/**
 * Created by ios on 2018/8/31.
 */
class newItemInfoController {
  constructor($scope, $compile, FigureService, CommonCon, tableService, DTColumnBuilder, toolService, SaleStockSubMenu, popups, dataService,
              $rootScope, $sce, basicService, $state, popupDataService, $stateParams, Common, Field, $templateCache) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupData = popupDataService;
    this.notStartingSku = `${$templateCache.get(`notStartingSku.html`)}`;
    this.eliminationRate = `${$templateCache.get(`eliminationRate.html`)}`;

    // 异步中需要处理的数据
    this.back = {};

    this.instance = {};

    //饼图load
    this.chartLoadOne = 1;
    this.chartLoadTwo = 1;
    this.chartLoadThree = 1;


    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
    }, ["classes", "category", "operation", "store", "district"]);


    this.keys = {
      finish: true,
    };

    // 日期控件配置
    this.dateOption = {};

    this.power = [
      {name: '门店', data: []},
      {name: '类别', data: []},
      {name: '业态', data: []},
      {name: '品类组', data: []},
      {name: '地区', data: []},
      {name: '品牌', data: []},
      {name: '商品', data: []},
      {name: '供应商', data: []},
      {name: '店群', data: []},
    ];

    this.sort = {
      classes: 1,
      category: 2,
      operation: 3,
      store: 4,
      district: 5
    };

  }

  click() {
    this.$state.go("app.saleStockTop.saleStock");
  }


  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    //原先这几个label用一个来控制eChart的显示(skuLabel profitLabel amountLabel) => label
    this.label = false;
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com = _.pick(com, _.keys(this.sort));
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  // 初始化数据
  start() {
    this.temp = [
      {
        name: '引入新品SKU数',
        percent: '占比商品SKU数',
        option: ['newProductUnit', 'newProductYoYValue', 'newProductYoY', 'newProductPercen', 'newProductPercenSelf'],
        data:['-', '-', '-', '-'],
        isSale: false,
        line: true
      },
      {
        name: '新品销售额(万元)',
        percent: '占比商品销售额',
        option: ['newProductAmount', 'newProductAmountYoYValue', 'newProductAmountYoY', 'newProductAmountPercen', 'newProductAmounttPercenSelf'],
        data:['-', '-', '-', '-'],
        isSale: true,
        line: true
      },
      {
        name: '新品毛利额(万元)',
        percent: '占比商品毛利额',
        option: ['newProductGPM', 'newProductGPMYoYValue', 'newProductGPMYoY', 'newProductGPMPercen', 'newProductGPMPercenSelf'],
        data:['-', '-', '-', '-'],
        isSale: true,
        line: true
      },
      {
        name: '新品经销周转天数',
        percent: '商品经销周转天数',
        option: ['saleDays', 'saleDaysYoYValue', 'saleDaysYoY', 'saleDaysPercen', 'saleDaysPercenSelf'],
        data:['-', '-', '-', '-'],
        isSale: false,
        line: false
      }
    ];
    this.temp2 = [
      {name: '引入新品SKU数', id: "newSku", option: ['allAmount', 'allAmountYoYValue'], isSale: true, prompt: 'importSku', data: '-'},
      {name: '申报中新品SKU数', id: "applySku", data: '-', isSale: false},
      {name: '新品运营中SKU数', id: "operationSku", pam: 'operationSku',  data: '-', isSale: false, prompt: 0},
      {name: '转为正常品SKU数', id: "normalSku", option: ['storeCnt', 'storeCntYoYValue'], isSale: false, prompt: 0, data: '-'},
      {name: '已淘汰SKU数', id: "eliminateSku", option: ['storeCnt', 'storeCntYoYValue'], isSale: false, prompt: 0, data: '-'},
      {name: '淘汰率', id: "eliminateRate", scale: true, option: ['storeCnt', 'storeCntYoYValue'], isSale: false, prompt: 'eliminationRate', data: '-'},
    ];


  }

  initialize(data) {
    this.inited = true;
    this.start();

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, null, {
      job: this.job,
      reset: ['classes']
    });

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // this.dataPower(data);

    this.getDate();

    this.scope.$watch('ctrl.last_name', (newVal, oldVal) => {
      if (!oldVal) return;
      if (newVal === oldVal) return;
      this.chartLoadOne += 1;
      this.getPeriodNewProductCount(newVal);
    });

    this.menu = this.basic.getSession(this.common.leftMenu);
    if(this.menu) {
      for (let i = 0; i < this.menu.length; i++) {
        let dic = this.menu[i];
        let array = dic.children;
        for (let j = 0; j < array.length; j++) {
          let child = array[j];
          if (child.resUrl === 'app.newItemAnalyze.newItemSaleStock') {
            this.saleStockMore = true;
          }else  if (child.resUrl === 'app.newItemAnalyze.newItemState') {
            this.saleStateMore = true;
          }
        }
      }
    }else {
      this.scope.$watch('ctrl.root.leftMenu', (newVal) => {
        if (!newVal) return;
        this.menu = newVal;
        for (let i = 0; i < this.menu.length; i++) {
          let dic = this.menu[i];
          let array = dic.children;
          for (let j = 0; j < array.length; j++) {
            let child = array[j];
            if (child.resUrl === 'app.newItemAnalyze.newItemSaleStock') {
              this.saleStockMore = true;
            }else  if (child.resUrl === 'app.newItemAnalyze.newItemState') {
              this.saleStateMore = true;
            }
          }
        }
      });
    }

    this.showMoreState();
  }

  getDate() {

    this.basic.packager(this.dataService.getBaseDate(), res => {


      this.baseDate = res.data.baseDate;
      let mBaseDate = moment(this.baseDate + '', 'YYYYMMDD');
      this.now = mBaseDate.format('MM/DD');

      const this_Year = parseInt(String(this.baseDate).slice(0, 4));

      this.basic.packager(this.dataService.getMonthByDate(this.baseDate), resp => {

        //接口所需要的按月查询的月份01-09
        this.com.date = this_Year + '01-' + resp.data.businessMonth;
        // marketing
        this.lastYearMarketing = [
          {id: "lastT", name: '去年同期', active: true},
          {id: "lastAll", name: '去年全年', active: false}
        ];

        // 今天年份
        this.year = this_Year;
        this.lastYear = this.year - 1;

        // marketing第一个值
        this.last_name = this.lastYearMarketing[0].id;

        // 上半部分四个接口
        this.getNewProductDataSummarySkuNum();
        this.getNewProductDataSummarySkuAllAmount();
        this.getNewProductDataSummarySkuAllProfit();
        this.getNewProductDataSummarySkuAllDay();

        this.getNewProductSurvivalSummary();
        this.getNewProductStructure();
        this.getTrendForSale();

        this.showCondition();
      });

    });
  }

  // 获取2018年概况数据 上半部分
  getNewProductDataSummarySkuNum() {

    this.com.status = 0;
    this.com.newProductYear = this.year;
    this.copyCom = angular.copy(this.com);
    let field = ["skuNum"];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductDataSummary(p), res => {

      this.temp[0].data = [
        this.FigureService.isDefine(res.data.allSkuAmount),
        this.FigureService.isDefine(res.data.allSkuAmountYoyValue),
        this.FigureService.scale(res.data.allSkuAmountYoy, true, true),
        this.FigureService.scale(res.data.allSkuAmountPct, true, true),
        res.data.allSkuAmountYoy,
        this.FigureService.isDefine(res.data.allSkuAmount),
        this.FigureService.isDefine(res.data.allSkuAmountYoyValue),
      ];
      this.allSkuAmountYoy = this.FigureService.scale(res.data.allSkuAmountYoy, true, true);
      this.chart_bar_Unit = this.buildChartData([this.temp[0].data[5], this.temp[0].data[6]], "引入新品SKU数", '', this.label);


    });
  }

  getNewProductDataSummarySkuAllAmount() {

    this.com.status = 0;
    this.com.newProductYear = this.year;
    let field = ["allAmount", "allAmountYoYValue", "allAmountYoY"];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductDataSummary(p), res => {
      this.temp[1].data = [
        this.FigureService.number(res.data.allAmount, true, true),
        this.FigureService.number(res.data.allAmountYoyValue, true, true),
        this.FigureService.scale(res.data.allAmountYoy, true, true),
        this.FigureService.scale(res.data.allAmountPct, true, true),
        res.data.allAmountYoy,
        this.FigureService.isDefine(res.data.allAmount),
        this.FigureService.isDefine(res.data.allAmountYoyValue),
        this.FigureService.number(res.data.allAmount, false, true),
        this.FigureService.number(res.data.allAmountYoyValue, false, true),
      ];
      this.allAmountYoy = this.FigureService.scale(res.data.allAmountYoy, true, true);
      this.chart_bar_Amount = this.buildChartData([this.temp[1].data[5], this.temp[1].data[6]], "新品销售额", '单位:万元', this.label);
    });
  }



  getNewProductDataSummarySkuAllProfit() {

    this.com.status = 0;
    this.com.newProductYear = this.year;
    let field = ["allProfit", "allProfitYoY", "allProfitYoYValue"];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductDataSummary(p), res => {

      this.temp[2].data = [
        this.FigureService.number(res.data.allProfit, true, true),
        this.FigureService.number(res.data.allProfitYoyValue, true, true),
        this.FigureService.scale(res.data.allProfitYoy, true, true),
        this.FigureService.scale(res.data.allProfitPct, true, true),
        res.data.allProfitYoy,
        this.FigureService.isDefine(res.data.allProfit),
        this.FigureService.isDefine(res.data.allProfitYoyValue),
        this.FigureService.number(res.data.allProfit, false, true),
        this.FigureService.number(res.data.allProfitYoy, false, true),
      ];
      this.allProfitYoy = this.FigureService.scale(res.data.allProfitYoy, true, true);
      this.chart_bar_GPM = this.buildChartData([this.temp[2].data[5], this.temp[2].data[6]], "新品毛利额", '单位:万元', this.label);
    });
  }


  getNewProductDataSummarySkuAllDay() {

    this.com.status = 0;
    this.com.newProductYear = this.year;
    let field = ["saleDays", "saleDaysYoYValue", "saleDaysYoYInc"];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductDataSummary(p), res => {
      this.temp[3].data = [
        this.FigureService.scaleOther(res.data.saleDays, false, false),
        this.FigureService.scaleOther(res.data.saleDaysYoyValue, false, false),
        this.FigureService.number(res.data.saleDaysYoyInc, false, true),
        this.FigureService.scaleOther(res.data.allSaleDays, false, false),
        res.data.saleDaysYoyInc
      ];
    });

  }

  // 获取2018年概况数据 下半部分
  getNewProductSurvivalSummary() {


    let com = angular.copy(this.com);
    com.status = null;
    com.newProductYear = null;
    com.date = "" + this.year;
    let p = this.tool.buildParam(this.tool.getParam(com, ''));
    p.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductSurvivalSummary(p), res => {
      this.temp2.forEach(t => {
        if (t.scale)
          t.data = this.FigureService.scale(res.data[t.id], true, true);
        else t.data = this.FigureService.isDefine(res.data[t.id]);
      })
    });
  }

  // 柱状图切换marketing数据
  getPeriodNewProductCount(newVal) {

    if (newVal === 'lastT') {
      this.chart_bar_Unit = this.buildChartData([this.temp[0].data[5], this.temp[0].data[6]], "引入新品SKU数", '', this.label);
      this.chart_bar_Amount = this.buildChartData([this.temp[1].data[5], this.temp[1].data[6]], "新品销售额", '单位:万元', this.label);
      this.chart_bar_GPM = this.buildChartData([this.temp[2].data[5], this.temp[2].data[6]], "新品毛利额", '单位:万元', this.label);
    }else  {

      this.com.date = "" + this.lastYear + '01' + '-' + "" + this.lastYear + '12';
      this.com.newProductYear = this.lastYear;
      let f = this.tool.buildParam(this.tool.getParam(this.com, ''));
      f.pageId = this.CommonCon.page.page_new_info;
      this.basic.packager(this.dataService.getPeriodNewProductCount(f), res => {
        this.chart_bar_Unit = this.buildChartData([this.temp[0].data[5], this.FigureService.isDefine(res.data)], "引入新品SKU数", '', this.label);
      });

      let field = ['allAmount', 'allProfit'];
      let p = this.tool.buildParam(this.tool.getParam(this.com, field));
      p.pageId = this.CommonCon.page.page_new_info;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
        this.chart_bar_Amount = this.buildChartData([this.temp[1].data[5], this.FigureService.isDefine(res.data["allAmount"])], "新品销售额", '单位:万元', this.label);
        this.chart_bar_GPM = this.buildChartData([this.temp[2].data[5], this.FigureService.isDefine(res.data["allProfit"])], "新品毛利额", '单位:万元', this.label);
      });
    }
  }

  // 饼状图数据
  getNewProductStructure() {

    this.com.year = this.year;
    this.com.saleType = 0;
    this.com.status = 0;
    let f = this.tool.buildParam(this.tool.getParam(this.com, ''));
    f.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getNewProductStructure(f), res => {
      const data = res.data.summary || {};

      this.chart_Pie_Unit = this.buildChartDataPie(data.newProductSku, "引入新品SKU结构");
      this.chart_Pie_Amount = this.buildChartDataPie(data.sale, "新品销售结构");
      this.chart_Pie_GPM = this.buildChartDataPie(data.profit, "新品毛利结构");
    });
  }

  // 趋势柱状图
  getTrendForSale() {
    let com = angular.copy(this.com);
    let last30 = moment(this.baseDate, 'YYYYMMDD').subtract(29, 'days').format('YYYY/MM/DD');
    const now = moment().format('YYYY') + '/01/01';
    const isBefore = moment(last30).isBefore(now);
    if(isBefore) last30 = now;
    com.date = last30 + '-' + "" + moment(this.baseDate, 'YYYYMMDD').format('YYYY/MM/DD');
    this.jumpDate = com.date;
    com.newProductYear = this.year;
    let field = ['allAmount', 'allAmountYoYValue', 'allAmountYoY'];
    let f = this.tool.buildParam(this.tool.getParam(com, field));
    f.sortBy = {
      field: "dateCode",
      direction: 1
    };
    f.pageId = this.CommonCon.page.page_new_info;
    this.basic.packager(this.dataService.getTrendForSale(f), res => {
      const data = res.data.details;
      this.chart_bar_new = this.buildChartDataNew(data);
    });

  }

  // 创建柱状图参数
  buildChartData(data, key, name, label) {

    // 当前指标的数据集合
    const lastYear = [data[0]];
    const thisYear = [data[1]];

    // 传给chart的系列数据
    const values = [lastYear, thisYear];


    // 传给chart的图例数据

    const legends = this.last_name === 'lastAll' ? ["" + this.year + '年', "" + this.lastYear + '全年'] : ["" + this.year + '年', "" + this.lastYear + '年'];
    const xData = [''];

    return this.setChart(values, legends, name, xData, key, label);
  }

  // 创建饼状图参数
  buildChartDataPie(d, name) {
    // 当前指标的数据集合
    const lastYear = [d[this.lastYear]];
    const thisYear = [d[this.year]];
    const all = [d['other']];
    // 传给chart的系列数据
    const values = [thisYear, lastYear, all];
    // 传给chart的图例数据
    const legends = ["" + this.year + '年新品', "" + this.lastYear + '年新品', '非新品'];
    let arr = [];
    values.forEach((el, i) => {
      arr.push({value: el, name: legends[i]});
    });

    return this.setChartPie(arr, legends, name);
  }

  // 创建趋势列表数据
  buildChartDataNew(d) {
    // 当前指标的数据集合
    const lastYear = d.map(s => s.allAmountYoYValue);
    const thisYear = d.map(s => s.allAmount);
    const yoyArr = d.map(s => s.allAmountYoY);

    // 传给chart的系列数据
    const values = [thisYear, lastYear];
    const name = '柱状图(万元)';
    const legends = ['销售额', '同期值'];
    const xData = d.map(s => moment(s.dateCode, 'YYYYMMDD').format('MM/DD'));
    const key = '销售额';
    return this.setChart(values, legends, name, xData, key, this.trendLabel);
  }

  // 绘制柱状图
  setChart(values, legends, name, xData, key, label) {
    return {
      xAxisNoWrap: true,
      color: ['#007ADB', '#26C08C'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
        formatter: (a) => {
          let index = a[0].dataIndex;
          let title = key + '&nbsp;' + '</br>';
          // let yoyTitle = yoy ? '同比增幅：' + yoy : '';
          //
          // let yoyArrTitle = yoyArr ? '同比增幅：' + (yoyArr[index] ? this.FigureService.scale(yoyArr[index], true, true) : '-') : '';

          return title + a.map(s => {
              let sum = name.includes('万') ? this.FigureService.number(s['value'], false, true) + '元' : this.FigureService.thousand(s['value'], 0);
              return s['marker'] + s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + sum + '<br/>';
            }).join('');
        }
      },
      legend: {
        left: 'center',
        textStyle: {fontSize: 12, fontFamily: 'SimSun'},
        padding: [0, 30, 0, 0],
        data: legends
      },
      grid: {
        left: '60px', top: '50px', right: '50px', bottom: '30px'
      },
      xAxis: {
        type: 'category',
        axisTick: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisLine: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisPointer: {type: 'shadow'},
        axisLabel: {color: '#071220'},
        data: xData
      },
      yAxis: {
        type: 'value',
        name: name,
        nameTextStyle: {fontSize: 12, fontFamily: 'SimSun', color: '#071220'},
        axisTick: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisLine: {lineStyle: {color: '#ccc', width: 1}},
        axisLabel: {
          color: '#071220', interval: 1, fontSize: 12, fontFamily: 'Arial',
          formatter: (a) => {
            return name.includes('万') ? this.FigureService.number(a, true, true, 0) : a;
          }
        },
        splitLine: {show: false},
        splitArea: {show: true, interval: 1, areaStyle: {color: ['#f9f9f9', '#fff']}}
      },
      // 数据内容数组
      series: (() => {
        const barScale = values.length > 1 ? '33%' : '50%';
        return values.map((s, i) => {
          return {
            type: 'bar',
            data: s,
            name: legends[i],
            barGap: '0%',
            barCategoryGap: barScale,
            label: {
              normal: {
                show: label,
                position: [0, -14],
                fontSize: 11,
                formatter: (p) => {
                  return name.includes('万元') ? this.FigureService.number(p.value, true, true, 0) : this.FigureService.thousand(p.value, 0);
                }
              }
            }
          };
        });
      })()
    };

  }


  // 绘制饼图
  setChartPie(arr, legends, name) {
    return {

      color: ['#007ADB', '#26C08C', '#FB6C93'],
      title: {
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (a) => {
          let title = name + "<br/>";
          let value = a.seriesName.includes('额') ? this.FigureService.number(a.value, false, true) + '元' : this.FigureService.thousand(a.value, 0);
          return title + a.marker + a.name + '：' + value + '(' + a.percent + '%' + ')'
        },
        textStyle: {
          fontSize: 10
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legends
      },
      series: [
        {
          name: name ? name : '',
          label: {
            normal: {
              formatter: '{d}%',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 12,
              }
            }
          },
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: arr,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          animation: false
        }
      ]
    }
  }

  // 更多
  jump(type) {

    this.setTopCondition(this.copyCom, ['date', 'status', 'saleType', 'year']);
    if (type === 'saleState') {
      let condition = angular.copy(this.copyCom);
      this.basic.setSession('fromInforToSaleState', true);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.newItemAnalyze.newItemState");
    } else if(type === 'sale'){
      let condition = angular.copy(this.copyCom);
      condition.date = this.jumpDate;
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.newItemAnalyze.newItemSaleStock");
    } else {
      let condition = angular.copy(this.copyCom);
      condition.date = this.year + '/01-' + moment(this.baseDate, 'YYYYMMDD').format('YYYY/MM');
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.newItemAnalyze.newItemSaleStock");
    }

  }

  setTopCondition(com, omit) {
    let copyCom = _.omit(angular.copy(com), omit);
    let topCondition = this.basic.getLocal(this.common.local.topCondition);
    if (topCondition) Object.assign(topCondition, copyCom);
    this.basic.setLocal(this.common.local.topCondition, topCondition || copyCom);
  }


  // 处理数据权限
  dataPower(data) {
    let store, category, operation, classes, district, brand, product, supplier, storeGroup;
    data.dataAccess.map(v => {
      if (v.dataAccessCode === '1') {
        store = [];
        v.accesses.map(val => {
          store.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '2') {
        category = [];
        v.accesses.map(val => {
          category.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '3') {
        operation = [];
        v.accesses.map(val => {
          operation.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '4') {
        classes = [];
        v.accesses.map(val => {
          classes.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '5') {
        district = [];
        v.accesses.map(val => {
          district.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '6') {
        brand = [];
        v.accesses.map(val => {
          brand.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '7') {
        product = [];
        v.accesses.map(val => {
          product.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '8') {
        supplier = [];
        v.accesses.map(val => {
          supplier.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '9') {
        storeGroup = [];
        v.accesses.map(val => {
          storeGroup.push('[' + val.code + ']' + val.name)
        })
      }
    });
    if (category.length > 0 && classes.length > 0) {
      category = [];
    }
    this.power[0].data = store !== undefined ? store.join(',') : [];
    this.power[1].data = category !== undefined ? category.join(',') : [];
    this.power[2].data = operation !== undefined ? operation.join(',') : [];
    this.power[3].data = classes !== undefined ? classes.join(',') : [];
    this.power[4].data = district !== undefined ? district.join(',') : [];
    this.power[5].data = brand !== undefined ? brand.join(',') : [];
    this.power[6].data = product !== undefined ? product.join(',') : [];
    this.power[7].data = supplier !== undefined ? supplier.join(',') : [];
    this.power[8].data = storeGroup !== undefined ? storeGroup.join(',') : [];

    this.anyPower = true;
    this.power.forEach(v => {
      if (v.data.length > 0) {
        this.anyPower = false;
      }
    })
  }

  /*@ param search*/
  search() {

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.setTopCondition(this.com, ['date', 'newProductYear', 'status', 'saleType', 'year']);

    this.chartLoadOne += 1;
    this.chartLoadTwo += 1;
    this.chartLoadThree += 1;
    this.copyCom = angular.copy(this.com);

    this.showMoreState();
    this.start();
    this.getDate();
    this.showCondition()

  }

  showMoreState() {
    if (this.com.operation.val.length > 0 || this.com.store.val.length > 0 || this.com.district.val.length > 0) {
      this.saleStateMore = false;
    }else {
      this.saleStateMore = true;
    }
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





}


angular.module("hs.productAnalyze.news").controller("newItemInfoCtrl", newItemInfoController);

