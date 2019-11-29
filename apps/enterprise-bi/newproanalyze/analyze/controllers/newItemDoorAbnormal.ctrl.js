class newItemDoorAbnormalController {
  constructor($scope, $compile, FigureService, CommonCon, tableService, DTColumnBuilder, toolService, popups, dataService,
              $rootScope, $sce, basicService, $state, popupDataService, $stateParams, Common, Field, Pop) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;
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
    this.popupData = popupDataService;
    this.Pop = Pop;

    this.instance = {};

    // 保存共通指标的地方
    this.field = {};

    // 日期控件配置
    this.dateOption = [];

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: ""
    }, ["classes", "category", "supplier"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    this.keys = {
      finish: true
    };
    // 调用接口的方法名字
    this.interfaceName = "getStoreAbnormalSalesByProduct";

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      supplier: 4,
      storeCount: 5,
      noSaleStoreOnly: 6
    };

    this.conditionTipsMessage = '';
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));
  }


  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, ['date']);
    // 新品门店动销，供应商选择只能选一个，条件中如果有值且超出一个的话取第一个
    if (this.com.supplier && this.com.supplier.val && this.com.supplier.val.length > 1)
      this.com.supplier.val = this.com.supplier.val.filter((v, k) => k === 0);


    // 如果session里面有值的话 优先读取session
    // this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    this.com.noSaleStoreOnly = true;
    this.com.noStoreCount_delete = true;
    this.com.storeCount = 30;
    this.com.storeCount_delete = 30;

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 从目标页面点击返回时触发的逻辑
    this.tool.fromTargetToBackPage(this.com, this.tableInfo);

    // 初始化column
    this.initColumn();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.copyCom.date = '';
      // 页面初始化的基础逻辑
      this.getDate();
    }, true);
  }

  getDate() {

    let p = this.tool.buildParam(this.tool.getParam(this.copyCom, ''));
    p.pageId = this.CommonCon.page.page_new_warnStore;
    this.basic.packager(this.dataService.getDateListFromStoreAbnormalSales(p), res => {
      if(res.data) {
        if (res.data.length) res.data.forEach(d => this.dateOption.push(moment(d, 'YYYYMM').format('YYYY/MM')));
        this.copyCom.noStoreCount_delete ? this.copyCom.storeCount = this.copyCom.storeCount_delete : delete this.copyCom.storeCount;
        this.copyCom.date = this.com.date ? angular.copy(this.com.date) : this.dateOption[0];
        this.baseYear = moment(this.copyCom.date, 'YYYY/MM').format('YYYY');
        this.buildOption();

        this.getName();
        this.showCondition();
      }
    });
  }



  buildOption() {

    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_new_warnStore
      }
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : [7, 'asc'],
      fixed: 4,
      row: this.rowCallback()
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {

        // 先判断供应商条件 如果大于一个就弹框提示不允许跳转
        if (this.copyCom.supplier.val.length > 1) {
          this.alert("警告", "多供应商条件下不能查看单品概况");
          return;
        }
        // this.tool.goDoorSubPageDetail(this.copyCom, this.back, rowData, "app.newItemAnalyze.newItemSaleStock", "product", this.$state);

        let condition = angular.copy(this.copyCom);

        // 点击跳转到目标页面触发的逻辑
        this.tool.fromMenuClickToTarget(this.$state, this.back, condition, (condition) => {
          const copyCond = angular.copy(condition);
          const date = condition.date + '-' + condition.date;
          condition.click = {
            name: 'newProduct',
            value: {
              val: [{
                code: rowData.productId,
                name: rowData.productName
              }],
              id: 10
            },
            special: {
              date,
              fromPage_delete: this.$state.$current.name
            }
          };

          const copyCondition = {
            category: condition.category,
            classes: condition.classes,
            supplier: condition.supplier,
            date
          };

          this.basic.setLocal(this.common.local.topCondition, copyCondition);
        });

        this.$state.go("app.newItemAnalyze.newItemSaleStock");
      });
    };
  }

  getName() {
    this.productName = `${this.copyCom.date.substr(0, 4)}年新品`;
  }


  /**
   * 查询按钮
   */
  search() {
    delete this.conditionTipsMessage;
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.com.noStoreCount_delete ? this.com.storeCount = this.com.storeCount_delete : delete this.com.storeCount;

    this.tool.commonSetTop(this.com);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.getName();
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.noSaleStoreOnly ? com.noSaleStoreOnly = '是' : delete com.noSaleStoreOnly;
    com.noStoreCount_delete ? com.storeCount = `大于${com.storeCount ? com.storeCount : 0 }` : delete com.storeCount;
    this.sortCom = this.tool.dealSortData(com, this.sort, {storeCount: {name: '门店铺设数'}, noSaleStoreOnly: {name: '只看零销售门店'}});
  }

  initColumn() {
    const fix = [
      {
        code: '_id',
        title: 'No.'
      },
      {
        code: "productCode",
        title: "联华码",
      },
      {
        code: "productName",
        title: "新品",
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },

      'spec',
      {
        code: 'firstDistribution',
        title: '首次到货时间',
        render: (data) => {
          return this.renderFun(data);
        },
      },

    ];

    this.newTable = ['storeCount', 'saleStoreCount', 'shelveRate'];
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), this.newTable, null, {
      noTitle: false,
      invalidFieldColor: true
    });
  }

  renderFun(data) {
    let formatData = this.FigureService.dataTransform(data);

    return `<span style="margin-left: 8px">${formatData}</span>`;
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

  openSupplier() {
    const promise = this.popupData.openSupplier({
      selected: this.com.supplier.val,
      multi: false

    });

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }
}


angular.module("hs.productAnalyze.news").controller("newItemDoorAbnormalCtrl", newItemDoorAbnormalController);

