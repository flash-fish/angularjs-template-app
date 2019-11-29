class SupplierProfitController {
  constructor(CommonCon, $state, toolService, basicService, popups, Table,
              $scope, tableService, Common, FigureService, popupDataService,
              popupToolService, CommSearchSort, dataService, QuaConst, supplierService, $rootScope) {
    this.Table = Table;
    this.scope = $scope;
    this.common = Common;
    this.popups = popups;
    this.$state = $state;
    this.root = $rootScope;
    this.tool = toolService;
    this.QuaConst = QuaConst;
    this.table = tableService;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.supplier = supplierService;
    this.popupData = popupDataService;
    this.popupToolService = popupToolService;
    this.sort = angular.copy(CommSearchSort);

    this.sort.supplier = 3;
    this.sort.store = 7;
    this.sort.district = 5;

    this.instance = {};

    // 调用接口的方法名字
    this.interfaceName = "getSalesAndInventoryDataBySupplier";
    this.supIdInterface = "getSupplierInfoByIds";

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["product", "brand", "category"], true);

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 品类组和门店相关条件的相互影响
    this.tool.effectCondition(this);

    // 监听路由变化
    this.root.$on('$stateChangeSuccess', () => { this.ClearSup() });
  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 根据角色动态过滤页面的条件
    this.condition = this.tool.getConditionByJob(this.job, this.com);

    // 获取二级菜单共享的条件session
    this.topCondition = this.tool.initProfitCondition(this.com, null, {
      job: this.job,
      reset: ['classes']
    });

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 保存指标的local
    this.localTable = `${this.commonCon.local.TABLE_ORIGIN_SUP_PROFIT_P}_${this.job}`;

    // 获取当前页面的可选指标
    this.currFileds = this.Table.supplierProfit[this.job];

    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    let YoYToTSettingTabs = {};
    if(table.YoYToTSettingTabs) {
      YoYToTSettingTabs = angular.copy(table.YoYToTSettingTabs);
      delete table.YoYToTSettingTabs;
    }

    // 取新品四象限分析跳转 session
    this.JumpFromQua = this.basic.getSession(this.common.supplierIDCondition);
    if(this.JumpFromQua && this.JumpFromQua.emitIndefication){
      const juQua = this.JumpFromQua;

      const supplierId = juQua.supplierId;

      this.supplier.supplierIdGet(this, supplierId, () => {
        let _Name;

        let _name = juQua.emitIndefication === 'supQuadrant';

        // 数据设定操作
        if(juQua.clasInfo){
          _Name = juQua.clasInfo.level === 2 ? '部门' : 3 ? '部组' : '品类组';
          if(_name){
            this.com.classes = {
              id: '4',
              val:[{
                code: juQua.clasInfo.code,
                level: juQua.clasInfo.level,
                name: `${_Name}-${juQua.clasInfo.name}`
              }],
            };
          }else this.com.classes = _.clone(juQua.clasInfo);
        }

        this.com.date = juQua.quaDateEmitInfo;

        // 供应商条件存为共同
        this.tool.profitSearch(this.topCondition, this.com);

        // 依据跳转 操作 Fields 指标
        let fromJumpFields = angular.copy(this.currFileds);

        _.forIn(fromJumpFields, (v,k) => {
          if(k === 'sale' || k === 'getBuyer'){
            v.list.forEach( s => {
              s.model = this.QuaConst.CheckList.includes(s['id']);
            })
          }else v.list.forEach( s => s.model = false)
        });

        // 重构弹窗结构
        this.currFileds = _.clone(fromJumpFields);

        // 跳转页面保存 session
        const localField = Object.assign(
          {}, this.popupToolService.buildSimpleField(this.currFileds), {YoYToTSettingTabs: YoYToTSettingTabs}
        );

        this.basic.setLocal(this.localTable, localField);

        this.methodRequire(this, table, YoYToTSettingTabs);
      });
    }else this.methodRequire(this, table, YoYToTSettingTabs);

  }

  // 重调函数封装
  methodRequire(self, table, YoYToTSettingTabs){
    const fields = table ? self.tool.getFieldFromLocal(table, self.Table.supplierProfit, self.job, true)[self.job] : self.currFileds;
    self.field.table = angular.copy(fields);

    //处理下同比环比的配置（获取table要去掉的fields）
    _.forIn(YoYToTSettingTabs, v => {
      const option = self.popupToolService.getSameRingRatioOption(v);
      self.field.table = Object.assign({}, fields, {option});
    });

    // 初始化column
    self.initColumn();

    // 页面初始化的基础逻辑
    self.tool.pageInit(this, () => {
      self.copyCom = angular.copy(self.com);
      self._table_show = true;
      self.buildOption();
      self.showCondition();
    });
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field),
      special: {
        pageId: `${this.commonCon.page.page_supplier_income}_${this.job}`
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

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.tool.goSupplierDetail(this.copyCom, this.back, rowData, 'app.supAnalyse.subProfit');
      });
    };
  }

  /**
   * 查询按钮
   */
  search() {
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.profitSearch(this.topCondition, this.com);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();

    this.ClearSup();
  }

  // 清除四象限页面跳转 session
  ClearSup(){
    this.basic.getSession(this.common.supplierIDCondition, true);
  }


  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.column = this.tool.buildSupplierColumn(this.field.newTable);
  }

  // 数据设定
  getTableOption() {
    const promise = this.popups.popupProfitTable({
      basicFields: this.Table.supplierProfit,
      field: this.currFileds,
      local: this.localTable,
      tab: false,
      job: this.job
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;

      this.ClearSup();

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
    });
  }

  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  openSupplier() {
    const promise = this.popupData.openSupplier({
      selected: this.com.supplier.val,
      MaxLimit: 2000,
    });

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

angular.module("hs.supplier.adviser").controller("supplierProfitCtrl", SupplierProfitController);
