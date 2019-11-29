class SaleStockChartCtrl {
  constructor(context, $uibModalInstance, Chart, basicService,
              CommonCon, toolService, $scope, popupToolService) {
    this.Chart = Chart;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.context = context;
    this.scope = $scope;

    this.errors = [];

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local.origin
      : CommonCon.local.CHART_ORIGIN_SUP_SALE_STOCK;

    this.localData = this.context.local
      ? this.context.local.data
      : CommonCon.local.CHART_DATA_SUP_SALE_STOCK;


    // 初始化销售类型
    this.saleTypes = angular.copy(CommonCon.saleTypes);
    this.saleType = this.saleTypes[0].id;

    this.originField = angular.copy(this.Chart.saleStock);

    if (this.context.removeField) {
      let originField = this.originField;
      this.context.removeField.forEach(s => {
        const modelField = {id:'', name: ''};
        let list = originField[s.key].line.list;
        let replaceField = angular.copy(list.find(l => l.id === s.replace));
        list.splice(_.findIndex(list, val => val.id === s.replace), 1, modelField);
        list.splice(_.findIndex(list, val => val.id === s.field), 1, replaceField);
      })
    }

    if(this.context.change) {

      _.forIn(this.context.change, (val, key) => {
        const list = this.originField[val.name][val.type].list;

        if (_.isEqual(key, "remove")) {
          _.remove(list, (n, i) => val.list.includes(i));
        }

        if (_.isEqual(key, "update")) {
          val.list.forEach(s => {
            list[s[0]][s[1]] = s[2];
          })
        }
      });
    }
  }


  init() {
    // 初始化页面指标结构和数据
    this.initChart();

    // 监听 销售类型
    this.popupTool.watchType(this.scope, this.chart);
  }


  /**
   * 初始化chart field的结构
   * @returns {{}}
   */
  initChart() {
    const local = this.basic.getLocal(this.localOrigin);

    if (local) {
      this.saleType = local.type;
      this.tool.getChartFromLocal(local.chart, this.originField);
    }

    this.chart = this.originField;

    _.forIn(this.chart, (val, key) => {
      this.popupTool.changeLine(val.line.list);
    })
  }

  /**
   * 柱状图指标发生变化后触发的点击事件
   * @param curr 当前点击的指标
   * @param val
   * @param all 销售或库存的所有指标
   * @param tab tab
   */
  change(curr, val, all, tab) {

    const isError = (tab) => {
      const err = this.popupTool.changeChartState(val, all, curr, {
        businessType: this.saleType
      });
      return err ? tab : null;
    };

    const errName = isError(tab);
    errName ? this.errors.push(errName) : _.remove(this.errors, (s) => s === tab);

    this.errors = _.uniq(this.errors);
    this.showManyError = !!this.errors.length;
  }


  ok() {
    if (this.showManyError) return;

    const type = this.saleType, chart = angular.copy(this.chart);
    const fieldSale = this.tool.calculateChartField(chart.sale, type);
    const fieldStock = this.tool.calculateChartField(chart.stock);
    const field = {first: fieldSale, second: fieldStock};

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.localOrigin, {type: type, chart: chart});

    // 将计算好的指标保存到local中
    this.basic.setLocal(this.localData, field);

    this.$uibModalInstance.close(field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("saleStockChartCtrl", SaleStockChartCtrl);
