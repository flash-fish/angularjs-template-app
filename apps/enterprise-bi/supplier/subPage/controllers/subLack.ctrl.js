class SubLackController {
  constructor($sce, CommonCon, toolService, dataService, SaleStockSubMenu, tableService,
              $stateParams, popupDataService, DTColumnBuilder, $state, basicService,
              $scope, Table, Field, FigureService, Common, CommSearchSort) {
    this.$sce = $sce;
    this.Field = Field;
    this.scope = $scope;
    this.$state = $state;
    this.common = Common;
    this.tool = toolService;
    this.state = $stateParams;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.sort = angular.copy(CommSearchSort);

    this.instance = {};

    this.menu = angular.copy(SaleStockSubMenu);

    // 日期控件配置
    this.dateOption = {};

    this.tableInfo = {};

    // 保存共通条件的地方
    // this.com = this.basic.initCondition({date: ""}, ["classes", "brand", "category", "product", "supplier"]);
    this.com = Object.assign({
      date: "",
    }, this.CommonCon.commonPro);

    // 异步中需要处理的数据
    this.back = {
      finish: false,
    };

    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;
      if (newVal.finish !== oldVal.finish)
        this.back.finish = true;
    }, true);

    // 调用接口的方法名字
    this.interfaceName = "getSubLack";

    this.initTemp = [
      {name: '加注缺品SKU数', option: '-'},
      {name: '平均加注缺品天数', option: '-'},
      {name: 'A类品加注缺品占比', option: '-'},
    ];
    this.temp = [
      {name: '加注缺品SKU数', option: 'stockOutSku'},
      {name: '平均加注缺品天数', option: 'avgStockOutDays'},
      {name: 'A类品加注缺品占比', option: 'stockOutSkuAPct'},
    ];

    // 日期控件
    this.dateOption = {};
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

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

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化com 和 subSession的值 返回fromSession
    const subPage = this.tool.subPageCondition(this.com);
    this.fromSession = subPage.fromSession;
    if (subPage.com) {
      this.subSession = subPage.com;
      this.com = subPage.com;
    }

    // 从详情页面跳转做
    const subDetailCondition = this.basic.getSession(this.common.subDetailCondition, true);
    if (subDetailCondition) {

      // 设置表格信息
      if (this.tableInfo) {
        this.tableInfo.sort = subDetailCondition.session.sortInfo;
        this.tableInfo.page = subDetailCondition.session.pageInfo;
      }

      _.forIn(subDetailCondition.session, (value, key) => {

        if (_.isUndefined(this.com[key])) return;
        this.com[key] = value;
      });
    }

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['brand', 'product']);

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    });
  }

  /**
   * 查询按钮
   */
  search() {
    this.back.finish = false;

    // 初始化合计表格
    this.initTemp.forEach(s => {
      s.option = '-';
      s.curr = '-';
    });

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    // 将当前条件设置到subCondition中
    this.tool.commonSetSub(this.com, this.subSession);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  initColumn() {
    this.buildColumn();
  }

  /**
   * 构建表格的column
   */
  buildColumn() {
    const fix = [
      '_id',
      'productCode',
      {
        code: "productName",
        title: "商品",
        render: (data) => {
          return this.tool.buildLink(data);
        },
      },
      'spec',
      {
        code: 'statusName',
        title: '商品状态',
        render: (data) => {
          return this.tool.formatTableData(data);
        },
      },
      {
        code: 'productLevel',
        title: '最新商品等级',
        render: (data) => {
          const temp = this.tool.formatTableData(data);
          if (temp === '-') {
            return temp;
          } else {
            return temp + '类品';
          }
        },
      },
      {
        code: 'stockOutDays',
        title: '加注缺品天数',
        render: (data, type, row) => {
          return row._id === '整体合计'
            ? this.FigureService.scaleOther(row.avgStockOutDays, false)
            : this.FigureService.scaleOther(data, false);
        },
        sort: true,
        class: 'text-right',
      }
    ];

    this.column = this.tableService.fixedColumn(fix);
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    let f = ["avgStockOutDays", "stockOutSkuAPct"];
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, f),
      setSum: (s) => this.buildSum(s),
      special: {
        pageId: this.CommonCon.page.page_subSupplier_lack
      }
    };

    const tableOpt = {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : 6,
      row: this.rowCallback()
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), tableOpt);
  }

  /**
   * 处理合计部分数据
   * @param d
   */
  buildSum(d) {
    const m = angular.copy(this.temp);

    m.forEach((s, i) => {
      // title原始数据
      this.initTemp[i].curr = '';
      // 显示数据
      this.initTemp[i].option = s.option === 'stockOutSkuAPct' ? this.FigureService.scale(d[s.option], false, true)
        : s.option === 'stockOutSku' ? this.FigureService.thousand(d[s.option], 0) : this.FigureService.number(d[s.option], false, true);
    });
  }

  rowCallback() {
    return (row, rowData) => {
      let jump = (state) => {
        let condition = angular.copy(this.copyCom);

        const order = this.back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: this.back.param.start};

        // 设置当前点击的字段
        condition.click = {
          name: 'product',
          value: {
            val: [{
              code: rowData.productId,
              name: rowData.productName,
              productCode: rowData.productCode
            }], id: 7
          }
        };

        // 设置父页面的条件
        condition.fromTopParent = this.fromSession;

        this.basic.setSession(this.common.subDetailCondition, condition);

        const info = angular.copy(this.info);
        info.subMenuActive = this.menu.list.filter(s => s.active)[0].r;

        this.$state.go(state, {info: JSON.stringify(info)});
      };

      angular.element('.a-link', row).unbind('click').click(() => {
        jump("app.supAnalyse.subLackDetail");
      });
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
      console.log(this.com.category.val);
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

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

}

angular.module("hs.supplier.saleStock").controller("subLackCtrl", SubLackController);
