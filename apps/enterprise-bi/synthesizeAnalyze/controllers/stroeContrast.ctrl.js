class storeContrastController {
  constructor(CommonCon, tableService, dataService, $scope, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService, $rootScope, chartService, Pop, BasicColor) {
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupDataService = popupDataService;
    this.rootScope = $rootScope;
    this.chartServ = chartService;
    this.BasicColor = BasicColor;

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.currentType = Pop.types.find(s => s.id === 1);

    // 接口参数
    this.interfaceName = 'getSalesAndInventoryDataBySupplier';

    // 初始化datables不显示，折线图也不显示
    this.chartShow = false;

    this.axis = CommonCon.chart.axis;

    // 赋值数据
    this.initData = [];
    this.searchData = [];

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["operation", "district", "storeGroup"], true);

    this.term = ['retailAmount', 'allProfit'];


    // 异步中需要处理的数据
    this.back = {};
    this.chartBack = {};
    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 日期控件
    this.opts = {};

    this.sort= {
      date: 1,
      store: 2,
      classes: 3,
      category: 4,
      brand: 5,
      product: 6,
      supplier: 7
    };

    this.lineSelectList = angular.copy(CommonCon.storeNorm);
  }

  init() {
    this.rootScope.fullLoadingShow = false;
    this.basic.packager(this.dataService.getMonthByDate(), res => {
      let baseDay = res.data.businessMonth;
      this.startYear = moment(baseDay, 'YYYYMMDD').format('YYYY') + '/01' + '-' + moment(baseDay, 'YYYYMMDD').format('YYYY/MM');

      this.tool.getAccess((d) => this.initialize(d));
    });

    /**
     select 时两个select框之间的联动内容
     */
    this.watchSelect();

  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断用户权限,是否显示综合收益,更改传递参数
    this.authority = '(' + '采购' + ')';

    this.newCurr = ['retailAmount', 'retailAmountPct', 'useSizeRetailUnit', 'operateSizeRetailUnit', 'operateSizeAllProfitRate', 'useSizeRetailUnit', 'operateSizeRetailUnit',
      'stockCost', 'flowCnt', 'retailFlowAmount', 'stockCostYoY', 'allProfitPct', 'allProfitYoY', 'operateSize', 'useSize', 'operateSize', 'allProfitRate',
      'operateSizeAllProfit', 'retailAmountYoY', 'retailUnit', 'operateSizeRetailAmount', 'useSizeRetailAmount', 'allProfit', 'flowCntYoY',
      'retailFlowAmountYoY',
      'distributionCostDay',
      'distributionCostDayYoY',
      'saleDays',
      'saleDaysYoYInc', 'retailUnitYoY'];

    this.selectX = this.CommonCon.storeX;
    this.selectY = this.CommonCon.storeY[0];
    this.selectBubble = this.CommonCon.storeBubble;

    // 默认select选中
    this.supTrendTypeX = this.selectX[0].id;
    this.supTrendTypeY = this.selectY[0].id;
    this.supTrendTypeBubble = this.selectBubble[0].id;

    this.com = angular.copy(this.accessCom);

    this.com.store.val = [];
    this.opts.date = this.com.date = this.startYear;
    this.showCondition();
  }

  // 点击 已经筛选完成 执行
  ok() {
    if (!this.chartBack.filter) return;

    if (!this.chartBack.filter.length) {
      this.emptyArea = true;
      return;
    }

    this.supTrendTypeNorm = this.lineSelectList[0];

    this.emptyArea = false;

    this.initData = this.searchData.filter(s => {
      return this.chartBack.filter.map(f => f.value[4]).includes(s.storeCode);
    });

    if (this.tableShow) {
      this.instance.reloadData();
      return;
    }

    this.tableShow = true;

    this.initColumn();
    this.buildOption();
  }

  // 点击  select旁边的确定
  getRecord() {
    // 清除默认的字段，重新选择
    this.term = ['', '', ''];
    this.selectX.forEach((v, i) => {
      i === Number(this.supTrendTypeX - 1) ? this.term[0] = v.option : '';
    });
    this.selectY.forEach((v, i) => {
      i === Number(this.supTrendTypeY - 1) ? this.term[1] = v.option : '';
    });
    this.selectBubble.forEach((v, i) => {
      i === Number(this.supTrendTypeBubble - 1) ? this.term[2] = v.option : '';
    });

    const zoomSelected = angular.copy(this.chartBack.zoomSelected) || [];
    const mapZoomSel = zoomSelected.map(s => {return this.searchData.find(d => _.eq(d.storeCode, s.value[4]))});

    if (!zoomSelected.length) {

      return;
    }

    this.chart_bar_supply = this.buildChartDataSupply(mapZoomSel, this.term);

    setTimeout(() => {
      this.chart_bar_supply = this.chartServ.appendGraphic(this.chart_bar_supply, this.chartBack);
    }, 150);
  }

  showCondition(){
    let com = angular.copy(this.com);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  lineChange() {
    let index = Number(this.supTrendTypeNorm.id) - 1;
    let f = this.CommonCon.storeNorm[index];

    let com = angular.copy(this.com);

    com.store.val = this.store;

    let condition = this.tool.buildParam(this.tool.getParam(com, [f.option]));

    this.basic.packager(this.dataService.getSalesAndInventoryDataByDate(condition, true), res => {
      this.chart_line_store = this.lineChartBuild(res.data, f, this.store);
    });
  }

  /*select 时两个select框之间的联动内容*/
  watchSelect() {
    this.scope.$watch('ctrl.supTrendTypeX', newVal => {
      if (!newVal) return;
      let index = Number(newVal) - 1;
      this.selectY = this.CommonCon.storeY[index];
      if (this.selectY[0]) this.supTrendTypeY = this.selectY[0].id;
      this.getRecord();
    });

    this.scope.$watch('ctrl.supTrendTypeY', newVal => {
      if (!newVal) return;
      this.getRecord();
    });

    this.scope.$watch('ctrl.supTrendTypeBubble', newVal => {
      if (!newVal) return;
      this.getRecord();
    });
  }

  // 初始化构建datatables
  initColumn() {
    this.buildColumn();
  }

  search() {
    this.chartShow = true;
    this.tableShow = false;
    this.chartBack.filter = [];

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    // 默认select选中
    this.supTrendTypeX = this.selectX[0].id;
    this.supTrendTypeY = this.selectY[0].id;
    this.supTrendTypeBubble = this.selectBubble[0].id;
    this.supTrendTypeNorm = this.CommonCon.storeNorm[0];

    this.chartBuild();
    this.showCondition();
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    // this.back = true;
    this.option = this.tableService
      .fromSource(this.getData(), {
        fixed: 3,
        sort: 3,
        pageLength: 5
      })
      .withDisplayLength(5);
  }

  /**
   * echart数据处理
   * @param d details
   * @param f
   * @param key 配置
   */
  buildChartDataSupply(d, f, key) {
    const name = ['', '', ''];
    this.selectX.forEach((v, i) => {
      v.option === f[0] ? name[0] = v.name : '';
    });
    this.selectY.forEach((v, i) => {
      v.option === f[1] ? name[1] = v.name : '';
    });
    this.selectBubble.forEach((v, i) => {
      v.option === f[2] ? name[2] = v.name : '';
    });

    // 传给chart的系列数据
    let values = this.chartServ.duplicatePoint(d, f, this.currentType);
    _.remove(values, s => _.isUndefined(s[0]) || _.isUndefined(s[1]));

    return this.setChart(values, name, f, key);
  }

  getData() {
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


      // 没有数据隐藏分页
      if (this.initData.length === 0) {
        $(".dt-toolbar-footer").css('opacity', 0);
      } else {
        $(".dt-toolbar-footer").css('opacity', 1);
      }
      let rankData = this.initData.sort(compare(param.columns[param.order[0].column].data, param.order[0].dir));
      let data = {};
      data.details = rankData.slice(param.start, param.start + 5);
      let total = this.initData.length;

      this.tableService.dealResp(data, {addId: param.start});
      this.tableService.pageNo(param, callback, total, data.details);
      this.loading_show = false;

      this.store = data.details.map(v => {
        return {code: v.storeCode, name: v.storeName}
      });
      // 门店没有值，就传空不再进行
      if (this.store.length === 0) {
        this.chart_line_store = this.lineChartBuild([], this.CommonCon.storeNorm[0], this.store);
      }
      let com = angular.copy(this.com);

      com.store.val = this.store;

      let optionName = this.CommonCon.storeNorm[this.supTrendTypeNorm.id - 1];

      let condition = this.tool.buildParam(this.tool.getParam(com, [optionName.option]));

      this.basic.packager(this.dataService.getSalesAndInventoryDataByDate(condition, true), res => {

        this.chart_line_store = this.lineChartBuild(res.data, optionName, this.store);

      });
    };

  }

  chartBuild() {
    // 如果门店没有值，不再进行
    if (this.com.store.val.length === 0) {
      return;
    }

    let f = this.newCurr;
    let param = this.tool.buildParam(this.tool.getParam(this.com, f));
    param.sortBy = {
      field: "dateCode",
      direction: 1,
    };

    this.rootScope.fullLoadingShow = true;

    this.basic.packager(this.dataService.getSalesAndInventoryDataByStore(param, true), res => {
      this.rootScope.fullLoadingShow = false;

      this.searchData = res.data.details;
      this.initData = angular.copy(this.searchData);
      this.chart_bar_supply = this.buildChartDataSupply(res.data.details, this.term);

      setTimeout(() => {
        this.chart_bar_supply = this.chartServ.appendGraphic(this.chart_bar_supply, this.chartBack);
      }, 150);

    });

  }

  compare(property) {
    return function (obj1, obj2) {
      let value1 = obj1[property];
      let value2 = obj2[property];
      return value1 - value2;     // 升序
    }
  }

  lineChartBuild(d, f, store) {
    let xData = [];
    const mDate = [];
    let value1 = [];
    let value2 = [];
    let value3 = [];
    let value4 = [];
    let value5 = [];
    let legends = [];
    let values = [value1, value2, value3, value4, value5];

    // 取日期参数
    for (let data in d) {
      let date = data.toString().length > 6 ? moment(data, 'YYYYMMDD').format('YYYY/MM/DD') : moment(data, 'YYYYMMDD').format('YYYY/MM');
      mDate.push(data);
      xData.push(date);
    }

    const option = f.option;

    mDate.forEach(v => {
      d[Number(v)].forEach((val, i) => {
        if (store[0].code === val.storeCode) {
          value1.push(val[option]);
          legends[0] = val.storeName;
        }
        if (store.length < 2) return;
        if (store[1].code === val.storeCode) {
          value2.push(val[option]);
          legends[1] = val.storeName;
        }
        if (store.length < 3) return;
        if (store[2].code === val.storeCode) {
          value3.push(val[option]);
          legends[2] = val.storeName;
        }
        if (store.length < 4) return;
        if (store[3].code === val.storeCode) {
          value4.push(val[option]);
          legends[3] = val.storeName;
        }
        if (store.length < 5) return;
        if (store[4].code === val.storeCode) {
          value5.push(val[option]);
          legends[4] = val.storeName;
        }
      })
    });

    return this.setLineChart(values, legends, xData, f);
  }

  tooltipFormatter(selectValue, value) {
    let result = value;

    if (selectValue[0].formatStyle == `sale`) {
      result = (result * 10000).toFixed(2);
    } else if (selectValue[0].formatStyle == `number`) {
      result = this.FigureService.number(value, false, true, 2);
    } else if (selectValue[0].formatStyle == `percent`) {
      result = this.FigureService.scale(value, true, false);
    } else if (selectValue[0].formatStyle == `area`) {
      result = value;
    } else if (selectValue[0].formatStyle == `flowCnt`) {
      result = this.FigureService.number(value, false, true, false);
    } else if (selectValue[0].formatStyle == `flowAmount`) {
      result = this.FigureService.number(value, false, true, 2);
    }
    return result + selectValue[0].unit;
  }

  axisFormatter(selectValue, value) {
    let result = value;

    if (selectValue[0].formatStyle == `sale`) {
      // result = this.FigureService.number(value / 10000, false, false, 2);
      // result = result.toFixed(2);
    } else if (selectValue[0].formatStyle == `percent`) {
      result = this.FigureService.scale(value, true, false);
    } else if (selectValue[0].formatStyle == `number`) {
      result = this.FigureService.number(value, false, true, 2);
    } else if (selectValue[0].formatStyle == `flowCnt`) {
      result = this.FigureService.number(value, false, true, false);
    } else if (selectValue[0].formatStyle == `area`) {
      result = value;
    } else if (selectValue[0].formatStyle == `flowAmount`) {
      result = this.FigureService.number(value, false, true, 2);
    }

    return result;
  }

  /**
   * chart设定
   * @param values
   * @param name
   * @param f
   * @param key
   */
  setChart(values, name, f, key) {
    key = key || {};

    let selectXValue = this.selectX.filter(i => {
      return i.option == f[0]
    });

    let selectYValue = this.selectY.filter(i => {
      return i.option == f[1]
    });

    let selectBubbleValue = [];
    if (f.length == 3) {
      selectBubbleValue = this.selectBubble.filter(i => {
        return i.option == f[2]
      });
    }

    const current = values.map(s => s[2]);
    _.remove(current, r => _.isUndefined(r));

    let maxDataBubble = !f[2] ? 0 : Math.max(...current);

    const data = values.map((s, i) => {
      if (selectXValue[0].formatStyle === 'sale')
        s[0] = s[0] / 10000;

      if (selectYValue[0].formatStyle === 'sale')
        s[1] = s[1] / 10000;

      return {name: i, value: s, itemStyle: {normal: this.BasicColor.normal}};
    });

    const option = {
      color: "#2A80D8",
      grid: {left: '3%', right: '5%', bottom: '1%', containLabel: true},
      tooltip: {
        trigger: 'item',
        textStyle: {align: 'left'},
        formatter: (param) => {
          let response = "", result = "", store = "";

          let value1 = this.tooltipFormatter(selectXValue, param.value[0]);
          let value2 = this.tooltipFormatter(selectYValue, param.value[1]);
          let value3 = this.tooltipFormatter(selectBubbleValue, param.value[2]);

          param.value[3].split(",").forEach(s => store += `${param.marker + s}<br />`);

          result = store + name[0] + '：' + value1 + '</br>' + name[1] + '：' + value2;

          if (name[2].includes(`无`)) {
            response += result;
          } else {
            response += result + '</br>' + name[2] + '：' + value3;
          }

          return response;
        },
        // axisPointer: this.axis.other.axisPointer
      },
      toolbox: {
        z: 11,
        right: '25px',
        feature: {
          dataZoom: {}
        }
      },
      legend: {
        left: 'right',
        textStyle: {fontSize: 12, fontFamily: 'SimSun'},
        padding: [0, 30, 0, 0],
        data: ''
      },

      xAxis: Object.assign({
        name: selectXValue[0].axisUnit,
        type: 'value',
        splitNumber: 10,
        axisLabel: Object.assign({
          formatter: (data) => {
            return this.axisFormatter(selectXValue, data);
          }
        }, this.axis.other.axisLabel),
      }, this.axis.basic),

      yAxis: Object.assign({
        name: selectYValue[0].axisUnit,
        type: 'value',
        axisLabel: Object.assign({
          formatter: (data) => {
            return this.axisFormatter(selectYValue, data);
          }
        }, this.axis.other.axisLabel),
      }, this.axis.basic),

      series: [
        {
          z: 11,
          name: '门店对比',
          type: 'scatter',
          data: data,
          symbolSize: function (data) {
            if (Number.isNaN(maxDataBubble) || !maxDataBubble) {
              return 10;
            }
            let bubbleScale = (data[2] / maxDataBubble) * 50;
            return bubbleScale >= 5 ? bubbleScale : 5;
          }
        }
      ]
    };

    if (!data.length) delete option.toolbox;
    return Object.assign({xAxisNoWrap: true}, option);
  }


  /**
   * chart容器大小发生变化时触发 需要重新计算graphic的位置
   * @param chart
   */
  resizeContainer(chart) {
    this.chartServ.resizeChart(chart, this.chartBack);
  }

  // 折线图
  setLineChart(values, legends, xDate, field) {

    let currentFieldKey;
    const currentField = this.CommonCon.storeNorm.find(s => s.id === this.supTrendTypeNorm.id);
    if (currentField) currentFieldKey = this.fieldInfo[currentField.option];

    const name = field.name;
    let yAxisName = (name.indexOf(`额`) > 0 && name.indexOf(`幅`) < 0) ? `万元` :
      (name.indexOf(`幅`) > 0 || name.indexOf(`率`) > 0) ? `%` :
        (name.indexOf(`天`) > 0 && name.indexOf(`幅`) < 0) ? `天` :
          name.indexOf(`面积`) > 0 && name.indexOf(`额`) < 0 ? `㎡` : ``;

    const option = {
      xAxisNoWrap: true,
      color: ['#007ADB', '#26C08C', '#FFC467', '#EA5B66', '#A948CC'],
      tooltip: {
        trigger: 'axis',
        textStyle: {align: 'left'},
        formatter: (a) => {
          let date = a[0]['name'] + '&nbsp;' + '&nbsp;' + '&nbsp;' + name + '</br>';

          return date + a.map(s => {
            let value = this.FigureService.number(s['value'], false, true);

            if (field.sale)
              value = this.FigureService.number((s['value'] * 10000), false, true) + '元';

            if (field.scale)
              value = this.FigureService.scale(s['value'], true, true);

            return s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + value + '</br>';
          }).join('');
        }
      },
      legend: {
        left: 'center',
        textStyle: {fontSize: 12, fontFamily: 'SimSun'},
        padding: [0, 30, 0, 0],
        data: legends
      },
      grid: {left: '60px', top: '50px', right: '40px', bottom: '30px'},

      xAxis: Object.assign({
        data: xDate,
        type: 'category',
        axisPointer: {type: 'shadow'},
        axisLabel: {color: '#404040', fontSize: 11, fontFamily: 'Arial'},
      }, this.axis.basic),

      yAxis: [
        Object.assign({
          name: yAxisName,
          type: 'value',
          axisLabel: Object.assign({
            formatter: (data) => {
              let forData = data;

              if (field.scale) {
                forData = (data * 100).toFixed(0)
              }
              return forData;
            }
          }, this.axis.other.axisLabel),
          splitArea: {show: true, interval: 1, areaStyle: {color: ['rgba(0,122,219,0.03)', '#fff']}}
        }, this.axis.basic),

        Object.assign({
          show: true,
          name: '',
          type: 'value',
          position: 'left',
          axisLabel: Object.assign({
            formatter: (data) => {
              let forData = data;

              if (field.scale) {
                forData = (data * 100).toFixed(0)
              }
              return forData;
            }
          }, this.axis.other.axisLabel),
        }, this.axis.basic)
      ],
      // 数据内容数组
      series: (() => {
        let series = [];
        if (values === '') return series;
        if (values === 'undefined') return series;

        values.forEach((s, i) => {
          if (field.sale) {
            s.forEach((c, i) => s[i] = c / 10000);
          }

          let item = {
            type: 'line',
            yAxisIndex: 1,
            showAllSymbol: 'true',
            name: legends[i],
            lineStyle: {normal: {width: 4}},
            data: s
          };

          item.label = {
            normal: {
              show: this.showLineLabel,
                position: [10, -15],
                fontSize: 11,
                formatter: (p) => {
                const isScale = currentFieldKey.scale;
                return isScale
                  ? this.FigureService.scale(p.value, true, true)
                  : this.FigureService.thousand(p.value, 0);
              }
            }
          };

          series.push(item);
        });

        return series
      })()
    };

    return option;
  }

  buildColumn() {
    const fix = [
      '_id',
      {
        code: 'storeCode',
        class: 'text-left'
      },
      {
        code: 'storeName',
        title: '门店',
        class: 'text-left',
        render: (data) => {
          return `<span>${data}</span>`;
        }
      },

      {
        code: "retailAmount",
        title: "零售额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: "operateSizeRetailAmount",
        title: "单位经营面积" + "</br>" + "零售额",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "retailAmountYoY",
        title: "零售销售额" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "retailUnit",
        title: "零售数",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "retailUnitYoY",
        title: "零售销售数" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
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
          return `<span title="${title}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "allProfitYoY",
        title: "毛利额" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'allProfitRate',
        title: "毛利率",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'flowCnt',
        title: "客单数",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true, false);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'flowCntYoY',
        title: "客单数" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'retailFlowAmount',
        title: "零售客单价",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'retailFlowAmountYoY',
        title: "零售客单价" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'stockCost',
        title: "日均库存金额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'stockCostYoY',
        title: "日均库存金额" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'distributionCostDay',
        title: "日均经销成本",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'distributionCostDayYoY',
        title: "日均经销成本" + "</br>" + "同比增幅",
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'saleDays',
        title: "经销周转天数",
        render: (data) => {
          let formatData = _.isUndefined(data) ? '∞' : this.FigureService.number(data, false, true);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'saleDaysYoYInc',
        title: "经销周转天数" + "</br>" + "同比增长",
        render: (data) => {
          let style = `color: ${_.isNumber(data) ? data < 0 ? 'green' : 'red' : ''}`;
          let formatData = this.FigureService.number(data, false, true);
          return `<span style="${style}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
      {
        code: 'operateSize',
        title: "经营门店面积",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right',
      },
    ];

    this.column = this.tableService.fixedColumn(fix);

  }

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

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
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


angular
  .module(
    "hs.synthesizeAnalyze"
  ).controller(
  "storeContrastCtrl"
  ,
  storeContrastController
)
;
