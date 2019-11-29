class NewProductCtrl {
  constructor(context, $uibModalInstance, $scope, $rootScope, popupToolService,
              Pop, dataService, basicService) {
    this.$scope = $scope;
    this.context = context;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.dataService = dataService;
    this.basic = basicService;

    // 标识当前pop的类型
    this.type = Pop.types.filter(s => s.id === 10)[0];
    this.search = '';
    this.curr = 1;
    this.key = {per: 100};


    this.param = angular.copy(this.context.param);

    // 默认多选
    this.isMulti = !_.isUndefined(this.param.multi) ? this.param.multi : true;
    //当前已选
    this.selected = this.context.param.selected;
    /*已选年份*/
    this.curr_year = this.context.param.years;

    //接口返回的baseDate
    this.baseYear = parseInt(this.context.param.baseYear);
  }

  init() {
    this.setDate();

    // 监听分页变化
    this.pageChange();
  }

  //设置新品年份
  setDate() {
    this.tabs = [
      {active: true},
      {active: false}
    ];
    if (this.baseYear) {
      this.tabs[0].name = this.baseYear;
      this.tabs[1].name = this.baseYear - 1;
      this.cur = this.tabs[0];
      if (this.curr_year) this.linkDate()
    } else {
      this.basic.packager(this.dataService.getBaseDate(), res => {
        const baseDate = res.data.baseDate;
        if(baseDate){
          const baseYear = baseDate.toString().substring(0, 4);
          this.tabs[0].name = baseYear;
          this.tabs[1].name = baseYear - 1;
          this.cur = this.tabs[0];
          if (this.curr_year) this.linkDate()
        }
      })
    }

    this.getList();
  }

  //新品年份联动
  linkDate(){
    this.tabs.forEach((d, i) => {
      if (d.name == this.curr_year) {
        this.tabs[i].active = true;
        this.cur = this.tabs[i];
      } else {
        this.tabs[i].active = false;
      }
    });
  }

  //切换日期
  switchTab(stab) {
    this.cur = stab;
    this.getList();
  }

  //获取列表数据
  getList() {
    this.loading = true;
    this.basic.packager(this.context.promiseFunc(this.buildParam()), res => {
      this.loading = false;
      this.initList = res.data.result;
      this.total = res.data.count;
      if (this.isMulti) {
        this.updateSelected();
      } else {
        if (this.selected && this.selected.length > 0)
          this.initList.selected = this.selected[0][this.type.title];
      }

      this.warnInfo = this.popupTool.checkReturnData(res);
    }, () => this.cancel());
  }

  //监听分页
  pageChange() {
    this.$scope.$watch("ctrl.curr", (newVal, oldVal) => {
      if (newVal === oldVal) return;

      this.getList();
    });
  }

  //点击列表
  choose(curr, currList) {
    const current = {code: curr[this.type.code], name: curr[this.type.title]};

    const key = {
      type: this.type,
      multi: this.isMulti,
      content: current
    };
    const select = this.popupTool.choose(curr, currList, this.selected, key);
    if (select) this.selected = select;
  };

  //搜索
  change() {
    this.curr = 1;
    this.warnInfo = '';
    this.setTimer();
  }

  //搜索延时
  setTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {

      this.getList();

      clearTimeout(this.timer);
    }, 800);
  }

  // 更新列表选中状态
  updateSelected() {
    this.popupTool.updateSelected(this.initList, this.selected, this.type.code);
  }

  //重置
  reset() {
    const select = this.popupTool.reset(this.initList, this.selected, this.isMulti);
    if (select) this.selected = select;
  }

  //反选
  reverseChoose() {
    this.selected.forEach(i => i.code = String(i.code));
    const select = this.popupTool.reverseChoose(this.initList, this.selected, this.type);
    if (select) this.selected = select;
  }

  //全选
  allChoose() {
    const select = this.popupTool.allChoose(this.initList, this.selected, this.type);
    if (select) this.selected = select;
  }

  //确定
  ok() {
    this.$uibModalInstance.close(this.selected);
  }

  //取消
  cancel() {
    this.$uibModalInstance.dismiss();
  }

  buildParam() {
    const isIncludeComma = /,/g.test(this.search);

    let params = {
      condition: {
        key: this.search,
        newProductYears: [parseInt(this.cur.name)],
        keyType: isIncludeComma ? 1 : 0
      },
      pagination: {
        page: this.curr, //当前页
        size: this.key.per //页面大小
      }
    };

    return params;
  }
}

angular.module("hs.popups").controller("NewProductCtrl", NewProductCtrl);
