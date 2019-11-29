class StructuralCharTableController {
  constructor($scope, DTColumnBuilder, tableService, FigureService, toolService, CommonCon, Field, Symbols, $timeout, dataService, basicService) {

    this.scope = $scope;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.toolService = toolService;
    this.CommonCon = CommonCon;
    this.structure = angular.copy(Field.structure);
    this.Symbols = angular.copy(Symbols);
    this.$timeout = $timeout;
    this.dataService = dataService;
    this.basicService = basicService;
  }

  init() {
    this.interfaceName = 'getSupplierStructurePct';
    this.column = [];
    this.instance = {};
    this.option = {};
    this.tableInfo = {};
    this.back = {};
    const fields = [
      'hsAmountPct', 'pctDiff', 'selfAmountPct', 'hsAmount', 'supplierSubAmount', 'supplierAllAmount'
    ];
    this.current = {};
    // 监听共通条件的变动
    this.buildOption();
    this.initColumns(fields);
    this.buildChart();
    let initFlag = true;
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal || initFlag) {
        initFlag = !initFlag;
        return;
      }
      this.$timeout(() => {
        this.key.param = this.toolService.getParam(this.param, []);
        this.instance.reloadData();
        this.buildChart();
      }, 50);
    });
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.toolService.getParam(this.param, []),
      special: {
        pageId: this.CommonCon.page.page_structure
      }
    };
    this.config = {
      fixed: 3,
      scrollY: true,
      pageLength: 100,
      start: 0,
      sort: 3,
      compileBody: this.scope
    };
    this.option = this.tableService.fromSource(this.toolService.getData(this.key, this.back), this.config);
  }

  buildChart() {
    let param = this.toolService.buildParam(this.toolService.getParam(this.param, []), {pageId: this.CommonCon.page.page_structure});
    param.pagination = null;
    param.sortBy = null;
    this.loadChart = !this.loadChart;
    this.basicService.packager(this.dataService.getSupplierStructurePct(param), res => {
      this.setChartData(res.data.details)
    });
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {
    let param = angular.copy(this.param);
    // 当x>y 时 采用x 否则采用y
    let xyMin = {
      x: this.FigureService.scale((param.pctDiff - 0.1), 1, 0),
      y: !param.pctHs || (param.pctHs && param.pctDiff > param.pctHs) ?
        this.FigureService.scale((param.pctDiff - 0.1), 1, 0) : this.FigureService.scale((param.pctHs - 0.1), 1, 0)
    };
    const nameTextStyle = {fontSize: 14, fontFamily: 'Arial', color: '#071220'};
    const axisLineAndTick = {lineStyle: {color: '#ECECEC', width: 1}};
    const axisLabel = {color: '#404040', interval: 1, fontSize: 11, fontFamily: 'Arial'};
    this.structuralPct = {
      grid: {
        left: '30px',
        top: '50px',
        right: '80px',
        bottom: '20px',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: "占比差(%)",
        nameTextStyle: nameTextStyle,
        axisTick: {show: false},
        splitLine: {show: false},
        axisLabel: axisLabel,
        axisLine: axisLineAndTick,
        min: xyMin.x
      },
      yAxis: {
        type: 'value',
        name: "占比华商小类(%)",
        nameTextStyle: nameTextStyle,
        axisTick: {show: false},
        axisLine: axisLineAndTick,
        axisLabel: axisLabel,
        splitLine: {show: false},
        splitArea: {show: true, interval: 1, areaStyle: {color: ['rgba(0,122,219,0.03)', '#fff']}},
        min: xyMin.y
      },
      tooltip: {
        show: true,
        trigger: 'item',
        confine: true,
        axisPointer: {type: 'shadow'},
        textStyle: {align: 'left'},
        formatter: p => {
          let value = p.value;
          return `${value[2]}<br>占比差：${value[0] + this.Symbols.percent}<br>占比华商小类：${value[1] + this.Symbols.percent}`
        }
      },
      series: {
        type: 'scatter',
        symbolSize: 3,
        data: this.duplicatePoint(data)
      }
    };
  }

  /**
   * 处理散点图重复的点的场合
   * @param details 接口details数据
   */
  duplicatePoint(details) {
    const points = ['pctDiff', 'hsAmountPct'];
    const type = ['categoryName3', 'supplierName'];
    let ba_data = [], newData = [];
    let dataCopy = details ? angular.copy(details) : [];

    _.forIn(_.groupBy(dataCopy, function (s) {
      return s[points[0]] + '' + s[points[1]];
    }), (val, key) => {
      if (val.length > 1) {
        val.forEach(v => {
          v.title = v[type[0]] + this.Symbols.comma + v[type[1]];
          v[points[0]] = this.FigureService.scale(v[points[0]], 1, 0);
          v[points[1]] = this.FigureService.scale(v[points[1]], 1, 0);
        });
        const name = val.map(s => s.title).join("<br>");
        val.forEach(s => s.title = name);
        newData.push(...val);
      } else {
        val[0][points[0]] = this.FigureService.scale(val[0][points[0]], 1, 0);
        val[0][points[1]] = this.FigureService.scale(val[0][points[1]], 1, 0);
        val[0].title = val[0][type[0]] + this.Symbols.comma + val[0][type[1]];
        newData.push(val[0]);
      }
    });
    newData.forEach(s => {
      ba_data.push([...points.map(p => s[p]), s.title]);
    });

    return ba_data;
  }

  initColumns(fields) {
    let fix = [
      {
        code: '_id',
        title: 'No',
        sort: false
      },
      {
        code: "categoryName3",
        title: '小类名称',
        render: (data) => `<span>${data}</span>`,
        sort: false
      },
      {
        code: "supplierName",
        title: '供应商',
        render: (data) => `<span>${data}</span>`,
        sort: false
      }
    ];
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), fields, this.structure);
  }
}

angular.module('hs.supplier.adviser').component('structuralChartTable', {
  templateUrl: 'app/supplier/analysis/directives/structuralRatio/structuralChartTable.tpl.html',
  controller: StructuralCharTableController,
  controllerAs: 'ctrl',
  bindings: {
    param: "<",
    keys: "="
  }
});
