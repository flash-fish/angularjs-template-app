class CatNormalController {
  constructor(dataService, DTColumnBuilder, $scope, $compile, $sce, Field, basicService, Common,
              tableService, CommonCon, FigureService, Symbols, toolService, pageService, Pop) {
    this.$sce = $sce;
    this.scope = $scope;
    this.symbol = Symbols;
    this.$compile = $compile;
    this.tool = toolService;
    this.page = pageService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;

    // 初始化dataTable实例
    this.instance = {};

    this.showStock = true;

    this.chartPage = 1;

    // 当前页面所对应的业务类型（分类， 门店。。。）
    this.current = Pop.types.filter(s => s.id === 2)[0];

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 初始化cat type下拉框
    this.initLevelType = this.CommonCon.catLevels;
    this.catType = angular.copy(this.CommonCon.catLevels);
    this.currCatType = this.catType[0].id;

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess);
    this.updatedSession = this.basic.getSession(Common.updatedCondition);

    this.tableCheckAccess = "category";

  }

  init() {
    // 调用接口的方法名字
    this.interfaceName = this.keys.categoryUrl
      ? this.keys.categoryUrl[0]
      : "getCategoryRankingForSale";

    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, 3);

    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {
      delete p.classLevel;

      // 保存查询的条件
      if (p.isSearch_delete || p.isInit_delete || p.isTabChange_delete) {
        delete p.isSearch_delete;
        delete p.isInit_delete;
        delete p.isTabChange_delete;

        this.searchData = angular.copy(p);
      }

      // 动态构建下拉框的列表
      const category = p.category.val;
      const maxLevel = _.last(angular.copy(this.CommonCon.catLevels)).id;
      const session = this.session.category.val;

      this.hideTree = !_.isUndefined(p.hideTree_delete)
        ? p.hideTree_delete
        : category.length !== 1;

      // 当筛选条件没有数据时 level读取this.session里的 否则读取筛选条件的
      const target = this.figure.haveValue(category) ? category : session;
      if (this.figure.haveValue(target)) {
        const level = target.length > 1 || target[0].level == maxLevel
          ? target[0].level
          : parseInt(target[0].level) + 1;

        this.catType = this.CommonCon.catLevels.filter(s => parseInt(s.id) >= level);
      } else
        this.catType = angular.copy(this.CommonCon.catLevels);

      // 初始化cat type下拉框
      if (!p.changeLevel_delete && this.catType[0])
        this.currCatType = this.catType[0].id;

      if (!this.hideTree) {
        this.chartKey = {
          url: "getCategoryParents",
          name: "categoryCode",
          session: angular.copy(this.session.category),
          code: category[0].code,
          level: category[0].level
        };
        this.tool.getTree(this.chartKey, this);
      }

      // 将参数需要的level对象保存到当前scope的currentLevel上
      this.currentLevel = {
        categoryLevel: this.catType.length === 0 ? parseInt(maxLevel) : parseInt(this.currCatType)
      };
    });

    // 监听table指标变动
    this.tool.watchTable(this, (param) => {
      param.categoryLevel = this.currentLevel.categoryLevel;
    });

    // 监听chart指标变动
    this.tool.watchChart(this, (chart, param) => {
      param.categoryLevel = this.currentLevel.categoryLevel;
    });

    // 监听chart排序字段的变化
    this.tool.watchSort(this, (param) => {
      param.categoryLevel = this.currentLevel.categoryLevel;
    });

    // 监听chart分页字段的变化
    this.tool.watchChartPage(this, () => {
      return this.key.param.condition;
    });
  }

  /**
   * 切换层级触发
   */
  changeLevel() {
    this.param = Object.assign({}, this.param, {changeLevel_delete: true});
  }

  /**
   * 初始化表格列信息
   * @param isChange 是否将条件放入session
   */
  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange, this.keys);
    this.buildColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption(param) {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(param, this.field),
      setChart: (d) => this.setChartData(d),
      // setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      addEvent: [
        {name: "click", event: (p, d) => this.addEvent(p, d), func: null},
        {name: "datazoom", event: (p) => this.basic.addZoomEvent(p, this.zoom), func: null}
      ],
      special: {
        pageId: this.keys.pageId
      },

    };
    // 是否有独立接口
    if (this.keys.independentInterFace) {
      this.key.independentInterFace = this.keys.independentInterFace;
    }
    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
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
    this.silentChart = myParam.condition.categoryLevel == _.last(this.CommonCon.catLevels).id
      && details && details.length === 1;

    if (this.silentChart) return null;

    return (param) => {
      if (!param.data.name) return;

      const params = this.tool.buildParam(this.tool.getParam(this.param, []), this.key.special);
      params.condition.category = {
        level: myParam.condition.categoryLevel,
        values: [param.data.name]
      };

      this.basic.checkAccess(params, () => {
        this.chartKey = {
          url: "getCategoryParents",
          name: "categoryCode",
          session: this.updatedSession.category,
          code: param.data.name,
          level: myParam.condition.categoryLevel
        };

        this.tool.commonChartClick(this, param.name, this.CommonCon.categoryClick);
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
    this.chartKey.session = this.updatedSession.category;

    this.tool.commonChartClick(this, name, this.CommonCon.categoryClick, () => {
      // this.scope.$emit(this.CommonCon.classClick, this.updatedSession.classes);
    });
  }

  /**
   * 构建chart所需要的数据
   * @param data
   */
  setChartData(data) {

    // 同个字段不同页面可能会有不同名称, 所以从页面自定义配置进来
    if (this.keys.fieldInfo) {
      _.forIn(this.keys.fieldInfo, (v, k) => {
        let info = this.fieldInfo[v.id];
        if (this.keys.compareTableTitle) info.name = angular.copy(v.name);
      })
    }

    let key = Object.assign({
      silent: this.silentChart,
      adjustOffset: true,
    }, this.tool.basicKey(this.current, this.fieldInfo, data));

    this.tool.getChartOption(key, this);
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
        code: "categoryCode",
        sort: true
      },
      {
        code: "categoryName",
        render: (data, t, f) => {
          if (this.keys.noLink) {
            return data;
          }

          let key = {code: f[this.current.code]};
          // if (!_.isUndefined(key.code)) {
          //   key.level = this.CommonCon.levelMap[key.code.toString().length];
          // }
          if (!_.isUndefined(f.level)) key.level = f.level;

          return this.tool.buildPopover(data, f._id, key, this);
        }
      },

    ];

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, null, this.keys);
  }
}

angular.module('hs.supplier.saleStock').component('catNormal', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/cat/catNormal.tpl.html',
  controller: CatNormalController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
