class FilterBoxController {
  constructor($scope, Field) {
    this.scope = $scope;
    this.Field = Field;

  }

  init() {
    let key = this.scope.key;
    if (!key) key = {};
    this.target = key.target ? key.target : "商品";

    // 定义筛选部分的逻辑
    this.filterField = key.limit
      ? key.limit : {
        sale: ["Amount", "Unit", "Cost"],
        profit: ["Profit"],
        stock: ["stockCost", "stockQty"]
      };


    this.scope.$watch("ctrl.scope.field", newVal => {
      if (!newVal) return;

      this.initSelect(newVal);
    });

    this.scope.$watch("ctrl.scope.limit", newVal => {
      if (!newVal || !newVal.field) return;

      this.check = true;

      const filter = this.selections.filter(s => s.id === newVal.field)[0];
      const newSel = filter ? filter.id : null;

      this.selected = newSel ? newSel : this.selections[0].id;
    });

    this.scope.$watch("ctrl.selected", newVal => {
      if (!newVal) return;

      this.newSelect = newVal;
    });

  }

  change() {
    this.scope.limit = this.check
      ? {field: this.selected, percentage: 0.8}
      : null;
  }

  selectChange() {
    this.scope.limit.field = this.selected;
  }

  initSelect(field) {
    let all = [], select = [], selectWhole = [];

    if (field.whole) selectWhole = field.whole.list.filter(s => s.model);
    const whole = selectWhole.length > 0 ? selectWhole[0].id : "";

    _.forIn(field, (val, key) => {
      const limit = this.filterField[key];

      if (!limit) return;

      const list = val.list.filter(s => s.model && s.join === 1 && limit.includes(s.id));
      all = all.concat(list);

      if (list.length > 0) {
        const sel = angular.copy(list[0]);
        if (val.key.join === 2) {
          sel.id = whole + sel.id;
          sel.name = this.Field.sale[sel.id].name;
        }
        select.push(sel);
      }
    });

    this.hideSelect = all.length === 0;
    if (this.hideSelect) return;

    this.selections = select;

    const curr = this.newSelect
      ? this.newSelect
      : this.scope.limit ? this.scope.limit.field : null;
    const filter = this.selections.filter(s => s.id === curr)[0];
    const newSel = filter ? filter.id : null;

    this.selected = newSel ? newSel : this.selections[0].id;

    if (this.scope.limit) this.scope.limit.field = this.selected;
  }

}

angular.module('SmartAdmin.Directives').directive('filterBox', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directive/business/filterBox/filter.box.tpl.html',
    controller: FilterBoxController,
    controllerAs: 'ctrl',
    scope: {
      field: '<',
      key: '<',
      limit: '='
    }
  }
});
