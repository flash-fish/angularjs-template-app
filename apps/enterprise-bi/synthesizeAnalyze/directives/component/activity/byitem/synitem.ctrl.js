class synByItemController {
  constructor(DTColumnBuilder, $scope, $compile, tableService, CommonCon, alert,
              toolService, Field, basicService, Pop, $state, $location, $stateParams, Common, indexCompleteService) {
    this.Pop = Pop;
    this.alert = alert;
    this.Common = Common;
    this.Field = Field;
    this.scope = $scope;
    this.$state = $state;
    this.tool = toolService;
    this.$compile = $compile;
    this.location = $location;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.indexService = indexCompleteService;


    this.instance = {};

    // 调用接口的方法名字
    // this.interfaceName = "getItemRankingForSale";

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    this.tableInfo = {};


  }

  init() {
    //当前页面基准日期 | 财务月 获取
    this.indexService.getBasicDate(this);

    // 获取路由参数的值用于子菜单渲染
    const info = this.stateParams.info;
    if (info) this.info = JSON.parse(info);

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = this.Pop.types.find(s => s.id === (this.keys.itemTabNew ? 10 : 7));

    // 所有指标的对照关系
    let mid_info = this.indexService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.keys.actCompare ?
      this.basic.buildField(mid_info)
      : this.basic.buildField(this.Field.sale);

    // 调用接口的方法名字
    this.interfaceName = this.keys.itemProduct
      ? this.keys.itemProduct[0]
      : "getItemRankingForSale";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 6);

    if (this.location.url().includes('newItem')) {
      this.popover.splice(0, 0, {
        id: 8, name: '单品概况', active: false
      })
    }

    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) =>{

      if(this.keys.actCompare){
        // 初始化column
        this.initColumn(true,p);
        // 根据是否勾选日期构建chart 数据
        let mid_field = _.clone(this.field.chart);
        this.field.chart = this.indexService.DateCheck(p,mid_field);
      }

      this.tool.removeLevel(p)
    });

    // 监听table指标变动
    this.tool.watchTable(this, () => {
      this.buildOption();
    });

    // 监听chart指标变动
    this.tool.watchChart(this, (c,p) => {
      // 监听chart指标变动
      if(this.keys.actCompare){
        if(this.noInit){
          // 根据是否勾选日期构建chart 数据
          if(!p.dateY) this.indexService.structureChart(this.field);
        }
      }
    }, {
      pageNoChart: true
    });

  }

  initColumn(isChange,n_param) {
    this.tool.changeCol(this.field, null, this.keys, f => {
      if(this.keys.actCompare && n_param){
        // 重构列 YoYValue YoYInc
        this.indexService.newColumn(this,f,n_param);
      }

    });
    this.buildColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, this.field),
      special: {
        pageId: this.keys.pageId
      },
      initSummary: this.keys.itemProduct[1],

    };

    if (this.keys.itemProduct && this.keys.itemProduct.length > 1)
      this.key.independentInterFace = this.keys.itemProduct.filter((v, k) => k === 1);

    if (this.keys.appendField) this.key.special.appendField = this.keys.appendField;

    const fixAndSort = this.keys.appendField ? 4 + this.keys.appendField.length : 4;

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      fixed: fixAndSort,
      start: this.arriveInfo.page ? this.arriveInfo.page.start : 0,
      sort: this.arriveInfo.sort ? this.arriveInfo.sort : fixAndSort,
      compileBody: this.scope,
      compileFixColumn: true,
      row: this.rowCallback()
    });

    this.arriveInfo = {};
  }


  /**
   * 点击跳转到 到货率/退回率  详情页面
   * @returns {function(*=, *)}
   */
  rowCallback() {
    return (row, rowData) => {
      // 点击事件
      let arrivalRate = this.keys.clickName ?　this.keys.clickName : [];
      $('.' + arrivalRate[0], row).unbind('click').click(() => {
        this.indexService.goSupplierRate(this.param, this.back, rowData, this.keys.routerRate[0], this.fromOne);
      });
      $('.' + arrivalRate[1], row).unbind('click').click(() => {
        this.indexService.goSupplierRate(this.param, this.back, rowData, this.keys.routerRate[1], this.fromOne);
      });
      $('.' + arrivalRate[2], row).unbind('click').click(() => {
        const _Param = this.indexService.YoYValueDateSetting(this.param, {
          basData: this.basicDate,
          cakeOne: this.cakeOne,
          basicMonth: this.basicMonth
        });
        this.indexService.goSupplierRate(_Param ? _Param : this.param, this.back, rowData, this.keys.routerRate[0], this.fromOne);
      });
      $('.' + arrivalRate[3], row).unbind('click').click(() => {
        const _Param = this.indexService.YoYValueDateSetting(this.param,{
          basData: this.basicDate,
          cakeOne: this.cakeOne,
          basicMonth: this.basicMonth
        });
        this.indexService.goSupplierRate(_Param ? _Param : this.param, this.back, rowData, this.keys.routerRate[1], this.fromOne);
      })
    };
  }


  extraClickFunc(curr, self) {
    // 先判断供应商条件 如果大于一个就弹框提示不允许跳转
    if (self.param.supplier.val.length > 1) {
      self.alert("警告", "多供应商条件下不能查看单品概况");
      return;
    }
    const row = {
      productId: self.currPopover.code,
      productName: self.currPopover.name
    };
    self.tool.goSubPageDetail(self.param, self.back, row, "app.newItemAnalyze.newInfo", "product");
  }

  /**
   * 构建表格的column
   */
  buildColumn() {
    this.fix = [
      "_id",
      "productCode",
      {
        code: "productName",
        class: "table-item-name",
        render: (data, t, f) => {
          return this.tool.buildPopover(data, f._id, {code: f[this.current.code]}, this);
        }
      },
      "spec"
    ];

    if (this.keys.appendField) this.fix.push(...this.keys.appendField);

    // 商品页面 所有非基础指标不允许排序（同步 环比 占比）
    const table = this.field.newTable.map(s => {
      let notSort = ["OfLH", "YoY", "ToT", "Pct"], isForbid = false;

      notSort.forEach(n => {
        if (s.includes(n) && !s.includes(`${n}Value`)) isForbid = true;
      });

      const notField = ["retailFlowAmount", "flowCntProportion"].includes(s);

      return isForbid && !notField
        ? Object.assign({notSort: true, code: s}, this.fieldInfo[s])
        : s
    });

    // 按商品页面 关于退货率配置
    let ownKeys = {realRate: true};

    this.column = this.tableService.anyColumn(
      this.tableService.fixedColumn(this.fix), table, this.fieldInfo,Object.assign( angular.copy(this.keys),ownKeys)
    );
  }
}

angular.module('hs.synthesizeAnalyze').component('synByItem', {
  templateUrl:  'app/synthesizeAnalyze/directives/component/activity/byitem/synitem.tpl.html',
  controller: synByItemController,
  controllerAs: 'ctrl',
  bindings: {
    fromOne: '<',
    param: '<',
    field: '<',
    keys: '=',
    arriveInfo: '='
  }
});






