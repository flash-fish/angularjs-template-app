class CommonPopoverController {

  constructor( ) {
  }

  init() {
    this.position = this.key.position ? this.key.position : "top-right";
    this.trigger = this.key.trigger ? this.key.trigger : "moursenter";
  }


}

angular.module('SmartAdmin.Directives').component('commonPopover', {
  templateUrl: "app/directive/business/popover/commonPop.tpl.html",
  controller: CommonPopoverController,
  controllerAs: 'ctrl',
  bindings: {
    key: '<',
    template: '<'
  }
});
