class supplierVitalFeRuleCtrl {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, FigureService,
              basicService, Field, toolService, popupDataService, $stateParams, Common, $state, CommSearchSort,
              $templateCache) {
    this.$sce = $sce;
    this.scope = $scope;
    this.common = Common;
    this.$state = $state;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.sort = angular.copy(CommSearchSort);
    this.sort.store = 4;
    this.sort.operation = 5;

    this.interfaceName = 'getSupplier8020';

    // 跳转控件
    this.initTemp = [
      {name: '全部'}
    ];

    this.com = this.basic.initCondition({date: ""}, ["store", "operation", "category", "district", "storeGroup"]);

    // 异步中需要处理的数据
    this.back = {finish: false};

    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.common);

    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;
      if (newVal.finish !== oldVal.finish)
        this.back.finish = true;
    }, true);

    // 日期控件配置
    this.dateOption = {};

    this.tableInfo = {};

    this.notstartingSku = $sce.trustAsHtml($templateCache.get(CommonCon.templateCache.receiveQtyRate));
    this.eliminationRate = $sce.trustAsHtml($templateCache.get(CommonCon.templateCache.returnAmountRate));
  }

  init() {
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));

    // 初始化表格
    this.initColumn();
  }

  initialize(data) {
    this.inited = true;

    // 获取路由参数的值用于子菜单渲染
    const info = this.stateParams.info;
    if (info) this.info = JSON.parse(info);

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, {
      needCategory: true
    });
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 从目标页面点击返回时触发的逻辑
    this.tool.fromTargetToBackPage(this.com, this.tableInfo);

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    });
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      addSum: false,
      special: {
        pageId: this.CommonCon.page.page_supplier_8020
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        fixed: 3,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
      })
      .withOption("rowCallback", (row, aData) => this.rowCallback(row, aData));
  }

  /**
   * 查询按钮
   */
  search() {
    this.back.finish = false;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom);

    // 判断当前分类的状态 一个的时候出面包屑
    const val = this.com.category.val;
    this.hideTree = val && val.length !== 1;

    if (!this.hideTree) {
      this.getCategoryTree(val[0].code);
    }

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  rowCallback(row, aData) {
    angular.element(".screen", row).unbind('click').click(() => {
      let val = {
        name: `${this.CommonCon.catLevels.filter(s => s.id == aData.level)[0].name}-${aData.categoryName}`,
        level: aData.level,
        code: aData.categoryCode
      };

      this.copyCom.category.val = [val];
      this.basic.setSession(this.CommonCon.session_key.hsParam, this.copyCom);
      this.showCondition();

      this.instance.reloadData();

      // 点击表格中的分类渲染面包屑
      this.getCategoryTree(val.code);
    });

    // 点击销售额前80%触发
    angular.element(".massAmount", row).unbind('click').click(() => {
      this.clickRow(aData, "allAmount");
    });

    // 点击毛利额前80%触发
    angular.element(".massProfit", row).unbind('click').click(() => {
      this.clickRow(aData, "allProfit");
    });

    // 点击库存金额前80%触发
    angular.element(".massStockCost", row).unbind('click').click(() => {
      this.clickRow(aData, "stockCost");
    });
  }

  /**
   * 点击某个单一指标触发
   * @param aData
   * @param field
   */
  clickRow(aData, field) {
    let condition = angular.copy(this.copyCom);

    // 点击跳转到目标页面触发的逻辑
    this.tool.fromMenuClickToTarget(this.$state, this.back, condition, (condition) => {
      const rowClick = {
        val: [{
          code: aData.categoryCode,
          name: `${this.CommonCon.catLevels.filter(s => s.id == aData.level)[0].name}-${aData.categoryName}`,
          level: aData.level
        }],
        id: 2
      };

      condition.click = {
        name: 'category',
        value: rowClick,
        special: {
          limit: {field, percentage: 0.8}
        },
        pop: {
          classes: []
        }
      };
      const copyCond = {
        date: condition.date,
        category: rowClick,
        store: condition.store,
        operation: condition.operation,
        district: condition.district,
        storeGroup: condition.storeGroup
      };

      this.basic.setLocal(this.common.local.topCondition, copyCond);
    });

    this.$state.go("app.supAnalyse.supplierSale");
  }

  /**
   * 获取当前分类的父级tree
   * @param code
   */
  getCategoryTree(code) {
    this.hideTree = false;

    this.basic.packager(this.dataService.getCategoryParents({categoryCode: code}), res => {
      const data = res.data;
      const category = this.accessCom.category;

      this.categoryTree = this.FigureService.haveValue(category.val)
        ? data.filter(s => s.level >= category.val[0].level)
        : data;
    });
  }

  /**
   * 面包屑绑定的事件
   * @param code
   * @param level
   * @param name
   */
  getParent(code, level, name) {

    this.hideTree = code === 'all';

    if (this.hideTree) {
      this.com.category = angular.copy(this.accessCom.category);

    } else {
      this.com.category.val = [{
        code,
        name: `${this.CommonCon.catLevels.filter(s => s.id == level)[0].name}-${name}`,
        level
      }];

      this.getCategoryTree(code);
    }

    this.basic.setSession(this.CommonCon.session_key.hsParam, this.com);

    this.instance.reloadData();
  }

  initColumn() {
    const fix = [
      '_id',
      'categoryCode',
      {
        code: 'categoryName',
        render: (data, type, row) => {
          if (!data) data = "";
          return row.level === 5 ? `<span>${data}</span>` : `<a href='javascript: void(0);' class="screen">${data}</a>`;
        }
      },
      {
        code: 'saleTotal',
        title: '销售额</br>涉及供应商数',
        render: (data) => {
          let formatData = this.FigureService.thousand(data, 0);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'saleSupNum',
        title: '前80%销售额</br>涉及供应商数',
        render: (data) => {
          let formatData = this.FigureService.thousand(data, 0);
          return `<a href='javascript: void(0);' class="massAmount">${formatData}</a>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'saleSupPrc',
        title: '销售额</br>供应商数占比',
        render: (data) => {
          return this.FigureService.scale(data, true, true);
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'profitTotal',
        title: '毛利额</br>涉及供应商数',
        render: (data) => {
          return `<span>${this.FigureService.thousand(data, 0)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'profitSupNum',
        title: '前80%毛利额</br>涉及供应商数',
        render: (data) => {
          let formatData = this.FigureService.thousand(data, 0);
          return `<a href='javascript: void(0);' class="massProfit">${formatData}</a>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'profitSupPrc',
        title: '前80%毛利额</br>供应商数占比',
        render: (data) => {
          return this.FigureService.scale(data, true, true);
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'stockTotal',
        title: '库存金额</br>涉及供应商数',
        render: (data) => {
          return `<span>${this.FigureService.thousand(data, 0)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'stockSupNum',
        title: '前80%库存金额</br>涉及供应商数',
        render: (data) => {
          let formatData = this.FigureService.thousand(data, 0);
          return `<a href='javascript: void(0);' class="massStockCost">${formatData}</a>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'stockSupPrc',
        title: '前80%库存金额</br>供应商数占比',
        render: (data) => {
          return this.FigureService.scale(data, true, true);
        },
        sort: true,
        class: 'text-right'
      }
    ];
    this.column = this.tableService.fixedColumn(fix);
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

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

}


angular.module("hs.supplier.adviser").controller("supplierVitalFeRuleCtrl", supplierVitalFeRuleCtrl);

