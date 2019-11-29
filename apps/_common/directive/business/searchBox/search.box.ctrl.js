class SearchBoxController {

  constructor(Symbols, $scope, Pop) {
    this.Symbols = Symbols;
    this.$scope = $scope;

    this.option = angular.copy(Pop.types);
  }

  init() {
    const key = this.$scope.key;

    let filter = typeof key === 'object'
      ? ['name', key.target]
      : typeof key === 'string'
        ? ['name', key]
        : ['id', key.id];

    this.$scope.$watch('ctrl.$scope.data', newVal => {

      if (!newVal) return;

      this.info = this.getInfo(filter);
      this.name = key.title ? key.title : this.info.name;

      this.list = newVal.map(b => b.name).join(this.Symbols.comma);
      this.count = newVal.length;
    }, true);
  }

  delete(e) {
    e.stopPropagation();

    this.$scope.data = [];
  }

  enter() {
    this.hideDel = this.count !== 0;
  }

  leave() {
    this.hideDel = false;
  }

  getInfo(filter) {
    return this.option.filter(s => s[filter[0]] === filter[1])[0];
  }
}


angular.module('SmartAdmin.Directives').directive('searchBox', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directive/business/searchBox/search.box.tpl.html',
    controller: SearchBoxController,
    controllerAs: 'ctrl',
    scope: {
      click: '&',
      data: '=',
      key: '<',
      disable: '<'
    }
  }
});
