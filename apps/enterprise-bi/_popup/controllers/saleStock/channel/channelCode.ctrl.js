class ChannelCodeListCtrl {
  constructor(context, $uibModalInstance, $scope, popupToolService, Pop,
              basicService) {
    this.$scope = $scope;
    this.context = context;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.basic = basicService;

    // 标识当前pop的类型
    this.type = Pop.types.find(s => s.id === 13);

    this.search = '';

    this.curr = 1;
    this.key = {per: 100};


    this.param = angular.copy(this.context.param);

    // 默认多选
    this.isMulti = !_.isUndefined(this.param.multi) ? this.param.multi : true;

    //当前已选
    this.selected = this.context.param.selected;

    this.dataTypes = [
      {id: 'all', name: "全部费用代码", val: 0},
      {id: 'buyer', name: "采购费用代码", val: 2},
      {id: 'store', name: "门店费用代码", val: 1}
    ];
    // if (this.param.job !== 'all') {
    //   this.dataTypes = this.dataTypes.filter(d => d.id === this.param.job);
    //   this.dataType = angular.copy(this.dataTypes[0].id);
    // }
    // else
    //   this.dataType = this.dataTypes.find(d => d.id === this.param.id).id;
    this.dataTypes = this.dataTypes.filter(d => d.id === this.param.id);
    this.dataType = this.dataTypes.find(d => d.id === this.param.id).id;

    this.channelCodeTypes = [
      {id: '', name: "全部"},
      {id: 2, name: "固定"},
      {id: 1, name: "变动"}
    ];
    this.feeKind = this.channelCodeTypes[0].id;
  }

  init() {
    this.getList();

    // 监听角色变化
    this.dataTypeChange();
  }

  //获取列表数据
  getList() {
    this.loading = true;
    this.basic.packager(this.context.promiseFunc(this.buildParam()), res => {
      this.loading = false;

      this.initList = res.data;
      this.total = res.data.length;

      if (this.isMulti) {
        this.updateSelected();
      } else {
        if (this.selected && this.selected.length > 0)
          this.initList.selected = this.selected[0][this.type.title];
      }

      this.warnInfo = this.popupTool.checkReturnData(res);

    });
  }

  //监听分页
  dataTypeChange() {
    this.$scope.$watch("ctrl.dataType", (newVal, oldVal) => {
      if (newVal === oldVal) return;

      this.getList();
    });

    this.$scope.$watch("ctrl.feeKind", (newVal, oldVal) => {
      if (newVal === oldVal) return;

      this.getList();
    });
  }

  //点击列表
  choose(curr, currList) {
    const current = {code: curr[this.type.code], name: curr[this.type.title]};
    if (this.type.showCode) current.showCode = curr[this.type.showCode];

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

  //参数
  buildParam() {
    const isIncludeComma = /,/g.test(this.search);

    const channelType = this.dataTypes.find(d => d.id === this.dataType).val;

    return {
      key: this.search,
      moduleId: this.context.moduleId,
      channelType: channelType ? channelType : null,
      keyType: isIncludeComma ? 1 : 0,
      classPropId: this.feeKind
    };
  }
}

angular.module("hs.popups").controller("channelCodeListCtrl", ChannelCodeListCtrl);
