/**
 * Created by ios on 2018/8/9.
 */
class SplitOtherLineController {
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

angular.module('SmartAdmin.Directives').component('splitOther', {
  templateUrl: "app/directive/common/split.line/splitOther.tpl.html",
  controller: SplitOtherLineController,
  controllerAs: 'hoOther',
  bindings: {
    show: '='
  }
});
