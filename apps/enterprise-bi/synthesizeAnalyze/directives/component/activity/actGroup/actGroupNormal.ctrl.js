class actGroupNormalController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService,
              tableService, CommonCon, toolService, pageService, Pop, Common,
              FigureService, $compile, indexCompleteService) {
    this.Field = Field;
    this.scope = $scope;
    this.tool = toolService;
    this.page = pageService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.indexService = indexCompleteService;

    // 初始化dataTable实例
    this.instance = {};

    this.showStock = true;

    this.chartPage = 1;

    // 调用接口的方法名字
    // this.interfaceName = "getClassRankingForSale";

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 4)[0];

    // 所有指标的对照关系
    // this.fieldInfo = this.basic.buildField(Field.sale);

    // 所有指标的对照关系 -- 自定义指标合并公共指标
    let mid_info = this.indexService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.basic.buildField(mid_info);

    this.dateInfo = Object.assign(this.Field.common,this.Field.activityDate);



    // 初始化cat type下拉框
    this.initLevelType = this.CommonCon.classLevels;
    this.catType = angular.copy(CommonCon.classLevels);
    this.currCatType = this.catType[0].id;

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess, false);

    this.tableCheckAccess = "classes";
  }

  init() {

    // 调用接口的方法名字
    this.interfaceName = this.keys.catGroupUrl
      ? this.keys.catGroupUrl[0]
      : "getCategoryRankingForSale";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 2);

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {

      // 初始化column 判断是否有对比日期
      this.initColumn(true,p);

      // 保存查询的条件
      if (p.isSearch_delete || p.isInit_delete || p.isTabChange_delete) {
        delete p.isSearch_delete;
        delete p.isInit_delete;
        delete p.isTabChange_delete;

        this.searchData = angular.copy(p);
      }

      // 根据是否勾选日期构建chart 数据
      let mid_field = _.clone(this.field.chart);
      this.field.chart = this.indexService.DateCheck(p,mid_field);

      // 动态构建下拉框的列表
      const category = p.classes.val;
      const sessionClasses = this.session.classes.val;
      const maxLevel = _.last(angular.copy(this.CommonCon.classLevels)).id;

      this.hideTree = !_.isUndefined(p.hideTree_delete)
        ? p.hideTree_delete
        : category.length !== 1;

      if (this.figure.haveValue(category)) {
        const level = category.length > 1 || category[0].level == maxLevel
          ? category[0].level
          : parseInt(category[0].level) + 1;
        this.catType = this.CommonCon.classLevels.filter(s => parseInt(s.id) >= level);

      } else {
        const haveClasses = this.figure.haveValue(sessionClasses);

        this.catType = haveClasses
          ? this.CommonCon.classLevels.filter(s => parseInt(s.id) >= sessionClasses[0].level)
          : angular.copy(this.CommonCon.classLevels);
      }


      // 初始化cat type下拉框
      if (!p.changeLevel_delete && this.catType[0])
        this.currCatType = this.catType[0].id;

      if (!this.hideTree) {
        this.chartKey = {
          url: "getClassParents",
          name: "classCode",
          session: this.session.classes,
          code: category[0].code,
          level: category[0].level
        };
        this.tool.getTree(this.chartKey, this);
      }

      // 将参数需要的level对象保存到当前scope的currentLevel上
      this.currentLevel = {
        classLevel: this.catType.length === 0 ? parseInt(maxLevel) : parseInt(this.currCatType)
      };
    });

    // 监听table指标变动
    this.tool.watchTable(this, (param) => {
      param.classLevel = this.currentLevel.classLevel;
    });

    // 监听chart指标变动
    this.tool.watchChart(this, (chart, param) => {

      if(this.noInit){
        // 根据是否勾选日期构建chart 数据
        if(!param.dateY) this.indexService.structureChart(this.field);
      }

      // 活动分析未来日
      this.indexService.ToTChart(this);

      param.classLevel = this.currentLevel.classLevel;
    });

    // 监听chart排序字段的变化
    this.tool.watchSort(this, (param) => {
      param.classLevel = this.currentLevel.classLevel;
    });

    // 监听chart分页字段的变化
    this.tool.watchChartPage(this, () => {
      return this.key.param;
    });
  }

  // 重构列结构
  initColumn(isChange,n_param) {
    this.tool.changeCol(this.field, null, this.keys, f => {
      if(this.keys.actCompare && n_param){
        // 重构列 YoYValue YoYInc
        this.indexService.newColumn(this,f,n_param);
      }
    });

    this.buildColumn();
  }


  /**
   * 构建表格数据
   */
  buildOption(param) {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(param, this.field),
      setChart: (d, s) => this.setChartData(d, s),
      // setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      addEvent: [
        {name: "click", event: (p, d) => this.addEvent(p, d), func: null},
        {name: "datazoom", event: (p) => this.basic.addZoomEvent(p, this.zoom), func: null}
      ],
      special: {
        pageId: this.keys.pageId
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back, this.keys), {
        sort: 3,
        fixed: 3,
        start: (this.chartPage - 1) * 10,
        compileBody: this.scope,
        compileFixColumn: true
      });
  }

  /**
   * chart 添加点击事件
   * @param myParam
   * @returns {function(*)}
   */
  addEvent(myParam, details) {
    this.silentChart = myParam.condition.classLevel == _.last(this.CommonCon.classLevels).id
      && details && details.length === 1;

    if (this.silentChart) return null;

    return (param) => {
      if (!param.data.name) return;

      const params = this.tool.buildParam(this.tool.getParam(this.param, []), this.key.special);

      const levelName = this.CommonCon.classLevelCodeMap[String(param.data.name).length];
      if (levelName) {
        params.condition.classes = {[levelName]: [param.data.name]};
      }

      this.basic.checkAccess(params, () => {
        this.chartKey = {
          url: "getClassParents",
          name: "classCode",
          session: this.session.classes,
          code: param.data.name,
          level: myParam.condition.classLevel
        };

        this.tool.commonChartClick(this, param.name, this.CommonCon.classClick);
      });
    }
  }

  /**
   * 面包屑绑定的事件
   * @param code
   * @param level
   * @param name
   */
  getParent(code, level, name) {
    this.chartKey.code = code;
    this.chartKey.level = level;
    this.chartKey.session = this.session.classes;

    this.tool.commonChartClick(this, name, this.CommonCon.classClick);
  }

  /**
   * 切换层级触发
   */
  changeLevel() {
    this.param = Object.assign({}, this.param, {changeLevel_delete: true});
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data, summary) {
    let key = Object.assign(
      {
        adjustOffset: true,
        silent: this.silentChart,
        compared: { haveCompare: true},
        compareDate: { dataY: this.param.dateY },
        chartInfo : {
          InFo: this.keys.chartInfo,
        },
      },
      this.tool.basicKey(this.current, this.fieldInfo, data)
    );

    // 活动分析未来日
    this.indexService.ToTTrans(this);

    this.tool.getChartOption(key, this, summary);
    // 图表联动
    this.basic.connectChart();
  }

  /**
   * 构建dataTable的column
   */
  buildColumn() {
    this.fix = [
      "_id",
      {
        code: "classCode",
        sort: true
      },
      {
        code: "className",
        render: (data, t, f) => {
          if (this.keys.noLink) {
            return data;
          }
          let key = {code: f[this.current.code]};
          if (!_.isUndefined(f.level)) key.level = f.level;
          return this.tool.buildPopover(data, f._id, key, this);
        }
      },

    ];

    // 活动分析页面ToT重构
    this.indexService.ToTTrans(this);

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, this.keys);
  }
}



angular.module('hs.synthesizeAnalyze').component('actGroupNormal', {
  templateUrl: 'app/synthesizeAnalyze/directives/component/activity/actGroup/actGroupNormal.tpl.html',
  controller: actGroupNormalController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
