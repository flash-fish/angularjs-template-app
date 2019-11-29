class StoreCtrl {
  constructor(context, $uibModalInstance, $scope, popupToolService, Pop,
              basicService) {
    this.$scope = $scope;
    this.context = context;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.basic = basicService;

    // 标识当前pop的类型
    this.type = Pop.types.filter(s => s.id === 1)[0];

    this.search = '';

    this.param = angular.copy(this.context.param);

    // 默认多选
    this.isMulti = !_.isUndefined(this.param.multi) ? this.param.multi : true;

    //当前已选
    this.selected = this.context.param.selected;

    this.maxCount = Pop.unlimited;
  }

  init() {
    this.getOperationList();

    this.getDistrictList();

    this.getList();
  }

  getList() {
    this.loading = true;
    this.basic.packager(this.context.storeFunc(this.buildParam()), res => {
      this.loading = false;

      this.initList = res.data;

      if (this.isMulti) {
        this.updateSelected();
      } else {
        if (this.selected && this.selected.length > 0)
          this.initList.selected = this.selected[0][this.type.title];
      }

      this.warnInfo = this.popupTool.checkReturnData(res);

    }, () => this.cancel());
  }

  getOperationList() {
    this.basic.packager(this.context.operationFunc({moduleId: this.context.moduleId}), res => {
      this.operations = res.data;
      this.operations.splice(0, 0, {
        businessOperationCode: "",
        businessOperationName: "全部业态"
      });

      const param = this.context.param.operation;
      this.operation = param ? param : this.operations[0].businessOperationCode;
    }, () => this.cancel());
  }

  getDistrictList() {
    this.basic.packager(this.context.districtFunc({moduleId: this.context.moduleId}), res => {
      this.districts = res.data;
      this.districts.splice(0, 0, {
        districtCode: "",
        districtName: "全部地区"
      });

      const param = this.context.param.district;
      this.district = param ? param : this.districts[0].districtCode;
    }, () => this.cancel());
  }

  //点击列表
  choose(curr, currList) {
    const current = {code: curr[this.type.code], name: curr[this.type.title]};

    const key = {
      type: this.type,
      multi: this.isMulti,
      content: current,
      maxCount: this.maxCount
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
    const select = this.popupTool.reverseChoose(this.initList, this.selected, this.type, this.maxCount);
    if (select) this.selected = select;
  }

  //全选
  allChoose() {
    const select = this.popupTool.allChoose(this.initList, this.selected, this.type, this.maxCount);
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

    return {
      key: this.search,
      operationCodes: !this.operation ? [] : [this.operation],
      districtCodes: !this.district ? [] : [this.district],
      moduleId: this.context.moduleId,
      keyType: isIncludeComma ? 1 : 0
    };
  }
}

angular.module("hs.popups").controller("storeCtrl", StoreCtrl);
