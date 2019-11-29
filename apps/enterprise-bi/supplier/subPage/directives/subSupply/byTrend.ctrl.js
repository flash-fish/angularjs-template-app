class supplyByTrendCtrl {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder,
              FigureService, basicService, Field, toolService, $rootScope, chartService) {
    this.scope = $scope;
    this.root = $rootScope;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.chartService = chartService;

    this.interfaceName = 'getSupplyDataByDate';

    this.supType = [
      {id: '1', name: '到货指标'},
      {id: '2', name: '退货指标'},
    ];
    this.supTrendType = this.supType[0].id;

    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.common);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);
  }

  init() {
    // 初始化Column
    this.initColumn();

    // 监听共通条件的变动
    this.watchParam();
  }

  watchParam() {
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

      if (newVal.special && newVal.special.noClickSearch) {
        newVal.special.noClickSearch = false;
        return;
      }

      // 初始化面包屑
      if (newVal.isSearch_delete) {
        this.crumb = [newVal.date];
        newVal.isSearch_delete = false;
      }

      if (this.noInit) {
        this.loadChart = !this.loadChart;

        // 点击查询时将条件保存到session
        this.basic.setSession(this.CommonCon.session_key.hsParam, newVal);
        this.basic.setSession(this.CommonCon.session_key.apiOrder, true);

        const table = angular.element('.dataTables_scrollBody .hs-table');
        table.DataTable().order([0, 'asc']).draw();
      } else
        this.buildOption();
    });

    this.scope.$watch('ctrl.supTrendType', (newVal, oldVal) => {
      if (newVal === oldVal) return;

      this.loadChart = !this.loadChart;
      this.chartBuild(newVal);
    });

  }

  initColumn() {
    this.buildColumn();
  }

  buildColumn() {
    const fix = [
      {
        code: "dateCode",
        render: (data, other, full) => {
          let formatData = data === '整体合计'
            ? data
            : data.toString().length > 6
              ? moment(data, 'YYYYMMDD').format('YYYY/MM/DD')
              : moment(data, 'YYYYMMDD').format('YYYY/MM');

          if (data.toString().length < 7) return formatData;

          let title = `杭州天气：${this.FigureService.changeNull(full.weatherInfo)}`;
          return `<span title="${title}" class="hs-trend-weather">${formatData}</span>`;
        },
        sort: true
      },
      {
        code: "receiveQtyRate",
        title: `<span title="实到商品数/应到商品数"><i class="glyphicon glyphicon-info-sign"></i>到货率</span>`,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "nonAmount",
        title: "未到商品金额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "avgDays",
        title: "平均早到天数",
        render: (data) => {
          let formatData = this.FigureService.scaleOther(data, false);
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "returnAmountRate",
        title: `<span title="退货成本(除税)/实到商品金额(除税)"><i class="glyphicon glyphicon-info-sign"></i>退货率</span>`,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "returnAmount",
        title: "退货成本(除税)(万元)",
        render: (data) => {
          let detail = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${detail}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
    ];

    this.column = this.tableService.fixedColumn(fix);
  }

  chartBuild(d) {
    // 将param里面的数据映射到页面条件上
    this.root.$broadcast(this.CommonCon.session_key.sessionParam, this.param);

    let param = angular.copy(this.param);
    let f = d === '2' ? ["returnAmountRate"] : ["returnAmountRate", "receiveQtyRate", "nonAmount", "avgDays"];

    param = this.tool.buildParam(this.tool.getParam(param, f));
    param.sortBy = {
      field: "dateCode",
      direction: 1
    };
    this.basic.packager(this.dataService.getSupplyDataByDate(param, true), res => {
      this.sale = this.buildChartDataSupply(res.data.details);
    });

  }

  /**
   * 构建表格数据
   */
  buildOption() {

    let f = ["returnAmountRate", "receiveQtyRate", "nonAmount", "avgDays"];

    this.key = {
      trend: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, f),
      addSum: 'dateCode',
      setSum: s => this.sum = s,
      setChart: (d) => this.sale = this.buildChartDataSupply(d),
      addEvent: [
        {name: "click", event: (p) => this.addEvent(p), func: null},
        {name: "datazoom", event: (p) => this.chartService.addZoomEvent(this), func: null}
      ]
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {sort: 0, pageLength: 100});

    // 初始化面包屑
    this.crumb = [this.param.date];
  }

  addEvent(myParam) {
    const key = {
      com: this.param,
      scope: this.scope,
      myParam
    };

    this.chartService.dataZoomOffAll(true);

    return this.tool.addDateEvent(key, this.crumb, () => {
      return this.crumb;
    });
  }

  /**
   * 供货echart数据处理
   * @param d
   * @returns {{color, tooltip, legend, grid, xAxis, yAxis, series}|*}
   */
  buildChartDataSupply(d) {
    if (d === null) return this.setChart('', '', '', '');

    const xData = d.map(s => s.dateCode.toString().length > 7
      ? moment(s.dateCode, 'YYYYMMDD').format('YYYY/MM/DD')
      : moment(s.dateCode, 'YYYYMMDD').format('YYYY/MM'));

    const date1 = this.param.date.split("-")[0];
    const dateLength = date1.length;

    if (this.supTrendType === '2') {
      const lastYear = d.map(s => this.FigureService.number(s.returnAmount, true));
      const thisYear = d.map(s => this.FigureService.scale(s.returnAmountRate, true));

      const values = [lastYear, thisYear];
      const legends = ['退货成本(除税)', '退货率'];

      this.sale =  this.setChart(d, values, legends, xData, dateLength);

    } else {
      //当前指标的数据集合
      const lastYear = d.map(s => this.FigureService.number(s.nonAmount, true));
      const thisYear = d.map(s => this.FigureService.scale(s.receiveQtyRate, true));

      // 传给chart的系列数据
      const values = [lastYear, thisYear];
      const legends = ['未到商品金额', '到货率'];

      this.sale = this.setChart(d, values, legends, xData, dateLength);
    }
    setTimeout(() => {
      this.chartService.appendRectAndRegisterEvent(this.sale);
    }, 1000);

    return this.sale;
  }

  /**
   * 供货echart设定
   * @param values
   * @param legends
   * @param xDate
   * @param length
   */
  setChart(datas, values, legends, xDate, length) {
    const nameTextStyle = {fontSize: 11, fontFamily: 'Arial', color: '#071220'};
    const axisLineAndTick = {lineStyle: {color: '#ECECEC', width: 1}};
    const axisLabel = {color: '#404040', interval: 1, fontSize: 11, fontFamily: 'Arial'};

    const dateFormat = length > 7 ? "MM/DD" : "YYYY/MM";
    const silent = this.tool.isSilentChart(this.param.date);
    const dates = this.param.date.split('-');
    const toolbox = {
      right: -3,
      top: -7,
      show: dates[0] !== dates[1] && dates[0].length !== 7,
      feature: {
        dataZoom: {
          title: {back: ''},
          icon: {
            zoom: 'path://M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1',
            back: 'path://0,0,0,0'
          }
        }
      }
    };
    return {
      xAxisNoWrap: true,
      adjustOffset: true,
      toolbox,
      color: ['#2A80D8', '#78BF57'],
      tooltip: {
        trigger: 'axis',
        formatter: (a) => {
          let field = a[0]['name'].replace(/\s*/g,"");
          if (length > 7) {
            const curr = datas.filter(s => s.dateCode == field.replace(/\//g, ""))[0];
            field = `${field} (杭州天气: ${this.FigureService.changeNull(curr.weatherInfo)})`;
          }

          let date = field + '&nbsp;' + '</br>';
          return date + a.map(s => {
            let m = '';

            if (['到货率', '退货率'].includes(s.seriesName)) {
              m = `${s.value}%`;
            } else
              m = this.FigureService.number(s['value'] * 10000, false, true) + '元';

            return s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + m + '</br>';
          }).join('');
        }
      },
      legend: {
        left: 'center',
        width: '60%',
        textStyle: {fontSize: 11, fontFamily: 'Arial'},
        padding: [3, 30, 0, 0],
        data: legends
      },
      grid: {
        left: '10px', top: '70px', right: '20px', bottom: '65px', containLabel: true
      },
      // dataZoom: [
      //   {show: true},
      //   {
      //     type: 'inside',
      //     bottom: 30,
      //     backgroundColor: 'rgba(142, 174, 195, 0)'
      //   }
      // ],
      xAxis: {
        type: 'category',
        axisTick: Object.assign({interval: 0, alignWithLabel: true}, axisLineAndTick),
        axisLine: axisLineAndTick,
        axisPointer: {type: 'shadow'},
        data: xDate,
        axisLabel: {
          color: '#071220', fontSize: 11,
          formatter: (p) => {
            return moment(p, "YYYY/MM/DD").format(dateFormat);
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          // name: `${legends[0]}(万元)`,
          name: '柱状图(万元)',
          nameTextStyle: nameTextStyle,
          axisTick: axisLineAndTick,
          axisLine: Object.assign({show: legends[1]}, axisLineAndTick),
          axisLabel: axisLabel,
          splitLine: {show: false},
          splitArea: {show: true, interval: 1, areaStyle: {color: ['#f9f9f9', '#fff']}},
          position: 'right',
        },
        {
          show: true,
          type: 'value',
          // name: legends.length === 2 ? legends[1] : legends[0],
          name: '折线图',
          nameTextStyle: nameTextStyle,
          axisTick: axisLineAndTick,
          axisLine: axisLineAndTick,
          axisLabel: Object.assign({formatter: (a) => {return `${a}%`}}, axisLabel),
          position: 'left',
          splitLine: {show: false}
        }
      ],
      // 数据内容数组
      series: (() => {
        if (!values) return [];

        const barScale = values.length > 1 ? '33%' : '50%';
        let series = [];

        values.forEach((s, i) => {
          let item = {};
          ['到货率', '退货率'].includes(legends[i])
            ? item = {
              type: 'line',
              yAxisIndex: 1,
              showAllSymbol: 'true',
              lineStyle: {normal: {width: 4}},
              label: {
                normal: {
                  show: this.showLineLabel,
                  position: [10, -15],
                  fontSize: 11,
                  formatter: (p) => {
                    return this.FigureService.addPercent(p.value);
                  }
                }
              }
            }
            : item = {
              type: 'bar',
              barGap: '0%',
              barCategoryGap: barScale,
              label: {
                normal: {
                  show: this.showBarLabel,
                  position: [0, -14],
                  fontSize: 11,
                  formatter: (p) => {
                    return this.FigureService.thousand(p.value, 0);
                  }
                }
              }
            };
          series.push(Object.assign({}, item, {silent, name: legends[i], data: s}));
        });

        return series;
      })()
    };
  }

}

angular.module('hs.supplier.saleStock').component('supplyByTrend', {
  templateUrl: 'app/supplier/subPage/directives/subSupply/byTrend.tpl.html',
  controller: supplyByTrendCtrl,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '=',
    tab: '=',
  }
});
