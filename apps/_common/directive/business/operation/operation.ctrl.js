class operationController {

  constructor(dataService, $scope) {
    this.dataService = dataService;
    this.$scope = $scope;
  }

  init() {
    this.getOperationList();
    /*this.isInit = false;*/

  }

  getOperationList() {
    this.dataService.getOperations().then(res => {
      this.operationList = [];
      if (res.data) this.operationList = res.data;
      this.operationList.splice(0, 0, {businessOperationCode: "", businessOperationName: "全部业态"});

      this.operations = angular.copy(this.operationList);

      if(!this.operation || !this.operation.businessOperationCode)
        this.operation = this.operationList[0];
      else {
        const opt = this.operationList.filter((o) => o.businessOperationCode == this.operation.businessOperationCode);
        this.operation = opt[0];
      }

      this.$scope.$watch('$ctrl.isInit', (val) => {
        if (!val) return;
        this.operation = this.operationList[0];
      });

      this.$scope.$watch('$ctrl.operation', (val) => {
        if (val.businessOperationCode) return;

        this.operation = this.operationList[0];
      })
    });
  }
}

angular.module('SmartAdmin.Directives').component('operation', {
  templateUrl: "app/directive/business/operation/operation.tpl.html",
  controller: operationController,
  bindings: {
    operation: '=',
    isInit: '<',
    operations: '='
  }
});
