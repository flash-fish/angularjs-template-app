class SplitLineController {
  constructor (dataService) {
    this.dataService = dataService;

    this.show = false;
  }

  init () {
    this.name = this.name ? this.name : '更多条件';
  }

  toggle () {
    this.show = !this.show;
  }


}

angular.module('SmartAdmin.Directives').component('splitLine', {
  templateUrl: "app/directive/common/split.line/split.tpl.html",
  controller: SplitLineController,
  controllerAs: 'ho',
  bindings: {
    show: '=',
    name: '@'
  }
});
