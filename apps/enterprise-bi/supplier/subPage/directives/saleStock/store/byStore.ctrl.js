class byStoreController {
  constructor(DTColumnBuilder, $scope, $compile, action, Field, basicService,
              tableService, CommonCon, toolService, Pop, Common, indexCompleteService) {
    this.scope = $scope;
    this.Field = Field;
    this.$compile = $compile;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.table = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.indexService = indexCompleteService;

    this.instance = {};

    this.showStock = true;

    this.chartPage = 1;

    // 调用接口的方法名字
    // this.interfaceName = "getStoreRankingForSale";

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 1)[0];


    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess);
  }

  init() {
    // 所有指标的对照关系
    let mid_info = this.indexService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.keys.actCompare ?
      this.basic.buildField(mid_info)
      : this.basic.buildField(this.Field.sale);

    // 调用接口的方法名字
    this.interfaceName = this.keys.saleStore
      ? this.keys.saleStore[0]
      : "getStoreRankingForSale";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 5);

    this.isbuildLink =  this.keys.link && _.isArray(this.keys.link) && this.keys.link.find(l => l === this.keys.active);

    // 是否需要清空operation
    this.clearOperation = this.keys.clearOperation;

    this.initColumn();
    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {

      if (this.keys.actCompare) {
        // 初始化column
        this.initColumn(true, p);
        // 根据是否勾选日期构建chart 数据
        let mid_field = _.clone(this.field.chart);
        this.field.chart = this.indexService.DateCheck(p, mid_field);

      }

      this.tool.removeLevel(p);
      this.clickChart ? this.clickChart = false : this.hideTree = true;
    });

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, (c, p) => {
      if (this.keys.actCompare) {
        if (this.noInit) {
          // 根据是否勾选日期构建chart 数据
          if (!p.dateY) this.indexService.structureChart(this.field);
        }
        // 活动分析未来日
        this.indexService.ToTChart(this);
      }

    });

    // 监听chart排序字段的变化
    this.tool.watchSort(this);

    // 监听chart分页字段的变化
    this.tool.watchChartPage(this);
  }


  initColumn(isChange, n_param) {
    this.tool.changeCol(this.field, null, this.keys, f => {
      if (this.keys.actCompare && n_param) {
        // 重构列 YoYValue YoYInc
        this.indexService.newColumn(this, f, n_param);
      }

    });
    this.buildColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, this.field),
      // setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      setChart: (d) => this.setChartData(d),
      addEvent: [
        {name: "click", event: (p, d) => this.tool.storeRelatedEvent(d, this, "store"), func: null},
        {name: "datazoom", event: (p) => this.basic.addZoomEvent(p, this.zoom), func: null}
      ],
      special: {
        pageId: this.keys.pageId
      }
    };

    // 是否有独立接口
    if (this.keys.independentInterFace) {
      this.key.independentInterFace = this.keys.independentInterFace;
    }

    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back, this.keys), {
        sort: 3,
        fixed: 3,
        start: (this.chartPage - 1) * 10,
        compileBody: this.scope,
        row: this.rowCallback(),
        compileFixColumn: !this.isbuildLink
      });
  }

  /**
   * 面包屑绑定的事件
   * @param code
   * @param level
   * @param name
   */
  getParent(code, level, name) {
    this.tool.storeRelatedTree(this, code);
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {

    // 同个字段不同页面可能会有不同名称, 所以从页面自定义配置进来
    if (this.keys.fieldInfo) {
      _.forIn(this.keys.fieldInfo, (v, k) => {
        let info = this.fieldInfo[v.id];
        if (this.keys.compareTableTitle) info.name = angular.copy(v.name);
      })
    }

    let key = Object.assign({
      silent: this.silentChart,
      adjustOffset: true,
    }, this.tool.basicKey(this.current, this.fieldInfo, data));

    if (this.keys.actCompare) {
      key.compared = {haveCompare: true};
      key.compareDate = {dataY: this.param.dateY};
      key.chartInfo = {
        InFo: this.keys.chartInfo,
      };
      this.indexService.ToTTrans(this);
    }

    this.tool.getChartOption(key, this);

    // 图表联动
    this.basic.connectChart();
  }

  buildColumn() {
    this.fix = [
      "_id",
      {
        code: "storeCode",
        sort: true
      },
      {
        code: "storeName",
        render: (data, t, f) => {
          if (this.keys.noLink && !_.isArray(this.keys.noLink)) {
            return data;
          }

          // const link = this.keys.link && _.isArray(this.keys.link) && this.keys.link.find(l => l === this.keys.active);
          if (this.isbuildLink) return this.tool.buildLink(data);

          return this.tool.buildPopover(data, f._id, {
            code: f[this.current.code]
          }, this);
        }
      },

    ];

    // 活动分析ToT转换
    this.indexService.ToTTrans(this);

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, this.keys);
  }


  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.currPopover = {code: rowData.storeCode, name: rowData.storeName};
        this.tool.goTab(this.keys.goTab.store, this);
      });
    };
  }
}

angular.module('hs.supplier.saleStock').component('byStore', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/store/byStore.tpl.html',
  controller: byStoreController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
