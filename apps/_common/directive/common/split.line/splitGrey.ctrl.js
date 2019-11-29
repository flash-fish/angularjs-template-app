/**
 * Created by ios on 2018/9/3.
 */
class SplitLineGreyController {
  constructor (dataService) {
    this.dataService = dataService;

    this.show = false;
  }

  init () {



  }

  toggle () {
    this.show = !this.show;
  }


}

angular.module('SmartAdmin.Directives').component('splitGreyLine', {
  templateUrl: "app/directive/common/split.line/splitGrey.tpl.html",
  controller: SplitLineGreyController,
  controllerAs: 'ho',
  bindings: {
    show: '='
  }
});
