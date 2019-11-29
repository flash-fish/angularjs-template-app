class ChannelTreeController {
  constructor(dataService, $scope, $sce, Field, basicService, $rootScope,
              tableService, CommonCon, FigureService, toolService, pageService, channelTreeFix) {
    this.$sce = $sce;
    this.scope = $scope;
    this.root = $rootScope;
    this.tool = toolService;
    this.page = pageService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.channelTreeFix = angular.copy(channelTreeFix);

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);
  }

  init() {

    // Tab页 以及subTab 页对应的接口
    this.interfaceMapping = {
      // 按品类组费用代码
      byCatChannelCode: 'getChannelAmountDataByClassWithChannel',
      byChannelCodeCat: 'getChannelAmountDataByChannelWithClass',
      // 按门店费用代码
      byStoreChannelCode: 'getChannelAmountDataByStoreWithChannel',
      byChannelCodeStore: 'getChannelAmountDataByChannelWithStore'
    };

    // 初始化一些字段为后面组装要展示列的字段做准备
    this.initField();

    // 组装固定列的新字段
    this.fixNameField = 'currName';
    this.fixCodeField = 'currCode';

    this.scope.$watch('ctrl.keys.subActive', newVal => {
      this.initField();
      //广播事件，初始化 channelCode 的查询条件
      this.scope.$emit('RESET_CHANNEL_CODE', this.keys[this.keys.activeSearch]);

      this.changeSubActive = true;
    });

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', (newVal, oldVal) => {
      if (!newVal) return;
      if (newVal == oldVal) {
        if (this.changeSubActive) {
          this.getData();
          this.changeSubActive = false;
        }
        return;
      }

      this.getData();

    }, true);

    // 监听table指标变动
    this.scope.$watch('ctrl.field.table', (newVal, oldVal) => {
      // 初始化时候的处理
      if (!newVal || !this.noInit) return;

      let newTable = this.tool.calculateTableField(newVal);
      let oldTable = this.tool.calculateTableField(oldVal);

      newTable = this.tool.SameRingSettingField(newTable, newVal.option);
      oldTable = this.tool.SameRingSettingField(oldTable, oldVal.option);

      if (_.isEqual(_.sortedUniq(newTable), _.sortedUniq(oldTable))) return;

      this.field.newTable = newTable;

      this.getData();
    });

    this.config = {
      fix: [
        {
          code: this.fixCodeField,
          width: 220,
          title: this.fixCode.title,
          // cellsRenderer: (rowIndex, field, value, rowData) =>
          //   `<span title="[${value}]${rowData[this.fixNameField]}">[${value}]${rowData[this.fixNameField]}</span>`
        },
      ],
      root: "details",
      headerWrap: true,
      sort: true,
      sortDir: 'desc',
      pageId: this.keys.pageId
    };

  }

  initField() {
    const fixCode = this.channelTreeFix;
    //tab 页为按品类组费用代码
    if (this.keys.active === 8) {
      this.keys.activeInterface = this.keys.subActive === 2 ? 'byCatChannelCode' : 'byChannelCodeCat';
      // 第一级需要的name字段
      this.firstField = this.keys.subActive === 2 ? 'className' : 'channelCodeName';
      // 第二级需要的name字段
      this.secondField = this.keys.subActive === 3 ? 'className' : 'channelCodeName';
      // 固定列上需要的code字段
      this.fixCode = this.keys.subActive === 2 ? fixCode.buyer.classCode : fixCode.buyer.channelCode;
    }
    //tab 页为按门店费用代码
    if (this.keys.active === 9) {
      this.keys.activeInterface = this.keys.subActive === 2 ? 'byStoreChannelCode' : 'byChannelCodeStore';
      // 第一级需要的name字段
      this.firstField = this.keys.subActive === 2 ? 'storeName' : 'channelCodeName';
      // 第二级需要的name字段
      this.secondField = this.keys.subActive === 3 ? 'storeName' : 'channelCodeName';
      // 固定列上需要的code字段
      this.fixCode = this.keys.subActive === 2 ? fixCode.store.storeCode : fixCode.store.channelCode;
    }
  }

  getData() {
    this.config.finish = false;
    this.root.fullLoadingShow = true;

    const key = {
      pageId: this.keys.pageId
    };

    if(this.field.newTable.find(n => n === this.fixNameField)) _.remove(this.field.newTable, n => n === this.fixNameField);

    // 将param里面的数据映射到页面条件上
    this.root.$broadcast(this.CommonCon.session_key.sessionParam, this.param);

    this.interfaceName = this.interfaceMapping[this.keys.activeInterface];

    let comParam = angular.copy(this.param);
    if (_.isUndefined(comParam.channelCode))  {
      comParam.channelCode = [];
    }
    const param = this.tool.buildParam(this.tool.getParam(comParam, this.field), key);

    // 有些页面某些字段需要过滤掉
    if (this.keys.fuzzyFilter)
      param.fields = param.fields.filter(f => !f.includes(this.keys.fuzzyFilter));

    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      let data = res.data;

      // 将不同的 code和name 组装到一个字段， 有点恶心（[code] 名称）
      data.forEach(d => {

        d[this.fixNameField] = d[this.fixNameField] ? d[this.firstField] : d[this.config.root][0][this.firstField];
        d[this.fixCodeField] = `[${d[this.fixCode.code]}]${d[this.fixNameField] }`;

        d[this.config.root].forEach(r => {
          r[this.fixNameField] =  r[this.secondField];
          r[this.fixCodeField] = `[${r[this.fixCode.other]}]${r[this.fixNameField]}`;
        });
      });

      // // 遍历树 添加展开收起的属性
      // const tree = {
      //   select: [],
      //   code: this.fixCode.code
      // };

      // data.forEach(s => this.tool.loopTree(...[tree, [s], []]));

      this.table = {
        data: data,
        field: this.field.newTable
      };

      this.table.field.push(this.fixNameField);

      this.keys.finish = true;
      this.noInit = true;
      this.root.fullLoadingShow = false;
    })
  }
}

angular.module("hs.saleStock").component('channelTree', {
  templateUrl: 'app/saleStock/directives/channel/channelTree.tpl.html',
  controller: ChannelTreeController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
