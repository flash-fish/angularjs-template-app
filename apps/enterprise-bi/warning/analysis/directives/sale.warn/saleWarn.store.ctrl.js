class saleWarnStoreController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Common, WarningService, Warning) {
    this.scope = $scope;
    this.Common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.warnServ = WarningService;

    // 异步中需要处理的数据
    this.back = {};
    this.instance = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({}, ["product", "supplier"], true);

    this.sort = {
      classes: 1,
      category: 2,
      operation: 4,
      store: 5,
      district: 6,
      storeGroup: 7,
      brand: 3
    };

    this.otherCommon = angular.copy(Warning.otherCommon);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getSaleAbnormalStoreList";

  }

  init() {

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 初始化column
    this.initColumn();
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup']);

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);

      this.showCondition();

      this.buildOption();
    }, true);
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_sale_by_store
      }
    };
    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : 6,
      fixed: 3,
      row: this.rowCallback(),
      compileBody: this.scope
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSubPageDetail(this.copyCom, this.back, rowData, "app.warn.saleWarnDetail", "store");
      })
    };
  }

  /**
   * 查询按钮
   */
  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }


  initColumn() {
    const fix = [
      '_id',
      "storeCode",
      {
        code: "storeName",
        title: `门店`,
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },
      "businessOperationName",
      "districtName",
      {
        code: 'retailAmountToT',
        title: "最近30天零售额跌幅",
        render: data => {
          let retailAmountToT = this.FigureService.scale(data, true, true);
          return `<span up-down change="${data}"></span>${retailAmountToT}`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'retailAmount',
        title: `最近30天零售额(万元)`,
        render: data => {

          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "retailAmountToTValue",
        title: `上个周期零售额(万元)`,
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "productCnt",
        title: `销售异常商品数`,
        sort: true,
        class: 'text-right'
      }
    ];
    this.column = this.tableService.fixedColumn(fix);
  }

  showCondition(){
    this.sortCom = this.tool.dealSortData(this.copyCom, this.sort, false, (list, pushFunc) => {
      this.warnServ.dealOtherCommon(list, pushFunc, this.sort, this.copyCom, this.otherCommon)
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
    });
  }

  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  openStoreGroup() {
    const promise = this.popupData.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }


}

angular.module('hs.warning.menu').component('saleWarnStore', {
  templateUrl: 'app/warning/analysis/directives/sale.warn/saleWarn.store.tpl.html',
  controller: saleWarnStoreController,
  bindings: {
    keys: '='
  }
});
