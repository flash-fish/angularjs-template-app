class SaleBrandController {
  constructor($scope, $compile, tableService, CommonCon, basicService,
              toolService, action, Field, Pop, indexCompleteService) {
    this.scope = $scope;
    this.Field = Field;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.tableService = tableService;
    this.indexCompleteService = indexCompleteService;

    this.instance = {};

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 6)[0];

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);
  }

  init() {

    // 调用接口的方法名字
    this.interfaceName = this.keys.saleBrand
      ? this.keys.saleBrand[0]
      : "getBrandRankingForSale";

    // 所有指标的对照关系
    let mid_info = this.indexCompleteService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.keys.actCompare ?
      this.basic.buildField(mid_info)
      : this.basic.buildField(this.Field.sale);

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 4);

    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, p => {

      if(this.keys.actCompare){
        // 初始化column
        this.initColumn(true,p);
        // 根据是否勾选日期构建chart 数据
        let mid_field = _.clone(this.field.chart);
        this.field.chart = this.indexCompleteService.DateCheck(p,mid_field);

      }

    });




    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart指标变动
    this.tool.watchChart(this, (c,p) => {
      if(this.keys.actCompare){
        if(this.noInit){
          // 根据是否勾选日期构建chart 数据
          if(!p.dateY) this.indexCompleteService.structureChart(this.field);
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
        this.indexCompleteService.newColumn(this,f,n_param);
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
      }
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      sort: 3,
      fixed: 3,
      compileBody: this.scope,
      compileFixColumn: true
    });
  }

  /**
   * 构建表格的column
   */
  buildColumn() {
    this.fix = [
      "_id",
      "brandId",
      {
        code: "brandName",
        render: (data, t, f) => {
          return this.tool.buildPopover(data, f._id, {
            code: f[this.current.code]
          }, this);
        }
      },

    ];

    // 活动分析ToT转换
    if(this.keys.actCompare){
      this.indexCompleteService.ToTTrans(this);
    }

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, this.keys);
  }
}

angular.module('hs.supplier.saleStock').component('saleBrand', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/brand/brand.tpl.html',
  controller: SaleBrandController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
