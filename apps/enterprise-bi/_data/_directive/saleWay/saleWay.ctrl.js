class HsSaleWayController {
  constructor($scope, basicService, dataService, toolService, FigureService) {
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.figure = FigureService;
    this.dataService = dataService;

    this.prefix = ["retailDistributionOf", "retailJointOf", "wholeDistributionOf", "wholeJointOf"];
    this.type = ["retail", "whole", "distribution", "joint"];

    this.data = {
      retailDistributionOfAllAmount: "经销-零售额占比",
      wholeDistributionOfAllAmount: "经销-批发额占比",
      retailJointOfAllAmount: "联营-零售额占比",
      wholeJointOfAllAmount: "联营-批发额占比",

      retailDistributionOfAllUnit: "经销-零售数占比",
      wholeDistributionOfAllUnit: "经销-批发数占比",
      retailJointOfAllUnit: "联营-零售数占比",
      wholeJointOfAllUnit: "联营-批发数占比",

      retailDistributionOfAllProfit: "经销-零售毛利额占比",
      wholeDistributionOfAllProfit: "经销-批发毛利额占比",
      retailJointOfAllProfit: "联营-零售毛利额占比",
      wholeJointOfAllProfit: "联营-批发毛利额占比",
    };

    this.remove = ["flowCnt", "retailFlowAmount"];
  }

  init() {
    this.scope.$watch("ctrl.param", newVal => {
      if (!newVal) return;

      this.getList();
    });

    this.watchField();
  }

  watchField() {
    this.scope.$watch("ctrl.field", (newVal, oldVal) => {

      if (!newVal || _.isEqual(newVal, oldVal)) return;

      this.getList();
    });
  }

  getList() {
    const bar = angular.copy(this.field.bar);

    _.remove(bar, s => {
      return this.remove.includes(s.id) || s.id.includes("YoYValue");
    });

    this.hide = !bar.length;

    if (this.hide) return;

    const field = _.flatMap(bar.map(s => {
      let id = s.id;
      this.type.forEach(t => {
        if (s.id.includes(t)) id = s.id.replace(t, "all");
      });

      return this.prefix.map(p => _.camelCase(`${p} ${id}`));
    }));

    // 监听this.field情况下 this.param 有可能为 undefine 需要判断
    if(this.param){
      let term = this.tool.buildParam({condition: this.param, field});
      this.basic.packager(this.dataService.getSaleWayPct(term), (res) => {
        this.list = field.map(s => {
          return {
            name: this.data[s],
            data: this.figure.scale(res.data[s], true, true)
          }
        });
      });
    }

  }

}

angular.module('app.datas').component('saleWayPct', {
  templateUrl: "app/_data/_directive/saleWay/saleWay.tpl.html",
  controller: HsSaleWayController,
  controllerAs: 'ctrl',
  bindings: {
    field: '<',
    param: '<'
  }
});
