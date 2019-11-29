class AbcStructureTableCtrl {
  constructor($uibModalInstance, context, toolService, CommonCon, basicService, Table,
              popupToolService) {
    this.tool = toolService;
    this.basic = basicService;
    this.context = context;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.Table = Table;

    // 最终输出的指标集合
    this.list = [];

    // 保存指标的local
    this.localOrigin = this.localOrigin = this.context.local
      ? this.context.local
      : CommonCon.local.TABLE_ORIGIN_ABC_STRUCTURE;

    this.originField = angular.copy(this.context.field);

    if (this.context.change) {
      this.context.change.forEach(s => {
        const list = this.originField[s.name].list;

        s.list.forEach(l => {
          list[l] = {id: "", name: ""};
        })
      });
    }
  }

  init() {
    const local = this.basic.getLocal(this.localOrigin);
    this.field = local ? this.tool.getFieldFromLocal(local, this.originField) : this.originField;
    delete this.field.option;
    _.forIn(this.field, (value, key) => {
      value.list.forEach((i, index) => {
        if (i.readOnly) {
          value.list[index].model = true;
          i.disable = true;
        }
      })
    });
    if(local.YoYToTSetting) {
      this.options = local.YoYToTSetting;
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
    _.forIn(fields, (value, key) => {
      value.list.forEach((i, index) => {
        if (i.readOnly) {
          value.list[index].model = true;
          i.disable = true;

        }
      })
    });
    this.popupTool.tableSelectOne('sale', fields);

    // 如果选中非拼接指标个数超过5个 return掉 显示报错信息
    this.showManyError = this.calculateTableModelNum(fields) > 5;
  }

  calculateTableModelNum(fields) {
    let changeNum = 0;
    if (fields) {
      _.forIn(fields, (value, key) => {
        if (key == 'whole') {
          this.isProduct = true;
          return
        }
        ;
        value.list.map(i => {
          if (i.join != 2 && i.model == true) {
            changeNum++
          }
        })
      });
    }
    return changeNum
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
    //如果当前点击的配置项是只读
    _.forIn(fields, (value, key) => {
      value.list.forEach((i, index) => {
        if (i.readOnly) {
          i.disable = true;
          value.list[index].model = true;
        }
      })
    });
    this.popupTool.tableSelectOne(key, fields);

    // 如果选中非拼接指标个数超过5个 return掉 显示报错信息
    this.showManyError = this.calculateTableModelNum(fields) > 5;
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
    if (this.showError || this.showManyError) return;

    // 将当前已选中的指标按照一定的结构保存到local中
    if(this.context.noShowSetting) {
      this.basic.setLocal(this.localOrigin,  this.popupTool.buildSimpleField(this.field));
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

angular.module("hs.popups").controller("abcStructureTableCtrl", AbcStructureTableCtrl);
