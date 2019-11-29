class supplierSupplyController {
  constructor($scope, FigureService, CommonCon, tableService, DTColumnBuilder,
              toolService, dataService, $sce, basicService, $state,popups,$rootScope,
              popupDataService, $stateParams, Common ,Table, indexCompleteService, commonP, SupplyRate) {
    this.$sce = $sce;
    this.scope = $scope;
    this.Table = Table;
    this.$state = $state;
    this.common = Common;
    this.popups = popups;
    this.root = $rootScope;
    this.commonP = commonP;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.table = tableService;
    this.dataService = dataService;
    this.toolService = toolService;
    this.stateParams = $stateParams;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.indexService = indexCompleteService;
    this.SupplyRate = SupplyRate;

    this.interfaceName = 'getSupplyDataBySupplier';

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 异步中需要处理的数据
    this.back = {};

    // 表格实例
    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = CommonCon.fieldInfo;

    // 保存共通指标的地方
    this.localTable = CommonCon.local.TABLE_ORIGIN_SUPPLIER_INOUT;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 存放 local field 指标
    this.localTableFields = CommonCon.local.TABLE_ORIGIN_SUPPLIER_TABLE_LOCAL;

    // 当前页面需要的指标结构
    this.currlTableFields = angular.copy(this.Table.materialOptions);

    // 同比指标
    this.ToTOptions = angular.copy(this.Table.excessYoYToTSetting);

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, angular.copy(CommonCon.commonPro));
    this.com.logisticsMode = this.CommonCon.logisticsPattern[0].id;

    // 页面配置项
    this.key = {
      router: 'app.supAnalyse.subSupply',
    };

    // 展示条件顺序和字段
    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5,
      logisticsMode: 6,
      receiveQtyRate: 7,
      returnAmountRate: 8,
      district: 9,
      storeGroup: 10,
      brand: 11,
      product: 12,
      supplier: 13
    }
  }

  init() {
    // 初始化搜索按钮状态
    this.condition_state = true;

    this.root.fullLoadingShow = false;
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));

    // 到货率、退货率监听
    this.indexService.receiveRateListen(this);

    // 页面初始化的基础逻辑
    this.indexService.supInit(this, () => {
      this.copyCom = angular.copy(this.com);
      // 中分类转换
      this.buildOption();
      this.showCondition();
    });
  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, this.commonP.mains);

    // 当前页面退货率到货率条件回复
    this.indexService.backCondition(this);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 如果session里面有值的话 优先读取session(按供应商页面返回session获取)
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(
      this.com,
      ['district', 'storeGroup', 'brand', 'product', 'supplier']
    );

    // 构建表格请求数据
    this.initField();
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTableFields);
    const fields = table
      ? this.tool.getFieldFromLocal(table, this.currlTableFields)
      : this.currlTableFields;
    this.field.table = angular.copy(fields);

    //初始化表格
    this.initColumn();
  }

  // 构建 newTable 数据
  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);

    this.buildColumn();
  }

  showCondition() {
    let com = angular.copy(this.copyCom);
    if (this.receiveRate) {
      const receiveRate = angular.copy(this.receiveRate);
      if (receiveRate.checkOne) com.receiveQtyRate = receiveRate.receiveQtyRate;
      if (receiveRate.checkTwo) com.returnAmountRate = receiveRate.returnAmountRate;
    }
    com.logisticsMode ?
      com.logisticsMode = this.CommonCon.logisticsPattern.find(l => l.id === com.logisticsMode).name
      : delete com.logisticsMode;
    this.sortCom = this.tool.dealSortData(com, this.sort, this.SupplyRate);
  }

  // 构建表格的column
  buildColumn( ) {
    this.fix = [
      "_id",
      {
        code: "supplierName",
        render: (data) => { return this.tool.buildLink(data) }
      },
      "supplierCode",
    ];
    this.column = this.table.anyColumn(this.table.fixedColumn(this.fix), this.field.newTable, null);
  }

  // 表格数据构建
  buildOption( ) {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field),
      addSum: '_id',
      setSum: s => this.sum = s,
      special: {
        pageId: this.CommonCon.page.page_supplier_supply
      }
    };

    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
        fixed: 3,
        row: this.rowCallback()
      });

    this.tableInfo = {};
  }

  // 点击查询
  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.isSearch = true;

    this.tool.commonSetTop(this.com);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.initColumn();
      this.instance.reloadData();
    });

    this.showCondition();
  }

  // 表格点击事件回掉值
  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.copyCom, this.back, rowData, "app.supAnalyse.subSupply");
      })
    };
  }

  // 门店
  openStoreList() {
    const promise = this.popupDataService.openStore({selected: this.com.store.val});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupDataService.openCategory({selected: this.com.category.val});
    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 品类组
  openClasses() {
    const promise = this.popupDataService.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 地区
  openDistrict() {
    const promise = this.popupDataService.openDistrict({selected: this.com.district.val});
    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  // 业态
  openOperation() {
    const promise = this.popupDataService.openOperation({selected: this.com.operation.val});
    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  // 商店
  openItem() {
    const promise = this.popupDataService.openItem({selected: this.com.product.val});
    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
      // 监听商品条件选择
      this.tool.watchProduct(this);
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupDataService.openBrand({selected: this.com.brand.val});
    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});
    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.storeGroup.val});
    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

  // 数据设定
  getTableOption() {
    const promise = this.popups.popupSaleStockTable({
      field: this.currlTableFields,
      local: this.localTableFields,
      haveOptions: this.ToTOptions
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;
      this.field = Object.assign({}, this.field);
      this.buildOption();
      this.initColumn();
    });

  };


}

angular.module("hs.supplier.adviser").controller("supplierSupplyCtrl", supplierSupplyController);
