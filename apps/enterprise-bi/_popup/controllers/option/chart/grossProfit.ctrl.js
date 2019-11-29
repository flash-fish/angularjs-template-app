class GrossProfitChartCtrl {

  constructor($uibModalInstance, Chart, basicService, CommonCon, toolService, $scope, context, popupToolService) {

    this.Chart = Chart;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.context = context;

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local.origin
      : CommonCon.local.CHART_ORIGIN_SUP_GROSS_PROFIT;

    this.localData = this.context.local
      ? this.context.local.data
      : CommonCon.local.CHART_DATA_SUP_GROSS_PROFIT;

    // 初始化销售类型
    this.saleTypes = angular.copy(CommonCon.saleTypes);
    this.saleType = this.saleTypes[0].id;

    this.originField = angular.copy(this.Chart.grossProfit);

    if(this.context.change) {
      this.context.change.forEach(s => {

        const list = this.originField[s.name][s.type].list;
        _.remove(list, (n, i) => s.list.includes(i));
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
    // const origin = angular.copy(this.Chart.grossProfit);
    const local = this.basic.getLocal(this.localOrigin);

    if (local) {
      this.saleType = local.type;
      this.tool.getChartFromLocal(local.chart, this.originField);
    } else
    this.tool.getOriginChartField(this.originField);

    this.chart = this.originField;

    _.forIn(this.chart, (val, key) => {
      this.popupTool.changeLine(val.line.list);
    })
  }


  /**
   * 柱状图指标发生变化后触发的点击事件
   * @param curr 当前点击的指标
   * @param val 当前指标所在集合
   * @param all 销售或库存的所有指标
   */

  change(curr, val, all) {
    this.showManyError = this.popupTool.changeChartState(val, all, curr, {
      businessType: this.saleType
    });
  }

  ok() {
    if (this.showManyError) return;

    const type = this.saleType, chart = angular.copy(this.chart);

    const field = {first: this.tool.calculateChartField(chart.sale, type)};

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

angular.module("hs.popups").controller("grossProfitChartCtrl", GrossProfitChartCtrl);
