class classCtrl {
  constructor(context, $uibModalInstance, popupDataService, Pop, $scope
    , popupToolService, basicService) {
    this.pop = Pop;
    this.scope = $scope;
    this.context = context;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.dataService = popupDataService;
    this.$uibModalInstance = $uibModalInstance;

    this.catLevels = angular.copy(Pop.classLevels);
    this.catLevels.unshift({id: 0, name: '编码', active: false, code: 'all'});
    this.initLevel = this.catLevels[1].id;

    // 标识当前pop的类型
    this.type = Pop.types.filter(s => s.id === 4)[0];

    this.search = "";
    this.categoryTitles = this.catLevels.map(s => s.name);

    // 分页信息
    this.curr = 1;
    this.key = {per: 100};

    this.param = angular.copy(this.context.param);

    // 默认多选
    this.isMulti = !_.isUndefined(this.param.multi) ? this.param.multi : true;

    //当前已选
    this.selected = this.popupTool.addLevel(this.param.selected, this.catLevels);
  }

  init() {
    this.basic.packager(this.context.getTree({moduleId: this.pop.module}), res => {
      this.loading = false;
      this.categoryPath = [res.data];
      this.curLevel = res.data.level;

      //无论有无已选择，默认选中编码
      this.level = 0;

      // 多选模式中 分类列表不根据输入框实时检索 而是依据分类层级和分类树中的分类
      if (this.isMulti) {
        this.initMultiCat();
        this.initCatList();
      }

      this.pageChange();

      this.initPath = angular.copy(this.categoryPath);
    }, () => this.cancel());

  }

  initMultiCat() {
    // 初始化选中全部
    this.categoryPath[0].selectedCat = "全部";

    const all = {
      classCode: null,
      className: "全部",
      level: 0
    };

    if (!this.categoryPath[0].mtClassModels) this.categoryPath[0].mtClassModels = [];
    this.categoryPath[0].mtClassModels.splice(0, 0, all);

  }

  initCatList() {
    if (this.level) this.getList();
  }

  pageChange() {
    this.scope.$watch("ctrl.curr", (newVal, oldVal) => {
      if (newVal === oldVal) return;

      this.getList();
    });
  }

  // 多选模式中 切换分类层级触发
  toggle(id) {
    if (this.level === id) {
      return;
    }
    this.currCategory = "";
    this.curr = 1;
    this.search = "";
    this.warnInfo = '';
    this.errorInfo = '';

    // 切换层级 清空编码所选分类 并获取当前层级下的所有分类
    if (!_.isUndefined(id)) {
      this.level = id;
      this.selected = [];

      // 切换层级 清空编码所选分类 并获取当前层级下的所有分类
      if (this.isClearList()) return;
    }

    this.getList();

    // 切换层级 树形结构也要初始化
    this.categoryPath = angular.copy(this.initPath);
  }

  /**
   * 获取分类列表中的数据
   */
  getList() {
    this.loading = true;

    let param = this.buildParam();

    if (this.warnInfo) {
      this.loading = false;
      return
    }

    if (!this.isMulti)
      param.condition = {
        moduleId: this.param.moduleId,
        key: this.search
      };

    this.basic.packager(this.context.getSubList(param), res => {
      this.loading = false;
      this.initList = res.data.data;
      this.total = res.data.total;

      this.updateSelected();

      if (this.level === 0) this.warnInfo = this.popupTool.checkReturnData(res);
    });
  }

  /**
   * 输入框筛选分类
   */
  change() {
    this.curr = 1;
    this.warnInfo = '';
    this.errorInfo = '';

    if (this.popupTool.isUnvalidated(this.search, this)) return;
    this.setTimer();
  }

  /**
   *  搜索延时
   */
  setTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {

      this.getList();

      clearTimeout(this.timer);
    }, 800);
  }

  isClearList() {
    //选择编码tab时 清空列表
    if (!this.level) {
      this.initList = [];
      this.total = null;
      return true;
    }
  }

  buildParam() {
    const isIncludeComma = /,/g.test(this.search);

    if (this.level === 0) {
      this.warnInfo = isIncludeComma
        ? this.popupTool.compareLevel(this.search, '品类组', this)
        : this.popupTool.compareLevelForOne(this.search, this)
    }

    let param = {
      condition: {
        moduleId: this.param.moduleId,
        keyType: this.level === 0 ? 1 : 0 //1精准查询 0模糊查询
      },
      page: {
        pageNo: this.curr, //起始页 （默认为1）
        pageSize: this.key.per //分页大小 （默认为100）
      }
    };

    if (this.level) param.condition.level = this.level;
    param.condition.classCode = this.currCategory;
    param.condition.key = this.search;

    return param;
  }

  /**
   * 打开一个类目(选定一个类目)
   * 并尝试展示其子类目
   * @param {object} category 类目对象
   * @param categoryItem
   */
  openCats(category, categoryItem) {
    categoryItem.selectedCat = category.className;

    // 保存当前点击的树形结构中的分类
    this.currCategory = category.classCode;

    if (this.isMulti) {
      // 清空输入框的过滤值
      this.search = "";

      // 多选模式中 点击树形结构的分类触发获取指定层级子分类
      this.getList();

      // 如果点击的全部或者点击level大于等于this.level 不去获取子分类
      if (category.level === 0) {
        this.categoryPath = this.categoryPath.slice(0, 1);
        return;
      } else if (category.level >= this.level - 1) return;

      if (!category.classCode) {
        _.remove(this.categoryPath, c => c.level > category.level);
        return;
      }
    } else {
      this.selected = [];
      this.selected.push({
        code: category.classCode,
        level: categoryItem.level,
        name: `${this.categoryTitles[categoryItem.level - 1]}-${category.className}`
      });
    }

    // 查询当前选中的是第几级
    let levelIdx = categoryItem.level - 1;
    if (levelIdx >= 3) return;

    let pathItem = this.categoryPath[levelIdx + 1];
    if (pathItem) this.categoryPath.splice(levelIdx + 1);

    // 请求后台获取子分类
    this.basic.packager(this.context.getTree({
      classCode: category.classCode,
      moduleId: this.pop.module
    }), res => {
      category.children = res.data.mtClassModels;
      if (!category.children || !category.children.length) return;

      let pathItem = this.categoryPath[levelIdx + 2];
      if (pathItem) this.categoryPath.splice(levelIdx + 2);

      if (this.categoryPath[this.categoryPath.length - 1].level == category.children[0].level) {
        this.categoryPath.splice(this.categoryPath.length - 1, 1);
      }

      this.categoryPath.push({
        level: levelIdx + 2,
        mtClassModels: category.children,
        selectedCat: "全部"
      });
    });
  }

  choose(curr, currList) {
    const name = `${curr[this.type.level.name]}-${curr.className}`;
    const current = {code: curr.classCode, level: curr.level, name: name};

    const key = {
      type: this.type,
      multi: this.isMulti,
      content: current
    };

    const select = this.popupTool.choose(curr, currList, this.selected, key, this.level);
    if (select) this.selected = select;
  }

  reset() {
    this.selected = [];

    if (this.isMulti) {
      if (this.initList) this.initList.filter(b => b.selected === true).forEach(b => (b.selected = false));
    } else {
      this.categoryPath = angular.copy(this.initPath);

      this.initList.selected = "";
    }
  }

  // 更新列表选中状态
  updateSelected() {
    this.popupTool.updateSelected(this.initList, this.selected, this.type.code);
  }

  //反选
  reverseChoose() {
    if (!this.total) return;

    this.selected.forEach(i => i.code = String(i.code));
    const select = this.popupTool.reverseChoose(this.initList, this.selected, this.type, null, null, this.level);
    if (select) this.selected = this.popupTool.addLevel(select, this.catLevels);
  }

  //全选
  allChoose() {
    if (!this.total) return;

    const select = this.popupTool.allChoose(this.initList, this.selected, this.type, null, null, this.level);
    if (select) this.selected = this.popupTool.addLevel(select, this.catLevels);
  }

  ok() {
    this.$uibModalInstance.close(this.selected);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("classCtrl", classCtrl);
