class supplierQuadrantController {
  constructor($rootScope, CommonCon, Field, toolService, basicService, popups,
              tableService, $scope, popupDataService, Common, FigureService,
              dataService, QuaConst, supplierService, $window) {
    this.Field = Field;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.root = $rootScope;
    this.$window = $window;
    this.tool = toolService;
    this.quaconst = QuaConst;
    this.basic = basicService;
    this.table = tableService;
    this.commonCon = CommonCon;
    this.figure = FigureService;
    this.suppier = supplierService;
    this.dataService = dataService;
    this.popupData = popupDataService;

    this.instance = {};
    // 日期控件配置 | 只显示月
    this.dateOption = {
      onlyShowCustom: "month",
    };

    // 保存共通条件的地方
    this.com = Object.assign(
      {date: "", comparableStores: false, limit: null}, CommonCon.commonPro
    );

    // 表格接口请求 | (按品类组-象限)
    this.interfaceName = 'getQuadrantSummaryWithDetails';

    // 初始化品类组选项
    this.Marks = QuaConst.init_Marks;
    this.s_mark = 1;

    // 页面标识
    this.page_name = CommonCon.page.page_supplier_quadrant;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 初始化页面指标配置
    this.fieldInfo = Object.assign({}, Field.sale, Field.quadrant);

    // 初始化cat type下拉框
    this.initLevelType = CommonCon.classLevels;
    this.catType = angular.copy(CommonCon.classLevels);
    this.currCatType = this.catType[0].id;

    // 树状图固定列配置 quadrantName '维度' | className '品类组'
    this.confFix = [
      [{code: "quadrantName", width: 190}],
      [{code: "className", width: 190}]
    ];

    // 显示列表排序
    this.sort = {
      date: 1,
      classes: 2,
    };

    // 配置
    this.conf = {
      paramShow: ["district"],
      isSubMenu: true
    };

    this.field = {};
  }

  init() {
    // 树形配置
    this.config = {
      root: "details",
      headerWrap: true,
      other: { icon: true },
      pageId: this.page_name,
      minWidth: 220,
      sort: false,
      supQuadrants: true,
      broadClasses: 'BROAD_CLASSES',
      cateLevelConf: 'CATE_LEVEL_CONF', // 品类组下拉参数定义
      supClaCode: 'SUP_CLA_CODE', // 树节点表头点击参数定义
      emitClaCondition: 'EMIT_CLA_CONDITION', // 品类组 | 时间映射到树
      interfaceOne: 'getSupplierInfoByIds',

    };

    // 定义表格 fix 指标
    this.config.fix = this.confFix[0];

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 异步中需要处理的数据
    this.keys = {
      finish: false,
    };

    this.back = {};
    this.tool.watchBack(this);

    // 监听条件的变动
    this.tool.watchParam(this, p => {
      delete p.categoryLevel;

      // 保存查询的条件
      if (p.isSearch_delete || p.isInit_delete || p.isTabChange_delete) {
        delete p.isSearch_delete;
        delete p.isInit_delete;
        delete p.isTabChange_delete;
        this.searchData = angular.copy(p);
      }

      // 动态构建下拉框的列表
      const category = p.classes.val;
      const sessionClasses = this.session.classes.val;
      const maxLevel = _.last(angular.copy(this.commonCon.classLevels)).id;

      this.hideTree = !_.isUndefined(p.hideTree_delete)
        ? p.hideTree_delete
        : category.length !== 1;

      if (this.figure.haveValue(category)) {
        const level = category.length > 1 || category[0].level == maxLevel
          ? category[0].level
          : parseInt(category[0].level) + 1;
        this.catType = this.commonCon.classLevels.filter(s => parseInt(s.id) >= level);
      } else {
        const haveClasses = this.figure.haveValue(sessionClasses);
        this.catType = haveClasses
          ? this.commonCon.classLevels.filter(s => parseInt(s.id) >= sessionClasses[0].level)
          : angular.copy(this.commonCon.classLevels);
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

      // 树形数据函数封装
      this.getData();

      // 品类组|时间 条件映射树结构
      this.EmitClass(p);
    });

    // 监听订阅的事件
    this.suppier.onEvent(this, this.conf);
  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, { });
    this.com = angular.copy(this.accessCom);

    // 该用户对应的数据权限
    this.session = this.basic.getSession(this.common.conditionAccess, false);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 数据权限是营运的时候 link 不可点击
    this.config.jobAccessConf = this.job === 'store';

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 过滤页面请求条件
    let _access = _.clone(this.com);
    _.forIn(this.accessCom, (v,k) => {
      if( k !== 'classes' && k!== 'date') delete _access[k]
    });

    // 初始化赋值请求数据
    this.com = angular.copy(_access);

    this.initColumn();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.param = angular.copy(this.com);


      // 功能函数
      this.otherMethod()
    });
  }


  // 重构表格列
  initColumn() {
    this.column = this.suppier.buildFirstColumn(this.quaconst.fTable, this.fieldInfo);
  }

  // 构建表格数据
  buildOption(param) {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(param, this.quaconst.fTable),
      setChart: (d) => this.setChartData(d),
      special: { pageId: this.page_name },
      addSum: 'quadrantName'
    };

    this.option = this.table
      .fromSource(this.tool.getData(this.key, this.back), {
        fixed: 2,
        noPage: true,
        pageLength: 100,
        row: this.rowCallback()
      });
  }


  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        if(!rowData.supplierIds) return;
        const supplierId = rowData.supplierIds;

        let emitParam = {};
        emitParam.quaDateEmitInfo = this.param.date;
        emitParam.clasInfo = this.param.classes;
        emitParam.emitIndefication = 'supQuadrantTable';
        emitParam.supplierId = supplierId;

        // 存 session 当前象限数据的供应商数
        this.basic.setSession(this.common.supplierIDCondition, emitParam);

        let urls = window.document.location.href;
        urls = urls.replace("sup_quadrant", "sup_profit");

        let a = $('<a href="'+urls+'" target="_blank"></a>')[0];
        let e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        a.dispatchEvent(e);

      });
    };
  }

  // 雷达图请求
  setChartData(data){
    this.quadrantPieChart =  this.suppier.firChartOption(data);
  }

  // 品类组
  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }


  // 查询按钮
  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.param = this.tool.commonQuery(this.com, () => {
    }, {noSetParam: true});

    this.EmitClass(this.param);

    // 显示搜索条件
    this.showCondition();
  }

  // 树形数据接口请求
  getData(){
    //  (按品类组-象限) | (按象限-品类组)
    const [ firFace, seFace ] = [
      'getFourQuadrantDataByClass', 'getFourQuadrantDataByQuadrant'
    ];

    // 全屏loading
    this.root.fullLoadingShow = true;

    const page_id = { pageId: this.page_name };

    let Interface;

    // 判断tab 调用不同接口 | 固定列区分
    if(this.s_mark === 1){
      Interface = firFace;
      this.config.fix = this.confFix[1];
    } else {
      Interface = seFace;
      this.config.fix = this.confFix[0];
    }

    let hsParam = Object.assign({}, this.param, this.currentLevel ? this.currentLevel : {});

    let param = this.tool.buildParam(
      this.tool.getParam(hsParam, this.quaconst.fTable), page_id
    );

    this.basic.packager(this.dataService[Interface](param), res => {
      let data = res.data.details;

      // 遍历树 添加展开收起的属性
      const tree = {
        select: this.param.classes.val,
        code: 'classCode'
      };

      data.forEach(s => this.tool.loopTree(...[tree, [s], []]));

      this.tableTree = {
        data: data,
        field: this.quaconst.fTable
      };

      this.root.fullLoadingShow = false;
    });
  }

  // checkbox显示详情
  showCondition(){
    let com = angular.copy(this.param);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  /**
   * 切换层级触发
   */
  changeLevel() {
    // 下拉框状态映射
    this.scope.$broadcast(this.config.cateLevelConf, this.currCatType);
    this.param = Object.assign({}, this.param, {changeLevel_delete: true});
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
    this.tool.commonChartClick(this, name, this.commonCon.classClick);
  }

  // 方法
  otherMethod(){
    this.scope.$broadcast(this.config.broadClasses, 1)
    // tab切换监听
    this.scope.$watch('ctrl.s_mark', (n,o) => {
      if(!n || n === o) return;

      // tab切换赋值
      this.s_mark = n;

      this.getData();

      // 选项条件映射
      this.scope.$broadcast(this.config.broadClasses, n)
    });

    // checkbox勾选搜索条件显示
    this.showCondition();

    //  节点树表头击监听
    this.scope.$on(this.config.supClaCode, (e,d) => {
      const [codes, names] = [d.code, d.name];

      const page_id = { pageId: this.page_name };

      let hsParam = Object.assign({}, this.param, this.currentLevel ? this.currentLevel : {});

      let params = this.tool.buildParam(
        this.tool.getParam(hsParam, this.quaconst.fTable), page_id
      );

      const levelName = this.commonCon.classLevelCodeMap[String(codes).length];

      if (levelName) {
        params.condition.classes = {[levelName]: [codes]};
      }

      this.basic.checkAccess(params, () => {
        this.chartKey = {
          url: "getClassParents",
          name: "classCode",
          session: this.session.classes,
          code: codes,
          level: params.condition.classLevel
        };
        this.tool.commonChartClick(this, names, this.commonCon.classClick);
      });
    });



    // 监听下拉框值
    this.scope.$watch('ctrl.currCatType', (n,o) => {
      if(!n && n === o) return;
      // 下拉框状态映射
      this.scope.$broadcast(this.config.cateLevelConf, n);
    });


    this.scope.$on('treeClickClass', (e,d) => {
    })

  }


  // 映射当前页面date
  EmitClass(pam){
    const broadInfo = pam || {};
    this.scope.$broadcast(this.config.emitClaCondition,{
      date: broadInfo.date,
    })
  }



}

angular.module("hs.supplier.adviser").controller("supplierQuadrantCtrl", supplierQuadrantController);
