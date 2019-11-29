class byAreaController {
  constructor(DTColumnBuilder, $scope, $compile, action, Field, basicService,
              tableService, CommonCon, toolService, Pop, Common, indexCompleteService) {
    this.scope = $scope;
    this.Field = Field;
    this.$compile = $compile;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.indexService = indexCompleteService;

    this.instance = {};

    this.showStock = true;

    this.chartPage = 1;

    // 调用接口的方法名字
    // this.interfaceName = "getAreaRankingForSale";

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 5)[0];

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
      ? this.keys.saleStore[2]
      : "getAreaRankingForSale";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs);

    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {

      if(this.keys.actCompare){
        // 初始化column
        this.initColumn(true,p);

        // 根据是否勾选日期构建chart 数据
        let mid_field = _.clone(this.field.chart);
        this.field.chart = this.indexService.DateCheck(p,mid_field);

      }

      this.tool.removeLevel(p);
      this.clickChart ? this.clickChart = false : this.hideTree = true;
    });

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, (c,p) => {
      if(this.keys.actCompare){
        if(this.noInit){
          // 根据是否勾选日期构建chart 数据
          if(!p.dateY) this.indexService.structureChart(this.field);
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

  initColumn(isChange,n_param) {
    this.tool.changeCol(this.field, null, this.keys, f => {

      if(this.keys.actCompare && n_param){
        // 重构列 YoYValue YoYInc
        this.indexService.newColumn(this,f,n_param);
      }

    });
    this.buildColumn();
  }


  changeTabClick(curr, self) {
    if (curr === 5) self.active = 1;
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
        {name: "click", event: (p, d) => this.tool.storeRelatedEvent(d, this, "district"), func: null},
        {name: "datazoom", event: (p) => this.basic.addZoomEvent(p, this.zoom), func: null}
      ],
      special: {
        appendField: ["storeCount"],
        pageId: this.keys.pageId
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back, this.keys), {
        sort: 4,
        fixed: 4,
        start: (this.chartPage - 1) * 10,
        compileBody: this.scope,
        compileFixColumn: true,
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
    let key = Object.assign({
      silent: this.silentChart,
      adjustOffset: true,
    }, this.tool.basicKey(this.current, this.fieldInfo, data));

    if(this.keys.actCompare) {
      key.compared =  { haveCompare: true};
      key.compareDate =  { dataY: this.param.dateY };
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
        code: "districtCode",
        sort: true
      },
      {
        code: "districtName",
        render: (data, t, f) => {
          if (this.keys.noLink) {
            return data;
          }

          return this.tool.buildPopover(data, f._id, {
            code: f[this.current.code]
          }, this);
        }
      },

      "storeCount"
    ];

    // 活动分析ToT转换
    if(this.keys.actCompare){
      this.indexService.ToTTrans(this);
    }

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, this.keys);
  }
}

angular.module('hs.supplier.saleStock').component('byArea', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/store/byArea.tpl.html',
  controller: byAreaController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '=',
    active: '='
  }
});
