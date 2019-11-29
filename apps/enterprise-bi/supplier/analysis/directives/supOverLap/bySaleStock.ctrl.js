class bySaleStockController {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService, $rootScope, CommSearchSort) {
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
    this.rootScope = $rootScope;
    // 接口参数
    this.interfaceName = 'getSalesAndInventoryDataBySupplier';

    // 初始化页面加载项
    this.screen = false;
    this.screen_nex = false;
    // datatables是否展示
    this.tableShow = false;

    // 赋值数据
    this.initData = [];
    this.record = [];

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, angular.copy(CommonCon.commonPro));
    this.term = ['allAmount', 'allProfit'];

    // 异步中需要处理的数据
    this.back = false;
    this.instance = {};

    // 是否是初次进入该页面
    this.isInit = false;

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.common);

    // 日期控件
    this.opts = {};

    this.sort = angular.copy(CommSearchSort);
  }

  init() {
    this.rootScope.fullLoadingShow = false;
    // 获取初始化日期
    this.basic.packager(this.dataService.getBaseDate(), res => {
      let baseDay = res.data.baseDate;
      this.startYear = moment(baseDay, 'YYYYMMDD').format('YYYY') + '/01' + '-' + moment(baseDay, 'YYYYMMDD').format('YYYY/MM');
      // 获取数据权限
      this.tool.getAccess((d) => this.initialize(d));
      // 初始化构建datatables
      this.initColumn();
    });

    /*共同条件变化时执行的内容*/
    this.watchCom();
    /*select 时两个select框之间的联动内容*/
    this.watchSelect();

  }

  initialize(data) {
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    let level = this.tool.authorityLevel(this.tool.getJobByAccess(this.accessCom));

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断用户权限,是否显示综合收益,更改传递参数
    this.authority = level.name;
    this.head = level.level;
    // 需要更改的参数
    this.curr = [
      this.head + 'BizCompIncomeAmount',
      this.head + 'BizCompIncomeAmountRate',
      this.head + 'BizCompIncomeAmountYoY',
      this.head + 'BizCompIncomeAmountRateYoYInc',
    ];
    this.fixCurr = ['allAmount', 'allProfit', 'allProfitRate', 'saleDays', 'allAmountYoY',
      'allProfitYoY', 'allProfitRateYoYInc', 'saleDaysYoY'
    ];
    this.newCurr = this.fixCurr.concat(this.curr);

    this.newX = [
      {id: '9', name: '综合收益额' + this.authority, option: this.head + 'BizCompIncomeAmount'},
      {id: '10', name: '综合收益率' + this.authority, option: this.head + 'BizCompIncomeAmountRate'},
      {id: '11', name: '综合收益额同比增幅' + this.authority, option: this.head + 'BizCompIncomeAmountYoY'},
      {id: '12', name: '综合收益率同比增长' + this.authority, option: this.head + 'BizCompIncomeAmountRateYoYInc'}
    ];
    this.selectXY = this.CommonCon.selectXY.concat(this.newX);
    // 默认select选中
    this.supTrendTypeX = this.selectXY[0].id;
    this.supTrendTypeY = this.selectXY[1].id;

    this.com = angular.copy(this.accessCom);
    this.opts.date = this.com.date = this.startYear;
    this.commonParam = angular.copy(this.com);

    this.sortCom = this.tool.dealSortData(this.commonParam, this.sort);
  }

  // 初次全选的时候执行
  primary() {
    this.screenNex = true;
  }

  // 进一步筛选执行
  Reelection() {
    this.screen = false;
    this.screenNex = false;
    this.lastSelect = this.supplierLength;

    this.chart_bar_supply = this.buildChartDataSupply(this.record, this.term);
  }

  // 点击 已经筛选完成 执行
  ok() {
    this.screen = false;
    this.screenNex = false;
    this.lastSelect = this.supplierLength;
    this.back = false;
    this.chart_bar_supply = this.buildChartDataSupply(this.record, this.term);
    this.initColumn();
    if(this.tableShow){
      this.instance.rerender();
    }
    this.tableShow = true;
  }

  // 根据选择重绘charts
  getRecord() {
    this.loadChart = !this.loadChart;
    // 清除默认的字段，重新选择
    this.term = [];
    this.newCurr.forEach((v, i) => {
      i === Number(this.supTrendTypeX - 1) ? this.term[0] = v : '';
      i === Number(this.supTrendTypeY - 1) ? this.term[1] = v : '';
    });
    console.log(this.term);
    this.chart_bar_supply = this.buildChartDataSupply(this.initData, this.term)
  }

  /*共同条件变化时执行的内容*/
  watchCom() {
    this.scope.$watch('ctrl.commonParam', newVal => {

      if (!newVal) return;
      this.loadChart = !this.loadChart;
      this.chartbuild();

      if (this.back) {
        this.initColumn()
      } else {
        this.buildOption();
      }

    });
  }

  /*select 时两个select框之间的联动内容*/
  watchSelect() {
    this.scope.$watch('ctrl.supTrendTypeX', (newVal, oldVal) => {
      if (newVal) {
        console.log(newVal);
        let y = angular.copy(this.selectXY);
        // y.splice(Number(newVal) - 1, 1);
        this.selectY = y;
        let num = Number(newVal) === 9 ? Number(newVal) - 1 : Number(newVal);
        if (this.supTrendTypeY !== newVal) {
          this.getRecord();
          return;
        }
        this.supTrendTypeY = this.selectY[num].id;

        this.getRecord();
      }

    });
    this.scope.$watch('ctrl.supTrendTypeY', newVal => {
      if (newVal) {
        console.log(newVal);
        let y = angular.copy(this.selectXY);

        let num = Number(newVal) === 9 ? Number(newVal) - 1 : Number(newVal);
        this.selectY = y;
        if (this.supTrendTypeX !== newVal) {
          this.getRecord();
          return;
        }
        this.supTrendTypeX = this.selectY[num].id;

        this.getRecord();
      }
    })
  }

  // 初始化构建datatables
  initColumn() {
    this.buildColumn();
  }

  search() {
    // 根据权限和选择删除综合收益
    if ((this.com.category.val.length > 0 || this.com.brand.val.length > 0 || this.com.product.val.length > 0) ||
      (this.com.classes.val.length > 0 && (this.com.operation.val.length > 0 || this.com.district.val.length > 0 || this.com.store.val.length > 0 || this.com.storeGroup.val.length > 0))
    ) {
      this.selectXY = this.CommonCon.selectXY;
      this.selectY = this.selectXY;
      this.newCurr = this.fixCurr
    } else {
      this.newCurr = this.fixCurr.concat(this.curr);
      this.selectXY = this.CommonCon.selectXY.concat(this.newX);
      this.selectY = this.selectXY;
    }
    this.back = true;
    this.isInit = true;
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.commonParam = angular.copy(this.com);

    // 所有确定按钮隐藏，清空select内容
    this.screen = false;
    this.screenNex = false;
    this.lastSelect = '';
    // 初始化指标
    this.supTrendTypeX = this.selectXY[0].id;
    this.supTrendTypeY = this.selectXY[1].id;

    if(this.tableShow){
      this.instance.rerender();
    }

    this.sortCom = this.tool.dealSortData(this.commonParam, this.sort);
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
        code: "allAmountYoY",
        title: "销售额" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "allProfit",
        title: "毛利额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "allProfitRate",
        title: "毛利率",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "allProfitYoY",
        title: "毛利额" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "allProfitRateYoYInc",
        title: "毛利率" + "</br>" + "同比增长",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "saleDays",
        title: "经销周转天数",
        render: (data) => {
          let formatData = _.isUndefined(data) ? '-' : this.FigureService.number(data, false, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "saleDaysYoY",
        title: "经销周转天数" + "</br>" + "同比增长",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: this.head + 'BizCompIncomeAmount',
        title: "综合收益额(万元)" + this.authority,
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: this.selectXY.length === 8,
      },
      {
        code: this.head + 'BizCompIncomeAmountRate',
        title: "综合收益率" + this.authority,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: this.selectXY.length === 8,
      },
      {
        code: this.head + 'BizCompIncomeAmountYoY',
        title: "综合收益额" + "</br>" + "同比增幅" + this.authority,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: this.selectXY.length === 8,
      },
      {
        code: this.head + 'BizCompIncomeAmountRateYoYInc',
        title: "综合收益率" + "</br>" + "同比增长" + this.authority,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
        visible: this.selectXY.length === 8,
      },
    ];

    this.column = this.tableService.fixedColumn(fix);

  }

  /**
   * 构建表格数据
   */
  buildOption() {
    // this.back = true;
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

      // 点击搜索按钮时清空数据
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
    $(".weather", row).unbind('mouseenter');
    $(".weather", row).unbind('mouseleave');

    $(".weatherBox", row).unbind('mouseenter');
    $(".weatherBox", row).unbind('mouseleave');

    $(".weather", row).mouseenter((e) => {
      let data = aData;
      $(e.target).next().text(data.productName);
      $(e.target).next().css({'display': 'inline-block'});
    });
    $(".weather", row).mouseleave((e) => {
      $(e.target).next().css('display', 'none')
    });

    $(".weatherBox", row).mouseenter((e) => {
      $(e.target).css('display', 'inline-block')
    });
    $(".weatherBox", row).mouseleave((e) => {
      $(e.target).css('display', 'none')
    });
  }

  chartbuild() {
    // 如果是初始化进入该页面，给echart空值，并结束
    if(!this.isInit){
      this.chart_bar_supply = this.buildChartDataSupply([], this.term);
      return;
    }

    let f = this.newCurr;
    let param = this.tool.buildParam(this.tool.getParam(this.commonParam, f));
    param.sortBy = {
      field: "dateCode",
      direction: 1,
    };
    param.pageId = this.CommonCon.page.page_supplier_across_sale;

    this.basic.packager(this.dataService.getSalesAndInventoryDataBySupplier(param, true), res => {
      this.chart_bar_supply = this.buildChartDataSupply(res.data.details, this.term);
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
  buildChartDataSupply(d, f) {
    //需要传给datatables的数据
    this.initData = d;
    //当前指标的数据集合
    const dataX = d.map(s => s[f[0]]);
    const dataY = d.map(s => s[f[1]]);
    const legendName = [];
    this.selectXY.forEach((v, i) => {
      v.option === f[0] ? legendName[0] = v.name : '';
      v.option === f[1] ? legendName[1] = v.name : '';
    });
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
            let value1 = (legendName[0].includes('额') && !legendName[0].includes('幅')) ? this.FigureService.number(params.value[0], false, true) + '元'
              : (legendName[0].includes('幅') || legendName[0].includes('率')) ? this.FigureService.scale(params.value[0], true, true)
              : this.FigureService.number(params.value[0], false, true);

            let value2 = (legendName[1].includes('额') && !legendName[1].includes('幅')) ? this.FigureService.number(params.value[1], false, true) + '元' :
              (legendName[1].includes('幅') || legendName[1].includes('率')) ? this.FigureService.scale(params.value[1], true, true)
                : this.FigureService.number(params.value[1], false, true);

            return names[params.dataIndex] + ' <br/>' + params.marker
              + legendName[0] + '：' + value1 + '</br>' + params.marker + legendName[1] + '：'
              + value2;
          }
          else {
            return params.seriesName.replace(/\s*/g,"") + ' :<br/>'
              + params.name +
              +params.value + '元';
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
        left: '80px', top: '50px', right: '50px', bottom: '30px'
      },
      xAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: (data) => {
              let forData;

              forData = (legendName[0].includes('额') && !legendName[0].includes('幅')) ? data / 10000 + '万元' :
                (legendName[0].includes('幅') || legendName[0].includes('率')) ? data * 100 + '%' : data;
              return forData;
            }
          },
          splitLine: {
            // show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: (data) => {
              let forData;

              forData = (legendName[1].includes('额') && !legendName[1].includes('幅')) ? data / 1000 + '万元' :
                (legendName[1].includes('幅') || legendName[1].includes('率')) ? data * 100 + '%' : data;
              return forData;
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
            // data: [
            //   {type : 'average', name: '平均值'},
            // ]
          }
        },
      ]
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

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

}

angular.module('hs.supplier.saleStock').component('bySaleStock', {
  templateUrl: 'app/supplier/analysis/directives/supOverLap/bySaleStock.tpl.html',
  controller: bySaleStockController,
  controllerAs: 'ctrl',
  bindings: {}
});
