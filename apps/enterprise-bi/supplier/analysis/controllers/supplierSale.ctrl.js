class SupplierSaleController {
  constructor(CommonCon, $state, toolService, basicService, popups, Table,
              tableService, $scope, popupDataService, Common, FigureService, CommSearchSort,
              dataService) {
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.table = tableService;
    this.commonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.popupData = popupDataService;

    this.instance = {};

    // 调用接口的方法名字
    this.interfaceName = "getSalesAndInventoryDataBySupplier";

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(Table.saleStock);
    _.remove(this.currFileds.sale.list, (v, i) => {
      return i === this.currFileds.sale.list.length - 1;
    });

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SUP_SALE_STOCK_P;

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: "", comparableStores: false, limit: null}, CommonCon.commonPro);

    this.sort = angular.copy(CommSearchSort);

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

    // 获取MenuCondition的值用于判断当前页面的来源
    this.crumbInfo = this.tool.getMenuCondition(this.$state, this.com);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    console.log(this.com);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product', 'supplier']);

    // 初始化表格指标
    if (this.com.limit) {
      this.basic.setLocal(this.localTable, this.currFileds);
    }

    const table = this.basic.getLocal(this.localTable);
    const fields = table && !this.com.limit ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);

    // 初始化column
    this.initColumn();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();

      this.sortCom = this.tool.dealSortData(this.copyCom, this.sort);

      this.scope.$watch('ctrl.copyCom.limit', newVal => {
        if (newVal && !newVal.field) return;

        this.com.limit = newVal;
        this.copyCom.limit = newVal;
        if (!newVal) {
          delete this.copyCom.limit;
          delete this.com.limit;
        }

        if (!this.noInit) return;

        this.basic.setSession(this.commonCon.session_key.hsParam, this.copyCom);
        this.instance.reloadData();
      }, true);
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

    this.sortCom = this.tool.dealSortData(this.copyCom, this.sort)
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.column = this.tool.buildSupplierColumn(this.field.newTable);
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field),
      special: {
        pageId: this.commonCon.page.page_supplier_saleStock
      }
    };


    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back), {
        fixed: 3,
        pageLength: 100,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
        row: this.rowCallback()
      });

    this.tableInfo = {};
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.copyCom, this.back, rowData, "app.supAnalyse.subSaleStock");
      });
    };
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupSaleStockTable({
      field: this.currFileds,
      local: this.localTable,
      change: [{name: "order", list: [3], remove: true}, {name:'order', key: {col: 4}}]
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;

      this.buildOption();

      this.initColumn(true);
    });
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

angular.module("hs.supplier.adviser").controller("supplierSaleCtrl", SupplierSaleController);
