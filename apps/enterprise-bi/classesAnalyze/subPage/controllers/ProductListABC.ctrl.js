class ProductListABCCtrl {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, basicService, $scope, $stateParams, $rootScope,
              dataService, Field, tableService, ABCAnalyzeSub, abcService) {
    this.Pop = Pop;
    this.Table = Table;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.Field = Field;
    this.root = $rootScope;
    this.tool = toolService;
    this.tableService = tableService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.abcService = abcService;
    this.dataService = dataService;
    this.popupData = popupDataService;

    //接口名称
    this.interfaceName = 'getDataByAllProduct';
    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);

    //newSelectList
    this.newProductLists = [];

    this.newProductYear = null;

    this.fieldInfo = this.Field.abc;

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "category", "brand", "product"]);

    //
    this.scope.$watch('ctrl.totalVal', (newVal) => {
      if (newVal) {
        this.upChangeNum(true)
      }
    });
    this.scope.$watch('ctrl.avglVal', (newVal) => {
      if (newVal) {
        // this.isShowWarning=false;
        this.upChangeNum(false)
      }
    });
    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.productListABC);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_ABC_PROJECT;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.instance = {};

    this.isShowWarning = true;
    //年变化时 设置月
    this.scope.$watch('ctrl.activeYear', newVal => {
      if (_.isUndefined(newVal)) return;
      // 初始化时候的处理

      let time = this.basic.getSession('ABCTime');
      //切换年份时判断是否有当前选中月，有的话月份不变，否则月份为列表中最后一个；
      if (newVal == this.years[0].id) {
        this.months = this.abcService.buildMonthSelect(time.data.year, time.data.monthValue);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id;
      } else {
        this.months = this.abcService.buildMonthSelect(time.data.year);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id
      }
    });

    this.endTime = null;

    //abc选择下拉框配置
    this.precondition = {
      abc: [],
      layStoreCnt: {
        lower: null,
        upper: null,
      }
    }
    this.totalList = [
      {name: '全部', id: 0},
      {name: 'A', id: 1},
      {name: 'B', id: 2},
      {name: 'C', id: 3}
    ]
    this.totalVal = 0;
    this.avglVal = 0;

    //门店数范围部分modal
    this.startNum = null;
    this.endNum = null;
    this.key = {
      active: 1,
      finish: false
    };
    this.key.finish = false;
    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);
    this.allCondition = '';
    this.totalTitle = '';
    this.avglTitle = '';


    this.scope.$watch('ctrl.totalVal', newVal => {
      if (newVal != 0) {
        this.totalList.forEach(i => {
          if (i.id == newVal) this.totalTile = `整体评分[${i.name}]`;
        })
      } else {
        this.totalTile = '';
      }
    });

    this.scope.$watch('ctrl.avglVal', newVal => {
      if (newVal != 0) {
        this.totalList.forEach(i => {
          if (i.id == newVal) this.avgTile = `平均评分[${i.name}]`;
        })
      } else {
        this.avgTile = ''
      }
    });

    this.copytotalVal = '';
    this.copyavglVal = '';
    this.copystartNum = '';
    this.copyendNum = '';
    this.copyactiveYear = '';
    this.copyactiveMonth = '';
    this.copyprecondition = '';
    this.copycom = '';
    this.com.newProductYear = '';

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      brand: 4,
      newProductYear: 5,
      product: 6,
    };

  }

  init() {

    //获取时间
    let time = this.basic.getSession('ABCTime');
    if (time) {
      this.endTime = time.data;
      this.setMonth(time.data);
      //年变化时 设置月
      // 获取用户权限后初始化页面
      this.tool.getAccess((d) => this.initialize(d));
      this.newProductLists = [
        {id: '', name: '全部'},
        {id: this.years[0].name, name: this.years[0].name},
        {id: this.years[0].name - 1, name: this.years[0].name - 1},
        {id: 1, name: '旧品'}
      ];
    } else {
      this.dataService.getDateCode().then(res => {
        this.basic.setSession('ABCTime', res);
        this.endTime = res.data;
        this.setMonth(res.data);
        //年变化时 设置月
        // 获取用户权限后初始化页面
        this.tool.getAccess((d) => this.initialize(d));
        this.newProductLists = [
          {id: null, name: '全部'},
          {id: this.years[0].name, name: this.years[0].name},
          {id: this.years[0].name - 1, name: this.years[0].name - 1},
          {id: 1, name: '旧品'}
        ];
      });
    }
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);
  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.copytotalVal = angular.copy(this.totalVal);
    this.copyavglVal = angular.copy(this.avglVal);
    this.copystartNum = angular.copy(this.startNum);
    this.copyendNum = angular.copy(this.endNum);
    this.copyactiveYear = angular.copy(this.activeYear);
    this.copyactiveMonth = angular.copy(this.activeMonth);
    this.copyprecondition = angular.copy(this.precondition);
    this.copycom = angular.copy(this.com);
    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    this.initColumn();

    this.isFinish = true;
    this.buildOption();

    this.showCondition();
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);


  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.field.newTable.forEach((i, index) => {
      if (i.includes('arrivalRate') && i.includes('YoY') && !i.includes('Value')) {
        let newItem = i;
        this.field.newTable[index] = newItem + 'Inc';
      }

    });
    this.buildColumn();
  }

  /**
   * 点击查询
   */
  search() {
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.com.date = angular.copy(this.activeMonth);
    //totalVal
    //avglVal
    //startNum
    //endNum
    //activeYear
    //activeMonth
    //precondition
    this.copytotalVal = angular.copy(this.totalVal);
    this.copyavglVal = angular.copy(this.avglVal);
    this.copystartNum = angular.copy(this.startNum);
    this.copyendNum = angular.copy(this.endNum);
    this.copyactiveYear = angular.copy(this.activeYear);
    this.copyactiveMonth = angular.copy(this.activeMonth);
    this.copyprecondition = angular.copy(this.precondition);
    this.copycom = angular.copy(this.com);
    this.key.param = this.tool.getParam(this.copycom, this.field);
    this.instance.reloadData();
    this.showCondition();
  }

  showCondition() {
    let com = angular.copy(this.copycom);
    const other = {
      newProductYear: {name: '新品'}
    };
    com.newProductYear ?
      com.newProductYear = this.newProductLists.find(n => n.id === com.newProductYear).name
      : delete com.newProductYear;
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  //构建option
  buildOption() {
    this.key = {
      isAbc: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copycom, this.field),
      setSum: (s) => this.getSum(s),
      appendParam: (p) => this.appendParam(p),
      special: {
        pageId: 'page_category_productABC'
      }
    };
    this.options = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      sort: 5,
      fixed: 2,
      pageLength: 100,
      compileBody: this.scope
    });
  }

  //清除abc选择部分筛选条件
  clearCondition() {
    this.startNum = null;
    this.endNum = null;
    this.totalVal = 0;
    this.avglVal = 0;
    delete this.precondition;
    this.allCondition = '';
    this.search()
  }

  //请求参数添加
  appendParam(param) {
    this.key.finish = true;
    this.com = angular.copy(this.copycom);
    this.activeYear = angular.copy(this.copyactiveYear);
    this.activeMonth = angular.copy(this.copyactiveMonth);
    this.precondition = angular.copy(this.copyprecondition);
    if (this.precondition) {
      if (this.precondition.abc.length != 0) param.condition.precondition = this.precondition;

      if (Number(this.startNum) && Number(this.startNum) > 0 && Number(this.endNum) && Number(this.endNum) <= 200) {
        this.precondition.layStoreCnt = this.precondition.layStoreCnt ? this.precondition.layStoreCnt : {};
        this.precondition.layStoreCnt.lower = Number(this.startNum);
        this.precondition.layStoreCnt.upper = Number(this.endNum) + 1;
      }

      if (this.startNum) param.condition.precondition = this.precondition;
      if (this.endNum) param.condition.precondition = this.precondition;
    }
  }

  getSum(summary) {
    this.sum = this.field.newTable.map(s => {
      const info = this.fieldInfo[s];
      return {
        name: info.name,
        data: summary[s],
        hoverData: summary[s]
      }
    })
  }

  buildColumn() {
    this.fix = [
      '_id',
      {
        code: 'productName',
        render: (data, type, f) => {
          if (data) {
            return `[${f.productCode}][${f.productName}]`;
          } else {
            return '-'
          }
        }
      },
      'spec',
      'goodsDate',
      {
        code: 'categoryCode4Name',
        render: (data, t, f) => {
          if (data) {
            return `[${f.categoryCode4}] [${f.categoryCode4Name}]`;
          } else {
            return '-'
          }

        }
      },
    ];
    this.columns = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, this.fieldInfo, {headerSilent: true});
  }

  /**
   * 根据年份设置月份下拉内容
   */
  setMonth(data) {
    this.years = this.tool.buildYearSelect(data.year - 1, data.year);
    this.activeYear = data.year;
    const nowMonth = data.monthValue; //month
    if (this.activeYear === data.year) {
      this.months = this.abcService.buildMonthSelect(data.year, nowMonth);
    } else {
      this.months = this.abcService.buildMonthSelect(data.year);
    }
    this.activeMonth = _.last(this.months).id;
    this.com.date = angular.copy(this.activeMonth);
  }

  changeNum(Num, isStart) {
    if (!Num && isStart) {
      this.startNum = null;
      return
    } else if (!Num && !isStart) {
      this.endNum = null;
    }
    Num = Num && 0 < Num && Num <= 200 ? Num : Num > 200 ? 200 : 0;
    if (!Num) Num = 0;
    let flag = 0 <= Number(this.startNum) && Number(this.startNum) <= Number(this.endNum) && Number(this.endNum) <= 200;
    this.isShowWarning = !flag;
  }

  upChangeNum(active) {
    if (active && this.startNum) {
      if (this.startNum.length == 1) {
        this.startNum = this.startNum.replace(/[^0-9]/g, 0)
      } else {
        this.startNum = this.startNum.replace(/[^0-9]/g, '')
      }
    } else if (!active && this.endNum) {
      if (this.endNum.length == 1) {
        this.endNum = this.endNum.replace(/[^0-9]/g, 0)
      } else {
        this.endNum = this.endNum.replace(/[^0-9]/g, '')
      }
    }
    if (!this.endNum && !this.startNum && (this.totalVal || this.avglVal)) {
      this.isShowWarning = false;
    }

  }

  /**
   * ABC选择弹窗 配置好所选择信息传往后台
   */
  changeABC() {
    if (!this.isShowWarning) {
      if (this.startNum && this.endNum) {
        this.range = `单品单店铺市数范围[${this.startNum}~${this.endNum}]`
      } else {
        this.range = ``;
      }

    } else {
      this.range = '';
      this.startNum = null;
      this.endNum = null;
    }

    // 处理头部条件文字显示的逻辑
    this.allCondition = `${this.totalTile ? (this.avgTile || this.range ? this.totalTile + ',' : this.totalTile) : ''}${this.avgTile ? (this.range ? this.avgTile + ',' : this.avgTile) : ''}${this.range ? this.range : ''}`;

    // if (this.totalTile && this.avgTile && !this.isShowWarning) {
    //
    //   this.allCondition = `${this.totalTile}，${this.avgTile}，${this.range}`;
    //
    // } else if (!this.totalTile && this.avgTile && !this.isShowWarning) {
    //
    //   this.allCondition = `${this.avgTile}，${this.range}`;
    //
    // } else if (this.totalTile && !this.avgTile && !this.isShowWarning) {
    //   this.allCondition = `${this.totalTile}，${this.range}`;
    // } else if (!this.totalTile && !this.avgTile && !this.isShowWarning) {
    //   this.allCondition = `${this.range}`;
    // } else if (this.totalTile && this.avgTile && !this.isShowWarning) {
    //   this.allCondition = `${this.totalTile}，${this.avgTile}`;
    // } else if (this.totalTile && this.avgTile && this.isShowWarning) {
    //   this.allCondition = `${this.totalTile}，${this.avgTile}`;
    // } else if (this.avgTile && this.isShowWarning) {
    //   this.allCondition = `${this.avgTile}`;
    // } else if (this.totalTile && this.isShowWarning) {
    //   this.allCondition = `${this.totalTile}`;
    // } else if (!this.totalTile && !this.avgTile && this.isShowWarning) {
    //   this.allCondition = '';
    // }
    // `${? this.totalTile : ''}${ && this.totalTile ? '，' + this.avgTile : this.avgTile}${(this.avgTile &&  && this.endNum) || (this.totalTile && this.startNum && ) ? '，' : ''}${this.startNum == null && this.endNum == null ? '' : '店铺范围[' + (this.startNum == null ? 0 : this.startNum) + '-' + (this.endNum == null ? '所有' : this.endNum) + ']'}`;
    let totalValAbc = null;
    let avglValAbc = null;
    if (this.precondition) {
      this.precondition.abc = [];
    } else {
      this.precondition = {
        abc: [],
      }
    }

    switch (this.totalVal) {
      case 1:
        totalValAbc = {field: 'total', tags: ["A"]};
        break;
      case 2:
        totalValAbc = {field: 'total', tags: ["B"]};
        break;
      case 3:
        totalValAbc = {field: 'total', tags: ["C"]};
        break;
    }
    switch (this.avglVal) {
      case 1:
        avglValAbc = {field: 'avg', tags: ["A"]};
        break;
      case 2:
        avglValAbc = {field: 'avg', tags: ["B"]};
        break;
      case 3:
        avglValAbc = {field: 'avg', tags: ["C"]};
        break;
    }
    if (avglValAbc) {
      this.precondition.abc.push(avglValAbc)
    }
    if (totalValAbc) {
      this.precondition.abc.push(totalValAbc)
    }
    this.search()
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupAbcStructureTable({
      local: this.localTable,
      field: this.currFileds
    });
    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.initColumn(true);
    });
  }

  /**
   * 获取 popup
   */
  openCat() {
    const promise = this.popupData.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  //打开新品选择模态框
  // buildNewProductList() {
  //
  //   const promise = this.popupData.openNewProduct({selected: this.com.product.val, years: this.model_date});
  //   this.tool.dealModal(promise, res => {
  //     this.com.product.val = res ? res : [];
  //   });
  // }

  //打开品牌选择模态框
  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  //打开商品选择模态框
  openItem() {
    const promise = this.popupData.openItem({selected: this.com.product.val});

    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
    });
  }

  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }
}

angular.module("hs.classesAnalyze.sub").controller("ProductListABCCtrl", ProductListABCCtrl);
