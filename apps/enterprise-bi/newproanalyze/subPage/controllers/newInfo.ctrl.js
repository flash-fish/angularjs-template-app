class newInfoController {
  constructor($scope, tableService, CommonCon, toolService, FigureService, chartService,
              newProductMenu, $stateParams, dataService, $rootScope, basicService, Pop,
              BasicColor, $sce) {
    this.scope = $scope;
    this.root = $rootScope;
    this.tool = toolService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.figure = FigureService;
    this.newProductMenu = newProductMenu;
    this.basic = basicService;
    this.chartServ = chartService;
    this.BasicColor = BasicColor;

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.currentType = Pop.types.find(s => s.id === 1);

    this.axis = CommonCon.chart.axis;

    /*表格接口*/
    this.interfaceName = "getNewProductStoreFirstDate";

    /*保存共同条件的地方*/
    this.com = Object.assign({}, this.CommonCon.commonPro);

    this.menu = angular.copy(this.newProductMenu);

    this.back = {finish: false};
    this.chartBack = {};

    // chart圈选后变量数据
    this.changeData = [];

    // chart table初始化数据
    this.initData = [];

    // 表格实例化
    this.instance = {};

    this.popover = $sce.trustAsHtml(`<span>首到效率：首次订货时间-首次到货时间 间隔的天数</span><br>
                <span>首销效率：首次到货时间-首次销售时间 间隔的天数</span>`);
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.stateParams);

    // 初始化select不显示
    this.se_Show = false;

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));
  }

  /**
   * @初始化用户信息
   * @param data
   */
  initialize(data) {

    // 初始化com 和 subSession的值 返回fromSession
    const subPage = this.tool.subPageCondition(this.com);
    this.fromSession = subPage.fromSession;
    this.com = subPage.com;

    this.click = this.fromSession.click.value.val[0];

    this.newTrail = {
      pageId: this.CommonCon.page.page_new_productInfo,
      condition: {
        supplier: this.com.supplier.val.map(s => s.code),
        product: [parseInt(this.click.code)]
      },
      sortBy: {
        field: "firstDistribution",
        direction: -1
      }
    };

    this.buildColumn();
    this.buildOption();
  }

  /**
   * 完成门店选择
   */
  changeSelect() {
    this.se_Show = false;

    if (!this.chartBack.filter) return;

    this.changeData = this.initData.filter(s => {
      return this.chartBack.filter.map(f => f.value[3]).includes(s.storeCode);
    });

    this.instance.reloadData();
  }

  /**
   * chart容器大小发生变化时触发 需要重新计算graphic的位置
   * @param chart
   */
  resizeContainer(chart) {
    this.chartServ.resizeChart(chart, this.chartBack);
  }

  /**
   * chart配置
   */
  setOptions(data) {

    const seriesData = this.scatter_buildSeries(data);

    let basic_Option = {
      grid: {
        left: '2%', right: '115px', bottom: '2%', containLabel: true
      },
      color: ['#2A80D8', '#78BF57'],
      tooltip: {
        textStyle: {align: 'left'},
        formatter: (params) => {

          let firstEff = `首到效率（天）： ${params.value[1]}`;

          let firstSale = `首销效率（天）： ${params.value[0]}`;

          let store = "";
          params.value[2].split(",").forEach(s => store += `${params.marker + s}<br />`);

          return store + firstEff + '<br />' + firstSale;
        },
        axisPointer: this.axis.other.axisPointer
      },

      toolbox: {
        right: '25px',
        feature: {
          dataZoom: {}
        },
      },

      xAxis: Object.assign({
        type: 'log',
        name: '首销效率（天）',
        axisLabel: Object.assign({
          formatter: '{value} 天'
        }, this.axis.other.axisLabel),
        axisPointer: {
          label: {
            formatter: (p) => {
              return this.figure.number(p.value, false, true, 0)
            }
          }
        }
      }, this.axis.basic),

      yAxis: Object.assign({
        type: 'log',
        name: '首到效率（天）',
        axisLabel: Object.assign({
          formatter: '{value} 天'
        }, this.axis.other.axisLabel),
        axisPointer: {
          label: {
            formatter: (p) => {
              return this.figure.number(p.value, false, true, 0)
            }
          }
        }
      }, this.axis.basic),

      series: [
        {
          name: '首到-首销（效率）',
          type: 'scatter',
          z: 15,
          data: seriesData
        },
      ]
    };
    if (!seriesData.length)
      delete basic_Option.toolbox;
    return basic_Option;
  }


  /**
   *
   * @param data
   * @returns {Array}
   * chart series 数据获取
   */
  scatter_buildSeries(data) {
    const filterData = data.filter(d => !_.isUndefined(d.firstSaleEff) && !_.isUndefined(d.firstDistributionEff));
    const points = this.chartServ.duplicatePoint(filterData, ["firstSaleEff", "firstDistributionEff"], this.currentType);

    return points.map((s, i) => {
      return {name: i, value: s, itemStyle: {normal: this.BasicColor.normal}};
    })
  }

  buildOption() {
    this.option = this.tableService.fromSource(this.getData(), {
      pageLength: 100,
      sort: 5
    });
  }

  /**
   * 表格获取数据函数封装
   *
   */
  getData() {
    this.inited = true;

    return (param, callback) => {

      function compare(property, sort) {
        return function (a, b) {
          let value1 = a[property];
          let value2 = b[property];

          if (_.isUndefined(value1)) {
            return 1;
          } else if (_.isUndefined(value2)) {
            return -1
          } else {
            return sort === "asc" ? value1 - value2 : value2 - value1;
          }
        }
      }

      if (!this.inited && this.changeData) {

        let change = this.changeData.sort(compare(param.columns[param.order[0].column].data, param.order[0].dir));

        change = change.slice(param.start, param.start + 100);

        this.tableService.dealResp(change, {addId: param.start});
        this.tableService.pageNo(param, callback, this.changeData.length, change);
        return;
      }

      this.basic.packager(this.dataService.getNewProductStoreFirstDate(this.newTrail), res => {
        const data = res.data;

        if (this.inited) this.changeData = this.initData = data.details;

        // set chart
        this.chart_Scatter = this.setOptions(data.details);

        setTimeout(() => {
          this.chart_Scatter = this.chartServ.appendGraphic(this.chart_Scatter, this.chartBack, {
            logAxis: true
          });
        }, 500);

        const details = data.details.slice(param.start, param.start + 100);

        this.tableService.dealResp(data, {addId: 0});
        this.tableService.pageNo(param, callback, data.total, details);

        this.inited = false;
      });
    }
  }

  /**
   * 构建表格列
   */
  buildColumn() {
    const fix = [
      '_id',
      {
        code: 'storeCode',
        title: '门店代码',
      },
      {
        code: 'storeName',
        title: '门店名称',
      },

      {
        code: 'businessOperationName',
        title: '业态',
        sort: false,
      },
      {
        code: 'districtName',
        title: '地区',
      },
      {
        code: 'firstDistribution',
        title: '首次到货时间',
        render: (data) => {
          let fir_data = this.figure.dataTransform(data);
          return `${fir_data}`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'firstSale',
        title: '首次销售时间',
        render: (data) => {
          let mar_data = this.figure.dataTransform(data);
          return `${mar_data}`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'firstSupplement',
        title: '首次补货时间',
        render: (data) => {
          let rep_data = this.figure.dataTransform(data);
          return `${rep_data}`;
        },
        sort: true,
        class: 'text-right'
      },
    ];

    this.newTable = ['firstDistributionEff', 'firstSaleEff'];
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), this.newTable);

  }

}

angular.module("hs.productAnalyze.view").controller("newInfoCtrl", newInfoController);
