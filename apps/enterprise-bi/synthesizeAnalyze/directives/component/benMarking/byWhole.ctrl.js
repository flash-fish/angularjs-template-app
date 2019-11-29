class byWholeController{
  constructor($rootScope, $sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService,indexCompleteService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.rootScope = $rootScope;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.indexService = indexCompleteService;


    // 初始化请求 field
    this.requestField = [];

    this.init_Data = [];
    this.init_Key = {storeName: ['对标对象1','对标对象2' ]};

    // 经销|联营 - 零售|批发 转换
    this.init_Tans = [
      {id: 1, name: '经销/联营', active: true},
      {id: 2, name: '零售/批发', active: false},
      {id: 3, name: '全部', active: false}
    ];
    this.models_Tans = this.init_Tans[0].id;

  }

  init(){
    // 初始化雷达图显示
    this.radarChart = this.setRadarChartData(this.init_Data,this.init_Key);

    // field 指标监听
    this.scope.$watch('ctrl.field',(newVal, oldVal) => {
      if(!newVal) return;
      this.requestField = newVal;
    });

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', (newVal, oldVal) => {
      if(!newVal || !newVal.firstStore || !newVal.secondStore) return;

      this.rootScope.fullLoadingShow = true;
      // ajax 门店请求限制
      this.com = angular.copy(newVal);

      // 将param里面的数据映射到页面条件上
      this.rootScope.$broadcast(this.CommonCon.session_key.sessionParam, this.com);

      this.AjaxPost();
      this.PieAjaxRequest();
      this.allAmountAjaxRequest();
      this.allAmountListen();
    });
  };

  // 经销联营-批发零售 切换监听函数
  allAmountListen(){
    this.scope.$watch('ctrl.models_Tans', (newVal,oldVal) => {
      if(_.isEqual(newVal,oldVal)) return;

      this.init_PieSelect = newVal;

      this.PieAjaxRequest(this.init_PieSelect);
    })
  }


  /**
   * RARDA chart ajax 请求
   */
  AjaxPost(){
    this.key = {
      param: this.tool.getParam(this.com,this.requestField.radar),
      special: {
        pageId: this.CommonCon.page.page_new_categoryContrast
      },
      skuParams:this.tool.getParam(this.com,this.requestField.skuParam),
    };

    let param = this.tool.buildParam(this.key.param, this.key.special);
    this.DeleteParam(param);

    let skuParams = this.tool.buildParam(this.key.skuParams, this.key.special);
    this.DeleteParam(skuParams);

    // SKU单独请求
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummaryStorecompare(skuParams),res => {
        this.sku_Data = angular.copy(res.data);


        this.functionYoy(this.sku_Data);

        this.saleSkuCount = this.FigureService.thousand(this.sku_Data.saleSkuCount);
        this.compareSaleSkuCount = this.FigureService.thousand(this.sku_Data.compareSaleSkuCount);

        this.scope.saleSkuCountYoY = {"color": this.T_C(res.data.saleSkuCountYoY)};
        this.scope.compareSaleSkuCountYoY = {"color": this.T_C(res.data.compareSaleSkuCountYoY)};

    });

    this.basic.packager(this.dataService.getSalesAndInventoryDataSummaryStorecompare(param),res => {
      this.rootScope.fullLoadingShow = true;
      if(res){
        this.rootScope.fullLoadingShow = false;
        this.init_Data = angular.copy(res.data);
        // 万元 tans
        this.retailAmount = this.F_Amount(this.init_Data.retailAmount);
        this.a_retail = this.FigureService.thousand(this.init_Data.retailAmount);
        this.scope.retailAmountYoY = {"color": this.T_C(this.init_Data.retailAmountYoY)};
        this.scope.compareRetailAmountYoY = {"color": this.T_C(this.init_Data.compareRetailAmountYoY)};

        this.compareRetailAmount = this.F_Amount(this.init_Data.compareRetailAmount);
        this.a_CompareRetail = this.FigureService.thousand(this.init_Data.compareRetailAmount);

        this.allAmount = this.F_Amount(this.init_Data.allAmount);
        this.a_allAmount = this.FigureService.thousand(this.init_Data.allAmount);
        this.compareAllAmount = this.F_Amount(this.init_Data.compareAllAmount);
        this.a_CompareAllAmount = this.FigureService.thousand(this.init_Data.compareAllAmount);

        this.scope.allAmountYoY = {"color": this.T_C(this.init_Data.allAmountYoY)};
        this.scope.compareAllAmountYoY = {"color": this.T_C(this.init_Data.compareAllAmountYoY)};

        this.allProfit = this.F_Amount(this.init_Data.allProfit);
        this.a_allBuss = this.FigureService.thousand(this.init_Data.allProfit);
        this.compareAllProfit = this.F_Amount(this.init_Data.compareAllProfit);
        this.a_compareAbuss = this.FigureService.thousand(this.init_Data.compareAllProfit);

        this.scope.operateSizeAllAmountYoY = {"color": this.T_C(this.init_Data.operateSizeAllAmountYoY)};
        this.scope.compareOperateSizeAllAmountYoY = {"color": this.T_C(this.init_Data.compareOperateSizeAllAmountYoY)};

        this.channelRealAmount = this.F_Amount(this.init_Data.storeChannelSettleAmount);
        this.a_channelRealAmount = this.FigureService.thousand(this.init_Data.storeChannelSettleAmount);
        this.compareStoreChannelSettleAmount = this.F_Amount(this.init_Data.compareStoreChannelSettleAmount);
        this.a_compareStoreChannelSettleAmount = this.FigureService.thousand(this.init_Data.compareStoreChannelSettleAmount);

        this.scope.allProfitYoY = {"color": this.T_C(this.init_Data.allProfitYoY)};
        this.scope.compareAllProfitYoY = {"color": this.T_C(this.init_Data.compareAllProfitYoY)};

        // 毛利率
        this.allProfitRate = this.FigureService.scale(this.init_Data.allProfitRate,true,true);
        this.allProfitRateYoYInc = this.FigureService.scale(this.init_Data.allProfitRateYoYInc,true,false);
        this.scope.allProfitRateYoYInc = {"color": this.T_C(this.init_Data.allProfitRateYoYInc)};

        this.compareAllProfitRate = this.FigureService.scale(this.init_Data.compareAllProfitRate,true,true);
        this.compareAllProfitRateYoYInc = this.FigureService.scale(this.init_Data.compareAllProfitRateYoYInc,true,false);
        this.scope.compareAllProfitRateYoYInc = {"color": this.T_C(this.init_Data.compareAllProfitRateYoYInc)};

        // 正常转换
        /*this.useSizeAllAmount = this.FigureService.thousand(this.init_Data.useSizeAllAmount);
        this.compareUseSizeAllAmount = this.FigureService.thousand(this.init_Data.compareUseSizeAllAmount);*/

        this.operateSizeAllAmount = this.FigureService.thousand(this.init_Data.operateSizeAllAmount);
        this.compareOperateSizeAllAmount = this.FigureService.thousand(this.init_Data.compareOperateSizeAllAmount);

        this.scope.operateSizeAllProfitYoY = {"color": this.T_C(this.init_Data.operateSizeAllProfitYoY)};
        this.scope.compareOperateSizeAllProfitYoY = {"color": this.T_C(this.init_Data.compareOperateSizeAllProfitYoY)};

        this.operateSizeAllProfit = this.FigureService.thousand(this.init_Data.operateSizeAllProfit);
        this.compareOperateSizeAllProfit = this.FigureService.thousand(this.init_Data.compareOperateSizeAllProfit);

        this.flowCnt = this.FigureService.thousand(this.init_Data.flowCnt,0);
        this.compareFlowCnt = this.FigureService.thousand(this.init_Data.compareFlowCnt,0);
        this.scope.flowCntYoY = {"color": this.T_C(this.init_Data.flowCntYoY)};
        this.scope.compareFlowCntYoY = {"color": this.T_C(this.init_Data.compareFlowCntYoY)};

        this.retailFlowAmount = this.FigureService.thousand(this.init_Data.retailFlowAmount);
        this.compareRetailFlowAmount = this.FigureService.thousand(this.init_Data.compareRetailFlowAmount);
        this.scope.retailFlowAmountYoY = {"color": this.T_C(this.init_Data.retailFlowAmountYoY)};
        this.scope.compareRetailFlowAmountYoY = {"color": this.T_C(this.init_Data.compareRetailFlowAmountYoY)};

        this.saleDays = this.FigureService.thousand(this.init_Data.saleDays);
        this.saleDaysYoYInc = this.FigureService.thousand(this.init_Data.saleDaysYoYInc);
        this.scope.saleDaysYoYInc = {"color": this.T_C(this.init_Data.saleDaysYoYInc)};

        this.compareSaleDays = this.FigureService.thousand(this.init_Data.compareSaleDays);
        this.compareSaleDaysYoYInc = this.FigureService.thousand(this.init_Data.compareSaleDaysYoYInc);
        this.scope.compareSaleDaysYoYInc = {"color": this.T_C(this.init_Data.compareSaleDaysYoYInc)};

        this.scope.storeChannelSettleAmountYoY = {"color": this.T_C(this.init_Data.storeChannelSettleAmountYoY)};
        this.scope.compareStoreChannelSettleAmountYoY = {"color": this.T_C(this.init_Data.compareStoreChannelSettleAmountYoY)};
        // 百分号 trans
        this.functionYoy(this.init_Data);

        let chart_key = {
          storeName: [
            this.com.firstStore ? this.com.firstStore : '对标对象1',
            this.com.secondStore ? this.com.secondStore : '对标对象2'
          ],
        };
        // Radar 图渲染
        this.firstStore = chart_key.storeName[0];
        this.secondStore = chart_key.storeName[1];
        this.radarChart = this.setRadarChartData(this.init_Data, chart_key);
      }

    });

  }

  // 颜色判断
  T_C(value) {
    let Color;
    Color = _.isNumber(value) ? value < 0 ? 'green' : 'red' : '';
    return Color;
  }

  // 经销-联营-零售-批发 接口请求
  PieAjaxRequest(status)
  {
    let init_Status =  _.isUndefined(status) ? 1 : status;
    // 饼图渲染
    this.pie = {
      param: this.tool.getParam(this.com,this.requestField.pieOne),
      special: { pageId: this.CommonCon.page.page_new_categoryContrast }
    };
    this.pieAll = {
      param: this.tool.getParam(this.com,this.requestField.pieAll),
      special: { pageId: this.CommonCon.page.page_new_categoryContrast }
    };
    let [
      All_Render_Data, data_Pie_One, data_Pie_Two
    ] = [ { }, { }, { } ];
    const lengendsAr = {
      one:['经销','联营'],
      two:['零售','批发'],
      three:['经销-零售', '经销-批发', '联营-零售', '联营-批发'],
    };
    All_Render_Data.color = ['#007ADB', '#26C08C', '#FFC467', '#FF905C'];
    if(init_Status < 3){
      const pieParam = this.tool.buildParam(this.pie.param, this.pie.special);
      this.DeleteParam(pieParam);
      // 经销-联营-零售-批发
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummaryStorecompare(pieParam), result => {
        this.pie_Result = true;
        // 经销额distributionAmount  联营额 jointAmount 零售额retailAmount  批发额wholeAmount
        // 对比门店 compareDistributionAmount||compareJointAmount||compareRetailAmount||compareWholeAmount
        const data_Pie = result.data;
        if(init_Status === 1){
          data_Pie_One.data = [
            {value:data_Pie.distributionAmount,name:lengendsAr.one[0]},
            {value:data_Pie.jointAmount,name:lengendsAr.one[1]},
          ];
          data_Pie_Two.data = [
            {value:data_Pie.compareDistributionAmount,name:lengendsAr.one[0]},
            {value:data_Pie.compareJointAmount,name:lengendsAr.one[1]},
          ];
          data_Pie_One.legend = lengendsAr.one;
        } else {
          data_Pie_One.data = [
            {value:data_Pie.retailAmount,name:lengendsAr.two[0]},
            {value:data_Pie.wholeAmount,name:lengendsAr.two[1]},
          ];
          data_Pie_Two.data = [
            {value:data_Pie.compareRetailAmount,name:lengendsAr.two[0]},
            {value:data_Pie.compareWholeAmount,name:lengendsAr.two[1]},
          ];
          data_Pie_One.legend = lengendsAr.two;
        }
        All_Render_Data.one_D = data_Pie_One;
        All_Render_Data.two_D = data_Pie_Two;
        this.cakeFirstChartOne = this.SpecialChart(All_Render_Data);
      });
    }else{
      const pieParam = this.tool.buildParam(this.pieAll.param, this.pie.special);
      this.DeleteParam(pieParam);
      this.basic.packager(this.dataService.getSalesAndInventoryDataPercentageStore(pieParam), result => {
        const data_Pie = result.data;
        data_Pie_One.data = [
          {value:data_Pie.retailDistributionAmount,name:lengendsAr.three[0]},
          {value:data_Pie.wholeDistributionAmount,name:lengendsAr.three[1]},
          {value:data_Pie.retailJointAmount,name:lengendsAr.three[2]},
          {value:data_Pie.wholeJointAmount,name:lengendsAr.three[3]},
        ];
        data_Pie_Two.data = [
          {value:data_Pie.compareRetailDistributionAmount,name:lengendsAr.three[0]},
          {value:data_Pie.compareWholeDistributionAmount,name:lengendsAr.three[1]},
          {value:data_Pie.compareRetailJointAmount,name:lengendsAr.three[2]},
          {value:data_Pie.compareWholeJointAmount,name:lengendsAr.three[3]},
        ];
        data_Pie_One.legend = lengendsAr.three;

        All_Render_Data.one_D = data_Pie_One;
        All_Render_Data.two_D = data_Pie_Two;
        this.cakeFirstChartOne = this.SpecialChart(All_Render_Data);
      });
    }
  }

  // 销售额 品类部门占比图
  allAmountAjaxRequest()
  {
    this.Amount = {
      param: this.tool.getParam(this.com,this.requestField.pieAnother),
      special: {
        pageId: this.CommonCon.page.page_new_categoryContrast
      }
    };
    let anotherParam = this.tool.buildParam(this.Amount.param, this.Amount.special);
    this.DeleteParam(anotherParam);

    this.basic.packager(this.dataService.getSalesAndInventoryDataByClassProportion(anotherParam), resAnother => {
      this.pie_Another = true;
      let resAnotherData = resAnother.data;
      let renderData_One = { },renderData_Two = { };
      renderData_One.data = [];
      renderData_One.legend = [];
      renderData_Two.data = [];
      renderData_Two.legend = [];

      $.each(resAnotherData,(a_key,a_value) => {
        _.forIn(a_value,(v,k) => {
          // chart 1 data legend
          renderData_One.data.push({value:v.allAmount,name:v.className});
          renderData_One.legend.push(v.className);
          // chart 2 data legend
          renderData_Two.data.push({value:v.compareAllAmount,name:v.className});
          renderData_Two.legend.push(v.className);
        });
      });
      let All_Render_Data = {};
      All_Render_Data.one_D = renderData_One;
      All_Render_Data.two_D = renderData_Two;
      All_Render_Data.color = ['#007ADB', '#05BC90', '#FFBC00', '#EA5B66', '#CB66B6'];
      //  对小于 10% 的百分比进行判断
      this.cakeSecondChartOne = this.SpecialChart(All_Render_Data);
    });

  }


  // SpecialChart
  SpecialChart(All_Render_Data)
  {
    function pie_Series() {
      let mid_Count = 0;
      return params => {
        let mid_number;
        const [ _oneName, _twoName, f_name ] = [
          ['经销','联营','零售','批发',],
          ['经销-零售', '经销-批发', '联营-零售', '联营-批发'],
          params.name,
        ];
        if( _oneName.includes(f_name) || _twoName.includes(f_name) ) {
          if(params.percent === 100) mid_Count ++;
          if(params.percent === 0 && mid_Count > 0) {
            mid_number = ''
          }else{
            if( _oneName.includes(f_name) ){
              mid_number = `${params.percent}%`;
            }else mid_number =  params.percent < parseInt(10) ? '' : `${params.percent}%`;
          }
        }else mid_number = params.percent < parseInt(10) ? '' : `${params.percent}%`;
        return mid_number;
      }
    }
    let specialChart = {
      color: All_Render_Data.color,
      tooltip : {
        trigger: 'item',
        confine: true,
        formatter:(param)=>{
          let title = param.name.replace(/\s*/g, "") +'<br>';
          let mid_element = this.FigureService.thousand(param.value);
          let value = param.marker + '销售额：' + `${mid_element}元(${param.percent}%)`;
          return title + value;
        },
        textStyle:{ align:'left' },
      },
      legend: { x : 'left',y : 'top',top: '20px', selectedMode:false, data:All_Render_Data.one_D.legend },
      calculable : true,
      series : [
        {
          type:'pie', selectedMode: false, radius : [0, 80],
          label: {
            normal: { position: 'inner', formatter: pie_Series() }
          },
          labelLine: { normal: { show: true } },
          center : ['25%', '61%'],
          data:All_Render_Data.one_D.data
        },
        {
          type:'pie', selectedMode: false, radius : [0, 80],
          label: {
            normal: { position: 'inner', formatter: pie_Series() }
          },
          labelLine: { normal: { show: true } },
          center : ['75%', '61%'],
          data:All_Render_Data.two_D.data
        }
      ]
    };
    return specialChart;
  }


  // 雷达图渲染
  setRadarChartData(data, chart_key) {
    // 判断返回值是否定义
    function Def(pas,flag) {
      let element;
      element =  _.isUndefined(pas) ? flag ? '-' : 0 : pas;
      return element;
    }

    // order 顺序 客单数->客单价->毛利额->销售额->零售额->经销周转天数
    // 零售额 retailAmount | 销售额 allAmount | 毛利额 allProfit
    // 客单数 flowCnt | 零售客单价 retailFlowAmount | 经销周转天数 saleDays
    // 零售额 compareRetailAmount | 销售额 compareAllAmount |毛利额 compareAllProfit
    // 客单数 compareFlowCnt | 零售客单价 compareRetailFlowAmount  | 经销周转天数 compareSaleDays
    let basicOption;

    const [
      flowCnt, retailFlowAmount, allProfit,
      allAmount, retailAmount, saleDays,
      c_FlowCnt, c_RetailFlowAmount, c_AllProfit,
      c_AllAmount, c_RetailAmount, c_SaleDays,
      ] = [
      data.flowCnt, data.retailFlowAmount,
      data.allProfit, data.allAmount,
      data.retailAmount, data.saleDays,
      data.compareFlowCnt, data.compareRetailFlowAmount,
      data.compareAllProfit, data.compareAllAmount,
      data.compareRetailAmount, data.compareSaleDays,
    ];

    // 经销周转率 对比门店作为基准 define tooltip show
    // order 顺序 客单数 ->零售客单价 ->毛利额 ->经销周转天数 -> 零售额-> 销售额;
    function _defineBaseArr() {
      return [
        [
          {name: '客单数', value: [ Def(flowCnt,true), Def(c_FlowCnt,true)] },
          {name: '客单价', value: [ Def(retailFlowAmount,true), Def(c_RetailFlowAmount,true)] },
          {name: '毛利额', value: [ Def(allProfit,true), Def(c_AllProfit,true)] },
          {name: '经销周转率', value: [ Def(saleDays,true), Def(c_SaleDays,true) ] },
          {name: '零售额', value: [ Def(retailAmount,true), Def(c_RetailAmount,true)] },
          {name: '销售额', value: [ Def(allAmount,true), Def(c_AllAmount,true)] },
        ],
        !isFinite(1/Def(c_SaleDays)) ? 1 : 1/Def(c_SaleDays),
      ]
    }
    const [newDate, c_saleRate  ] = _defineBaseArr();

    // 定义经销周转天数为 0 的情况
    const saleRate = this.indexService.distributeDay(c_SaleDays,saleDays);

    // min_mid_Arr 指标1 与指标2 的集合
    const base_Arr = [
      [ Def(flowCnt), Def(c_FlowCnt)],
      [ Def(retailFlowAmount), Def(c_RetailFlowAmount)],
      [ Def(allProfit), Def(c_AllProfit)],
      [ saleRate,c_saleRate],
      [ Def(retailAmount), Def(c_RetailAmount)],
      [ Def(allAmount), Def(c_AllAmount)],
    ];

    const basicKey = {
      conf_name: [
        '客单数', '客单价', '毛利额', '经销周转率', '零售额', '销售额'
      ],
      show_legend:true,
      base_Arr: base_Arr,
      tool_Date: newDate,
      storeName: _.clone(chart_key.storeName),
    };

    basicOption = this.indexService.DefineRadar(basicKey);

    return basicOption;
  }
  /**
   * 万元换算
   */
  F_Amount(data){
    let TransNumber = Math.abs(data) < 50 && Math.abs(data) > 0
      ? this.FigureService.amount(data, 4)
      : this.FigureService.amount(data);
    return TransNumber;
  }

  /**
   * 百分号添加函数封装
   */
  functionYoy(init_data){
    _.forIn(init_data,(value,key)=>{
      if(key.includes('YoY') && !key.includes('YoYInc')){
        init_data[key] = this.FigureService.scale(value,true,true);
      }
    })
  };

  // firstStore secondStore 删除
  DeleteParam(ele) {
    delete ele.condition.firstStore;
    delete ele.condition.secondStore;
    _.forIn(ele.condition,(value,key) => {
      if(key === "compareStoreCode_mid") delete ele.condition.compareStoreCode_mid;
      if(key === "compareStoreGroup_mid") delete ele.condition.compareStoreGroup_mid;
    })
  }

}

angular.module('hs.synthesizeAnalyze').component('byWhole',  {
  templateUrl: 'app/synthesizeAnalyze/directives/component/benMarking/byWhole.tpl.html',
  controller: byWholeController,
  controllerAs: 'ctrl',
  bindings: {
    tab: '<',
    param: '<',
    field: '<',
    keys: '='
  }
});
