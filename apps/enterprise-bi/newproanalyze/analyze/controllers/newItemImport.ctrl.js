class newItemImportController {
  constructor($scope, $compile, FigureService, CommonCon, tableService, DTColumnBuilder, toolService, SaleStockSubMenu, popups, dataService,
              $rootScope, $sce, basicService, $state, popupDataService, $stateParams, Common, Field, chartService) {
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
    this.chartService = chartService;
    this.instance = {};

    // 保存共通指标的地方
    this.field = {};

    // 日期控件配置
    this.dateOption = {noCrossYear: true};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["product"], true);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    this.keys = {
      finish: true
    };

    // 调用接口的方法名字
    this.interfaceName = "getNewProductImportByTime";

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.com.reloadData_delete = false;

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      brand: 4,
      supplier: 5,
      flag: 6
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

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, ["flag"], {
      job: this.job,
      reset: ['classes']
    });

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);
    this.com.flag = true;

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'supplier']);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化column
    this.buildColumn();

    const date = angular.copy(this.com.date);
    this.com.date = '';

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, (d) => {

      this.tool.dateConditionSave(this, date, null, Object.assign({}, this.dateOption));
      this.copyCom = angular.copy(this.com);

      this.buildOption();

      this.scope.$watch("ctrl.copyCom", newVal => {
        if (!newVal) return;
        this.showCondition();
        if (this.com.reloadData_delete) {
          this.com.reloadData_delete = false;
          this.basic.setSession(this.CommonCon.session_key.changeColumn, true);
          this.fetchData();
        }else {
          // 保存最新的条件
          this.basic.setSession(this.CommonCon.session_key.hsParam, this.copyCom);
          if(this.instance.dataTable) this.instance.reloadData();
        }
      });
      this.showCondition();
    });
  }

  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      setChart: (d) => this.setChartData(d),
      addEvent: [
        {name: "click", event: (p) => this.addEvent(p), func: null},
        {name: "datazoom", event: (p) => this.chartService.addZoomEvent(this, (date)=>{
            this.com.date = date.includes('-') ? date : `${date}-${date}`;
            this.copyCom = angular.copy(this.com);
            this.showCondition();
          }), func: null}
      ],
      trend: true,
      special: {
        pageId: this.CommonCon.page.page_new_in
      }
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {pageLength: 100});

    // 初始化面包屑
    this.crumb = [this.copyCom.date];
  }


  addEvent(myParam) {
    const key = {
      com: this.copyCom,
      scope: this.scope,
      myParam
    };

    return this.tool.addDateEvent(key, this.crumb, () => {
      return this.crumb;
    }, (date) => {
      this.copyCom.date = date;

      this.showCondition();

      // 保存最新的条件
      this.basic.setSession(this.CommonCon.session_key.hsParam, this.copyCom);

      this.instance.reloadData();
    });
  }

  fetchData() {
    this.change = !this.change;
    this.buildColumn(this.change);
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {
    const dates = this.copyCom.date.split('-');
    const key = {
      firstRect: true,
      xData: {
        code: "dateCode",
        format: this.copyCom.date.length > 16 ? "MM/DD" : "YYYY/MM"
      },
      data: data,
      info: this.fieldInfo,
      silent: this.tool.isSilentChart(this.copyCom.date),
      rectZoom: {
        show: dates[0] !== dates[1] && dates[0].length !== 7,
        title: {
          back: ''
        },
        //icon 内要设置图标的话，其他字段的图标就算用原本的值也要重新设定
        icon: {
          zoom: 'path://M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1',
          back: 'path://0,0,0,0',
        },
        // right: 120,
        top: -7
      },
      noWeather: true,
      xAxisNoWrap: true
    };

    const bar = [{
      id: 'skuNum',
      name: '引入新品SKU数',
    }];

    if (this.copyCom.flag) bar.push({
      id: 'preSkuNum',
      name: '引入新品SKU数-上年同期'
    });

    this.sale = this.tool.buildChart({bar}, key);

    setTimeout(() => {
      this.chartService.appendRectAndRegisterEvent(this.sale);
    }, 1000);
  }


  /**
   * 查询按钮
   */
  search() {

    delete this.conditionTipsMessage;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, ["flag"], null, ['newProductYear']);

    this.isSearch = true;

    this.copyCom = angular.copy(this.com);

    this.crumb = [this.copyCom.date];
    // this.fetchData();
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.flag ?  com.flag = '是' : delete com.flag;
    this.sortCom = this.tool.dealSortData(com, this.sort, {flag: {name: '查看去年同比'}});
  }

  buildColumn(changed) {

    const fix = [
      this.tool.buildTableDate()
    ];

    const newTable = this.com.flag ? ['skuNum', 'preSkuNum', 'preSkuNumYoY'] : ['skuNum'];
    const column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), newTable);

    if (!_.isUndefined(changed)) {
      // 保存最新的条件
      this.basic.setSession(this.CommonCon.session_key.hsParam, this.copyCom);

      if (changed) column.push(this.DTColumnBuilder.newColumn("dateCode").notVisible());
    }

    this.column = column;

    if (this.isSearch) {
      this.crumb = [this.copyCom.date];
      this.isSearch = false;
    }
  }

  reloadData() {
    this.com.reloadData_delete = true;
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


angular.module("hs.productAnalyze.news").controller("newItemImportCtrl", newItemImportController);

