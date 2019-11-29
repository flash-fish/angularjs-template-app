class ChartToggleController {

  constructor($scope) {
    this.scope = $scope;

  }

  init() {
    this.key = this.key || {};
    this.type = this.key.type ? this.key.type : 'bar';
    this.image = this.key.img ? this.key.img : "chart_label.svg";

    this.isLine = this.type === 'line';

    this.scope.$watch("ctrl.first", newVal => {
      if (!newVal || !newVal.series) return;
      if (!this.isLine) {
        this.firstHaveLine = this.haveLine(newVal.series, 'bar');
        return;
      }

      this.firstHaveLine = this.haveLine(newVal.series);
    });

    this.scope.$watch("ctrl.second", newVal => {
      if (!newVal || !newVal.series) return;
      if (!this.isLine) {
        this.secondHaveLine = this.haveLine(newVal.series, 'bar');
        return;
      }

      this.secondHaveLine = this.haveLine(newVal.series);
    })
  }

  haveLine(series, type) {
    type = type || 'line';
    return series.some(s => s.type === type);
  }

  /**
   * 切换chart 的 label显示隐藏
   */
  toggle() {
    this.showLabel = !this.showLabel;

    const filter = (data, instance) => {
      if (!data || !data.series) return;
      let series = data.series;
      series.filter(s => s.type === this.type).forEach(s => {

        // 这块echart 还是3.7
        s.label.normal.show = this.showLabel;
        if (s.label.emphasis) s.label.emphasis.show = this.showLabel;
      });

      if (instance) instance.setOption({ series });

      // const zoom = this.key.zoom;
      // if (zoom) {
      //   const slider = data.dataZoom[1];
      //   slider.start = zoom.start;
      //   slider.end = zoom.end;
      // }
    };

    let chartDom;

    // 这里打个补丁: 控制某些要显示Y值得chart, 其他不应该care.
    if (this.key.controlCharts) {
      const ele = "." + this.key.controlCharts;
      chartDom = $(ele);
    } else
      chartDom = $(".chart-div");

    if (!chartDom.length) return;

    for (let i = 0; i < chartDom.length; i++) {
      const instance = echarts.getInstanceByDom(chartDom[i]);
      const option = instance.getOption();

      filter(option, instance);
    }

    filter(this.first);
    if (this.second) filter(this.second);
    if (this.third) filter(this.third);

  }

  down() {
    this.active = true;
  }

  up() {
    this.active = false;
  }

}

/**
 *
 * extra: type -> Array
 */
angular.module('SmartAdmin.Directives').component('chartToggle', {
  templateUrl: "app/directive/business/chartToggle/chartToggle.tpl.html",
  controller: ChartToggleController,
  controllerAs: "ctrl",
  bindings: {
    first: "=",
    showLabel: "=",
    second: "=",
    third: "=",
    key: "<"
  }
});
