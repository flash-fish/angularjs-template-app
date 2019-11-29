class ChannelTableController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService,
              tableService, CommonCon, toolService, pageService, Pop, Common,
              FigureService, $compile, channelField) {
    this.scope = $scope;
    this.tool = toolService;
    this.page = pageService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.channelField = angular.copy(channelField);

    // 初始化dataTable实例
    this.instance = {};

    this.showStock = true;

    this.chartPage = 1;

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 4)[0];

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess, false);

  }

  init() {

    this.interfaceMapping = {
      // 按品类组费用代码
      buyerChannelCode: 'getBuyerChannelAmountDataByChannelCode',
      // 按门店费用代码
      storeChannelCode: 'getStoreChannelAmountDataByChannelCode'
    };

    // 初始化column
    this.initColumn();

    this.scope.$watch('ctrl.keys.subActive', newVal => {
      this.keys.activeInterface = this.keys.subActive === 1 && this.keys.active === 8 ? 'buyerChannelCode' : 'storeChannelCode';
      this.scope.$emit('RESET_CHANNEL_CODE', this.keys[this.keys.activeSearch]);
    });

    // 监听共通条件的变动
    this.tool.watchParam(this);

    // 监听table指标变动
    this.tool.watchTable(this);

    this.buildOption(this.param);
  }

  /**
   * 初始化表格列信息
   */
  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange, this.keys);
    this.buildColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption(param) {
    this.key = {
      addSum: 'channelCode',
      interfaceName: this.interfaceMapping[this.keys.activeInterface],
      param: this.buildParam(param),
      special: {
        pageId: this.keys.pageId
      }
    };


    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back, this.keys), {
        sort: this.keys.active === 9 ? 2 : 3,
        fixed: this.keys.active === 9 ? 2 : 3,
        start: (this.chartPage - 1) * 10,
        compileBody: this.scope,
        pageLength: 100
      });
  }

  buildParam(val) {
    const channelCode = angular.copy(val.channelCode);
    let param = angular.copy(val);
    delete param.channelCode;
    let res = this.tool.getParam(param, this.field);
    res.condition = Object.assign(res.condition, {channelCode});
    if (_.isUndefined(val.channelCode) || !val.channelCode.length) delete res.condition.channelCode;
    return res;
  }


  /**
   * 切换层级触发
   */
  changeLevel() {
    this.param = Object.assign({}, this.param, {changeLevel_delete: true});
  }

  /**
   * 构建dataTable的column
   */
  buildColumn() {

    this.fix = _.keys(this.channelField);

    if (this.keys.active === 9) {
      this.fix = this.fix.filter(s => s !== 'feeKindName');
    }

    this.column = this.tableService.anyColumn(
      this.tableService.fixedColumn(this.fix, this.channelField),
      this.field.newTable,
      null,
      this.keys
    );
  }
}

angular.module("hs.saleStock").component('channelTable', {
  templateUrl: 'app/saleStock/directives/channel/channelTable.tpl.html',
  controller: ChannelTableController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
