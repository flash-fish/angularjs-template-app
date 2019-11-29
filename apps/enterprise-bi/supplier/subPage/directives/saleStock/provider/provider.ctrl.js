/**
 * Created by ios on 2018/8/13.
 */
class ProviderController {
  constructor(CommonCon, $state, toolService, basicService, popups, Table,
              tableService, $scope, popupDataService, Common, Field, Pop, $compile) {
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

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    this.instance = {};

    // 调用接口的方法名字
    // this.interfaceName = "getSalesAndInventoryDataBySupplier";

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

  }

  init() {
    // 调用接口的方法名字
    this.interfaceName = this.keys.Supplier
      ? this.keys.Supplier[0]
      : "getSalesAndInventoryDataBySupplier";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 7);

    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this);

    // 监听table指标变动
    this.tool.watchTable(this, () => {
      this.buildOption();
    });

    // 监听chart指标变动
    this.tool.watchChart(this, null, {
      pageNoChart: true
    });
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange, this.keys);
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
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },

    ];

    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable, null, this.keys);

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
        row: this.rowCallback()
      });
    this.clear();
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.param, this.back, rowData, this.keys.router);
      });
    };
  }

}


angular.module('hs.supplier.saleStock').component('saleProvider', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/provider/provider.tpl.html',
  controller: ProviderController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '=',
    tableInfo: '<',
    clear: '&'
  }
});

