class RangeController {
  constructor ($scope) {
    // this.ranges = [
    //   {value: 1, name: "高于平均3%以上"},
    //   {value: 2, name: "高于平均1%~3%"},
    //   {value: 3, name: "高于平均1%以内"},
    //   {value: 4, name: "低于平均1%以内"},
    //   {value: 5, name: "低于平均1%~3%"},
    //   {value: 6, name: "低于平均3%以上"}
    // ];

    $scope.$watch('ctrl.able',newVal => {
      debugger
      this.able = newVal;
    })

    $scope.$watch("ctrl.ranges", newVal => {
      debugger
      if (!newVal) return;
      this.ranges = newVal;
    });
  }

}

angular.module('hs.supplier.saleStock').component('range', {
  templateUrl: 'app/supplier/subPage/directives/subLack/range.tpl.html',
  controller: RangeController,
  controllerAs: 'ctrl',
  bindings: {
    selected: '=',
    able: '<',
    ranges:'<'
  }
});
