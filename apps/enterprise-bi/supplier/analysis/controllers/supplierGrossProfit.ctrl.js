class SupplierGrossProfitController {
  constructor(CommonCon, $state, toolService, basicService, popups, Table,
              tableService, $scope, dataService, popupDataService, Common, CommSearchSort) {
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.$state = $state;
    this.tool = toolService;
    this.basic = basicService;
    this.table = tableService;
    this.commonCon = CommonCon;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.sort = angular.copy(CommSearchSort);

    this.instance = {};

    // 调用接口的方法名字
    this.interfaceName = "getSalesAndInventoryDataBySupplier";

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(Table.grossProfit);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SUP_GROSS_PROFIT_P;

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: "", comparableStores: false}, CommonCon.commonPro);

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, {
      setTopCache: true
    });
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product', 'supplier']);

    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);

    // 初始化column
    this.initColumn();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    });
  }


  /**
   * 查询按钮
   */
  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.buildColumn();
  }

  /**
   * 构建表格的column
   */
  buildColumn() {
    const fix = [
      "_id",
      "supplierCode",
      {
        code: "supplierName",
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },

    ];
    this.column = this.table.anyColumn(this.table.fixedColumn(fix), this.field.newTable);
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field),
      special: {
        pageId: this.commonCon.page.page_supplier_profit
      }
    };

    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        fixed: 3,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
        row: this.rowCallback()
      });

    this.tableInfo = {};
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupGrossProfitTable({
      field: this.currFileds,
      local: this.localTable
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;

      this.buildOption();

      this.initColumn(true);
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.copyCom, this.back, rowData, 'app.supAnalyse.subGrossProfit');
      });
    };
  }

  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  openCat() {
    const promise = this.popupData.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});

    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  openDistrict() {
    const promise = this.popupData.openDistrict({selected: this.com.district.val});

    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  openItem() {
    const promise = this.popupData.openItem({selected: this.com.product.val});

    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];

      // 监听商品条件选择
      this.tool.watchProduct(this);
    });
  }

  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  openSupplier() {
    const promise = this.popupData.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

  openStoreGroup() {
    const promise = this.popupData.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }
}

angular.module("hs.supplier.adviser").controller("supplierGrossProfitCtrl", SupplierGrossProfitController);
