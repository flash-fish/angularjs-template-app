class searchResultBoxController {
  constructor($scope, basicService) {
    this.scope = $scope;
    this.basic = basicService;

    this.list = [];
  }

  init() {

    this.scope.$watch("ctrl.keys", (newVal) => {
      if (!newVal) return;
      // 是否显示按code显示
      this.isShowCode = newVal.find(n => n.showCode);
      //排序
      this.list = newVal.sort(this.basic.sortBy('sort'));
    });

  }
}

angular.module('SmartAdmin.Directives').component('searchResultBox', {
  templateUrl: 'app/directive/business/searchResultBox/searchResult.box.tpl.html',
  controller: searchResultBoxController,
  controllerAs: 'ctrl',
  bindings: {
    keys: '<'
  }
});
