class byStoreTrendController {
  constructor($rootScope, $sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService, Symbols, chartService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.Symbols = Symbols;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.rootScope = $rootScope;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.chartService = chartService;

    // 初始化下啦列表
    this.tren_Select = angular.copy(this.CommonCon.storeTrend);
    this.init_tend = `${this.tren_Select[0].id}`;

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.Store);

    // 当前页面请求接口
    this.interfaceName = 'getSalesAndInventoryDataByDateStorecompare';

    // 初始化请求 field 参数
    this.init_Field = {};
    // 销售额 销售额-同比增幅 销售数 销售数-同比增幅 毛利额 毛利额-同比增幅
    // 毛利率 毛利率-同比增长（百分点） 零售客单价 客单数 日均库存成本
    this.init_Field = {
      newTable:[
        'allAmount',
        'allAmountYoY',
        'allUnit',
        'allUnitYoY',
        'allProfit',
        'allProfitYoY',
        'allProfitRate',
        'allProfitRateYoYInc',
        'retailFlowAmount',
        'flowCnt',
        'stockCost',
      ]
    };

    // 表格实例化；预定义
    this.instance = {};

    // formeSource 表格请求返回 back 参数
    this.back = {};
    this.scope.$watch('ctrl.back', (newVal, oldVal) => {

      this.noInit = newVal.noInit;

    }, true);

  }

  init(){

    this.keys = this.keys || {};

    // this.param 参数监听
    this.watchParam(this, (p) => {

      // 初始化面包屑
      if (p.isSearch_delete) {
        this.crumb = [p.date];
        p.isSearch_delete = false;
      }

    });
  }


  /**
   * 监听共通条件的变动
   */
  watchParam(self, func) {
    self.scope.$watch('ctrl.param', (newVal, oldVal) => {

      if (!newVal || !newVal.firstStore || !newVal.secondStore) { return } else this.chartShow = true;

      if (func) func(newVal);

      let hsParam = Object.assign({}, newVal);

      // 初始化请求参数
      delete hsParam.firstStore;
      delete hsParam.secondStore;

      this.basic.setSession(this.CommonCon.session_key.hsParam, hsParam);
      const table = angular.element('.dataTables_scrollBody .hs-table');

      if (self.noInit) {
        self.loadChart = !self.loadChart;
        // 构建合计的结构

        if (self.sortInfo) {
          // 如果表格中没有当前排序的字段 则表格设置为排名升序
          !self.sortInfo.flag
            ? this.tool.dynamicSort(hsParam, self.sortInfo.field, self.sortInfo.dir)
            : table.DataTable().order([self.sortInfo.index, self.sortInfo.dir]).draw();
        } else {
            this.basic.setSession(this.CommonCon.session_key.apiOrder, true);
            table.DataTable().order([0, 'asc']).draw();
        }
        self.initColumn();
      }
      else
      {
        self.buildOption(hsParam);

        self.initColumn();
      }
    });

  };

  /**
   *
   *  改变图表参数
   */

  changeLevels()
  {
    this.ListenChart(this);

    this.instance.reloadData();

  }

  // chart 指标监听

  ListenChart(self){

    let field = this.tren_Select.filter( s => s.id === parseInt(this.init_tend))[0].title;

    let session_field = angular.copy(this.init_Field);

    field.split('+').forEach( s => {
      if( ! session_field.newTable.includes(s) ) session_field.newTable.push(s);
    });

    // 将最新的条件保存到session
    self.basic.setSession(this.CommonCon.session_key.hsField, session_field);

  }


  /**
   * 构建表格数据
   */
  buildOption(param ) {

    this.key = {
      trend: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(param, this.init_Field),
      setChart: (d) => this.setChartData(d),
      addEvent: [
        {name: "click", event: (p) => this.addEvent(p), func: null},
        {name: "datazoom", event: (p) => this.chartService.addZoomEvent(this), func: null}
      ]
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      fixed: 1,
      compileBody: this.scope
    });

    // 初始化面包屑
    this.crumb = [this.param.date];

  }

  /**
   * 初始化表格列信息
   * @param isChange 是否将条件放入session
   */
  initColumn() {
    // 点击查询时将条件保存到session
    this.basic.setSession(this.CommonCon.session_key.hsField, this.init_Field);

    this.buildColumn();
  }


  // 列
  buildColumn(){
    this.fix = [  this.tool.buildTableDate(this.field) ];
    this.fieldInfo.extendText = { one: this.param.firstStore, two: this.param.secondStore };
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field_Extend(this.init_Field.newTable),this.fieldInfo);
  }




  // 图表点击事件 数据钻取
  addEvent(myParam) {
    const key = { com: this.param, scope: this.scope, myParam };

    this.chartService.dataZoomOffAll(true);

    return this.tool.addDateEvent(key, this.crumb, () => {
      return this.crumb;
    });
  }

  // 表格 title 显示扩展
  field_Extend(oldField){
    let nu_Ar = [];
    let init_Field = angular.copy(oldField);
    init_Field.forEach(s => {
      let later_Number = 'compare' + s.charAt().toUpperCase() +  s.slice(1);
      nu_Ar.push(s, later_Number);
    });
    return nu_Ar
  }

  // 图表渲染
  setChartData(data){
    const dates = this.param.date.split('-');
    let key = {
      data,
      xAxisNoWrap: true,
      info: this.fieldInfo,
      xData: {
        code: "dateCode",
        format: this.param.date.length > 16 ? "MM/DD" : "YYYY/MM"
      },
      rectZoom: {
        show: dates[0] !== dates[1] && dates[0].length !== 7,
        title: {
          back: ''
        },
        //icon 内要设置图标的话，其他字段的图标就算用原本的值也要重新设定
        icon: {
          zoom: 'path://M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1',
          back: 'path://0,0,0,0',
        },
        top: -7
      },
      silent: this.tool.isSilentChart(this.param.date),
      storeName: [
        {name:this.param.firstStore},
        {name:this.param.secondStore}
      ]
    };

    // 门店对比门店参数 name 转换 function 封装
    function NumTrans(num){
      let res_Number;
      res_Number = 'compare' + num.charAt().toUpperCase() +  num.slice(1);
      return res_Number;
    }

    let render_One = this.tren_Select.filter(s => s.id === parseInt(this.init_tend) )[0].title;

    this.chart_Set = {
      bar:[
        {id:`${render_One.split('+')[0]}` },
        {id:`${NumTrans(render_One.split('+')[0])}`}
      ],
      line:[
        {id: `${render_One.split('+')[1]}`},
        {id: `${NumTrans(render_One.split('+')[1])}`}
      ]
    };

    key.barLabel = this.showBarLabel;
    key.lineLabel = this.showLineLabel;

    this.sale = this.buildChart(this.chart_Set, key);

    setTimeout(() => {
      this.chartService.appendRectAndRegisterEvent(this.sale);
    }, 1000);
  }

  /**
   * 构建chart option
   * @param curr 当前chart所对应类型的指标结构
   * @param key 配置
   * @returns
   */
  buildChart(curr, key) {
    const data = key.data, fieldInfo = key.info;
    let storeName = key.storeName;
    // 获取当前指标的集合 和 系列数据
    const seriesObj = this.tool.getSeriesData(curr, data, fieldInfo, key.xData);

    const xData = data.map(o => {
      const curr = key.xData.code === 'dateCode'
        ? moment(o[key.xData.code], "YYYYMMDD")
          .format(_.toString(o[key.xData.code]).length > 6 ? "YYYY/MM/DD" : "YYYY/MM")
        : o[key.xData.title];

      return !curr ? "" : curr;
    });

    key.seriesType = _.uniq(_.keys(curr));
    // 获取chart基础样式
    const basic = this.tool.basicChartStyle(seriesObj.field, xData, fieldInfo, key);


    if(basic.yAxis[1].name === '毛利额'
      || basic.yAxis[1].name === '销售额'
      || basic.yAxis[1].name === '日均库存金额')
    {
      basic.yAxis[1].name = `${basic.yAxis[1].name}（万元）`
    }

    let legend_data = angular.copy(basic.legend.data);
    let select_Name = [];
    legend_data.forEach( (ele,index) => {
      if(index < 2) {
        if(index === 0){
          select_Name.push(`${storeName[0].name} - ${ele}`);
        }else{
          select_Name.push(`${storeName[1].name} - ${ele}`);
        }
      }else{
        if(index === 2){
          select_Name.push(`${storeName[0].name} - ${ele}`);
        }else{
          select_Name.push(`${storeName[1].name} - ${ele}`);
        }
      }
    });

    basic.legend.data = select_Name;

    let newOption = {
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {type: 'shadow'},
        textStyle: {align: 'left'},
        formatter: this.formatData(seriesObj.field, fieldInfo, key)
      },
      // 添加框选型区域缩放组件
      toolbox: {
        right: key.rectZoom.right || 'auto',
        top: key.rectZoom.top || 'auto',
        show: _.isBoolean(key.rectZoom.show) ? key.rectZoom.show : true,
        feature: {
          dataZoom: {
            title: key.rectZoom.title ? key.rectZoom.title : undefined,
            icon: key.rectZoom.icon ? key.rectZoom.icon : {},
            iconStyle: key.rectZoom.iconStyle ? key.rectZoom.iconStyle : undefined
          }
        }
      },
      grid: {
        left: '30px',
        top: 70,
        right: '30px',
        bottom: '20px',
        containLabel: true
      },
      series: (() => {
        return this.buildSeries(seriesObj, key, curr, storeName);
      })()
    };

    return Object.assign({xAxisNoWrap: true,}, basic, newOption);
  };


  /**
   * chart tooltip 格式化
   *
   * @param fields
   * @param fieldInfo 所有指标的配置
   * @param key chart配置
   */
  formatData(fields, fieldInfo, key) {
    const newField = _.flattenDeep(fields);

    // 判定是否包含同比或环比指标
    const haveToT = newField.some(s => s.id.indexOf("ToT") >= 0);
    const haveYoY = newField.some(s => s.id.indexOf("YoY") >= 0);

    return (p) => {
      let info = "", field = p[0].name.replace(/\s*/g,"");

      // 趋势页面并且视图为天并且没有配置noWeather
      if (_.eq(key.xData.code, "dateCode") && _.eq(key.xData.format, "MM/DD") && !key.noWeather) {
        const curr = key.data.filter(s => s.dateCode == field.replace(/\//g, ""))[0];
        let vsWeather = "";

        if (haveYoY) vsWeather += ` , 同期: ${this.FigureService.changeNull(curr.weatherInfoYoYValue)}`;
        if (haveToT) vsWeather += ` , 环期: ${this.FigureService.changeNull(curr.weatherInfoToTValue)}`;

        field = `${field} (杭州天气: ${this.FigureService.changeNull(curr.weatherInfo)}${vsWeather})`;
      }

      p.forEach((s, i) => {
        const name = s.seriesName.substr(_.indexOf(s.seriesName, '-') + 1).trim();
        const id = newField.find(n => name === n.name).id;
        const codeKey = fieldInfo[id];
        const isSale = codeKey.sale;

        const unit = codeKey.unit ? codeKey.unit : isSale ? "元" : "";
        // 客单数（万次）
        const isTime = codeKey.time;

        const point = !_.isUndefined(codeKey.point) ? codeKey.point : 2;

        let _Value;

        if(s.value === this.Symbols.bar){
          _Value = s.value;
        }
        else if(codeKey.scale){
          _Value = `${s.value}%`
        }
        else if(codeKey.sale){
          _Value = this.FigureService.thousand(s.value * 10000)
        }
        else if(codeKey.inc){
          _Value =  this.FigureService.thousand(key.inc === 1 ? s.value : s.value * 100)
        }
        else if((!s.value || s.value === this.Symbols.bar) && codeKey.infinite){
          _Value =  value = this.Symbols.infinite;
        }
        else{
          _Value = this.FigureService.thousand(isSale || isTime ? s.value * 10000 : s.value, point);
        }

        info += `<br />${s.marker}${s.seriesName} : ${_Value} ${unit}`;
      });

      return field + info;
    }
  };


  /**
   * 构建最后传给chart的series对象
   * @param seriesObj
   * @param key
   * @param curr 柱状图还有折线数组，判断是否是双折线（curr.bar.length > 0）
   * @returns {Array}
   */
  buildSeries(seriesObj, key, curr, storeName) {
    let series = [];
    seriesObj.series.forEach((s, i) => {
      if (i === 0 && curr.bar.length > 0) {
        let barScale = s.length > 1 ? '33%' : '50%';
        let bars = s.map((x,index) => {
          let bar = {
            type: 'bar',
            name: `${storeName[index].name} - ${x.curr.name}`,
            data: x.list,
            barGap: '0%',
            barCategoryGap: barScale,
            silent: key.silent
          };

          // 判断当前的系列是否堆叠
          if (x.curr.stack) bar.stack = x.curr.stack;

          bar.label = {
            normal: {
              show: key.barLabel,
              position: 'top',
              fontSize: 11,
              formatter: (p) => {
                return this.FigureService.thousand(p.value, 0);
              }
            }
          };
          return bar;
        });
        series = series.concat(bars);
      } else {
        let lines = s.map((x,index) => {
          let line = {
            type: 'line',
            name: `${storeName[index].name} - ${x.curr.name}`,
            yAxisIndex: 1,
            data: x.list,
            lineStyle: {normal: {width: 4}},
            silent: key.silent
          };

          line.label = {
            normal: {
              show: key.lineLabel,
                position: [10, -15],
                fontSize: 11,
                formatter: (p) => {
                const isScale = x.curr.scale;
                return isScale
                  ? this.FigureService.addPercent(p.value)
                  : this.FigureService.thousand(p.value, 0);
              }
            }
          }

          return line;
        });
        series = series.concat(lines);
      }
    });

    return series;
  };



}

angular.module('hs.synthesizeAnalyze').component('byStoreTrend',  {
  templateUrl: 'app/synthesizeAnalyze/directives/component/benMarking/byStoreTrend.tpl.html',
  controller: byStoreTrendController,
  controllerAs: 'ctrl',
  bindings: {
    tab: '<',
    param: '<',
    field: '<',
    keys: '='
  }
});
