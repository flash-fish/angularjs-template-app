/**
 * Created by ios on 2018/8/13.
 */
class newProviderController {
  constructor(CommonCon, $state, toolService, basicService, popups, Table,
              tableService, $scope, popupDataService, Common, Field, Pop, $compile, indexCompleteService) {
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.table = tableService;
    this.commonCon = CommonCon;
    this.popupData = popupDataService;
    this.$compile = $compile;
    this.Field = Field;
    this.indexService = indexCompleteService;

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);


    this.instance = {};

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 9)[0];

    // 调用接口的方法名字
    // this.interfaceName = "getSalesAndInventoryDataBySupplier";

    // 所有指标的对照关系
    // this.fieldInfo = this.basic.buildField(Field.sale);

  }

  init() {
    if (!this.tableInfo) this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = this.keys.Supplier
      ? this.keys.Supplier[0]
      : "getSalesAndInventoryDataBySupplier";

    // 所有指标的对照关系
    let mid_info = this.indexService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.keys.actCompare ?
      this.basic.buildField(mid_info)
      : this.basic.buildField(this.Field.sale);

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 7);

    this.initColumn();
    // 监听共通条件的变动
    this.tool.watchParam(this, p => {

      if(this.keys.actCompare){
        // 初始化column
        this.initColumn(true,p);

        // 根据是否勾选日期构建chart 数据
        let mid_field = _.clone(this.field.chart);
        this.field.chart = this.indexService.DateCheck(p,mid_field);

      }

    });

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, (c,p) => {
      // 监听chart指标变动
      if(this.keys.actCompare){
        if(this.noInit){
          // 根据是否勾选日期构建chart 数据
          if(!p.dateY) this.indexService.structureChart(this.field);
        }
      }
    }, {
      pageNoChart: true
    });
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

  /**
   * 构建表格的column
   */
  buildColumn() {
    this.fix = [
      "_id",
      "supplierCode",
      {
        code: "supplierName",
        class: "table-item-name",
        render: (data, t, f) => {
          return this.tool.buildPopover(data, f._id, {code: f[this.current.code], showCode: f[this.current.showCode]}, this);
        }
      },

    ];

    // 活动分析ToT转换
    if(this.keys.actCompare){
      this.indexService.ToTTrans(this);
    }

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, this.keys);
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, this.field),
      special: {
        pageId: this.keys.pageId
      }
    };

    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        fixed: 3,
        start: this.tableInfo.page ? this.tableInfo.page.start: 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
        compileBody: this.scope,
        compileFixColumn: true
      })
    ;
  }


}



angular.module('hs.supplier.saleStock').component('newProvider', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/newProvider/newProvider.tpl.html',
  controller: newProviderController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '=',
    tableInfo: '<'
  }
});

