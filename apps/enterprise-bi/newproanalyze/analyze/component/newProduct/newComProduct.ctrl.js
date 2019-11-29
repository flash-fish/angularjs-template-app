class newComProductController {
  constructor($scope, FigureService, CommonCon, tableService,
              toolService, popups, dataService, $sce, newState, alert,
              basicService, $state, popupDataService, Common, Field) {
    this.$sce = $sce;
    this.alert = alert;
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.tool = toolService;
    this.newState = newState;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;

    this.instance = {};

    // 日期控件配置
    this.dateOption = {};

    this.keys = {finish: true};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
      newProductYear: '',
      newProduct: {val: [], id: '10'}
    }, ["classes", "brand", "category", "supplier"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    this.interfaceName = 'getNewProductSurvivalList';

    this.model_pie = this.CommonCon.dateStyle[0].id;

    this.initTemp = angular.copy(this.CommonCon.sumState);


    // 新品状态
    this.statusList = newState.statusList;
    this.com.status = this.statusList[0].id;

    // 建档时间下拉框
    this.moreDate = newState.moreProData;

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.tool.watchBack(this);

    // 条件回复参数构建
    this.com.filterCondition_delete = {
      field: this.moreDate[0].id,
      gtDays: '',
      ltDays: '',
      moreOption: false
    };


    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      statusName: 4,
      filterCondition: 5,
      brand: 6,
      newProduct: 7,
      supplier: 8,
    }
  }

  init() {
    // 初始化column
    this.initColumn();

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
    this.tool.getTopCondition(this.com, null, ["date", "status", "filterCondition_delete"], {
      job: this.job,
      reset: ['classes']
    });

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.getDate();


    // 新品状态监听
    this.watchFilter();
  }


  getDate() {
    this.basic.packager(this.dataService.getBaseDate(), res => {
      const this_Year = parseInt(String(res.data.baseDate).slice(0, 4));
      this.baseYear = this_Year;

      this.new_product_Year = [
        {id: String(this_Year), name: this_Year + '年新品', active: true},
        {id: String(this_Year - 1), name: this_Year - 1 + '年新品', active: false}
      ];

      if (this.com.newProductYear) {
        this.com.date = angular.copy(String(this.com.newProductYear));
      } else
        this.com.date = this.new_product_Year[0].id;

      // 如果session里面有值的话 优先读取session
      this.com = this.tool.getComFromSession(this.com, this.tableInfo);
      // 获取页面跳转session
      this.fromNew = this.basic.getSession(this.newState.session.newMetSession, true);

      // 按品类组 | 按类别 （页面跳转赋值）
      if (this.fromNew) {
        this.com.date = this.fromNew.year;
        // 非新品状态获取
        if (this.fromNew.typ === 1) { // 按品类组 tab 跳转
          this.com.classes = {
            id: 4,
            val: [{code: this.fromNew.code, level: 4, name: '品类组-' + this.fromNew.Name}]
          };
          this.com.category = {id: 2, val: []};
        } else {
          this.com.category = { // 按类别 tab 跳转
            id: 2,
            val: [{code: this.fromNew.code, level: 3, name: '中分类-' + this.fromNew.Name}]
          };
          this.com.classes = {id: 4, val: []};
        }

        let [_Link, _Sate] = [this.fromNew.link, this.fromNew.state];
        if (_Link) {
          // 正则过滤传值汉字符号
          _Link = _Link.replace(/[\u4e00-\u9fa5]/g, "").split('-');
          if (_Link.length > 1) {
            this.com.filterCondition_delete = {
              gtDays: +_Link[0] + 1, ltDays: _Link[1]
            }
          } else {
            // 判断跳转的类型
            let _Ele_T, _Ele_O;
            if (+_Link[0] === 10) {
              if (this.fromNew.Select > 0 && this.fromNew.Select < 3) {
                _Ele_O = +_Link[0] + 1;
                _Ele_T = ''
              } else {
                _Ele_O = 1;
                _Ele_T = _Link[0];
              }
            } else if (+_Link[0] === 5) {
              _Ele_O = 1;
              _Ele_T = _Link[0]
            } else {
              _Ele_O = +_Link[0] + 1;
              _Ele_T = '';
            }
            this.com.filterCondition_delete = {gtDays: _Ele_O, ltDays: _Ele_T};
          }
        }

        // 状态
        if (!_.isUndefined(this.fromNew.Select)) {
          // 天数
          if (!_Link) this.com.filterCondition_delete = {gtDays: 1, ltDays: ''};

          this.com.filterCondition_delete.field = this.moreDate[this.fromNew.Select].id;
          this.com.filterCondition_delete.moreOption = true;
        }

        if (_Sate) this.com.status = "" + _Sate;
      }

      this.com.newProductAbnormalDays = this.com.filterCondition_delete.moreOption
        ? angular.copy(this.com.filterCondition_delete)
        : null;

      if (this.basic.getSession('fromInforToSaleState', true)) {
        this.com.filterCondition_delete = {
          field: this.moreDate[0].id,
          moreOption: false
        };
        this.com.status = this.statusList[0].id;
        this.com.date = this.new_product_Year[0].id;
      }

      // 判断隐藏条件等有没有值
      this.show = this.tool.contrastCom(this.com, ['brand', 'newProduct', 'supplier', 'status', 'filterCondition_delete.moreOption']);

      // 页面初始化的基础逻辑(copy条件变量)
      this.tool.pageInit(this, () => {
        this.copyCom = angular.copy(this.com);
        delete this.copyCom.newProductYear;
        this.buildOption();
        this.build();
        this.showCondition();
      }, true);

    });
  }

  // 初始化构建datatables
  initColumn() {
    this.buildColumn();
  }

  // 构建datatable表格
  buildColumn() {
    const fix = [
      {
        code: '_id',
        title: 'No.'
      },
      "productCode",
      {
        code: "productName",
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },
      "spec",
      'productStatus'
    ];

    this.newTable = [
      'importDate', 'firstOrderGoods', 'firstDistribution',
      'firstSale', 'firstSupplement', 'distributionProductStoreCnt',
      'saleProductStoreCnt', 'supplementProductStoreCnt'
    ];
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), this.newTable, null, {
      invalidFieldColor: true
    });

  }

  renderFun(data) {
    let formatData = this.FigureService.dataTransform(data);

    return `<span style="margin-left: 10px">${formatData}</span>`;
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
        pageId: this.CommonCon.page.page_new_state
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : [5, 'asc'],
        fixed: 4,
        row: this.rowCallback()
      })
  }

  /**
   * 构建合计数据
   */
  build(c) {
    let p = this.tool.buildParam(this.tool.getParam(c ? c : this.copyCom, ''));

    p.sortBy = {field: "dateCode"};
    p.pageId = this.CommonCon.page.page_new_state;

    this.basic.packager(this.dataService.getNewProductSurvivalSummary(p, true), res => {
      this.buildSum(res.data);
    });
  }

  // 合计数据构建
  buildSum(d) {
    this.initTemp = angular.copy(this.CommonCon.sumState);
    _.forIn(d, (v, k) => {
      this.initTemp.forEach((a, b, ar) => {
        if (k === a.pam) {
          if (a.scale) {
            ar[b].option = this.FigureService.scale(v, false, true);
          } else ar[b].option = this.FigureService.thousand(v, 0);
        }
      })
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

        this.tool.goSubPageDetail(this.copyCom, this.back, rowData, "app.newItemAnalyze.newInfo", "newProduct");
      });
    };
  }

  /**
   * 查询按钮
   */
  search() {
    this.com.newProductAbnormalDays = this.com.filterCondition_delete.moreOption
      ? angular.copy(this.com.filterCondition_delete)
      : null;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(
      Object.assign(this.com, {newProductYear: Number(this.com.date)}),
      ["date", "status", "filterCondition_delete"], null, ['newProductYear']);

    this.copyCom = this.tool.commonQuery(this.com, (c) => {
      this.build(c);
      this.instance.reloadData();
    });

    delete this.copyCom.newProductYear;

    this.showCondition();
  }

  /**
   * 条件展示
   */
  showCondition() {
    let com = angular.copy(this.copyCom);
    const otherFieldName = {
      filterCondition: {name: this.moreDate.find(v => v.id === com.filterCondition_delete.field).name},
      statusName: {name: '状态'},
      newProduct: {name: '新品', type: 0}
    };
    com.status ? com.statusName = this.statusList.find(v => v.id === com.status).name : delete com.statusName;

    if (com.filterCondition_delete.moreOption) {
      let [_one, _two] = [
        com.filterCondition_delete.gtDays, com.filterCondition_delete.ltDays
      ];
      let [text_one, text_two] = [
        _one.toString().length > 0 ? `${_one}天以上` : '',
        _two.toString().length > 0 ? `${_two}天以下` : ''
      ];
      com.filterCondition = text_one
        + `${text_one && text_two ? ' - ' : ''}`
        + text_two
        + `(${this.currText}至今天数)`;
    } else delete com.filterCondition;

    this.sortCom = this.tool.dealSortData(com, this.sort, otherFieldName);
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
    const promise = this.popupData.openNewProduct({
      selected: this.com.newProduct.val,
      years: this.com.date,
      baseYear: this.baseYear
    });
    this.tool.dealModal(promise, res => {
      this.com.newProduct.val = res ? res : [];

      // 监听商品条件选择
      this.tool.watchProduct(this, "newProduct");
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
      selected: this.com.supplier.val
    });

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

  // 状态监听
  watchFilter() {
    this.scope.$watch('ctrl.com.filterCondition_delete.field', (v, o) => {
      if (!v) return;
      const _Md = _.clone(this.moreDate);
      let _Text = _Md.filter(s => s.id === v);
      this.currText = _Text[0].name.slice(0, 2);
    });
  }

}

angular.module('hs.productAnalyze.news').component('newComProduct', {
  templateUrl: 'app/newproanalyze/analyze/component/newProduct/newComProduct.tpl.html',
  controller: newComProductController,
  controllerAs: 'ctrl',
  bindings: {
    keys: '<',
    tableInfo: '<',
  }
});
