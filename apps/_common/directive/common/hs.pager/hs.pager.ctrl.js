class HsPagerController {
  constructor($scope) {
    this.scope = $scope;
    this.show = true;
  }

  init() {
    const key = this.key;

    this.max = key.max ? key.max : 5;
    this.per = key.per ? key.per : 100;

    this.total = 100;

    this.scope.$watch("ctrl.total", newVal => {
      if (!newVal) return;

      this.show = false;
      this.total = newVal;
      this.show = true;
    });
  }
}

angular.module("SmartAdmin.Directives").component("hsPager", {
  templateUrl: "app/directive/common/hs.pager/hs.pager.tpl.html",
  controller: HsPagerController,
  controllerAs: "ctrl",
  bindings: {
    curr: "=",
    total: "<",
    key: "<"
  }
});
