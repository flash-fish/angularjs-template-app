class MinusProfitWarnStoreController {
  constructor($scope, FigureService, CommonCon, tableService, toolService,
              dataService, basicService, popupDataService, Field, Warning, Common, WarningService) {
    this.Common = Common;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.WarningService = WarningService;

    // 异步中需要处理的数据
    this.back = {};
    this.instance = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
      filterCondition: {
        minusReason: ""
      }
    }, ["product", "supplier"], true);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getMinusProfitAbnormalStoreList";

    this.allminusReason = angular.copy(Warning.reason);
    this.checkbox = angular.copy(Warning.checkbox);
    this.filterBox = angular.copy(Warning.checkbox);

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      minusReason: 4,
      brand: 5,
      businessOperation: 6,
      store: 8,
      district: 7,
      storeGroup: 9,
    };

    this.otherCommon = angular.copy(Warning.otherCommon);
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => {
      this.getMinusProfitDateProduct(d);
    });

    // 初始化column
    this.initColumn();
  }


  initialize(data) {

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    this.com = this.tool.getComFromSession(this.com, this.tableInfo, null, (session)=>{
      this.com.filterCondition.minusReason = session.filter.select;
      this.checkbox = session.filter.checkbox;
    });

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'store']);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.buildPageCondition();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    }, true);
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_minus_profit_by_store
      }
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : [5, 'asc'],
      fixed: 3,
      row: this.rowCallback()
    });
  }

  getMinusProfitDateProduct(d) {
    this.basic.packager(this.dataService.getMinusProfitDateStore(), res => {
      if (res.data) {
        this.dateRange = res.data.map(i => {
          return moment(i, 'YYYYMMDD').format(String(i).length === 6 ? "YYYY/MM" : "YYYY/MM/DD");
        });

        this.com.date = this.dateRange[0];
      }

      this.initialize(d);
    });

  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.copyCom.filter = Object.assign({select: this.copyCom.filterCondition.minusReason}, {checkbox: this.checkbox});
        this.tool.goSubPageDetail(this.copyCom, this.back, rowData, "app.warn.minusProfitWarnDetail", "store");
      })
    };
  }

  /**
   * 查询按钮
   */
  search() {
    this.buildPageCondition();

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, ()=>{
      this.instance.reloadData();
    });

    this.showCondition();
  }

  buildPageCondition() {
    this.checkbox.forEach(s => {
      this.com.filterCondition[s.code] = s.check ? -1 : null;
    })
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
        code: 'businessProfit',
        title: `经销-预估毛利额(万元)`,
        render: data => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "productCnt",
        title: `经销负毛利异常商品数`,
        sort: true,
        class: 'text-right'
      }
    ];

    this.column = this.tableService.fixedColumn(fix);
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.filterCondition.minusReason = this.allminusReason.find(r => _.eq(r.value, com.filterCondition.minusReason)).label;
    com.filterCondition = _.omit(com.filterCondition, this.filterBox.map(c => c.code));
    this.sortCom = this.tool.dealSortData(com, this.sort, false, (list, pushFunc) => {
      this.WarningService.dealOtherCommon(list, pushFunc, this.sort, com, this.otherCommon)
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

angular.module('hs.warning.menu').component('minusProfitWarnStore', {
  templateUrl: 'app/warning/analysis/directives/minusProfit.warn/minusProfitWarn.store.tpl.html',
  controller: MinusProfitWarnStoreController,
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
