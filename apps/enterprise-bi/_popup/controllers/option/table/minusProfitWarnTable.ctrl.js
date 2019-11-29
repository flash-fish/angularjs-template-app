class minusProfitWarnTableCtrl {
  constructor($uibModalInstance, context, basicService, toolService, CommonCon,
              popupToolService) {
    this.context = context;
    this.tool = toolService;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;

    // 最终输出的指标集合
    this.list = [];

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local
      : CommonCon.local.TABLE_ORIGIN_WARN_MINUS_PROFIT;

    this.originField = angular.copy(this.context.field);
  }


  init() {
    const local = this.basic.getLocal(this.localOrigin);
    this.field = local ? this.tool.getFieldFromLocal(local, this.originField) : this.originField;
  }

  /**
   * 点击全选触发的事件
   * @param curr 当前指标对象
   * @param fields 所有的指标
   */
  selectAll(curr, fields) {
    // 清除error信息
    this.showError = false;

    // 全选按钮切换时 指标联动
    curr.list.forEach(s => {
      s.model = curr.all;

      // 如果全选按钮选中 清除disable效果
      if (s.join === 2) s.disable = !curr.all;
    });

    this.buildSale(curr, !curr.all, fields);
  }

  /**
   * 单击一个指标触发的事件
   * @param curr 当前指标对象
   * @param parent 当前指标所在的父级对象
   * @param fields 所有的指标
   */
  selectOne(curr, parent, fields) {
    // 清除error信息
    this.showError = false;

    const list = parent.list;
    const checks = list.filter(s => s.model).length;
    // 判断全选按钮是否选中
    parent.all = checks === list.length;

    this.buildSale(parent, checks === 0, fields);
  }

  /**
   * 特殊处理销售指标
   * @param parent 当前大模块的指标对象
   * @param isDisable 是否禁用
   * @param fields 所有的指标对象
   */
  buildSale(parent, isDisable, fields) {
    // 如果整体指标全都没选中 那么销售指标全部disable 并且值清空
    if (parent.key.name === '整体') {

      _.forIn(fields, (val, key) => {
        if (val.key.join !== 2) return;

        val.disable = isDisable;

        val.all = false;
        val.list.forEach(s => {
          if (isDisable) s.model = false;
        });
      });
    }
  }

  /**
   * 用户点击模态框的确认按钮时触发
   */
  ok() {
    this.list = [];

    // 计算指标
    this.list = this.tool.calculateTableField(angular.copy(this.field));

    // 如果当前输出的集合为空 return掉 显示报错信息
    this.showError = this.list.length === 0;
    if (this.showError) return;

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.localOrigin, this.popupTool.buildSimpleField(this.field));

    this.$uibModalInstance.close(this.field);

  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("minusProfitWarnTableCtrl", minusProfitWarnTableCtrl);
