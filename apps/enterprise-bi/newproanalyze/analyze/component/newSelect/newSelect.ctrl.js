class SelectController
{
  constructor($scope)
  {
    this.scope = $scope;
  }
  init()
  {
    this.scope.$watch('ctrl.option', newvalue => {
      this.models = newvalue;
      this.selected = `${this.models[0].selects[0].id},${this.models[0].active}`;
      this.check = false;
    });

    this.scope.$watch("ctrl.data", newVal =>{
      this.data = newVal;
    });
    this.scope.$watch("ctrl.selected", newVal =>{
      this.change();
    });
  };
  change(){
    this.data = this.check ? {field: this.selected} : null;
  }
}
angular.module('hs.productAnalyze.news').component('newSelect',  {
    templateUrl: 'app/newproanalyze/analyze/component/newSelect/newSelect.tpl.html',
    controller: SelectController,
    controllerAs: 'ctrl',
    bindings: {
      option: '<',
      data: '='
    }
});
