class ChannelGroupController {
  constructor($scope, toolService, popupDataService, channelTypes, subChannelTypes) {
    this.scope = $scope;
    this.tool = toolService;
    this.popupData = popupDataService;
    this.channelTypes = channelTypes;
    this.subTypes = subChannelTypes
  }

  init() {
    if (this.param.classLevel) delete this.param.classLevel;

    this.keys.subActive = 1;

    //通道费用Tab 没有通道费用率， 要把费用率的字段给过滤掉
    this.keys.fuzzyFilter = 'Rate';

    this.inputFilter = {
      //品类组tab的费用代码查询
      buyerChannelCode: [],
      //门店tab的费用代码查询
      storeChannelCode: [],
    };

    this.types = this.channelTypes[this.keys.active === 8 ? 'buyerTypes' : 'storeTypes'];
    this.keys.activeSearch = this.keys.active === 8 ? 'buyerChannelCode' : 'storeChannelCode';
    const clearSearch = this.keys.active === 9 ? 'buyerChannelCode' : 'storeChannelCode';
    this.keys[clearSearch] = [];

    this.scope.$on('RESET_CHANNEL_CODE', (e, val) => {

      if (val) {
        this.inputFilter[this.keys.activeSearch] = angular.copy(val);
      }
    });

    // 广播事件（非boss的时候）
    this.scope.$emit('CAL_FIELD');


    this.scope.$watch('ctrl.inputFilter[ctrl.keys.activeSearch]', (newVal, oldVal) => {
      if (newVal == oldVal) return;

      this.mergeParam();
    });

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', p => {
      if (!p) return;

      this.mergeParam();
    });

    this.currentParam = angular.copy(this.param)
  }

  mergeParam() {
    this.keys[this.keys.activeSearch] = angular.copy(this.inputFilter[this.keys.activeSearch]);
    const channelCode = this.inputFilter[this.keys.activeSearch] ? this.inputFilter[this.keys.activeSearch].map(r => r.code) : [];
    this.currentParam = Object.assign({}, this.param, {channelCode});
  }

  openChannelCode() {
    const promise = this.popupData.openChannelCode({
      selected: this.inputFilter[this.keys.activeSearch],
      job: this.keys.job,
      id: this.keys.active === 8 ? 'buyer' : 'store'
    });

    this.tool.dealModal(promise, res => {
      this.inputFilter[this.keys.activeSearch] = res ? res : [];
    });
  }
}

angular.module("hs.saleStock").component('channelGroup', {
  templateUrl: 'app/saleStock/directives/channel/channelGroup.tpl.html',
  controller: ChannelGroupController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
