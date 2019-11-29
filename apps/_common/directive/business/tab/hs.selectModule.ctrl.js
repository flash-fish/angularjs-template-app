class SelectModuleCtrl {
  constructor($scope) {
    this.$scope = $scope;

    // 初始化Tabs
    this.tabs = [
      {name: "柱状图", active: true},
      {name: "饼图", active: false}
    ];
  }

  init() {
    this.cur = this.tabs[0];
  }

  switchTab(stab) {
    this.cur = stab;
    if (this.cur.name == "柱状图") {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
}

angular.module("SmartAdmin.Directives").component("selectModule", {
  templateUrl: "app/directive/business/tab/hs.selectModule.tpl.html",
  controller: SelectModuleCtrl,
  bindings: {
    isShow: "="
  }
});
