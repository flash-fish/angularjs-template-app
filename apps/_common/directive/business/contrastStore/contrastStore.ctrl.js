class ContrastStoreController {

  constructor($scope, popupDataService, toolService) {
    this.scope = $scope;
    this.tool = toolService;
    this.popupData = popupDataService;

    this.datas = [
      {id: 1, name: "整体门店", active: true},
      {id: 2, name: "可比门店", active: false}
    ];

    this.scope.$watch("ctrl.current", newVal => {
      if (_.isUndefined(newVal)) return;

      this.curr = newVal === 2;
    });

    this.scope.$watch("ctrl.curr", newVal => {
      if (_.isUndefined(newVal)) return;

      this.current = newVal ? 2 : 1;
    });


    this.scope.$watch("ctrl.dis", v => {
      if (_.isUndefined(v)) return;
      if(v === 1) {
        this.datas = [
          {id: 1, name: "整体门店", active: true},
          {id: 2, name: "可比门店", active: false, disabled: true}
        ];
        this.curr = false;
      }else{
        this.datas = [
          {id: 1, name: "整体门店", active: true},
          {id: 2, name: "可比门店", active: false}
        ];
      }
    })

  }

  open() {
    this.tool.dealModal(this.popupData.openContrastStore(this.param));
  }


}

angular.module('SmartAdmin.Directives').component('contrastStore', {
  templateUrl: "app/directive/business/contrastStore/contrastStore.tpl.html",
  controller: ContrastStoreController,
  controllerAs: "ctrl",
  bindings: {
    param: "<",
    curr: "=",
    dis: "<"
  }
});
