class SupplierInOutTableCtrl {
  constructor($uibModalInstance, context, basicService, toolService, CommonCon,
              popupToolService, Table) {
    this.context = context;
    this.tool = toolService;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.Table = Table;

    // 最终输出的指标集合
    this.list = [];

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local
      : CommonCon.local.TABLE_ORIGIN_SUPPLIER_INOUT;

    this.originField = angular.copy(this.context.field);
  }


  init() {
    const local = this.basic.getLocal(this.localOrigin);
    this.field = local ? this.tool.getFieldFromLocal(local, this.originField) : this.originField;
    if (local.YoYToTSetting) {
      this.options = local.YoYToTSetting;
      delete this.field.option;
    } else {
      let YoYToTSetting = angular.copy(this.Table.YoYToTSetting);
      YoYToTSetting.line.name = '同比设定';
      YoYToTSetting.all.name = '同比设定';
      YoYToTSetting.group = YoYToTSetting.group.filter(g => g.id === 'YoY');
      this.options = YoYToTSetting;
    }
  }

  /**
   * 点击全选触发的事件
   * @param curr 当前指标对象
   * @param fields 所有的指标
   */
  selectAll(curr, fields) {
    // 清除error信息
    this.showError = false;

    this.popupTool.tableSelectAll(curr, fields);

    // 如果选中个数超过10个 return掉 显示报错信息
    this.showManyError = this.popupTool.calculateTableModelNum(fields) > 10;
  }

  /**
   * 单击一个指标触发的事件
   * @param curr 当前指标对象
   * @param key 当前指标所在的父级对象key
   * @param fields 所有的指标
   */
  selectOne(curr, key, fields) {
    // 清除error信息
    this.showError = false;

    this.popupTool.tableSelectOne(key, fields);

    // 如果选中个数超过10个 return掉 显示报错信息
    this.showManyError = this.popupTool.calculateTableModelNum(fields) > 10;
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
    if (this.context.noShowSetting) {
      this.basic.setLocal(this.localOrigin, this.popupTool.buildSimpleField(this.field));
    } else {
      const localField = Object.assign({}, this.popupTool.buildSimpleField(this.field), {YoYToTSetting: this.options});
      this.basic.setLocal(this.localOrigin, localField);

      //处理下同比环比的配置（获取table要去掉的fields）
      const option = this.popupTool.getSameRingRatioOption(this.options);
      this.field = Object.assign({}, this.field, {option});
    }

    this.$uibModalInstance.close(this.field);

  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("supplierInOutTableCtrl", SupplierInOutTableCtrl);
