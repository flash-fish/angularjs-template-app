class NewSkuContrastAnalyzeChartController {
  constructor($uibModalInstance, Chart, basicService, CommonCon, toolService,
              $scope, context, popupToolService) {
    this.Chart = Chart;
    this.scope = $scope;
    this.context = context;
    this.tool = toolService;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;

    this.currJob = this.context.job;
    this.jobs = CommonCon.jobTypes;

    // 保存指标的local
    this.local = this.context.local
      ? this.context.local
      : {
        origin: `${CommonCon.local.CHART_ORIGIN_NEW_SKU_CONTRAST_ANALYZE}_${this.currJob}`,
        data: `${CommonCon.local.CHART_DATA_NEW_SKU_CONTRAST_ANALYZE}_${this.currJob}`
      };

    // 页面的指标结构
    this.option = angular.copy(Chart[this.context.chart]);

    if (this.context.change) {
      this.context.change.forEach(c => {
        if (c.bar.isMerge) {
          c.bar.list.forEach(l => {
            let item = this.option.all.bar.list.find(a => l.id === a.id);
            Object.assign(item, l);
          })
        }
      })
    }

    // 页面配置
    this.key = this.context.key;

    // tab信息
    this.tabTypes = angular.copy(this.tool.getTabTypes());

    // 父级页面可以定制化popup内的tab
    if (this.key && this.key.changeTab) {
      this.tabTypes[this.key.changeTab.index] = this.key.changeTab.content;
    }

    // 初始化选中父级页面所在的tab
    if (this.context.tab)
      this.tabTypes.forEach(s => s.active = s.id.includes(this.context.tab.toString()));

    // 获取当前popup内选中的tab
    this.currTab = this.tabTypes.filter(s => s.active)[0];

    // 判断当前是否为全权限
    this.isBoss = this.tool.isBoss(this.currJob);

    // 标识当前页面是否有tab
    this.showTab = this.context.tab && this.isBoss;

    this.errors = [];
  }

  init() {
    // 初始化页面指标结构和数据
    this.initChart();
  }


  /**
   * 初始化chart field的结构
   * @returns {{}}
   */
  initChart() {
    const local = this.basic.getLocal(this.local.origin);

    if (local) {
      const chart = this.option;
      this.tool.getChartFromLocal(local, {chart}, 1);
      this.option = chart;
    }
  }


  /**
   * 柱状图指标发生变化后触发的点击事件
   * @param curr 当前点击的指标
   * @param val 当前指标所在集合
   * @param all 销售或库存的所有指标
   */
  change(curr, val, all) {

    const isError = this.popupTool.changeChartState(val, all, curr, {
      businessType: this.saleType
    });

    isError ? this.errors.push(this.currTab.name) : _.remove(this.errors, s => s === this.currTab.name);

    this.errors = _.uniq(this.errors);
    this.showManyError = this.errors.length;

    if (!this.showTab && this.showManyError) {
      this.errors = [];
    }
  }

  ok() {

    if (this.showManyError) return;

    const chart = angular.copy(this.option);
    const profit = this.tool.getProfitChart(this.currJob, chart);

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.local.origin, {chart: profit.chart});

    // 将计算好的指标保存到local中
    this.basic.setLocal(this.local.data, profit.field);

    this.$uibModalInstance.close(profit.field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("newSkuContrastAnalyzeChartCtrl", NewSkuContrastAnalyzeChartController);
