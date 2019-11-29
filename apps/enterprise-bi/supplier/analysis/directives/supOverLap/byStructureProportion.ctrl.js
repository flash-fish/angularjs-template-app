class byStructureProportionController {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService,
              basicService, Field, toolService, popups, popupDataService, CommSearchSort) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;

    this.interfaceName = 'getSalesAndInventoryDataBySupplier';

    // 初始化页面加载项
    this.screen = false;
    // datatables是否展示
    this.tableShow = false;

    // 赋值数据
    this.record = [];
    this.initData = [];

    //保存共同条件
    this.com = Object.assign({date: ""}, angular.copy(CommonCon.commonPro));

    // 异步中需要处理的数据
    this.back = false;
    this.isInit = false;

    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.common);
    // 日期控件
    this.opts = {};


    this.sort = angular.copy(CommSearchSort);
  }

  init() {
    // 获取初始化日期
    this.basic.packager(this.dataService.getBaseDate(), res => {
      let baseDay = res.data.baseDate;
      this.startYear = moment(baseDay, 'YYYYMMDD').format('YYYY') + '/01' + '-' + moment(baseDay, 'YYYYMMDD').format('YYYY/MM');
      // 获取数据权限
      this.tool.getAccess((d) => this.initialize(d));

    });
    /*共同条件变化时执行的内容*/
    this.watchCom();

  }

  initialize(data) {
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 需要更改的参数
    this.newCurr = ['allAmountOfSupplier', 'allAmountOfLH', 'allAmount'];

    this.com = angular.copy(this.accessCom);
    this.opts.date = this.com.date = this.startYear;
    this.commonParam = angular.copy(this.com);


    this.sortCom = this.tool.dealSortData(this.commonParam, this.sort);
  }

  // 选择完成的时候执行
  primary() {
    this.back = false;
    this.screen = false;
    this.lastSelect = this.supplierLength;
    this.chart_bar_supply = this.buildChartDataSupply(this.record);
    // 初始化构建datatables
    this.initColumn();
    if(this.tableShow){
      this.instance.rerender();
    }
    this.tableShow = true;
  }

  // 搜索按钮
  search() {
    this.back = true;
    this.isInit = true;
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.commonParam = angular.copy(this.com);
    if(this.tableShow){
      this.instance.rerender();
    }
    this.screen = false;
    this.lastSelect = '';

    this.sortCom = this.tool.dealSortData(this.commonParam, this.sort);
  }

  /*共同条件变化时执行的内容*/
  watchCom() {
    this.scope.$watch('ctrl.commonParam', newVal => {

      if (!newVal) return;
      this.loadChart = !this.loadChart;
      this.chartbuild();
      if (this.back) {
        // this.instance.rerender()
      } else {
        this.buildOption();
      }
    });
  }

  // 初始化构建datatables
  initColumn() {
    this.buildColumn();
  }


  buildColumn() {
    const fix = [
      '_id',
      {
        code: 'supplierCode',
        class: 'text-left'
      },
      {
        code: 'supplierName',
        title: '供应商名称',
        class: 'text-left',
        render: (data) => {
          return `<a>${data}</a>`;
        }
      },

      {
        code: "allAmount",
        title: "销售额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: '',
      },
      {
        code: "allAmountOfSupplier",
        title: "销售额占比供应商自己",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: '',
      },
      {
        code: "allAmountOfLH",
        title: "销售额占比联华类别",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: '',
      },
    ];

    this.column = this.tableService.fixedColumn(fix);

  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.option = this.tableService
      .fromSource(this.getData(), {fixed: 1, sort: 3})
      .withOption("rowCallback", (row, aData) => this.rowCallback(row, aData))
      .withDisplayLength(10);
  }

  getData() {
    return (param, callback) => {

      function compare(property, sort) {
        return function (a, b) {
          let value1 = a[property];
          let value2 = b[property];
          // 如果是经销周转天数，根据是否有值，赋值为无穷大
          if (property === 'saleDays') {
            value1 = _.isUndefined(a[property]) ? Infinity : a[property];
            value2 = _.isUndefined(b[property]) ? Infinity : b[property];
          }
          if (_.isUndefined(value1)) {
            return 1;
          } else if (_.isUndefined(value2)) {
            return -1
          } else {
            return sort === "asc" ? value1 - value2 : value2 - value1;
          }

        }
      }

      if (this.back) {
        this.initData = [];
      }

      // 没有数据隐藏分页
      if (this.initData.length === 0) {
        $(".dt-toolbar-footer").css('opacity', 0);
      }

      let rankData = this.initData.sort(compare(param.columns[param.order[0].column].data, param.order[0].dir));
      let data = {};
      data.details = rankData.slice(param.start, param.start + 10);
      let total = this.initData.length;


      this.tableService.dealResp(data, {addId: param.start});
      this.tableService.pageNo(param, callback, total, data.details);
      this.loading_show = false;
    };

  }


  rowCallback(row, aData) {
    $(".weather", row).unbind('click');

    $(".weather", row).click((e) => {
      let data = aData;
      $(e.target).next().text(data.productName);
      $(e.target).next().css({'display': 'inline-block'});
    });

  }

  chartbuild() {
    // 如果是初始化进入该页面，给echart空值，并结束
    if (!this.isInit) {
      this.chart_bar_supply = this.buildChartDataSupply([], this.term);
      return;
    }
    let f = this.newCurr;
    let param = this.tool.buildParam(this.tool.getParam(this.commonParam, f));
    param.sortBy = {
      field: "dateCode",
      direction: 1,
    };
    param.pageId = this.CommonCon.page.page_supplier_across_structure;

    this.basic.packager(this.dataService.getSalesAndInventoryDataBySupplier(param, true), res => {
      this.chart_bar_supply = this.buildChartDataSupply(res.data.details);
    });

    this.event = {
      name: "brushselected",
      func: (param) => {
        let index = param.batch[0].selected[0].dataIndex;
        let newArr = [];
        if (index.length === 0) {
          this.screen = false;
          this.screenNex = false;
          return;
        }
        this.screen = true;
        index.forEach((s, i) => {
          newArr.push(this.initData[s])
        });
        this.record = newArr;
        this.supplierLength = newArr.length;
      },
    };

  }

  /*
  * 供货echart数据处理
 */
  buildChartDataSupply(d) {
    //需要传给datatables的数据
    this.initData = d;
    //当前指标的数据集合
    const dataX = d.map(s => s.allAmountOfSupplier);
    const dataY = d.map(s => s.allAmountOfLH);
    const legendName = ['销售额占比供应商自己', '销售额占比联华类别'];

    // 传给chart的系列数据
    const values = [];
    dataX.forEach((s, i) => values.push(_.compact([s, dataY[i]])));
    const names = d.map(s => s.supplierName);
    return this.setChart(values, names, legendName);
  }

  /*
* 供货echart设定
* */
  setChart(values, names, legendName) {

    return {
      title: {
        text: '',
      },
      color: ['#2A80D8', '#78BF57'],
      tooltip: {
        // trigger: 'item',
        showDelay: 0,
        formatter: (params) => {
          if (params.value.length > 1) {
            return names[params.dataIndex] + '<br/>' + params.marker
              + legendName[0] + '：' + this.FigureService.scale(params.value[0], true, true) + '</br>' + params.marker + legendName[1] + '：'
              + this.FigureService.scale(params.value[1], true, true);
          }
          else {
            return params.seriesName.replace(/\s*/g,"") + ' :<br/>'
              + params.name +
              +params.value;
          }
        },
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        }
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: {
            type: ['rect', 'polygon', 'clear']
          }
        }
      },
      brush: {
        outOfBrush: {
          color: '#abc'
        },
        brushStyle: {
          borderWidth: 2,
          color: 'rgba(0,0,0,0.2)',
          borderColor: 'rgba(0,0,0,0.5)',
        },
        seriesIndex: [0, 1],
        throttleType: 'debounce',
        throttleDelay: 400,
        geoIndex: 0
      },
      legend: {
        left: 'right',
        textStyle: {fontSize: 12, fontFamily: 'SimSun'},
        padding: [0, 30, 0, 0],
        data: ''
      },
      grid: {
        left: '60px', top: '50px', right: '50px', bottom: '30px'
      },
      xAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: (a) => {
              return a * 100 + '%'
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: (a) => {
              console.log(a);
              return a * 100 + '%'
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '某供应商',
          type: 'scatter',
          data: values,
          markArea: {
            silent: true,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderWidth: 1,
                borderType: 'dashed'
              }
            },
          },
          markLine: {
            lineStyle: {
              normal: {
                type: 'solid'
              }
            },
            data: [
              // {type : 'average', name: '平均值'},
            ]
          }
        },
      ]
    };
  }

  // 类别
  openCat() {
    const promise = this.popupDataService.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

}


angular.module('hs.supplier.adviser').component('byStructureProportion', {
  templateUrl: 'app/supplier/analysis/directives/supOverLap/byStructureProportion.tpl.html',
  controller: byStructureProportionController,
  controllerAs: 'ctrl',
  bindings: {}
});
