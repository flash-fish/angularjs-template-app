class HolidaySaleTrendController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService,
              tableService, CommonCon, toolService, $compile) {
    this.scope = $scope;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.table = tableService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.columnBuilder = DTColumnBuilder;

    this.instance = {};

    // 调用接口的方法名字
    this.interfaceName = "getHolidayTrendForSale";

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);
  }

  init() {
    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => this.tool.removeLevel(p));

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, null, {
      trend: true
    });
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
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
      addEvent: {name: "click", event: (p) => this.addEvent(p), func: null}
    };

    this.option = this.table.fromSource(this.tool.getData(this.key, this.back, this.keys), {
      fixed: 1
    });
  }

  addEvent(myParam) {
    const key = {
      com: this.param,
      scope: this.scope
    };

    return this.tool.addDateEvent(myParam, key, () => {
      this.dateKeys = {
        showRange: true,
        date: this.param.date,
        dateY: this.param.dateY
      };
    }, () => {
      this.param = Object.assign({}, this.param);
    });
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {
    const key = {
      xData: {
        code: "dateCode",
        format: this.param.date.length > 16 ? "MM/DD" : "YYYY/MM"
      },
      data: data,
      info: this.fieldInfo
    };

    this.tool.getChartOption(key, this);
  }


  buildColumn() {
    this.fix = [
      this.tool.buildTableDate()
    ];

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable);
  }
}


angular.module('hs.supplier.saleStock').component('holidaySaleTrend', {
  templateUrl: 'app/supplier/subPage/directives/holidayStock/trend/trend.tpl.html',
  controller: HolidaySaleTrendController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
