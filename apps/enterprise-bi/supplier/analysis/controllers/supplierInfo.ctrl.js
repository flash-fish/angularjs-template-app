class SupplierInfoController {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService,
              basicService, Field, toolService, popups, popupDataService, $stateParams, $templateCache, $state, Common, $rootScope, commonRateField) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.commonRateField = commonRateField;
    this.popupData = popupDataService;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;

    this.colorArray = ['#EA5B66', '#FF905C', '#FFC467', '#26C08C', '#007ADB', '#A948CC'];

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

    this.notstartingSku = `${$templateCache.get(`receiveQtyRate.html`)}`;
    this.eliminationRate = `${$templateCache.get(`returnAmountRate.html`)}`;

    // 供应商引入提示框
    this.inOut = `${$templateCache.get(`inOut.html`)}`;
    // 销售异常提示框
    this.abnoAmont = `${$templateCache.get(`abnormalAmount.html`)}`;
    // 毛利异常提示框
    this.abnoPRf = `${$templateCache.get(`abnormalProfit.html`)}`;

    this.fieldInfo = this.basic.buildField(Field.sale);

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
    }, ["classes", "category", "operation", "store", "district"]);

    //是否点击search
    this.chartLoadOne = 1;
    this.chartLoadTwo = 1;
    this.chartLoadThree = 1;
    this.chartLoadFour = 1;
    this.chartLoadFive = 1;
    this.keys = {
      finish: true,
    };

    this.sort = {
      classes: 1,
      category: 2,
      operation: 3,
      store: 4,
      district: 5
    };

  }

  init() {
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));

    //原先这几个label用一个来控制eChart的显示(unitLabel profitLabel amountLabel) => label
    this.label = false;
  }

  start() {

    this.initTemp = [
      {dateCode: '-', receiveQtyRate: '-', dateYoY: '-', receiveQtyRateYoY: '-', curr: '-'},
      {dateCode: '-', receiveQtyRate: '-', date: '月至今'},
      {dateCode: '-', receiveQtyRate: '-', date: '年至今'}
    ];
    this.abnormal = [
      {name: '销售异常供应商数', code: '最近30天', data: '-', prompt: 1},
      {name: '毛利异常供应商数', code: '最近30天', data: '-', prompt: 2},
    ];
    this.supply = [
      {name: '到货率', self: '-', other: '-', tot: '', prompt: 1},
      {name: '未到商品金额(万元)', self: '-', other: '-', tot: '', prompt: 2},
      {name: '退货率', self: '-', other: '-', tot: '', prompt: 3},
      {name: '退货成本(除税)(万元)', self: '-', other: '-', tot: '', prompt: 3}
    ];
    this.lack = [
      {name: '加注缺品SKU数', self: '-', other: '-', tot: ''},
      {name: '平均加注缺品天数', self: '-', other: '-', tot: ''},
      {name: 'A类品加注缺品占比', self: '-', other: '-', tot: ''}
    ];

    this.model_date = this.CommonCon.dateTypeToT[0].id;
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

    this.copyCom = angular.copy(this.com);

    // 处理数据权限
    // this.dataPower(data);




    delete this.com.date;
    this.getDate();

    this.showCondition();
    this.menu = this.basic.getSession(this.common.leftMenu);
    if(this.menu) {
      for (let i = 0; i < this.menu.length; i++) {
        let dic = this.menu[i];
        let array = dic.children;
        for (let j = 0; j < array.length; j++) {
          let child = array[j];
          if (child.resUrl === 'app.supAnalyse.supplierAbnormal') {
            this.abnormalMore = true;
          }else  if (child.resUrl === 'app.supAnalyse.supplierInOut') {
            this.importInforMore = true;
          }else  if (child.resUrl === 'app.supAnalyse.supplierSupply') {
            this.supplyMore = true;
          }else  if (child.resUrl === 'app.supAnalyse.supplierLack') {
            this.lackMore = true;
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
          for (let i = 0; i < this.menu.length; i++) {
            let dic = this.menu[i];
            let array = dic.children;
            for (let j = 0; j < array.length; j++) {
              let child = array[j];
              if (child.resUrl === 'app.supAnalyse.supplierAbnormal') {
                this.abnormalMore = true;
              }else  if (child.resUrl === 'app.supAnalyse.supplierInOut') {
                this.importInforMore = true;
              }else  if (child.resUrl === 'app.supAnalyse.supplierSupply') {
                this.supplyMore = true;
              }else  if (child.resUrl === 'app.supAnalyse.supplierLack') {
                this.lackMore = true;
              }
            }
          }

        }
      });
    }

    // 监听日期变化
    this.scope.$watch('ctrl.model_date', (newVal, oldVal) => {
      if (newVal === oldVal) return;
      this.chartLoadTwo = +1;
      this.getInOutToBar()
    })


  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com = _.pick(com, _.keys(this.sort));
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  getDate() {
    // 获取基准日
    this.basic.packager(this.dataService.getBaseDate(), res => {
      this.baseDay = moment(res.data.baseDate + '', 'YYYY/MM/DD');
      this.baseDate = res.data.baseDate;
      // 获取财务月
      this.basic.packager(this.dataService.getBaseMonth(), res => {

        this.monthStart = res.data.startDate;
        // 页面显示的年至今日期格式
        this.nearYear = '01/01' + '-' + moment(this.baseDay, 'YYYYMMDD').format('MM/DD');
        // 接口需要的年至今日期格式

        this.otherStartYear = moment(this.baseDay, 'YYYYMMDD').format('YYYY') + '/01/01' + '-' + moment(res.data.endDate, 'YYYYMMDD').format('YYYY/MM/DD');

        this.basic.packager(this.dataService.getMonthByDate(this.baseDate), resp => {

          //接口所需要的按月查询的月份01-09
          this.monthDate = moment(this.baseDay, 'YYYYMMDD').format('YYYY') + '/01' + '-' + moment(resp.data.businessMonth, 'YYYYMM').format('YYYY/MM');
          let lastYear = parseInt(moment(this.baseDay, 'YYYYMMDD').format('YYYY')) - 1;
          this.lastMonthDate = lastYear + '01' + '-' + lastYear + moment(resp.data.businessMonth, 'YYYYMM').format('MM');
          this.startYear = this.monthDate;
          this.initTemp[0] = {
            dateCode: moment(this.baseDay, 'YYYYMMDD').format('MM/DD') + '\u00A0' + '\u00A0' + '全天'
          };

          let toMonth = '月至今' + '\u00A0' + '(' + moment(this.monthStart, 'YYYYMMDD').format('MM/DD') +
            '-' + moment(this.baseDay, 'YYYYMMDD').format('MM/DD') + ')';
          this.initTemp[1].dateCode = toMonth;
          this.initTemp[2].dateCode = '年至今' + '\u00A0' + '(' + '01/01' + '-' + moment(this.baseDay, 'YYYYMMDD').format('MM/DD') + ')';

          // 供应商到货趋势
          this.getSupplyData();
          // 供应商异常
          this.getAbnormalData();
          // 供应商引入
          this.getInOutToBar();
          this.getInOutToPie();
          // 供应商供货
          this.getSupply();
          // 供应商加注缺品
          this.getLack();
        });



      });
    });

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
    });

  }

  // 供应商到货趋势数据处理
  getSupplyData() {
    // 财务月至今天的日期
    let bussDay = {date: moment(this.monthStart, 'YYYYMMDD').format('YYYY/MM/DD') + '-' + moment(this.baseDay, 'YYYYMMDD').format('YYYY/MM/DD')};

    let today = this.tool.buildParam(this.tool.getParam(Object.assign(bussDay, angular.copy(this.com)), ['receiveQtyRate']));
    today.sortBy = {
      field: "dateCode",
      direction: 1
    };

    // 获取今天,昨天,月至今,年至今的数据
    this.basic.packager(this.dataService.getSupplyDataByDate(today), res => {
      // 获取昨天日期
      let day1 = new Date(moment(this.baseDay, 'YYYYMMDD').format('YYYY/MM/DD'));
      day1.setDate(day1.getDate() - 1);
      let yesDay = moment(day1).format('YYYY/MM/DD');
      let monthData = res;

      // 获取昨天的数据，存入模板
      this.basic.packager(this.dataService.getSupplyDataByDate(this.tool.buildParam(this.tool.getParam(
        Object.assign({date: yesDay + '-' + yesDay}, angular.copy(this.com)),
        ['receiveQtyRate']))), resp => {
        let lastData = resp.data.details;

        // 把今天的数据存入模板
        let v = monthData.data.details.filter(item => item.dateCode === this.baseDate);
        let lastDay = moment(day1).format('YYYYMMDD');
        let lastWea = lastData.length > 0 ? (lastData[0].weatherInfo ? '[' + lastData[0].weatherInfo + ']' : '') : '';
        let dayYOY = this.tool.calculateSub(lastData.length > 0 ? lastData[0].receiveQtyRate : '-', v.length > 0 ? v[0].receiveQtyRate : '-');


        let weather = v.length > 0 ?  (v[0].weatherInfo ? '[' + v[0].weatherInfo + ']' : '') : '';
        this.initTemp[0] = {
          dateCode: moment(this.baseDay, 'YYYYMMDD').format('MM/DD') + '\u00A0' + weather + '\u00A0' + '全天',
          receiveQtyRate: v.length > 0 ? v[0].receiveQtyRate : '',
          dateYoY: '上周期(' + moment(day1).format('MM/DD') + lastWea + ')',
          curr: dayYOY,
          receiveQtyRateYoY: lastData.length > 0 ? lastData[0].receiveQtyRate : ''
        };
      });

      // 把月至今的数据存入模板
      let toMonth = '月至今' + '\u00A0' + '(' + moment(this.monthStart, 'YYYYMMDD').format('MM/DD') +
        '-' + moment(this.baseDay, 'YYYYMMDD').format('MM/DD') + ')';
      this.initTemp[1].receiveQtyRate = res.data.summary.receiveQtyRate;
    });

    // 获取年至今的信息,存入模板
    let p = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear}, angular.copy(this.com)), ['receiveQtyRate']));
    p.pageId = this.CommonCon.page.page_supplier_info;
    this.basic.packager(this.dataService.getSupplyDataByDate(p), res => {
      this.initTemp[2].receiveQtyRate = res.data.summary.receiveQtyRate;
    });

    // 最近30天日期
    let day = new Date(moment(this.baseDay, 'YYYYMMDD').format('YYYY/MM/DD'));
    day.setDate(day.getDate() - 29);
    let theNearFuture = moment(day).format('YYYY/MM/DD') + '-' + moment(this.baseDay, 'YYYYMMDD').format('YYYY/MM/DD');
    const param = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: theNearFuture}, angular.copy(this.com)), ['receiveQtyRate']));
    param.sortBy = {
      field: "dateCode",
      direction: 1
    };
    param.pageId = this.CommonCon.page.page_supplier_info;
    // 最近三十天的数据,绘制echar图
    this.basic.packager(this.dataService.getSupplyDataByDate(param), res => {
      this.setChartData(res.data.details)
    })
  }

  // 供应商异常->获取数据
  getAbnormalData() {
    // 销售异常参数
    const amountAbnormal = this.tool.buildParam(this.tool.getParam(
      angular.copy(this.com), ['allAmount', 'saleAndProfitSupplierAbnormalCount',]));
    amountAbnormal.pageId = this.CommonCon.page.page_supplier_info;
    // 毛利异常参数
    const profitAbnormal = this.tool.buildParam(this.tool.getParam(
      angular.copy(this.com), ['allProfit', 'saleAndProfitSupplierAbnormalCount',]));
    // 销售异常参数数据
    profitAbnormal.pageId = this.CommonCon.page.page_supplier_info;
    this.basic.packager(this.dataService.getAbnormalSupplierBySales(amountAbnormal), res => {
      this.abnormal[0].data = this.FigureService.isDefine(res.data.summary);
    });
    // 毛利异常参数 数据
    this.basic.packager(this.dataService.getAbnormalSupplierBySales(profitAbnormal), res => {
      this.abnormal[1].data = this.FigureService.isDefine(res.data.summary);
    });
  }

  // 供应商引入->柱状图->获取数据
  getInOutToBar() {
    let thisYear = this.otherStartYear;
    let lastYear;
    let lastOne;

    // 根据选择确定日期范围
    if (this.model_date === 1) {
      let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY')) - 1;
      lastYear = year + '/01/01' + '-' + year + moment(this.baseDay, 'YYYYMMDD').format('MM/DD');
      lastOne = year + '/01/01' + '-' + year + moment(this.baseDay, 'YYYYMMDD').format('MM/DD');
    } else {
      let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY')) - 1;
      lastYear = year + '/01' + '-' + year + '/12';
      lastOne =  year + '/01/01' + '-' + year + '/12/31';
    }

    // 构建第1排，第一个echart图参数
    const thisAllSku = this.tool.buildParam(this.tool.getParam(Object.assign({date: thisYear}, this.com), ''));
    const lastAllSku = this.tool.buildParam(this.tool.getParam(Object.assign({date: lastOne}, this.com), ''));

    thisAllSku.pageId = this.CommonCon.page.page_supplier_info;
    lastAllSku.pageId = this.CommonCon.page.page_supplier_info;
    // 获取供应商数 -> 第 1 排 第 1 个 echart 数据
    this.basic.packager(this.dataService.getPeriodNewSupplierCount(thisAllSku), res => {
      let m = [];
      m[0] = res.data;
      this.basic.packager(this.dataService.getPeriodNewSupplierCount(lastAllSku), res => {
        m[1] = res.data;

        this.setChartSummary(m);
      });
    });

    // 构建第1排，第2，3个echart图参数
    let yearToThis = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY'));
    let yearToLast = yearToThis - 1;
    const thisAmount = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: thisYear, year: yearToThis}, this.com), ['allAmount', 'allProfit']));
    thisAmount.pageId = this.CommonCon.page.page_supplier_info;
    const lastAmount = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: lastYear, year: yearToLast}, this.com), ['allAmount', 'allProfit']));
    lastAmount.pageId = this.CommonCon.page.page_supplier_info;
    // 获取  第 1 排 第 2,3 个 echart 数据
    this.basic.packager(this.dataService.getNewSupplierSalesData(thisAmount), res => {
      let m = [];
      m[0] = res.data.summary;
      this.basic.packager(this.dataService.getNewSupplierSalesData(lastAmount), res => {
        m[1] = res.data.summary;
        this.setChartSummary(m);
      })
    });

  };

  // 供应商引入->饼状图->获取数据
  getInOutToPie() {
    let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY'));
    const param = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear, year: year}, this.com), ''));
    param.pageId = this.CommonCon.page.page_supplier_info;
    this.basic.packager(this.dataService.getNewSupplierStructure(param), res => {
      this.buildChartPieData(res.data.summary, year)
    })
  }

  // 供应商供货-> 获取数据
  getSupply() {

    let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY'));
    let f = ["returnAmountRate", "receiveQtyRate", "nonAmount",];
    let lastYear = year + '/01/01' + '-' + year + moment(this.baseDay, 'YYYYMMDD').format('/MM/DD');
    const paramNear = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear}, this.com), f));
    // 合计部分数据
    paramNear.pageId = this.CommonCon.page.page_supplier_info;
    /*this.basic.packager(this.dataService.getSupplyDataSummary(paramNear), res => {
      let data = res.data.summary;
      this.getLastYearSupply(data)
    });*/

    // 供应商供货信息 - 到货率、退货率获取
    this.getLastYearSupply();

    const paramReceive = this.tool.buildParam(this.tool.getParam(Object.assign({date: this.startYear}, this.com), ['receiveQtyRate']));
    const paramReturn = this.tool.buildParam(this.tool.getParam(Object.assign({date: lastYear}, this.com), ['returnAmountRate']));
    paramReceive.pageId = this.CommonCon.page.page_supplier_info;
    paramReturn.pageId = this.CommonCon.page.page_supplier_info;
    // 饼状图数据
    this.basic.packager(this.dataService.getSupplyDataBySupplierCountProportion(paramReceive), res => {
      const receiveValues = [];
      const legends = [];
      const name = '到货率';
      if(res.data.summary) {
        res.data.summary.receiveCount.forEach(v => {
          receiveValues.push({value: v.count, name: v.countName});
          legends.push(v.countName);
        });
      }
      this.chart_Pie_Receive = this.setChartPieLegendUnder(receiveValues, legends, name);

    });
    this.basic.packager(this.dataService.getSupplyDataBySupplierCountProportion(paramReturn), res => {

      const returnValues = [];
      const legends = [];
      const name = '退货率';
      if(res.data.summary) {
        res.data.summary.returnCount.forEach(v => {
          returnValues.push({value: v.count, name: v.countName});
          legends.push(v.countName);
        });
      }
      this.chart_Pie_Return = this.setChartPieLegendUnder(returnValues, legends, name);
    })
  }

  // 供应商供货信息获取上边合计
  getLastYearSupply(now) {
    let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY'));
    // 供应商指标构建
    // let f = ["returnAmountRate", "receiveQtyRate", "nonAmount","returnAmount"];
    let rateField = angular.copy(this.commonRateField.rateField);

    let lastYear = year + '/01/01' + '-' + year + moment(this.baseDay, 'YYYYMMDD').format('/MM/DD');
    const paramLastNear = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: lastYear}, this.com), rateField));
    paramLastNear.pageId = this.CommonCon.page.page_supplier_info;
    this.basic.packager(this.dataService.getSupplyDataSummary(paramLastNear), res => {
      let data = res.data.summary;
      this.buildSupplySum(data)
    });

  }

  // 供应商加注缺品-> 获取数据
  getLack() {
    let year = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY')) - 1;
    let f = ["stockOutSku", "avgStockOutDays", "stockOutSkuAPct"];
    let lastYear = year + '/01/01' + '-' + year + moment(this.baseDay, 'YYYYMMDD').format('/MM/DD');

    const paramNear = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear}, this.com), f));
    const paramLastNear = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: lastYear}, this.com), f));
    let m;
    let n;
    paramNear.pageId = this.CommonCon.page.page_supplier_info;
    paramLastNear.pageId = this.CommonCon.page.page_supplier_info;
    // 合计部分数据
    this.basic.packager(this.dataService.getStockOutDataBySupplier(paramNear), res => {

      n = res.data.summary;
      if (m) {
        this.buildLackSum(n, m)
      }
    });
    this.basic.packager(this.dataService.getStockOutDataBySupplier(paramLastNear), res => {

      m = res.data.summary;
      if (n) {
        this.buildLackSum(n, m)
      }
    });

    const paramReceive = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear,}, this.com), ["stockOutSku", "avgStockOutDays", "stockOutSkuAPct"]));
    paramReceive.pageId = this.CommonCon.page.page_supplier_info;
    // 饼状图数据
    this.basic.packager(this.dataService.getStockOutDataBySupplierCountProportion(paramReceive), res => {
      // 供应商缺货信息echart
      const stockValues = [];
      const stocklegends = [];
      const stockName = '加注缺品SKU数';
      if (res.data.summary) {
        res.data.summary.stockOutSkuCount.forEach(v => {
          stockValues.push({value: v.count, name: v.countName});
          stocklegends.push(v.countName);
        });
      }
      // 供应商平均缺货天数echart
      const avgDayValues = [];
      const avgDaylegends = [];
      const avgDayName = '平均缺货天数';
      if (res.data.summary) {
        res.data.summary.avgStockOutDaysCount.forEach(v => {
          avgDayValues.push({value: v.count, name: v.countName});
          avgDaylegends.push(v.countName);
        });
      }

      // 供应商A类加注缺品占比echart
      const AValues = [];
      const Alegends = [];
      const AName = 'A类品加注缺品占比';
      if (res.data.summary) {
        res.data.summary.stockOutSkuAPctCount.forEach(v => {
          AValues.push({value: v.count, name: v.countName});
          Alegends.push(v.countName);
        });
      }


      this.chart_Pie_out = this.setChartPieLegendUnder(stockValues, stocklegends, stockName);
      this.chart_Pie_avgDay = this.setChartPieLegendUnder(avgDayValues, avgDaylegends, avgDayName);
      this.chart_Pie_aPrc = this.setChartPieLegendUnder(AValues, Alegends, AName);
    });
  }

  // 第2排，所有echart图->处理数据
  buildChartPieData(d, f) {
    const legends = [f + '年新供应商', f - 1 + '年新供应商', '非新供应商'];
    const nameGPM = '毛利额结构';
    const nameSale = '销售额结构';
    const nameSupplier = '引入年份结构';
    // 毛利结构数据
    const GPMValues = [];
    [d.profit[f], d.profit[f - 1], d.profit.other].forEach((el, i) => {
      GPMValues.push({value: el, name: legends[i]});
    });
    // 销售额结构数据
    const saleValues = [];
    [d.sale[f], d.sale[f - 1], d.sale.other].forEach((el, i) => {
      saleValues.push({value: el, name: legends[i]});
    });
    // 新供应商结构数据
    const supplierValues = [];
    [d.supplier[f], d.supplier[f - 1], d.supplier.other].forEach((el, i) => {
      supplierValues.push({value: el, name: legends[i]});
    });


    this.chart_Pie_Supplier = this.setChartPie(supplierValues, legends, nameSupplier);
    this.chart_Pie_Sale = this.setChartPie(saleValues, legends, nameSale);
    this.chart_Pie_GPM = this.setChartPie(GPMValues, legends, nameGPM);
  }

  // 第一排 第2，3 echart图 ->处理数据
  setChartSummary(d) {
    let yearToThis = Number(moment(this.baseDay, 'YYYYMMDD').format('YYYY'));
    let yearToLast = yearToThis - 1;

    const Legends = this.model_date === 1 ? [yearToThis + '年', yearToLast + '年'] : [yearToThis + '年', yearToLast + '全年'];
    const xData = [''];

    if (typeof d[0] === "object") {
      let m = d.map(v => {
        return v.allAmount;
      });
      let n = d.map(v => {
        return v.allProfit;
      });

      const amountValues = [[m[0]], [m[1]]];
      const GPMValues = [[n[0]], [n[1]]];

      const amountName = '单位' + ':' + '万元';
      const profitName = '单位' + ':' + '万元';

      // const Legends = [yearToThis + '年', yearToLast + '年'];
      const amountKey = ['供应商销售额'];
      const profitKey = ['供应商毛利额'];
      const xData = [''];

      this.chart_bar_Amount = this.setChart(amountValues, Legends, amountName, xData, amountKey, this.label);
      this.chart_bar_GPM = this.setChart(GPMValues, Legends, profitName, xData, profitKey, this.label);
    } else {
      const unitValues = [[d[0]], [d[1]]];
      const unitName = '';
      const key = ['引入供应商数'];
      this.chart_bar_Unit = this.setChart(unitValues, Legends, unitName, xData, key, this.label);
    }
  }

  // 最近30天到货趋势 echart图 ->处理数据
  setChartData(d) {
    const xDate = d.map(v => {
      return moment(v.dateCode, 'YYYYMMDD').format('MM/DD')
    });
    const key = d.map(v => {
      return moment(v.dateCode, 'YYYYMMDD').format('YYYY/MM/DD')
    });
    let value = d.map(v => {
      return v.receiveQtyRate
    });
    const values = [value];
    const legends = ['到货率'];
    const name = '最近30天到货率趋势';

    this.chart_recent = this.setChart(values, legends, name, xDate, key, this.recentLabel);

  }

  // 供应商供货 -> sum部分数据 ->处理数据
  buildSupplySum(data) {
    let supData = {};
    const _Field = angular.copy(this.commonRateField.rateField);
    if(!data){
      _.forEach(_Field, s => supData[s] = null )
    }else supData = angular.copy(data);

    this.supply = [
      {
        name: '到货率',
        self: this.FigureService.scale(supData.receiveQtyRate, true, true),
        other: this.FigureService.scale(supData.receiveQtyRateYoYValue, true, true),
        tot: this.tool.calculateSub(supData.receiveQtyRate, supData.receiveQtyRateYoYValue,),
        prompt: 1,
        count: this.FigureService.scale(supData.receiveQtyRateYoYInc, true, true)
      },
      {
        name: '未到商品金额(万元)',
        self: this.FigureService.number(supData.nonAmount, true, true),
        other: this.FigureService.number(supData.nonAmountYoYValue, true, true),
        tot: this.tool.calculateDiv(supData.nonAmount, supData.nonAmountYoYValue) , prompt: 2,
        currSelf: this.FigureService.number(supData.nonAmount, false, true) + '元',
        currOther: this.FigureService.number(supData.nonAmountYoYValue, false, true) + '元',
        count: this.FigureService.scale(supData.nonAmountYoY, true, true)
      },
      {
        name: '退货率',
        self: this.FigureService.scale(supData.returnAmountRate, true, true),
        other: this.FigureService.scale(supData.returnAmountRateYoYValue, true, true),
        tot: this.tool.calculateSub(supData.returnAmountRate, supData.returnAmountRateYoYValue) ,
        prompt: 3,
        count: this.FigureService.scale(supData.returnAmountRateYoYInc, true, false)
      },
      {
        name: '退货成本(除税)(万元)',
        self: this.FigureService.number(supData.retNet, true, true),
        other: this.FigureService.number(supData.retNetYoYValue, true, true),
        tot: this.tool.calculateDiv(supData.retNet, supData.retNetYoYValue) ,
        prompt: 2,
        currSelf: this.FigureService.number(supData.retNet, false, true) + '元',
        currOther: this.FigureService.number(supData.retNetYoYValue, false, true) + '元',
        count: this.FigureService.scale(supData.retNetYoY, true, true)
      }
    ];

  }

  // 供应商加注缺品 -> sum部分数据 ->处理数据
  buildLackSum(near, last) {

    if (!near) {
      near = {
        stockOutSku : null,
        avgStockOutDays: null,
        stockOutSkuAPct: null,
      }
    };

    if (!last) {
      last = {
        stockOutSku : null,
        avgStockOutDays: null,
        stockOutSkuAPct: null,
      }
    };
    let arr = [near, last];
    const stockOutSku = arr.map(v => {
      return v.stockOutSku;

    });
    const avgStockOutDays = arr.map(v => {
      return v.avgStockOutDays;

    });
    const stockOutSkuAPct = arr.map(v => {
      return v.stockOutSkuAPct;
    });

    this.lack = [
      {
        name: '加注缺品SKU数',
        self: this.FigureService.thousand(stockOutSku[0], 0),
        other: this.FigureService.thousand(stockOutSku[1], 0),
        tot: stockOutSku[0] - stockOutSku[1],
        count: this.FigureService.scale((stockOutSku[0] - stockOutSku[1]) / stockOutSku[1], true, true)
      },
      {
        name: '平均加注缺品天数',
        self: this.FigureService.number(avgStockOutDays[0], false, true),
        other: this.FigureService.number(avgStockOutDays[1], false, true),
        tot: avgStockOutDays[0] - avgStockOutDays[1],
        // currSelf: this.FigureService.number(amount[0], false, true) + '元',
        // currOther: this.FigureService.number(amount[1], false, true) + '元',
        count: this.FigureService.scale((avgStockOutDays[0] - avgStockOutDays[1]) / avgStockOutDays[1], true, true)
      },
      {
        name: 'A类品加注缺品占比',
        self: this.FigureService.scale(stockOutSkuAPct[0], true, true),
        other: this.FigureService.scale(stockOutSkuAPct[1], true, true),
        tot: stockOutSkuAPct[0] - stockOutSkuAPct[1],
        count: this.FigureService.scale(stockOutSkuAPct[0] - stockOutSkuAPct[1], true, false)
      }
    ];
  }


  setChart(values, legends, name, xDate, key, label) {
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
          if (key.length > 2) {
            return a.map(s => {
              let date = key[s['dataIndex']] + '&nbsp;' + '</br>';
              return date + s['marker'] + s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + this.FigureService.scale(s['value'], true, true) + '<br/>';
            }).join('')
          } else {
            let title = key[0] + '&nbsp;' + '</br>';
            return title + a.map(s => {
              let sum = name.includes('万') ? this.FigureService.number(s['value'], false, true) + '元' : this.FigureService.thousand(s['value'], 0) + '家';
              return s['marker'] + s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + sum + '<br/>';
            }).join('')
          }
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
        data: xDate
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
            return name.includes('万') ? this.FigureService.number(a, true, true, 0)  : (name.includes('率') ? a * 100 + '%' : a);
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
                  return _.eq(p.seriesName, "到货率")
                    ? this.FigureService.scale(p.value, true, true)
                    : name.includes('万元') ? this.FigureService.number(p.value, true, true, 0) : this.FigureService.thousand(p.value, 0)
                }
              }
            }
          };
        });
      })()
    };
  }

  setChartPie(arr, legends, name, horizontal, position) {
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
          let value = a.seriesName.includes('额') ? this.FigureService.number(a.value, false, true) + '元' : this.FigureService.thousand(a.value, 0) + '家';
          return title + a.marker + a.name + '：' + value + '(' + a.percent + '%' + ')'
        },
        textStyle: {
          fontSize: 10
        }
      },
      legend: {
        orient: horizontal ? 'horizontal' : 'vertical',
        left: position ? position : 'left',
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

  setChartPieLegendUnder(arr, legends, name, color) {
    return {
      color: color ? color : ['#007ADB', '#26C08C', '#FFC467', '#FF905C', '#EA5B66', '#A948CC'],
      title: {
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (a) => {
          let title = name + "<br/>";
          let value = a.seriesName.includes('额') ? this.FigureService.number(a.value, false, true) + '元' : this.FigureService.thousand(a.value, 0) + '家';
          return title + a.marker + a.name + '：' + value + '(' + a.percent + '%' + ')'
        },
        textStyle: {
          fontSize: 10
        }
      },
      legend: {
        orient: 'horizontal',
        x: 'center',
        data: legends,
        y: '80%',
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
          labelLine:{
            normal:{
              length:3
            }
          },
          type: 'pie',
          radius: '52%',
          center: ['50%', '40%'],
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
  jump(type, index) {

    if (type === 'abornormal') {
      let condition = angular.copy(this.copyCom);
      this.basic.setSession('fromSupplierToAbnormal', true);
      this.basic.setSession(this.common.condition, condition);
      if (index) this.basic.setSession("fromSupplierToAbnormalIndex", index);
      this.$state.go("app.supAnalyse.supplierAbnormal");
    }else if (type === 'import'){
      let condition = angular.copy(this.copyCom);
      condition.date = this.monthDate;
      this.basic.setSession('fromInforToInOut', true);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.supAnalyse.supplierInOut");
    }else if (type === 'supply'){
      let condition = angular.copy(this.copyCom);
      condition.date = this.monthDate;
      this.basic.setSession('fromInforToSupply', true);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.supAnalyse.supplierSupply");
    }else {
      let condition = angular.copy(this.copyCom);
      condition.date = this.monthDate;
      this.basic.setSession('fromInforToLack', true);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.supAnalyse.supplierLack");

    }

  }


  /*@ param search*/
  search() {

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.basic.setLocal(this.common.local.topCondition, this.com);

    this.chartLoadOne += 1;
    this.chartLoadTwo += 1;
    this.chartLoadThree += 1;
    this.chartLoadFour += 1;
    this.chartLoadFive += 1;
    this.copyCom = angular.copy(this.com);
    this.start();
    this.getDate();

    this.showCondition();
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

angular.module("hs.supplier.adviser").controller("supplierInfoCtrl", SupplierInfoController);
