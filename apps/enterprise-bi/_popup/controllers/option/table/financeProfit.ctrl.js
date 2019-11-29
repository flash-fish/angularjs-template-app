/**
 * Created by ios on 2018/10/23.
 */
class FinanceProfitTableCtrl {
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

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local
      : `${CommonCon.local.TABLE_ORIGIN_SALE_FINANCE_PROFIT}_${this.currJob}`;

    // 页面的指标结构
    this.option = angular.copy(Table.financeAnalyze_profitTable);


    // 页面配置
    this.key = this.context.key;

    // tab信息
    this.tabTypes = angular.copy(this.tool.getTabTypes());

    // 父级页面可以定制化popup内的tab
    if (this.key && this.key.changeTab) {
      this.tabTypes[this.key.changeTab.index] = this.key.changeTab.content;
    }

    // 初始化选中父级页面所在的tab
    if (this.context.tab)
      this.tabTypes.forEach(s => s.active = s.id.includes(this.context.tab.toString()));

    // 获取当前popup内选中的tab
    this.currTab = this.tabTypes.filter(s => s.active)[0];

    // 判断当前是否为全权限
    this.isBoss = this.tool.isBoss(this.currJob);

    // 标识当前页面是否有tab
    this.showTab = this.context.tab && this.isBoss;

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
      this.option = this.tool.getFieldFromLocal(local, this.option, this.currJob);
      _.forIn(this.option, v => delete v.option);
    }

    // console.log(this.option);
  }

  tabChange(curr) {
    this.tabTypes.forEach(s => s.active = _.isEqual(s.id, curr.id));
    this.currTab = this.tabTypes.filter(s => s.active)[0];
  }

  /**
   * 点击全选触发的事件
   * @param curr 当前指标对象
   * @param type tab选中的是那个表格
   * @param fields 所有的指标
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


  // 检查各个表格是否是超过10个指标
  check(fields, key) {
    let string = '';
    if (key === 'buyer') {
      string = '按品类组';
    } else if (key === 'store') {
      string = '按门店';
    } else {
      string = '按趋势/按供应商';
    }
    if (this.popupTool.calculateTableModelNum(fields) > 10) {
      // 超过10个先看是否数组中有，没有就添加
      if (this.manyError.indexOf(string) === -1) this.manyError.push(string);
    } else {
      // 如果没超过10个，查看数组中是否有，有就删除
      if (this.manyError.indexOf(string) > -1) this.manyError.splice(this.manyError.indexOf(string), 1);
    }

    if (this.showTab) {
      this.showManyError = `【${this.manyError.join(' , ')}】` + '最多指定十个指标, 请减少一些指标 .';
    } else {
      this.showManyError = '最多指定十个指标, 请减少一些指标 .';
    }
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

      let errorTab = [];
      this.field = angular.copy(table);
      _.forIn(table, (v, k) => {
        const list = this.tool.calculateTableField(v);

        // 如果当前输出的集合为空 return掉 显示报错信息
        if (list.length === 0) {
          const current = this.tabTypes.filter(s => s.href === k)[0].name;
          errorTab.push(current);
        }
      });

      if (errorTab.length ) this.zeroError = errorTab;
      this.showError = `【${errorTab.join(' , ')}】` + content;
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
    const localField = Object.assign({}, this.popupTool.buildSimpleField(this.field, this.showTab),
      {YoYToTSettingTabs: this.YoYToTSettingTabs});
    this.basic.setLocal(this.localOrigin, localField);

    //处理下同比环比的配置（获取table要去掉的fields）
    _.forIn(this.YoYToTSettingTabs, (v, k) => {
      const option = this.popupTool.getSameRingRatioOption(v);
      if(this.showTab)
        this.field[k] = Object.assign({}, this.field[k], {option});
      else
        this.field = Object.assign({}, this.field, {option});
    });

    this.$uibModalInstance.close(this.field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("financeProfitTableCtrl", FinanceProfitTableCtrl);
