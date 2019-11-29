class HomeTableController {
  constructor($scope, dataService, toolService, CommonCon, FigureService, basicService) {
    this.scope = $scope;
    this.dataService = dataService;
    this.CommonCon = CommonCon;
    this.FigureService = FigureService;
    this.tool = toolService;
    this.basic = basicService;

    this.option = {
      allAmount: "销售额",
      allProfit: "毛利额",
    }


  }

  init() {

    this.tableField = {
      curr: {code: 'allAmount', name: '销售额'},
      yoy: {code: 'allAmountYoY', name: "同比增幅"}
    };

    this.title = this.key.title;
    this.subTitle = this.key.subTitle;
    this.reloadData('allAmountYoY');
  }

  reloadData(type) {

    if (type === this.des) return;
    this.des = type;
    let field = ['allAmount', 'allAmountYoY'];
    if (this.key.title === '品类组') {
      this.condition.classLevel = this.key.classLevel;
      if (this.condition.categoryLevel) delete this.condition.categoryLevel;
    }else if (this.key.title === '类别') {
      this.condition.categoryLevel = this.key.categoryLevel;
      if (this.condition.classLevel) delete this.condition.classLevel;
    }else {
      if (this.condition.classLevel) delete this.condition.classLevel;
      if (this.condition.categoryLevel) delete this.condition.categoryLevel;
    }
    let p = this.tool.buildParam(this.tool.getParam(this.condition, field));
    p.pageId = this.CommonCon.page.page_home;

    p.pagination= {size: 5, page: 1};
    p.sortBy = {field: type, direction: -1};
    this.basic.packager(this.dataService[this.key.interfaceName](p), res => {
      let data = res.data.details;
      this.rowData = data;
      this.tableDataArray = [];
      for (let i = 0; i < 5; i++) {
        let one = data[i];
        let dic = {};
        if (one) {
          if(i === 4) {
            dic = {
              num : i + 1,
              allAmount: this.FigureService.number(one.allAmount, true, true)  + '万',
              allAmountY: this.FigureService.number(one.allAmount, false, true),
              allAmountYoYC: this.FigureService.scale(one.allAmountYoY, true, true),
              allAmountYoY: one.allAmountYoY,
              type : one[this.key.type],
              line: false,
            };
          }else {
            dic = {
              num : i + 1,
              allAmount: this.FigureService.number(one.allAmount, true, true)  + '万',
              allAmountY: this.FigureService.number(one.allAmount, false, true),
              allAmountYoYC: this.FigureService.scale(one.allAmountYoY, true, true),
              allAmountYoY: one.allAmountYoY,
              type : one[this.key.type],
              line: true,
            };
          }

        }else {
          if (i === 4) {
            dic = {
              num : i + 1,
              allAmount: '',
              allAmountY: '',
              allAmountYoYC: '',
              allAmountYoY: '',
              type : '',
              line: false,

            };
          }else {
            dic = {
              num : i + 1,
              allAmount: '',
              allAmountY: '',
              allAmountYoYC: '',
              allAmountYoY: '',
              type : '',
              line: true,

            };
          }
        }
        this.tableDataArray.push(dic);
      }
    });
  }

  rowCallback(num) {
    let data = [];
    let selectData = this.rowData[num - 1];
    if (this.key.title === '门店') {
      data = [{code: selectData.storeCode, name: selectData.storeName}];
      this.key.param.store.val = data;
    }else if (this.key.title === '类别') {
      data = [{code: selectData.categoryCode, name: this.key.categoryName + '-' + selectData.categoryName, level: selectData.level}];
      this.key.param.category.val = data;
    }else if (this.key.title === '品类组') {
      data = [{code: selectData.classCode, name: '品类组-' + selectData.className, level: selectData.level}];
      this.key.param.classes.val = data;
    }else if (this.key.title === '品牌') {
      data = [{code: selectData.brandId, name: selectData.brandName}];
      this.key.param.brand.val = data;
    }

    this.key.param.date = this.key.date;
    this.tool.goHomeSubPageDetail(this.key.param, "app.saleStockTop.saleStock");
  }
}

/**
 *   condition: 共通条件，
 *
 *   key: {

 *    title: 表格标题，
 *    interface: 接口方法名，
 *    subTitle: 子标题，
 *   }
 */
angular.module('app.home').component('homeTable', {
  templateUrl: "app/home/directives/homeTable.tpl.html",
  controller: HomeTableController,
  controllerAs: 'ctrl',
  bindings: {
    condition: '<',
    key: '<'
  }
});
