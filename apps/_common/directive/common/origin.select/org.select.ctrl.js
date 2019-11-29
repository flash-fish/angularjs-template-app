class OrgSelectController {
  constructor($scope) {
    this.$scope = $scope;
  }

  init() {
    this.keys = this.keys || {};
    this.id = this.keys.id ? this.keys.id : "value";
    this.title = this.keys.title ? this.keys.title : "label";
    this.nameAttr = this.keys.nameAttr || "";

    this.$scope.$watch("ctrl.list", newVal => {
      if (!newVal) return;
      this.list = newVal;
    });
  }
}

/**
 * 下拉框组件
 * @param list 下拉列表的选项
 * @param select 当前选中的值
 * @param keys 配置项
 *
 * keys: {
 *  id: 列表中标识为code的属性名 -> [default]: "value",
 *  title: 列表中标识为name的属性名 -> [default]: "label",
 *  nameAttr: 给select的name属性赋值
 * }
 */
angular.module("SmartAdmin.Directives").component("hsOrgSelect", {
  templateUrl:
    "app/directive/common/origin.select/org.select.tpl.html",
  controller: OrgSelectController,
  controllerAs: "ctrl",
  bindings: {
    select: "=",
    list: "<",
    keys: "<"
  }
});
