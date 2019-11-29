class byStoreTypeController {
  constructor($rootScope, $sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService,Common,Pop,indexCompleteService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.Field = Field;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.rootScope = $rootScope;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.indexCompleteService = indexCompleteService;

    // 初始化下啦列表
    this.levelType = angular.copy(this.CommonCon.storeAnalyzeSelect);
    this.levelsSelect = `${this.levelType[0].id}`;

    this.initLevelType = this.CommonCon.catLevels;

    this.chartType = angular.copy(this.CommonCon.storeAnalyzeChart);
    this.chartSelect = `${this.chartType[0].id}`;

    this.chartShow = false;

    this.chartPage = 1;

    // 所有指标的对照关系
    this.fieldInfo = angular.copy(this.Field.Store);
    // 监听数据设定
    this.back = {};

    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;

      if (!_.isUndefined(newVal.tablePage)) {
        self.chartPage = newVal.tablePage;
      }

    }, true);

    this.interfaceName = 'getSalesAndInventoryDataByCategory';
    this.pieInterfaceName = 'getSalesAndInventoryDataByCategoryProportion';

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess);
    this.updatedSession = this.basic.getSession(Common.updatedCondition);

    this.instance = {};

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 1)[0];
  }

  init(){

    // 初始化 Chart 参数
    this.InitChart(this);

    // 监听chart分页字段的变化
    this.tool.watchChartPage(this, () => {
      return this.key.param.condition;
    });

    // 监听共通条件的变动
    this.watchParam(this, (p) => {
      delete p.classLevel;
      this.searchData = angular.copy(p);

      // 动态构建下拉框的列表
      const category = p.category.val;
      const maxLevel = _.last(angular.copy(this.CommonCon.storeAnalyzeSelect)).id;
      let session;
      if(this.session) session = this.session.category.val;

      this.hideTree = !_.isUndefined(p.hideTree_delete)
        ? p.hideTree_delete
        : category.length !== 1;

      // 当筛选条件没有数据时 level读取this.session里的 否则读取筛选条件的
      const target = this.FigureService.haveValue(category) ? category : session;
      if (this.FigureService.haveValue(target)) {
        const level = target.length > 1 || target[0].level == maxLevel
          ? target[0].level
          : parseInt(target[0].level) + 1;

        this.levelType = this.CommonCon.storeAnalyzeSelect.filter(s => parseInt(s.id) >= level);
      } else{
        this.levelType = angular.copy(this.CommonCon.storeAnalyzeSelect);


      }

      // 初始化cat type下拉框
      if (!p.changeLevel && this.levelType[0])
        this.levelsSelect = `${this.levelType[0].id}`;

      if (!this.hideTree) {
        this.chartKey = {
          url: "getCategoryParents",
          name: "categoryCode",
          session: angular.copy(this.session.category),
          code: category[0].code,
          level: category[0].level
        };
        this.tool.getTree(this.chartKey, this);
      }

      // 将参数需要的level对象保存到当前scope的currentLevel上
      this.currentLevel = {
        categoryLevel: this.levelType.length === 0 ? parseInt(maxLevel) : parseInt(this.levelsSelect)
      };
    });

    // 监听table指标变动
    this.indexCompleteService.watchTable(this, () => { });

    // 列表 chart 排序字段设置
    this.indexCompleteService.listenSort(this, (param) => {
      param.categoryLevel = this.currentLevel.categoryLevel;
    });

  }

  // 初始化 chart 参数
  InitChart(self)
  {
    let chartTitle = self.chartType.filter(s => s.id === parseInt(self.chartSelect) )[0].title;
    let chartName = self.chartType.filter(s => s.id === parseInt(self.chartSelect) )[0].name;
    // 下拉列表赋值
    self.field.chart = { first: { bar: [ {check: true, id: chartTitle , name: chartName} ]} };
  }

  /**
   * 切换层级触发
   */
  changeLevels() {
    this.param = Object.assign({}, this.param, {changeLevel: true});
  }

  /**
   * 构建表格数据
   */
  buildOption(param ) {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(param, this.field),
      setChart: (d) => this.setChartData(d),
      addEvent: {name: "click", event: (p, d) => this.addEvent(p, d), func: null},

    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      sort: 3,
      fixed: 3,
      start: (this.chartPage - 1) * 10,
      compileBody: this.scope
    });
  }

  /**
   * 初始化表格列信息
   * @param isChange 是否将条件放入session
   */
  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange, this.keys);

    this.buildColumn();
  }

  // 构建列
  buildColumn(){
    this.fix = [
      "_id",
      {
        code: "categoryCode",
        sort: true
      },
      {
        code: "categoryName",
        render: (data, t, f) => {
          let render = '';
          if(!_.isUndefined(data) ) {  render = data; }
          return render;
        }
      },
    ];

    this.fieldInfo.extendText = { one: this.param.firstStore, two: this.param.secondStore };
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field_Extend(), this.fieldInfo);
  }

  // 表格 title 显示扩展
  field_Extend(){
    let init_Field = angular.copy(this.field);
    let nu_Ar = [];
    init_Field.newTable.forEach(s => {
      let later_Number = 'compare' + s.charAt().toUpperCase() +  s.slice(1);
      nu_Ar.push(s, later_Number);
    });
    return nu_Ar
  }

  // chart 钻取事件
  addEvent(myParam, details)
  {
    this.silentChart = myParam.condition.categoryLevel == _.last(this.CommonCon.catLevels).id
      && details && details.length === 1;

    if (this.silentChart) return null;

    return (param) => {

      const params = this.tool.buildParam(this.tool.getParam(this.param, []));
      params.condition.category = {
        level: myParam.condition.categoryLevel,
        values: [param.data.name]
      };

      this.basic.checkAccess(params, () => {
        this.chartKey = {
          url: "getCategoryParents",
          name: "categoryCode",
          session: this.updatedSession.category,
          code: param.data.name,
          level: myParam.condition.categoryLevel
        };
        this.tool.commonChartClick(this, param.name, this.CommonCon.categoryClick);
      })
    }
  }

  /**
   * 面包屑绑定的事件
   * @param code
   * @param level
   * @param name
   */
  getParent(code, level, name) {
    this.chartKey.code = code;
    this.chartKey.level = level;
    this.chartKey.session = this.updatedSession.category;

    this.tool.commonChartClick(this, name, this.CommonCon.categoryClick, () => {
      this.scope.$emit(this.CommonCon.classClick, this.updatedSession.classes);
    });
  }

  // chart 数据渲染
  setChartData(data){
    const key = {
      data,
      info: this.fieldInfo,
      xData: { code: "categoryCode", title: "categoryName",  },
      storeName: [ {name:this.param.firstStore}, {name:this.param.secondStore} ]
    };
    // 门店对比门店参数 name 转换 function 封装
    function NumTrans(num){
      let res_Number;
      res_Number = 'compare' + num.charAt().toUpperCase() +  num.slice(1);
      return res_Number;
    }
    let render_One = this.chartType.filter(s => s.id === parseInt(this.chartSelect) )[0].title;

    this.chart_Set = { bar:[ {id:`${render_One}`}, {id:`${NumTrans(render_One)}`} ], };

    key.barLabel = this.showBarLabel;
    key.lineLabel = this.showLineLabel;

    this.sale = this.buildChart(this.chart_Set, key);
    // 饼图
    this.PieChartRender();
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
    // 定义 chart 图表y轴基础数据
    const axisLabel = {color: '#404040', interval: 1, fontSize: 11, fontFamily: 'Arial'};
    // 获取chart基础样式
    const basic = this.tool.basicChartStyle(seriesObj.field, xData, fieldInfo, key);

    let legend_data = angular.copy(basic.legend.data);
    let select_Name = [];
    legend_data.forEach( (ele,index) => {
      if(index === 0){ select_Name.push(`${storeName[0].name} - ${ele}`) }
      else select_Name.push(`${storeName[1].name} - ${ele}`);
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
      series: (() => {
        return this.buildSeries(seriesObj, key, curr, storeName);
      })()
    };

    return Object.assign(basic, newOption);

  };

  /**
   * chart tooltip 格式化
   * @param fields
   * @param fieldInfo 所有指标的配置
   * @param key chart配置
   */
  formatData(fields, fieldInfo, key) {
    const newField = _.flattenDeep(fields);
    return (p) => {
      let info = "", field = p[0].name.replace(/\s*/g,"");
      p.forEach((s, i) => {
        const codeKey = fieldInfo[newField[i].id];
        const isSale = codeKey.sale;
        const unit = codeKey.unit ? codeKey.unit : isSale ? "元" : "";
        const point = !_.isUndefined(codeKey.point) ? codeKey.point : 2;
        let value = codeKey.scale ? `${s.value}%` : this.FigureService.thousand(isSale ? s.value * 10000 : s.value, point);
        info += `<br />${s.marker}${s.seriesName} : ${value} ${unit}`;
      });
      return field + info;
    }
  }

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
            normal: { show: key.barLabel, position: 'top', fontSize: 11,
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
          };
          return line;
        });
        series = series.concat(lines);
      }
    });
    return series;
  };

  // 类别饼图数据渲染
  PieChartRender(){
    this.rootScope.fullLoadingShow = true;
    const type_level = this.chartType.filter(s => s.id === parseInt(this.chartSelect) )[0];
    let pie_level = Object.assign({}, this.param, {categoryLevel: parseInt(this.levelsSelect)});
    delete pie_level.firstStore;
    delete pie_level.secondStore;
    let pie = { param: this.tool.getParam(pie_level,[type_level.title]), };
    let pieParam = this.tool.buildParam(pie.param);
    // 定义请求参数排序字段
    pieParam.sortBy = {
      field: type_level.title,
      direction: -1
    };
    this.basic.packager(this.dataService[this.pieInterfaceName](pieParam), res =>{
      if(res){
        this.PieChart = this.PieRender(res.data);
        this.rootScope.fullLoadingShow = false;
      }
    })
  }


  // 饼图样式获取
  PieRender(data){
    const change_data_one = this.chartType.filter(s => s.id === parseInt(this.chartSelect) )[0].title;
    // 指标名称
    let render_One = this.chartType.filter(s => s.id === parseInt(this.chartSelect) )[0].name;
    let pieData = angular.copy(data);
    let renderData_One =[];
    let renderData_Two =[];
    let specialChart;
    const pie_Legend = _.intersection(
      pieData.compareStore.map(s => s.categoryName),
      pieData.store.map(s => s.categoryName),
    );
    pieData.store.forEach(s => {
      renderData_One.push({value:s[change_data_one],name:s.categoryName });
    });
    pieData.compareStore.forEach(s => {
      renderData_Two.push({value:s[change_data_one],name:s.categoryName });
    });
    let config_Pie = {
      normal: {
        formatter: p => { if (p.percent < 6) return ""; return p.percent + '%'; } ,
        textStyle: { fontWeight: 'normal', fontSize: 12, },
        show: true, position: 'inside',
      },
      emphasis: {
        show: true, align: 'left', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10,
          padding: 7,
          formatter: (p) => {
          if (p.name === ' ') return "未知";
          return  render_One
            + '\n'
            + `${p.name.replace(/\s*/g,"")}：${this.FigureService.thousand(p.value)}元(${p.percent}%)`;
        }
      }
    };
    specialChart = {
      color: [
        '#007ADB', '#26C08C', '#FFC467', '#FF905C', '#EA5B66', '#A948CC',
        '#129FCC', '#6CD169', '#FFB358', '#FF9F75', '#FB6C93', '#E66BCF',
        '#FA7C70', '#6C58D8 ', '#C8D45D', '#FF8D50'
      ],
      legend: {orient: 'horizontal', x : 'left', y : 'top', top: '0', left:'-5px', data:pie_Legend, },
      calculable : true,
      series : [
        {
          type:'pie', selectedMode: 'single', radius : [0, 90], clockwise: false,
          label: config_Pie,
          labelLine: { normal: { show: true } },
          center : ['25%', '50%'],
          data:renderData_One
        },
        {
          type:'pie',
          selectedMode: 'single',
          radius : [0, 90],
          label: config_Pie,
          labelLine: { normal: { show: true } },
          center : ['75%', '50%'],
          data:renderData_Two
        }
      ]
    };
    return specialChart;
  }

  /**
   * 监听共通条件的变动
   */
  watchParam(self, func) {
    self.scope.$watch('ctrl.param', (newVal, oldVal) => {
      if (!newVal || !newVal.firstStore || !newVal.secondStore) { return } else this.tableShow = true;
      if (func) func(newVal);
      let hsParam = Object.assign({}, newVal, self.currentLevel ? self.currentLevel : {},);
      // 初始化请求参数
      delete hsParam.changeLevel;
      delete hsParam.firstStore; delete hsParam.secondStore;

      this.basic.setSession(this.CommonCon.session_key.hsParam, hsParam);

      if (self.noInit) {
        self.loadChart = !self.loadChart;
        // 构建合计的结构
        if (self.sortInfo) {
          const table = angular.element('.dataTables_scrollBody .hs-table');
          if(!self.sortInfo.flag)  {
            this.tool.dynamicSort(hsParam, self.sortInfo.field, self.sortInfo.dir)
          }else{
            table.DataTable().order([self.sortInfo.index, self.sortInfo.dir]).draw();
          }
        } else{  self.instance.rerender();  }

        self.initColumn();
      }
      else{
        self.initColumn();
        self.buildOption(hsParam);
      }
    });
  };


  /**
   *  改变 Chart 参数
   */
  changeCharts() {
    this.InitChart(this);
    this.param.categoryLevel = this.currentLevel.categoryLevel;
    this.basic.setSession(this.CommonCon.session_key.hsField, this.field);
    let field = this.chartType.filter( s => s.id === parseInt(this.chartSelect))[0].title;

    if (this.sortInfo) {
      // 将最新的param保存到session
      this.basic.setSession(this.CommonCon.session_key.hsParam, this.param);
      const table = angular.element('.dataTables_scrollBody .hs-table');
      // 如果表格中没有当前排序的字段 则表格设置为排名升序
      const index = _.findIndex(this.column, {mData: field});

      this.sortInfo.flag = this.field.newTable.includes(field);

      !this.sortInfo.flag
        ? this.tool.dynamicSort(this.param, field, this.sortInfo.dir)
        : table.DataTable().order([index, this.sortInfo.dir]).draw();
    } else {
      // 将最新的条件保存到session
      let session_field = angular.copy(this.field);
      if( !this.field.newTable.includes(field) ) session_field.newTable.push(field);
      this.basic.setSession(this.CommonCon.session_key.hsField, session_field.newTable);
      this.basic.setSession(this.CommonCon.session_key.hsParam, this.param);
      this.basic.setSession(this.CommonCon.session_key.hsField, this.field);

      this.instance.reloadData();
    }

  }


}

angular.module('hs.synthesizeAnalyze').component('byStoreType',  {
  templateUrl: 'app/synthesizeAnalyze/directives/component/benMarking/byStoreType.tpl.html',
  controller: byStoreTypeController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
