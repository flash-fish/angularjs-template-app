class AbcStructureChartCtrl {
  constructor($uibModalInstance, Chart, basicService, CommonCon, toolService, $scope, context,
              popupToolService) {
    this.Chart = Chart;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.context = context;

    // 保存指标的local
    this.localOrigin = CommonCon.local.CHART_ORIGIN_ABC_STRUCTURE;
    this.localData = CommonCon.local.CHART_DATA_ABC_STRUCTURE;

    // 初始化类型
    this.saleTypes = angular.copy(CommonCon.abcStructureTypes);
    this.saleType = this.saleTypes[0].id;

    if (this.context) {
      this.originField = angular.copy(this.context.field);
    } else {
      this.originField = angular.copy(this.Chart.abc_structure);
    }
  }


  init() {
    // 初始化页面指标结构和数据
    this.initChart();

    // 获取初始化选中的基础柱状图指标
    this.getCurrBar();

    // 监听 类型
    this.popupTool.watchType(this.scope, this.chart, () => {
      this.getCurrBar();
    });
  }

  /**
   * 初始化chart field的结构
   * @returns {{}}
   */
  initChart() {
    // const origin = angular.copy(this.Chart.grossProfit);
    const local = this.basic.getLocal(this.localOrigin);

    if (local) {
      //this.saleType = local.type;
      this.tool.getChartFromLocal(local.chart, this.originField);
    }

    this.chart = this.originField;
  }


  /**
   * 获取当前柱状图的指标
   */
  getCurrBar() {
    this.currBar = this.chart.sale.bar.list.filter(s => s.check)[0];
  }

  /**
   * 柱状图指标发生变化后触发的点击事件
   * @param curr 当前点击的指标
   * @param val 当前指标所在集合
   * @param all 销售或库存的所有指标
   */
  change(curr, val, all) {
    this.popupTool.changeChartState(val, all, curr);

    if (!val.key.watch) return;
    this.getCurrBar();
  }

  ok() {
    const type = this.saleType, chart = angular.copy(this.chart);

    const field = {first: this.tool.calculateChartField(chart.sale)};

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.localOrigin, {type: type, chart: chart});

    console.log(field, chart);

    // 将计算好的指标保存到local中
    this.basic.setLocal(this.localData, field);

    this.$uibModalInstance.close(field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("abcStructureChartCtrl", AbcStructureChartCtrl);
