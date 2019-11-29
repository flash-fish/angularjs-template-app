class ChannelProfitTableController {
  constructor($uibModalInstance, context, basicService, toolService, CommonCon,
              Table, popupToolService) {
    this.tool = toolService;
    this.basic = basicService;
    this.context = context;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;

    // 最终输出的指标集合
    this.list = [];

    this.currJob = this.context.job;
    this.jobs = CommonCon.jobTypes;
    let jobList = _.keys(this.jobs);

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local
      : `${CommonCon.local.TABLE_ORIGIN_CHANNEL_PROFIT}_${this.currJob}`;

    // 页面的指标结构
    this.option = angular.copy(Table.channelProfit);

    // 页面配置
    this.key = this.context.key;

    // tab信息
    this.tabTypes = angular.copy(this.tool.getTabTypes());

    // 判断当前是否为全权限
    this.isBoss = this.tool.isBoss(this.currJob);
    if (!this.isBoss) {
      this.tabTypes = this.tabTypes.filter(t => t.href === this.currJob);
      if (this.currJob === this.jobs.store) {
        this.tabTypes.unshift(this.context.storeOtherTab)
      } else {
        this.tabTypes[0].name = '共通';
      }
    }

    const tabTypes = angular.copy(this.context.tabTypes);

    _.remove(tabTypes, t => t.href !== ('costCodeFor' + _.capitalize(this.currJob)) && !this.isBoss);

    //判断当前是否有
    if (this.context.costCodeTab)
      this.tabTypes = _.concat(this.tabTypes, tabTypes);

    // 初始化选中父级页面所在的tab
    if (this.context.tab && this.isBoss)
      this.tabTypes.forEach(s => s.active = s.id.includes(this.context.tab.toString()));
    else {
      let type = this.tabTypes.find(t => t.id.includes(this.context.tab.toString()));
      if (!type)
        this.tabTypes[0].active = true;
      else
        type.active = true;
    }

    // 获取当前popup内选中的tab
    this.currTab = this.tabTypes.find(s => s.active);

    jobList.filter(j => this.tool.isBoss(j) || (!this.isBoss && j !== this.currJob))
      .forEach(job => delete this.option['costCodeFor' + _.capitalize(job)]);

    // 标识当前页面是否有tab
    this.showTab = true;

    // 查看是否超过10个指标
    this.manyError = [];

    this.YoYToTSettingTabs = {};
  }

  init() {
    const local = this.basic.getLocal(this.localOrigin);

    if (local) {
      if (local.YoYToTSettingTabs) {
        this.YoYToTSettingTabs = angular.copy(local.YoYToTSettingTabs);
        delete local.YoYToTSettingTabs;
      }

      const options = angular.copy(this.option);

      this.option = this.tool.getFieldFromLocal(local, options, this.currJob, false, this.isBoss);

      if (!this.isBoss) {
        const types = this.tabTypes.filter(t => t.href !== this.currJob);
        types.forEach(t => {
          this.option = Object.assign(this.option, this.tool.getFieldFromLocal(local, options, t.href, false, this.isBoss));
        });
      }

      _.forIn(this.option, v => delete v.option);
    }

  }

  // 检查各个表格是否是超过10个指标
  check(fields, key) {

    const errorTab = this.tabTypes.find(t => t.href === key).name;

    if (this.popupTool.calculateTableModelNum(fields) > 10) {
      // 超过10个先看是否数组中有，没有就添加
      if (!this.manyError.find(e => e === errorTab)) this.manyError.push(errorTab);
    } else {
      // 如果没超过10个，查看数组中是否有，有就删除
      if (this.manyError.find(e => e === errorTab)) _.remove(this.manyError, val => val === errorTab);
    }

    if (this.showTab) {
      this.showManyError = `【${this.manyError.join(' , ')}】最多指定十个指标, 请减少一些指标 .`;
    } else {
      this.showManyError = '最多指定十个指标, 请减少一些指标 .';
    }

  }

  tabChange(curr) {
    this.tabTypes.forEach(s => s.active = _.isEqual(s.id, curr.id));
    this.currTab = this.tabTypes.find(s => s.active);
  }

  /**
   * 点击全选触发的事件
   * @param curr 当前指标对象
   * @param fields 所有的指标
   * @param type tab选中的是那个表格
   */
  selectAll(curr, type, fields) {
    // 清除error信息
    this.showError = '';

    this.popupTool.tableSelectAll(curr, fields);

    // 如果选中个数超过10个 return掉 显示报错信息
    this.check(fields, type);
  }

  /**
   * 单击一个指标触发的事件
   * @param curr 当前指标对象
   * @param key 当前指标所在的父级对象key
   * @param fields 所有的指标
   * @param type tab选中的是那个表格
   */
  selectOne(curr, key, fields, type) {
    // 清除error信息
    this.showError = '';

    this.popupTool.tableSelectOne(key, fields);

    // 如果选中个数超过10个 return掉 显示报错信息
    this.check(fields, type);
  }

  /**
   * 用户点击模态框的确认按钮时触发
   */
  ok() {
    // 判断是否超过10个指标
    if (this.manyError.length > 0) return;

    const table = angular.copy(this.option);

    this.zeroError = [];
    this.showError = '';

    if (this.showTab) {
      const content = "Tab标签至少指定一个指标 . ";

      let errors = [];
      this.field = angular.copy(table);
      _.forIn(table, (v, k) => {
        const list = this.tool.calculateTableField(v);

        // 如果当前输出的集合为空 return掉 显示报错信息
        if (list.length === 0) {
          const current = this.tabTypes.filter(s => s.href === k)[0].name;
          errors.push(current);
        }
      });

      this.zeroError = errors;
      this.showError = errors.join(' , ') + content;

    } else {
      this.field = angular.copy(table[this.currJob]);
      const list = this.tool.calculateTableField(table[this.currJob]);
      if (list.length === 0) {
        this.zeroError.push("至少指定一个指标");
      }
      this.showError = "至少指定一个指标";
    }

    if (this.zeroError.length > 0) return;

    // 将当前已选中的指标按照一定的结构保存到local中
    const localField = Object.assign({}, this.popupTool.buildSimpleField(this.field, this.showTab), {YoYToTSettingTabs: this.YoYToTSettingTabs});
    this.basic.setLocal(this.localOrigin, localField);

    //处理下同比环比的配置（获取table要去掉的fields）
    _.forIn(this.YoYToTSettingTabs, (v, k) => {
      const option = this.popupTool.getSameRingRatioOption(v);
      if (this.showTab)
        this.field[k] = Object.assign({}, this.field[k], {option});
    });
    this.$uibModalInstance.close(this.field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("channelProfitTableCtrl", ChannelProfitTableController);
