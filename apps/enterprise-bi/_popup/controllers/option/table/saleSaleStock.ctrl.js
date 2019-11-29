class saleSaleStockTableCtrl {
  constructor($uibModalInstance, context, toolService, CommonCon, basicService, Table,
              popupToolService) {
    this.tool = toolService;
    this.context = context;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.Table = Table;

    // 最终输出的指标集合
    this.list = [];

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local
      : CommonCon.local.TABLE_ORIGIN_SUP_SALE_STOCK;

  }

  init() {
    const local = this.basic.getLocal(this.localOrigin);
    const field = local ? this.tool.getFieldFromLocal(local, this.context.field) : this.context.field;

    // 初始化field
    const data = angular.copy(field);
    this.supplierField = angular.copy({other: data.other});
    delete data.other;
    if (local.YoYToTSetting) {
      this.options = local.YoYToTSetting;
      delete data.option;
    }

    this.originField = data;

    if (this.context.change) {
      this.context.change.forEach(s => {
        const list = this.originField[s.name].list;

        s.list.forEach(l => {
          list[l] = {id: "", name: ""};
        })
      });
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

    this.isError();
  }

  isError() {
    // 如果选中个数超过10个 return掉 显示报错信息
    const originCount = this.popupTool.calculateTableModelNum(this.originField);

    this.showManyError = originCount > 10;
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

    this.isError();
  }

  /**
   * 用户点击模态框的确认按钮时触发
   */
  ok() {

    // 计算指标
    const origin = this.tool.calculateTableField(angular.copy(this.originField));

    // 如果当前输出的集合为空 return掉 显示报错信息
    this.showError = origin.length === 0;
    if (this.showError || this.showManyError) return;

    this.field = Object.assign({}, this.originField, this.supplierField);

    // 将当前已选中的指标按照一定的结构保存到local中
    const localField = Object.assign({}, this.popupTool.buildSimpleField(this.field), {YoYToTSetting: this.options});
    this.basic.setLocal(this.localOrigin, localField);

    //处理下同比环比的配置（获取table要去掉的fields）
    const option = this.popupTool.getSameRingRatioOption(this.options);

    this.$uibModalInstance.close(Object.assign({}, this.field, {option}));
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("saleSaleStockTableCtrl", saleSaleStockTableCtrl);
