class newSelectController {
  constructor($scope) {
    this.$scope = $scope;
  }

  init() {


    this.id = this.keys.id ? this.keys.id : "value";
    this.title = this.keys.title ? this.keys.title : "label";
    this.all = this.keys.all || false;

    this.$scope.$watch("ctrl.options", newVal => {
      if (!newVal) return;
      this.options = newVal;
      this.isShow = !_.isUndefined(this.selected);
      if (this.all)
        this.options.splice(this.all - 1, 0, {
          [this.id]: "",
          [this.title]: "全部"
        });
    });
  }
}

/**
 * 下拉框组件 select2样式
 * @param options 下拉列表的选项
 * @param selected 当前选中的值
 * @param keys 配置项
 *
 * keys: {
 *  id: 列表中标识为code的属性名 -> [default]: "value",
 *  title: 列表中标识为name的属性名 -> [default]: "label",
 *  all: 是否需要增加【全部】选项 [default]: false 如果需要添加，需要指定插入的位置，最小值为1
 *  name: 指定当前下拉框的placeholder
 * }
 */
angular.module("SmartAdmin.Directives").component("hsNewSelect", {
  templateUrl:
    "app/directive/common/new.select/hs.new.select.tpl.html",
  controller: newSelectController,
  controllerAs: "ctrl",
  bindings: {
    options: "<",
    selected: "=",
    keys: "<"
  }
});
