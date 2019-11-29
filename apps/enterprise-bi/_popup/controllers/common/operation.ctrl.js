class OperationController {
  constructor(context, $uibModalInstance, $scope, popupToolService, Pop,
              basicService, toolService) {
    this.$scope = $scope;
    this.context = context;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.tool = toolService;

    // 标识当前pop的类型
    this.type = Pop.types.filter(s => s.id === 3)[0];

    this.search = '';

    this.curr = 1;
    this.key = {per: 100};

    this.maxCount = Pop.unlimited;

    this.param = angular.copy(this.context.param);

    // 默认多选
    this.isMulti = !_.isUndefined(this.param.multi) ? this.param.multi : true;

    //当前已选
    this.selected = this.context.param.selected;

    this.commonOperation = angular.copy(Pop.commonOperation)
  }

  init() {
    this.getList();

    // 监听分页变化
    this.pageChange();
  }

  //获取列表数据
  getList() {
    this.loading = true;
    this.basic.packager(this.context.promiseFunc(this.buildParam()), res => {
      this.loading = false;

      this.initList = res.data;

      if (this.isMulti) {
        this.updateSelected();
        this.tool.getAccess(access => this.initByAccess(access, res.data));
      } else {
        if (this.selected && this.selected.length > 0)
          this.initList.selected = this.selected[0][this.type.title];
      }
    }, () => this.cancel());
  }

  // 根据权限初始化常用设定
  initByAccess(access, data) {
    if (!access) return;
    let accessOperation =  access.dataAccess.find(d => String(d.dataAccessCode) === '3');
    let codes = accessOperation.accesses.map(m => String(m.code));

    let dataCodes = data.map(d => String(d[this.type.code]));
    this.commonOperation.forEach(c => {
      if (!c.selected) return;
      //  如果是有权限的话，就得先按权限筛选下
      if (codes.length) c.list = c.list.filter(f => codes.includes(f.code));
      let codeList = c.list.map(l => String(l.code));
      //  再通过接口获得的数据进行筛选下，看看是否有通配选项,（地区，门店权限会计算业态属性）
      let sameCodes = codeList.filter(f => dataCodes.includes(f));
      if (sameCodes.length)
        c.list = c.list.filter(f => sameCodes.includes(f.code));
    });
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
      content: current,
      maxCount: this.maxCount
    };
    const select = this.popupTool.choose(curr, currList, this.selected, key);
    if (select) this.selected = select;
  };

  //搜索
  change() {
    this.curr = 1;
    this.getList();
  }

  // 更新列表选中状态
  updateSelected() {
    this.popupTool.updateSelected(this.initList, this.selected, this.type.code);
  }

  //重置
  reset() {
    const select =this.popupTool.reset(this.initList, this.selected, this.isMulti);
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

  //参数
  buildParam() {
    let params = {};
    params.moduleId = this.context.moduleId;
    return params;
  }

  // 通常选
  commonChoose(item) {
    if (item.selected) {
      this.selected = angular.copy(item.list);
      const codes = this.selected.map(m => m.code);
      this.initList.forEach(s => {
          s.selected = codes.includes(s[this.type.code])
      });
    } else {
      const codes = item.list.map(m => m.code);
      this.initList.forEach(s => {
        s.selected = !codes.includes(s[this.type.code])
      });
      this.selected = this.initList.filter(s => s.selected).map(m => {
        return {
          code: String(m[this.type.code]),
          name: m[this.type.title]
        }
      });
    }
  }
}

angular.module('hs.popups').controller('operationCtrl', OperationController);
