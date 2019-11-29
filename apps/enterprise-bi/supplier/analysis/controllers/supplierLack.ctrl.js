class supplierLackController {
  constructor($scope, $compile, FigureService, CommonCon, tableService, DTColumnBuilder,
              toolService, SaleStockSubMenu, popups, dataService, $stateParams, $sce,
              basicService, $state, popupDataService, Common) {
    this.$sce = $sce;
    this.scope = $scope;
    this.common = Common;
    this.popups = popups;
    this.$state = $state;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;

    this.menu = angular.copy(SaleStockSubMenu);

    this.interfaceName = 'getStockOutDataBySupplier';

    // 日期控件配置
    this.dateOption = {};

    // 初始化合计内容
    this.initTemp = [
      {name: '加注缺品SKU数', option: '-'},
      {name: '平均加注缺品天数', option: '-'},
      {name: 'A类品加注缺品占比', option: '-'}
    ];

    this.temp = [
      {name: '加注缺品SKU数', option: 'avgStockOutSku'},
      {name: '平均加注缺品天数', option: 'avgStockOutDays'},
      {name: 'A类品加注缺品占比', option: 'stockOutSkuAPct'}
    ];

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 保存共通条件的地方
    // this.com = this.basic.initCondition({
    //   date: "",
    //   stockOutSkuFlag: false,
    //   avgStockOutDaysFlag: false,
    //   stockOutSkuAPctFlag: false,
    //   stockOutSkuId: 0,
    //   avgStockOutDaysId: 0,
    //   stockOutSkuAPctId: 0,
    // }, ["classes", "brand", "category", "supplier", "product"]);
    this.com = Object.assign({
      date: "",
      stockOutSkuFlag: false,
      avgStockOutDaysFlag: false,
      stockOutSkuAPctFlag: false,
      stockOutSkuId: 0,
      avgStockOutDaysId: 0,
      stockOutSkuAPctId: 0,
    }, this.CommonCon.commonPro);


    // 异步中需要处理的数据
    this.back = {
      finish: false,
    };
    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = CommonCon.fieldInfo;

    // 保存共通指标的地方
    this.field = {};

    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;
      if (newVal.finish !== oldVal.finish)
        this.back.finish = true;
    }, true);

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      stockOutSkuId: 4,
      avgStockOutDaysId: 5,
      stockOutSkuAPctId: 6,
      brand: 7,
      product: 8,
      supplier: 9
    }
  }

  init() {
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));
    //初始化表格
    this.initColumn();
  }

  initialize(data) {
    this.inited = true;

    // 获取路由参数的值用于子菜单渲染
    const info = this.stateParams.info;
    if (info) this.info = JSON.parse(info);

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, ["stockOutSkuFlag", "avgStockOutDaysFlag", "stockOutSkuAPctFlag"]);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    if(this.basic.getSession('fromInforToLack', true)) {
      this.com.stockOutSkuFlag = false;
      this.com.avgStockOutDaysFlag = false;
      this.com.stockOutSkuAPctFlag = false;
      this.com.stockOutSkuId = 0;
      this.com.avgStockOutDaysId = 0;
      this.com.stockOutSkuAPctId = 0;
    }

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断隐藏条件等有没有值
    this.hideCondition = ['brand', 'product', 'supplier'];
    this.show = this.tool.contrastCom(this.com, this.hideCondition);

    // 这段代码从init方法改放到这里，否则异步数据就会产生问题
    let param = ["stockOutSku", "avgStockOutDays", "stockOutSkuAPct"];
    this.basic.packager(this.dataService.getCountRange(param), res => {
      this.stockOutSkuSelections = res.data.stockOutSku;
      this.avgStockOutDaysSelections = res.data.avgStockOutDays;
      this.stockOutSkuAPctSelections = res.data.stockOutSkuAPct;

      this.stockOutSkuSelected = this.stockOutSkuSelections[this.com.stockOutSkuId];
      this.avgStockOutDaysSelected = this.avgStockOutDaysSelections[this.com.avgStockOutDaysId];
      this.stockOutSkuAPctSelected = this.stockOutSkuAPctSelections[this.com.stockOutSkuAPctId];
      this.copyCom = angular.copy(this.com);
      this.showCondition();
    });

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.showCondition();
      this.buildOption();
    });
  }

  initColumn() {
    const fix = [
      "_id",
      "supplierCode",
      {
        code: 'supplierName',
        title: '供应商名称',
        render: (data) => {
          return this.tool.buildLink(data);
        },
      },

      {
        code: "stockOutSku",
        title: "加注缺品SKU数",
        render: (data) => {
          let formatData = this.FigureService.thousand(data, 0);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "avgStockOutDays",
        title: "平均加注缺品天数",
        render: (data) => {
          let formatData = this.FigureService.scaleOther(data, false);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "stockOutSkuAPct",
        title: "A类品加注缺品占比",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
    ];

    this.column = this.tableService.fixedColumn(fix);
  }

  buildOption() {
    let f = ["avgStockOutDays", "stockOutSkuAPct"];
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, f),
      addSum: '_id',
      setSum: (s) => this.buildSum(s),
      special: {
        pageId: this.CommonCon.page.page_supplier_lack
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back, this), {
        pageLength: 100,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
        row: this.rowCallback()
      })
  }

  /**
   * 处理合计部分数据
   * @param d
   */
  buildSum(d) {
    if (!d) return;
    const m = angular.copy(this.temp);

    m.forEach((s, i) => {
      this.initTemp[i].curr = '';

      this.initTemp[i].option =
        s.option === 'stockOutSkuAPct'
          ? this.FigureService.scale(d[s.option], false, true)
          : this.initTemp[i].option = this.FigureService.scaleOther(d[s.option], false, true);
    });
  }

  search() {
    this.initTemp.forEach(v => {
      v.option = '-';
      v.curr = '';
    });

    if (this.com.stockOutSkuFlag) {
      this.stockOutSkuSelections.forEach((v, i) => {
        if (this.stockOutSkuSelected === v)
          return this.com.stockOutSkuId = Number(i);
      })
    } else {
      delete this.com.stockOutSkuFlag;
      delete this.com.stockOutSkuId
    }

    if (this.com.avgStockOutDaysFlag) {
      this.avgStockOutDaysSelections.forEach((v, i) => {
        if (this.avgStockOutDaysSelected === v)
          return this.com.avgStockOutDaysId = Number(i);
      })
    } else {
      delete this.com.avgStockOutDaysFlag;
      delete this.com.avgStockOutDaysId
    }

    if (this.com.stockOutSkuAPctFlag) {
      this.stockOutSkuAPctSelections.forEach((v, i) => {
        if (this.stockOutSkuAPctSelected === v)
          return this.com.stockOutSkuAPctId = Number(i);
      })
    } else {
      delete this.com.stockOutSkuAPctFlag;
      delete this.com.stockOutSkuAPctId
    }

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, ["stockOutSkuFlag", "avgStockOutDaysFlag", "stockOutSkuAPctFlag"]);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.com);
    // 这个页面定义的恶心的变量重新声明好组装，然后遍历处理下
    const arr = ['stockOutSku', 'avgStockOutDays', 'stockOutSkuAPct'];
    arr.forEach(a => {
      if(com[a+'Flag']) {
        if (!this[a+ 'Selections']) return;
        com[a+'Id'] = this[a+ 'Selections'].find((v, k) => k === com[a+'Id']);
      } else
        delete com[a+'Id'];
    });

    const other = {
      stockOutSkuId: {name: '加注缺品SKU数'},
      avgStockOutDaysId: {name: '平均加注缺品天数'},
      stockOutSkuAPctId: {name: 'A类加注缺品占比'}
    };
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.copyCom, this.back, rowData, "app.supAnalyse.subLack");
      })
    };
  }

  /**
   * popup 接口
   */

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
}

angular.module("hs.supplier.adviser").controller("supplierLackCtrl", supplierLackController);
