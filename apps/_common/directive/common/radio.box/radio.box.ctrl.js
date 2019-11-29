class RadioBoxController {
  constructor($scope) {
    $scope.$watch('$ctrl.values', newVal => {
      if(_.isUndefined(newVal)) return;
      this.values = angular.copy(newVal);
    });
  }

  init() {
    this.yes = this.values.yes;
    this.no = this.values.no;
  }
}

angular.module("SmartAdmin.Directives").component("radioBox", {
  templateUrl: "app/directive/common/radio.box/radio.box.tpl.html",
  controller: RadioBoxController,
  controllerAs: "ctrl",
  bindings: {
    select: "=",
    values: "<"
  }
});
