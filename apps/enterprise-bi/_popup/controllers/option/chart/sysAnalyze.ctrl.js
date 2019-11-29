class sysAnalyzeCtrl {
  constructor(context, $uibModalInstance, Chart, basicService,
              CommonCon, toolService, $scope, popupToolService) {
    this.Chart = Chart;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;
    this.context = context;
    this.scope = $scope;

    this.errors = [];

    // 保存指标的local
    this.localOrigin = this.context.local
      ? this.context.local.origin
      : CommonCon.local.CHART_ORIGIN_SUP_SALE_STOCK;

    this.localData = this.context.local
      ? this.context.local.data
      : CommonCon.local.CHART_DATA_SUP_SALE_STOCK;


    // 初始化销售类型
    this.saleTypes = angular.copy(CommonCon.saleTypes);
    this.saleType = this.saleTypes[0].id;

    this.originField = angular.copy(this.Chart.ActivitySetting);

    if(this.context.change) {

      _.forIn(this.context.change, (val, key) => {
        const list = this.originField[val.name][val.type].list;

        if (_.isEqual(key, "remove")) {
          _.remove(list, (n, i) => val.list.includes(i));
        }

        if (_.isEqual(key, "update")) {
          val.list.forEach(s => {
            list[s[0]][s[1]] = s[2];
          })
        }
      });
    }
  }

  init() {
    // 初始化页面指标结构和数据
    this.initChart();

    // 监听 销售类型
    this.watchType(this.scope, this.chart);
  }

  /**
   * 初始化chart field的结构
   * @returns {{}}
   */
  initChart() {
    const local = this.basic.getLocal(this.localOrigin);

    if (local) {
      this.saleType = local.type;
      this.tool.getChartFromLocal(local.chart, this.originField);
    }

    this.chart = this.originField;


    _.forIn(this.chart, (val, key) => {
      this.changeLine(val.line.list);
    })

  }

  /**
   * 柱状图指标发生变化后触发的点击事件
   * @param curr 当前点击的指标
   * @param val
   * @param all 销售或库存的所有指标
   */
  change (curr, val, all, tab) {
    this.changeChartState(val, all, curr, {
      businessType: this.saleType,
      tab
    });
  }

  watchType(scope, chart, func) {
    scope.$watch("ctrl.saleType", (newVal, oldVal) => {
      if (_.isEqual(newVal, oldVal)) return;

      const curr = chart.sale;

      const deal = (val, isLine) => {
        val.list.forEach((s, i) => {
          if (!s.noType && !isLine) return;

          const key = s.noType, types = ["all"];
          if (key) typeof key === 'string' ? types.push(key) : types.push(...key);

          s.disable = key && !types.includes(newVal) ;
        });

        // 重新按bar来初始化line的选择属性
        this.changeChartState(curr.bar, curr, curr.bar.list.find(l => l.check), {businessType: newVal, tab: '销售'});

        if (!val.list.some(s => s.disable && s.check))
          return;

        if (isLine) {
          val.list.filter(s => s.disable && s.check).forEach(s => {
            s.disable = true;
            s.check = false;
          });

          this.changeLine(val.list);
        } else {
          const index = val.key.forceIndex === 'end' ? val.list.length - 1 : val.key.forceIndex;
          val.list.forEach((s, i) => s.check = i === index);
        }
      };

      // 处理柱状图指标
      deal(curr.bar);
      if (curr.bar_add) deal(curr.bar_add);

      // 处理折线图指标
      deal(curr.line, true);

      // 毛利场合需要看bar1和bar2的制约关系
      const firstBar = curr.bar.list.filter(s => s.check)[0];
      if (firstBar && firstBar.disKey) {
        _.forIn(firstBar.disKey, (v, k) => {
          curr[k].list[v[0][0]].disable = true;
        })
      }

      if (func) func();
    })
  }



  changeLine (list, curr, tab) {
    // 如果选中个数超过2个 return掉 显示报错信息
    const err = list.filter(s => s.check).length > 2;

    err ? this.errors.push(tab) : _.remove(this.errors, (s) => s === tab);

    this.errors = _.uniq(this.errors);
    this.showManyError = !!this.errors.length;

    // change line
    list.filter(s => s.lineDisable).forEach(s => s.lineDisable = false);

    if (list.some(s => !_.eq(s.effect, "other") && s.check)) {
      list.filter(s => _.eq(s.effect, "other")).forEach(s => s.lineDisable = true);
    }

    if(!curr) {
      if (list.some(s => _.eq(s.effect, "other") && s.check)) {
        let Ar = [];
        list.filter( s => _.eq(s.effect, "other") && s.check ).forEach( e => Ar.push(e) );

        list.filter( s => !_.eq(s.effect, "other")
        || !_.eq(s.keep, Ar[0].keep) ).forEach(s => s.lineDisable = true);
      }
      return;
    }

    if (list.some(s => _.eq(s.effect, "other") && s.check)) {
     list.filter(s => !_.eq(s.keep, curr.keep)).forEach(s => s.lineDisable = true);
    }

  }

  changeChartState(val, all, curr, option) {
    option = option || {};

    // 折线图指标change逻辑
    if (val.key.checkbox) {

      this.changeLine(val.list, curr, option.tab);

    } else {

      // 柱状图指标change逻辑
      val.list.forEach(s => s.check = s.id === curr.id);
    }

    if (!val.key.basic) return;

    _.forIn(all, (v, k) => {
      if (v.key.basic) return;

      // 判断当前指标是否影响上年同期
      if (val.key.last) {
        val.key.last.disable = curr.last;
        if (curr.last) val.key.last.active = false;
      }

      // 对list中的指标进行重新检查
      v.list.forEach((s, index) => {
        const dis = curr.disKey;
        const noType = option.businessType && s.noType ? ![s.noType, 'all'].includes(option.businessType) : false;

        const disObj = dis && dis[k];

        s.disable = noType || disObj && dis[k][0].includes(index);

      });

      const error = v.list.filter(s => s.disable && s.check);
      if (error && error.length > 0) {
        const index = v.key.forceIndex === 'end' ? v.list.length - 1 : v.key.forceIndex;
        v.list.forEach((s, i) => s.check = i === index);
      }
    });

    this.changeLine(all.line.list);

  }

  calculateChartField(chart, type) {

    function getField(curr, basic, id, basicInfo) {
      const newId = id ? id : curr.id;
      const basicId = basicInfo ? basicInfo : basic.data.id;

      const data = {
        id: curr.own ? newId : basic.data.inc ? `${basicId + newId}Inc` : basicId + newId,
        needType: basic.data.needType ? basic.data.needType : null
      };

      if (curr.addSum) data.addSum = curr.addSum;

      return data;
    }

    // 是否变更id的
    let changeField;
    if (chart && chart.changeField) {
      changeField = angular.copy(chart.changeField);
      delete chart.changeField;
    }

    let field = {}, basic = {}, copyChart = angular.copy(chart);
    _.forIn(chart, (v, k) => {
      v.list = v.list.filter(s => s.check || s.disable);

      const curr = v.list.find(s => s.check);
      if (!curr || !curr.id) return;

      if (v.key.basic) {
        basic = {name: k, data: curr};
        field[k] = [];

        // 基础指标可能存在两个的情况
        if (curr.id.includes("&")) {
          curr.id.split("&").forEach((s, i) => {

            field[k].push({id: s, stack: curr.stack});
          });
        } else
          field[k].push(curr);

        // 判断上年同期
        if (v.key.last && v.key.last.active) {
          // 基础指标可能存在两个的情况
          if (curr.id.includes("&")) {
            curr.id.split("&").forEach((s, i) => {

              field[k].push({
                id: s + v.key.last.id,
                stack: curr.stack ? `${curr.stack}同期` : false
              });
            });
          } else
            field[k].push({
              id: curr.id + v.key.last.id,
              needType: basic.data.needType ? basic.data.needType : null
            });
        }
      }

      if (v.key.and) {
        field[basic.name].push(getField(curr, basic));
      }

      if (v.key.checkbox) {
        field[k] = [];
        field[k].push(...v.list.filter(s => s.check));
      }
    });

    if (type) {
      const noTypes = copyChart.bar.list.filter(s => s.noType).map(s => s.id);

      _.forIn(field, (v, k) => {
        v.forEach(s => {
          const count = noTypes.filter(q => s.id.includes(q)).length;
          const needType = s.needType && s.needType.includes(type);

          s.id = count <= 0 ? type + s.id : s.id;

          if (needType) s.id = _.camelCase(`${type} ${s.id}`);
        });
      });
    }

    // 根据变更规则变更id
    if (changeField) {
      let changeId = changeField.list.find(l => l.check);
      if (changeId) {
        _.forIn(field, (v, k) => {
          if (changeId.startAdd) {
            v.forEach(s => {
              s.id = changeId.id + _.upperFirst(s.id);
            })
          }
        });
      }
      chart.changeField = changeField;
    }

    return field;
  }


  ok() {
    if (this.showManyError) return;

    const type = this.saleType, chart = angular.copy(this.chart);

    const fieldSale = this.calculateChartField(chart.sale, type);
    const fieldStock = this.calculateChartField(chart.stock);
    const field = {first: fieldSale, second: fieldStock};

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.localOrigin, {type: type, chart: chart});

    // 将计算好的指标保存到local中
    this.basic.setLocal(this.localData, field);

    this.$uibModalInstance.close(field);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("sysAnalyzeCtrl", sysAnalyzeCtrl);
