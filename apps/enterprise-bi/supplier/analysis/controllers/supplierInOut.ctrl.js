class SupplierInOutCtrl {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder,
              $compile, popups, Table, $cookieStore, toolService, basicService,
              popupDataService) {
    this.$sce = $sce;
    this.Table = Table;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;

    this.inOut = this.$sce.trustAsHtml(`<span><b>按供应商建档日期来算哪一年引入的供应商</b></span>`);

    this.interfaceName = 'getNewSupplierSalesData';

    // 保存共通条件的地方
    this.com = this.basic.initCondition({type_delete: ""}, ["product", "brand"], true);

    this.com.type_delete = this.CommonCon.dateTypeToThis[0].id;

    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = CommonCon.fieldInfo;

    // 保存共通指标的地方
    this.localTable = CommonCon.local.TABLE_ORIGIN_SUPPLIER_INOUT;

    this.field = {};
    this.currFileds = angular.copy(this.Table.supplierInOut);


    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;
      if (newVal.finish !== oldVal.finish)
        this.back.finish = true;
    }, true);

    this.tableInfo = {};

    this.sort = {
      date: 1,
      year: 2,
      classes: 3,
      category: 5,
      operation: 6,
      store: 7,
      supplier: 8,
      district: 9,
      storeGroup: 10,
    }
  }

  init() {

    // 获取初始化日期
    this.tool.initDate(this, (baseDate) => {
      const [startMonth, endMonth] = this.com.date.split("-");

      this.baseDay = moment(baseDate, "YYYYMMDD").format("YYYY/MM/DD");
      this.baseMonth = endMonth;
      this.baseYear = String(baseDate).substr(0, 4);
      this.lastYear = Number(this.baseYear) - 1;

      this.baseMonthDay = this.baseDay.substring(5);

      this.dateType = [
        {id: String(this.baseYear), name: `${this.baseYear}年供应商`, active: true},
        {id: String(this.lastYear), name: `${this.lastYear}年供应商`, active: false}
      ];

      this.com.year = this.dateType[0].id;

      // 获取数据权限
      this.tool.getAccess((d) => this.initialize(d));

      // 监听日期选项变化
      this.watchDate();
    });

  }

  watchDate() {
    this.scope.$watch("ctrl.com.type_delete", newVal => {
      if (!newVal) return;

      let thisYear = this.baseYear;
      let lastYear = this.lastYear;

      switch (newVal) {
        case 1:
          this.com.date = `${thisYear}/01-${this.baseMonth}`;
          break;
        case 2:
          this.com.date = `${lastYear}/01/01-${lastYear}/${this.baseMonthDay}`;
          break;
        case 3:
          this.com.date = `${lastYear}/01-${lastYear}/12`;
          break;
        default:
          this.com.date = `${thisYear}/01-${this.baseMonth}`;
          break;
      }

      // 选择去年同期/去年全年的情况下，自动选择2017年供应商，并且2018年供应商不可选
      const isLast = [2, 3].includes(newVal);

      this.dateType[0].disabled = isLast;
      this.dateType = angular.copy(this.dateType);

      this.com.year = this.dateType[isLast ? 1 : 0].id;
    });
  }


  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, ["type_delete", "year", "date"], {
      job: this.job,
      reset: ['classes']
    });

    // 如果session（父子页面跳转）里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    if(this.basic.getSession('fromInforToInOut', true)) {
      this.com.type_delete = this.CommonCon.dateTypeToThis[0].id;
      this.com.year = this.dateType[0].id;
    }

    this.mode = this.tool.authorityLevel(this.job).name === '' ? '' : this.tool.authorityLevel(this.job).name;

    // 根据权限显示字段
    this.list = {
      'allSku': {name: '有售SKU数', point: 0},
      'allSkuYoYValue': {name: '有售SKU数-同期值', point: 0},
      'allSkuYoY': {name: '有售SKU数-同比增幅', scale: true, color: true},
      'singleProductAmount': {name: '单品销售额', sale: true},
      'singleProductAmountYoYValue': {name: '单品销售额-同期值', sale: true},
      'singleProductAmountYoY': {name: '单品销售额-同比增幅', scale: true, color: true},
      'allProfit': {name: '毛利额', sale: true},
      'singleProductProfit': {name: '单品毛利额', sale: true},
      'singleProductProfitYoYValue': {name: '单品毛利额-同期值', sale: true},
      'singleProductProfitYoY': {name: '单品毛利额-同比增幅', scale: true, color: true},
      'allProfitPct': {name: '毛利额-占比', scale: true},
      'compIncomeAmount': {name: '综合收益', sale: true},
      'compIncomeAmountYoYValue': {name: '综合收益-同期值', sale: true},
      'compIncomeAmountYoY': {name: '综合收益-同比增幅', scale: true, color: true},
      'singleProductCompIncomeAmount': {name: '单品综合收益', sale: true},
      'singleProductCompIncomeAmountYoYValue': {name: '单品综合收益-同期值', sale: true},
      'singleProductCompIncomeAmountYoY': {name: '单品综合收益-同比增幅', scale: true, color: true},
      'compIncomeAmountPct': {name: '综合收益-占比', scale: true},
      'firstSaleStockDay': {name: '引入时间'},
    };

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['supplier', 'district', 'storeGroup']);

    // 初始化数据设定内容
    this.initField();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    }, true);
  }

  /**
   * 初始化构建Column
   * @param isChange
   */
  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.buildColumn();
  }

  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);

    const fields = table
      ? this.tool.getFieldFromLocal(table, this.currFileds)
      : this.currFileds;

    this.field.table = angular.copy(fields);

    this.initColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field.newTable),
      addSum: '_id',
      special: {
        pageId: this.CommonCon.page.page_supplier_in
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        fixed: 4,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 4
      })
      .withOption("rowCallback", (row, aData) => this.rowCallback(row, aData));

    this.tableInfo = {};
  }

  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, ["type_delete", "year", "date"]);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.year = `${com.year}年供应商`;
    this.sortCom = this.tool.dealSortData(com, this.sort, {year: {name: '供应商'}});
  }

  buildColumn() {
    const fix = [
      '_id',
      'supplierCode',
      {
        code: 'supName',
        render: (data) => {
          return this.tool.buildLink(data);
        },
      },

      {
        code: 'importDate',
        title: `<span title="供应商建档日期"><i class="glyphicon glyphicon-info-sign"></i>引入日期</span>`,
        sort: true,
        render: d => {
          return d ? moment(d, "YYYYMMDD").format("YYYY/MM/DD") : "";
        }
      }
    ];

    let dif = [];
    this.field.newTable.forEach((s, i) => {
      let m = {}, k = this.list[s];

      k ? m = {
        name: k.name,
        code: s,
        sale: k.sale ? k.sale : false,
        scale: k.scale ? k.scale : false,
        point: !_.isUndefined(k.point) ? k.point : false,
        color: k.color ? k.color : false
      } : m = s;

      dif.push(m);
    });

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), dif, null, {
      headerSilent: true
    });
  }

  rowCallback(row, rowData) {
    angular.element('.a-link', row).unbind('click').click(() => {
      this.tool.goSupplierDetail(this.copyCom, this.back, rowData, "app.supAnalyse.subSaleStock", "supName");
    });
  }

  // 获取数据设定信息
  getTableOption() {
    const promise = this.popups.popupSupplierInOutTable({field: this.currFileds});

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;

      this.buildOption();

      this.initColumn(true);
    });

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

angular.module("hs.supplier.adviser").controller("supplierInOutCtrl", SupplierInOutCtrl);
