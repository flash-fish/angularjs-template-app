class SupplierStructuralRatioController {
  constructor(OccupationRatio, CommonCon, dataService, Symbols, $rootScope, toolService) {
    this.CommonCon = CommonCon;
    this.OccupationRatio = OccupationRatio;
    this.dataService = dataService;
    this.Symbols = angular.copy(Symbols);
    this.rootScope = $rootScope;
    this.tool = toolService;
    this.sort = {date: 1, pctDiff: 2,  pctHs: 3};
  }

  init() {
    //tips，提示
    this.tip = {
      occupationRatio: {tplName: 'occupationRatio.html'},
      occupationRatioDiff: {tplName: 'occupationRatioDiff.html'},
      occupationRatioHsSmallClass: {tplName: 'occupationRatioHsSmallClass.html'},
      occupationRatioSupplierOwn: {tplName: 'occupationRatioSupplierOwn.html'},
    };
    //初始化检索条件
    const initPct = this.OccupationRatio[this.OccupationRatio.length - 1].value;
    this.searchFilter = {
      pctDiff: initPct,
      pctHs: {
        value: initPct,
        checked: false
      },
      date: ''
    };
    this.originFilter = angular.copy(this.searchFilter);
    this.back = {finish: true};
    this.key = {
      active: 1
    };
    this.keys = {
      pageId: this.CommonCon.page.page_structure
    };
    this.getFinanceDate();
    this.rootScope.$watch('fullLoadingShow', newVal =>
      this.select()
    )
  }

  getFinanceDate() {
    let OccupationDate = [];
    this.dataService.getMonthByDate().then(res => {
      let businessMonth = res.data.businessMonth.toString();
      if (businessMonth && businessMonth.length >= 6) {
        let month = moment(moment(businessMonth, 'YYYYMM')).format('MM');
        let originItem = {id: 1, value: '', label: ''};
        //财务月份 > 3
        if (parseInt(month) > 3)
          OccupationDate.push(this.getDate(angular.copy(originItem), businessMonth, (parseInt(month) - 1)));
        //近三个财务月
        let item = angular.copy(originItem);
        if (OccupationDate.length)
          item.id++;
        OccupationDate.push(this.getDate(item, businessMonth, 3));
        if (OccupationDate.length)
          this.searchFilter.date = OccupationDate[0].value;
        this.OccupationDate = OccupationDate;
        this.copySearchFilter();
        this.showCondition();
      }
    });
  }

  getDate(item, baseDate, subParam) {
    let startDateValue = moment(moment(baseDate, 'YYYYMM').subtract(subParam, 'months')).format('YYYYMM');
    let endDateValue = moment(moment(baseDate, 'YYYYMM').subtract(1, 'months')).format('YYYYMM');
    item.value = startDateValue + this.Symbols.bar + endDateValue;
    let startDateLabel = (moment(startDateValue, 'YYYYMM').format('YYYY/MM'));
    let endDateLabel = (moment(endDateValue, 'YYYYMM').format('YYYY/MM'));
    item.label = startDateLabel + this.Symbols.bar + endDateLabel;
    return item;
  }

  search() {
    this.copySearchFilter();
    this.showCondition();
  }

  copySearchFilter() {
    this.originFilter = angular.copy(this.searchFilter);
    let commonParam = angular.copy(this.searchFilter);
    commonParam.pctHs = commonParam.pctHs.checked ? commonParam.pctHs.value : null;
    this.commonParam = angular.copy(commonParam);
  }

  select() {
    this.searchFilter = angular.copy(this.originFilter);
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    com.date = this.OccupationDate.find(o => o.value === com.date).label;
    com.pctDiff = this.OccupationRatio.find(o =>o.value === com.pctDiff).name;
    if(!com.pctHs)
      delete com.pctHs;
    else
      com.pctHs = this.OccupationRatio.find(o =>o.value === com.pctHs).name;
    this.sortCom = this.tool.dealSortData(com, this.sort, {pctDiff: {name: '占比差高于'}, pctHs: {name: '占比华商小类高于'}});
  }
}

angular.module('hs.supplier.adviser').controller('supplierStructuralRatioCtrl', SupplierStructuralRatioController);
