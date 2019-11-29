class SaleTrendController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService,
              tableService, CommonCon, toolService, $compile, chartService, FigureService) {
    this.scope = $scope;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.table = tableService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.columnBuilder = DTColumnBuilder;
    this.chartService = chartService;
    this.figureService = FigureService;

    this.instance = {};

    this.showStock = true;

    // 调用接口的方法名字
    // this.interfaceName = "getTrendForSale";

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 财务月加的参数 chart只能点击到月份
    this.dateType = false;

    //默认不显示未来模式
    this.showFutureToggle = false;

    this.isTrend = true;

    this.initBaseDate = "";
  }

  init() {

    // 调用接口的方法名字
    this.interfaceName = this.keys.TrendInterFace
      ? this.keys.TrendInterFace[0]
      : "getTrendForSale";

    // 初始化column
    this.initColumn();

    this.scope.$watch('ctrl.keys.search', newVal => {
      //点击搜索时关闭未来日模式
      if (!_.isUndefined(this.openFuturePattern)) delete this.openFuturePattern;
    });

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {
      this.tool.removeLevel(p);
      if (this.keys.dateType) {
        const [sta, end] = this.param.date.split("-");
        this.dateType = _.isEqual(sta, end);
      }

      // 初始化面包屑
      if (p.isSearch_delete) {
        this.crumb = [p.date];
        p.isSearch_delete = false;
      }
      // 初始化天气列
      if (!this.keys.financeTrend) {
        let isMonth = (p && p.date && p.date.split('-')[0].length <= 7) === this.isMonth;
        if (!isMonth) {
          this.keys.initColumn = true;
        }
      }

    }, this.keys);

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, (field) => {
      if (!field
        || (field && !field.second)
        || (field && !_.keys(field.second).length)) return;

      if (!_.isUndefined(this.openFuturePattern)) delete this.openFuturePattern;
      this.isStockLatest = ["stockCostLatest", "stockQtyLatest"].includes(field.second.bar[0].id);
    }, {
      trend: true,
      sortsChart: this.keys.sortsChart ? this.keys.sortsChart : false,
    });

    //监听未来日模式
    this.tool.watchFuturePattern(this);
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange, this.keys);
    this.buildColumn();
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
      setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      addEvent: [
        {name: "click", event: (p) => this.addEvent(p), func: null},
        {
          name: "datazoom", event: (p) => this.chartService.addZoomEvent(this, null, pDate => {
            this.initShowFutureToggle(pDate);
            delete this.openFuturePattern; // 关闭未来日模式
          }), func: null
        }
      ],
      special: {
        pageId: this.keys.pageId
      }
    };

    // 避免重新走buildOption的时候出现baseDate未定义
    if (this.initBaseDate)
      this.key._basicDate = this.initBaseDate ? angular.copy(this.initBaseDate) : "";

    //配置页面是否需要未来日模式
    if (this.keys.showFutureToggle) {
      this.key.getOpenFuture = () => this.openFuturePattern;
      this.key.showFutureToggle = (show) => {
        if (this.clickChartBar) {
          this.clickChartBar = false;
          return
        }
        if (this.chartFieldIncludeYoYValue) this.showFutureToggle = show;
      };
      this.key.getShowFutureToggle = () => this.showFutureToggle;

      // 未来初始化一些设定
      this.tool.initFutureDate(this, () => this.initShowFutureToggle());
    }

    this.option = this.table.fromSource(this.tool.getData(this.key, this.back, this.keys), {
      pageLength: 100,
      fixed: this.fix.length,
      compileBody: this.scope
    });

    // 初始化面包屑
    if (!this.keys.initColumn && !(this.crumb && this.crumb.includes(this.param.date))) {
        this.crumb = [this.param.date];
    }
  }

  initShowFutureToggle(dates) {
    const pDate = dates ? dates : this.param.date;
    const date = pDate.includes('-') ? pDate.split('-')[1] : pDate;
    if (_.isUndefined(this.key._basicDate)) return;
    const year = this.key._basicDate.baseYear;
    const month = this.key._basicDate.endMonth;
    const endDate = String(year) + String(month);
    const baseDate = this.key._basicDate.baseDate;
    const afterDate = date.length > 7 ? this.key._basicDate.startDate : endDate;
    const dateType = date.length > 7 ? 'YYYYMMDD' : 'YYYYMM';
    if (this.chartFieldIncludeYoYValue)
      this.showFutureToggle = date.length > 7 ?
        moment(date.replace('/', ''), dateType).isSame(moment(baseDate, dateType)) :
        !moment(date.replace('/', ''), dateType).isBefore(moment(afterDate, dateType));
    else this.showFutureToggle = false;
  }

  addEvent(myParam) {
    const key = {
      com: this.param,
      scope: this.scope,
      myParam,
      basicDate: () => this.key._basicDate,
      showFutureToggle: this.keys.showFutureToggle
    };

    this.chartService.dataZoomOffAll(true);

    return this.tool.addDateEvent(key,
      this.crumb,
      () => {
        return this.crumb;
      },
      (pDate, type) => {
        const changeFlag = () => {
          this.showFutureToggle = false; // 隐藏未来日
          delete this.openFuturePattern; // 关闭未来日模式
          this.clickChartBar = true; //通过点击chart
        };
        if (!type && this.keys.finallMonth) changeFlag();
        if (!type) return;
        const dates = pDate.split('-');
        const isSameDay = dates[0].length > 8 && dates[0] === dates[1];
        if (isSameDay) changeFlag();
      },
      this.keys.dateType ? this.keys.dateType : null);
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {
    const dates = this.param.date.split('-');

    const endDate = moment(dates[1], 'YYYY/MM/DD').format('YYYYMMDD');

    const isSilent = () => {
      if (this.openFuturePattern && this.showFutureToggle) {
        const notAfterBaseDate = moment(Number(endDate)).isAfter(moment(this.key._basicDate.baseDate));
        return notAfterBaseDate || this.dateType;
      } else return this.tool.isSilentChart(this.param.date) || this.dateType;
    };

    const key = {
      data,
      trend: true,
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
      info: this.fieldInfo,
      xData: {
        code: "dateCode",
        format: this.param.date.length > 16 ? "MM/DD" : "YYYY/MM"
      },
      xAxisNoWrap: true,
      adjustOffset: true,
      silent: isSilent()
    };

    this.tool.getChartOption(key, this);

    // 图表联动
    this.basic.connectChart();

    setTimeout(() => {
      this.chartService.appendRectAndRegisterEvent(this.sale);
    }, 1000);
  }

  buildColumn() {
    this.fix = [
      this.tool.buildTableDate(this.field, {noWeather: true})
    ];

    const haveToT = this.field.newTable.some(s => s.includes("ToT"));
    const haveYoY = this.field.newTable.some(s => s.includes("YoY"));
    this.hasWeatherInfoCol = haveToT || haveYoY;
    this.isMonth = this.param && this.param.date && this.param.date.split('-')[0].length <= 7;
    if (!this.keys.financeTrend && !this.isMonth) {
      this.fix.push({
        code: "weatherInfo",
        title: "杭州天气",
        render: (data, type, full) => {
          if (full.dateCode && full.dateCode === '整体合计' || this.isMonth) return;
          if (!this.hasWeatherInfoCol)
            return this.figureService.changeNull(data);
          let content = [];
          content.push(`${this.figureService.changeNull(data)}`);
          if (haveYoY)
            content.push(`同期：${this.figureService.changeNull(full.weatherInfoYoYValue)}`);
          const text = content.join('，');
          if (haveToT)
            content.push(`环期：${this.figureService.changeNull(full.weatherInfoToTValue)}`);
          const title = content.join('&#10;');
          return `<span title="${title}">${text}</span>`;
        }
      })
    }

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable, null, this.keys);
  }
}


angular.module('hs.supplier.saleStock').component('saleTrend', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/trend/trend.tpl.html',
  controller: SaleTrendController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
