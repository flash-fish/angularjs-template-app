class marketingController {

  constructor(CommonCon, $scope) {
    this.CommonCon = CommonCon;
    this.$scope = $scope;
  }

  init() {
    this.$scope.$watch('$ctrl.models', newVal => {
      this.newModels = newVal;
    });

    this.$scope.$watch('$ctrl.model', newVal => {
      if (_.isUndefined(newVal) || _.isUndefined(this.newModels)) return;

      this.newModels.forEach(r => {
         r.active = r.id === this.model;
      });

      this.$scope.$emit("modelChange", newVal);
    });

  }

  toggle(id) {
    this.model = id;
    this.newModels.forEach(r => {
       r.active = r.id === id;
    })
  }
}

angular.module('SmartAdmin.Directives').component('marketing', {
  templateUrl: "app/directive/business/marketing/marketing.tpl.html",
  controller: marketingController,
  bindings: {
    model: '=',
    models: '<'
  }
});
