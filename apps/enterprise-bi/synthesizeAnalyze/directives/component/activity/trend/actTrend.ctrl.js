class actTrendController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService, Symbols,
              tableService, CommonCon, toolService, $compile, indexCompleteService, FigureService, Chart, chartService) {
    this.scope = $scope;
    this.Field = Field;
    this.Chart = Chart;
    this.Symbols = Symbols;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.table = tableService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.columnBuilder = DTColumnBuilder;
    this.indexCompleteService = indexCompleteService;
    this.chartService = chartService;

    this.instance = {};

    this.showStock = true;

    // 调用接口的方法名字
    this.interfaceName = "getSalesAndInventoryDataByDateHoliday";

    // 所有指标的对照关系 -- 自定义指标合并公共指标
    let mid_info = this.indexCompleteService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.basic.buildField(mid_info);

    this.dateInfo = Object.assign({}, this.Field.common, this.Field.activityDate);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 合计字段
    this.trend_params = angular.copy(Field.actParams);

    // 定义当前节假日日期
    // this.holidayInfo = {};


  }

  init() {
    // 监听共通条件的变动 p => this.param
    this.tool.watchParam(this, (p) => {

      // 初始化column 判断是否有对比日期
      this.initColumn(true, p);

      // 根据是否勾选日期构建chart 数据
      let mid_field = _.clone(this.field.chart);
      this.field.chart = this.indexCompleteService.DateCheck(p, mid_field);

      // 趋势页面构建合计数据
      this.indexCompleteService.sumNumber(this, p);
      this.judge = angular.copy(p);

      // 定义当前节假日日期
      if (p.other.MarkDay) this.holidayInfo = p.other.MarkDay;

      this.InitHash = false;

      if (p.other.endDaY === 'usualDay') this.InitHash = true;

      this.tool.removeLevel(p);
      // 初始化面包屑
      if (p.isSearch_delete) {
        this.crumb = [p.date];
        p.isSearch_delete = false;
      }

    });

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动 c=>chart p=>this.param
    this.tool.watchChart(this, (c, p) => {
      // 根据是否勾选日期构建chart 数据 监听是否有对比日期 过滤YoYInc YoY

      if (this.noInit) {
        // 根据是否勾选日期构建chart 数据
        if (!p.dateY) this.indexCompleteService.structureChart(this.field);
      }

      // 活动分析未来日
      this.indexCompleteService.ToTChart(this);

    }, {
      trend: true
    });

  }

  // 重构列结构
  initColumn(isChange, n_param) {
    this.tool.changeCol(this.field, null, this.keys, f => {
      if(this.keys.actCompare && n_param){
        // 重构列 YoYValue YoYInc
        this.indexCompleteService.newColumn(this,f,n_param);
      }
    });

    this.buildColumn(n_param);
  }


  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      trend: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, this.field),
      setChart: (d) => this.setChartData(d),
      setSum: (s) => this.devSum(this.tool.getSum(s, this.sum, this.fieldInfo), s),
      addEvent: [
        {
          name: "datazoom", event: (p) => this.chartService.addZoomEvent(this, (date, option) => {
            //矩形缩放选择时取值会有边界溢出
            const startValue = this.dateYList[option.startValue < 0 ? 0 : option.startValue];
            const endValue = this.dateYList[option.endValue > (this.dateYList.length - 1) ? (this.dateYList.length - 1) : option.endValue];
            const dateY = {from: startValue, to: endValue, type: "day"};
            this.scope.$emit(this.CommonCon.dateChange, date.includes('-') ? date : `${date}-${date}`, dateY);
          }), func: null
        }
      ],
      special: {
        pageId: this.keys.pageId
      }
    };

    let mid_fix;
    if (!this.noInit && !this.param.dateY) {
      mid_fix = 2;
    } else if (!this.noInit && this.param.dateY) {
      mid_fix = 3;
    }

    this.option = this.table.fromSource(this.tool.getData(this.key, this.back, this.keys), {
      pageLength: 100,
      fixed: mid_fix,
      compileBody: this.scope
    });

    // 初始化面包屑
    this.crumb = [this.param.date];
  }

  // 构建合计数据
  devSum(func, devsumary) {
    let detailSum = devsumary;
    if (func) func();

    this.detailSum = detailSum;
  }


  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {
    this.dateYList = data.map(d => d.dateCodeY);
    const dates = this.param.date.split('-');
    const key = {
      adjustOffset: true,
      trend: true,
      data,
      info: this.fieldInfo,
      xData: {
        code: "dateCode",
        // format: this.param.date.length > 16 ? "MM/DD" : "YYYY/MM",
        format: this.Symbols.slashDate
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
      silent: true,
      compared: { haveCompare: true},
      compareDate: { dataY: this.param.dateY },
      xAxisNoWrap: true,
      chartInfo : {
        hashName: '节假日',
        InFo: this.keys.chartInfo,
        showHash: this.InitHash,
        hashHoliday: this.holidayInfo,
      },

    };

    this.indexCompleteService.ToTChart(this);

    this.tool.getChartOption(key, this);
    // 图表联动
    this.basic.connectChart();
    setTimeout(() => {
      this.chartService.appendRectAndRegisterEvent(this.sale);
    }, 1000);
  }

  // 重构表格列
  buildColumn(n_param) {
    // 构建表格列 判断是否有对比日期dataY

    this.fix = [
      this.tool.buildTableDate(this.field, {flag: true, activityCompare: 'one'}),
      this.tool.buildTableDate(this.field, {date: 'dateCodeY', flag: true, activityCompare: 'two'}),
      {
        code: "weatherInfo",
        render: (data, type, full) => {
          if (full.dateCode === '整体合计' ) return;
          if (this.fix.length === 2) return data;
          let content = [];
          content.push(`${this.figure.changeNull(data)}`);
          content.push(`对比日期：${this.figure.changeNull(full.weatherInfoYoYValue)}`);
          return `<span>${this.figure.changeNull(data)} / ${this.figure.changeNull(full.weatherInfoYoYValue)}</span>`
        }
      }
    ];

    if (this.noInit) {
      if (n_param.dateY) {
        this.option.fixedColumns = {leftColumns: 3}
      } else {
        this.option.fixedColumns = {leftColumns: 2};
        // this.fix.splice(1, 1)
        this.fix = this.fix.filter((v, k) => k !== 1);
      }
    } else if (!n_param.dateY) {
      // this.fix.splice(1, 1);
      this.fix = this.fix.filter((v, k) => k !== 1);
    }

    // 活动分析页面ToT重构
    this.indexCompleteService.ToTTrans(this);

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix, this.dateInfo), this.field.newTable, this.fieldInfo);
  }
}


angular.module('hs.synthesizeAnalyze').component('actTrend', {
  templateUrl: 'app/synthesizeAnalyze/directives/component/activity/trend/actTrend.tpl.html',
  controller: actTrendController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
