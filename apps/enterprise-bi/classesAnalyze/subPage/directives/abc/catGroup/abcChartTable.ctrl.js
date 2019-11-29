class AbcChartTableController {
  constructor(dataService, DTColumnBuilder, $scope, Field, basicService,
              tableService, CommonCon, toolService, pageService, Pop, Common,
              FigureService, $rootScope, $compile, abcService) {
    this.scope = $scope;
    this.tool = toolService;
    this.page = pageService;
    this.$compile = $compile;
    this.basic = basicService;
    this.root = $rootScope;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.columnBuilder = DTColumnBuilder;
    this.Field = Field;
    this.Pop = Pop;
    this.abcService = abcService;
    this.chartPage = 1;
    this.localChart = CommonCon.local.CHART_DATA_ABC_STRUCTURE;
    // 初始化dataTable实例
    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(this.Field.abc);
    this.newSum = [];
    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

    // this.scope.$watch('ctrl.field.table',(val)=>{
    //   // this.init();
    // })
    this.sortNum = 1;
    this.comeStorByNum = 0;
    this.sort = 'abcTagName';
    this.scope.$on('sortBy', (d, data) => {
      //点击表格排序
      if (this.sortName == data || (this.comeStorByNum == 0 && !this.sortName)) {
        _.forIn(this.fieldInfo, (v, k) => {
          if (data === v.name) {
            this.sort = k;
            this.sortName = v.name;
          }

        });
        this.comeStorByNum++;
        if (this.comeStorByNum == 1) {
          this.sortNum = -1
        } else if (this.comeStorByNum == 2) {
          this.sortNum = 1;
        } else if (this.comeStorByNum == 3) {
          this.sortNum = 1;
          this.sort = 'abcTagName';
          this.comeStorByNum = 0
        }
        this.tableTreeConfige.sortBy = this.sort;
        this.tableTreeConfige.sortNum = this.sortNum;
      } else {
        _.forIn(this.fieldInfo, (v, k) => {
          this.comeStorByNum = 1;
          if (data === v.name) {
            this.sortNum = -1;
            this.sortName = v.name;
            this.sort = k;
            this.tableTreeConfige.sortNum = this.sortNum;
            this.tableTreeConfige.sortBy = k
          }

        });
      }
      this.calsslevel = this.currCatType;
      this.scope.$emit('serch', this.param);
    });

    // 该用户对应的数据权限
    this.session = this.basic.getSession(Common.conditionAccess, false);
    this.isStackShow = true;
    this.endTime = null;
    this.showPie2 = false;
    this.chartField = '';
    // this.scope.$watch("ctrl.pie2", (newVal) => {
    //   if (newVal) {
    //     this.showPie2 = true;
    //   } else {
    //     this.showPie2 = false;
    //   }
    // });
    this.scope.$watch("ctrl.isStackShow", (newVal) => {
      const session = this.basic.getLocal("abc_field_chart");
      if (session && newVal) {
        this.sale = null;
        this.field.chart = session;
      } else {
        this.pie1 = null;
        this.field.chart = session;
      }
    });
    this.currentLevel = {};

    this.scope.$on('goTab', (d, data) => {
      this.goTab(data.id, data.ctrl, data.tags)
    });
  }

  init() {
    // 先将field.chart保存到local中
    const session = this.basic.getLocal("abc_field_chart");
    this.chartField = angular.copy(session);
    if (session && this.isStackShow) this.field.chart = session;

    this.changeChartField(this.field.chart);

    switch (this.keys.active) {
      case 1:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 11)[0];
        this.interfaceName = 'getDataByDate';
        break;
      case 2:
        // 初始化cat type下拉框
        this.catType = angular.copy(this.CommonCon.classLevels);
        this.newCatType = angular.copy(this.CommonCon.classLevels);
        this.currCatType = this.catType[0].id;
        this.current = this.Pop.types.filter(s => s.id === 4)[0];
        //动态获取tab切换的index、调用不同的接口！
        this.interfaceName = 'getClassForABC';
        this.isCatOrClass = true;
        break;
      case 3:
        // 初始化cat type下拉框
        this.newCatType = angular.copy(this.CommonCon.catLevels);
        this.catType = angular.copy(this.CommonCon.catLevels);
        this.currCatType = this.catType[0].id;
        this.current = this.Pop.types.filter(s => s.id === 2)[0];
        this.interfaceName = 'getDataByCategory';
        this.isCatOrClass = true;
        break;
      case 4:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 6)[0];
        this.interfaceName = 'getABCBrandChartTable';
        break;
      case 5:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 1)[0];
        this.interfaceName = 'getDataByStore';
        break;
      case 6:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 7)[0];
        this.interfaceName = 'getDataByProduct';
        break;
      case 7:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 3)[0];
        this.interfaceName = 'getDataByOperation';
        break;
      case 8:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 12)[0];
        this.interfaceName = 'getDataByNewProduct';
        break;
    }
    this.keys.tabs = [
      {id: 1, name: '按整体', active: true},
      {id: 2, name: '按品类组', active: false},
      {id: 3, name: '按类别', active: false},
      {id: 7, name: '按业态群', active: false},
      {id: 5, name: '按门店', active: false},
      {id: 8, name: '按新品', active: false},
      {id: 4, name: '按品牌', active: false},
      {id: 6, name: '按商品', active: false}
    ];
    // 获取表格悬浮式的tab信息
    this.popover = this.tool.getHoverTab(this.keys.tabs, this.keys.active);
    // 初始化column
    this.initColumn();

    // 监听共通条件的变动
    this.tool.watchParam(this, (p) => {
      // 动态构建下拉框的列表
      if (this.keys.active != 2 && this.keys.active != 3) {
        return
      }
      let category = '';
      switch (this.keys.active) {
        case 2:
          //构建品类组下拉框列表
          category = p.classes.val;
          break;
        case 3:
          //构建类别下拉框列表
          category = p.category.val;
          break;
      }

      // 保存查询的条件
      if (p.isSearch_delete || p.isInit_delete || p.isTabChange_delete) {
        delete p.isSearch_delete;
        delete p.isInit_delete;
        delete p.isTabChange_delete;

        this.searchData = angular.copy(p);
      }

      const maxLevel = _.last(angular.copy(this.newCatType)).id;
      let type = this.keys.active == 2 ? this.session.classes : this.session.category;
      this.hideTree = !_.isUndefined(p.hideTree_delete)
        ? p.hideTree_delete
        : category.length !== 1;
      if (this.figure.haveValue(category)) {
        const level = category.length > 1 || category[0].level == maxLevel
          ? category[0].level
          : parseInt(category[0].level) + 1;
        this.catType = this.newCatType.filter(s => parseInt(s.id) >= level);
      } else {
        this.catType = type && type.val && type.val.length ?
          this.newCatType.filter(s => parseInt(s.id) >= parseInt(type.val[0].level)) : angular.copy(this.newCatType);
      }
      // 初始化cat type下拉框
      if (!p.changeLevel && this.catType[0])
        this.currCatType = this.catType[0].id;
      if (!this.hideTree) {
        this.chartKey = {
          url: this.keys.active == 2 ? "getClassParents" : "getCategoryParents",
          name: this.keys.active == 2 ? 'classCode' : "categoryCode",
          session: this.keys.active == 2 ? this.session.classes : this.session.category,
          code: category[0].code,
          level: this.keys.active == 2 ? category[0].level : category[0].level
        };
        this.tool.getTree(this.chartKey, this);
      }
      // 将参数需要的level对象保存到当前scope的currentLevel上
      this.currentLevel = {
        classLevel: this.catType.length === 0 ? parseInt(maxLevel) : parseInt(this.currCatType)
      };
    });

    // 监听table指标变动
    this.tool.watchTable(this);

    // 监听chart分页字段的变化
    this.tool.watchChartPage(this, () => {
      return this.key.param;
    });

    // 监听chart指标变动
    this.tool.watchChart(this, (chart) => {
      if (this.isStackShow) {
        this.changeChartField(chart);
      } else {
        this.changeChartField(chart, 1);
      }
    });

    // 监听chart排序字段的变化
    this.tool.watchSort(this);
    this.tableTreeConfige = {
      fix: [{code: 'operationsName', width: 200}],
      root: "nodes",
      other: {
        fieldName: "abc",
      },
      popover: angular.copy(this.popover),
      tab: this.keys.active,
      sortBy: this.sort,
      sort: 0,//sort==0  代表不需要排序
      sortNum: this.sortNum,
      noHeight: true,
      height: this.keys.active == 6 ? '500px' : null
    };
  }

  changeChartField(field, isStackShow) {
    const chart = field.first;
    if (isStackShow) {
      _.forIn(chart, (val, key) => {
        val.forEach(s => {
          if (!s.id.includes("_")) return;

          const split = s.id.split("_");
          s.id = split[0] + split[1];
        });
        chart[key] = _.uniqBy(val, "id");
      });
    } else {
      _.forIn(chart, (val, key) => {
        val.forEach(s => {
          if (!s.id.includes("_")) return;

          const split = s.id.split("_");

          if (this.keys.active === 1) {
            const last = split[1] && split[1].length !== 1 ? split[1].substr(1) : '';
            s.id = !s.id.includes("Total") ? `${split[0]}Total${last}` : s.id;

          } else {
            s.id = split[0] + split[1];
          }
        });

        chart[key] = _.uniqBy(val, "id");
      });
    }
  }

  /**
   * 初始化表格列信息
   */
  initColumn(isChange) {

    this.tool.changeCol(this.field, isChange, null, (f) => {
      let newfield = [], field = f.newTable;

      if ([1, 6].includes(this.keys.active)) {
        //按商品板块不需要展示ABC类，在此处理
        field.forEach((item, index) => {
          if (item.match("_") == null) {
            newfield.push(item);
          }
        });
      } else {
        // 其余板块需要按abc展示，在此处理
        field.forEach((item, index) => {
          let newItemAgo = '';
          let newItemAgin = '';
          let newItem = '';
          if (item.match("_") != null) {
            const strIndex = item.indexOf('_');
            newItemAgo = item.slice(0, strIndex);
            newItemAgin = item.slice(strIndex + 1);
            newItem = newItemAgo + newItemAgin;
            newfield.push(newItem);
          } else {
            newfield.push(item);
          }
        });
      }
      //按商品不需要展示有售sku数列表；
      if (this.keys.active == 6) {
        let catField = [];
        newfield.map(i => {
          if (i.includes("skuUnit")) {
            catField.push(i)
          }
        });
        if (catField.length !== newfield.length) {
          newfield = newfield.filter(i => {
            return !i.includes("skuUnit");
          })
        }
      }
      this.field.newTable = newfield;
    });

    //到货率字段修改为 arrivalRateYoYInc
    this.field.newTable.forEach((i, index) => {
      if (i.includes('arrivalRate') && i.includes('YoY') && !i.includes('Value')) {
        let newItem = i;
        this.field.newTable[index] = newItem + 'Inc';
      }
    });
    this.buildColumn();
  }

  /**
   * 构建表格数据
   */
  buildOption(param) {
    //请求参数加上preCondition
    let conditionAbc = this.basic.getSession('conditionAbc', true);
    let buildPreConditionAbc = () => {
      const param = this.tool.getParam(param, this.field);
      param.precondition = conditionAbc.condition.precondition;
      return param;
    };
    this.key = {
      isAbc: true,
      interfaceName: this.interfaceName,
      param: conditionAbc ? buildPreConditionAbc() : this.tool.getParam(param, this.field),
      setChart: (d, s) => this.setChartData(d, s),
      setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      addEvent: {name: "click", event: (p, d) => this.addEvent(p, d), func: null},
      appendParam: (s) => this.appendParam(s),
      special: this.keys.special
    };
    this.key.addSum = 'operationsName';
    let Data = this.tool.getData(this.key, this.back, this.keys);
    this.option = this.tableService.fromSource(Data, {
      sort: {0: 1, 1: this.sortNum == 1 ? 'asc' : 'desc'},
      pageLength: this.keys.active == 6 ? 100 : 15,
      fixed: this.keys.active == 1 || this.keys.active == 8 ? 1 : 2,
      compileBody: this.scope
    });
  }

  //整理数据

  appendParam(param) {

    if (this.key.param.condition.tags) {
      param.condition.tags = this.key.param.condition.tags;
    }
    if (this.sort) {
      param.sortBy.field = this.sort;
      param.sortBy.direction = this.sortNum;
    }
    if (this.keys.active == 3) {

      if (param.condition.category) {
        param.condition.category.level = this.currCatType
      } else {
        param.condition.category = {level: this.currCatType};
      }
    }

    if (this.keys.active == 2) param.condition.classLevel = this.currCatType;
    if (this.calsslevel) {
      param.condition.classLevel = this.calsslevel;
      this.currCatType = this.calsslevel;
      this.calsslevel = false;
    }

    // (补丁) 当切到按门店时， condition 的 total 要设成 true
    if (this.keys.active === 5 || param.condition.store) param.condition.total = 'true';
  }

  /**
   * chart 添加点击事件
   * @param myParam
   * @returns {function(*)}
   */
  addEvent(myParam, details) {
    let chartKey = {};
    if (this.keys.active == 2) {
      if (myParam.condition.classLevel == _.last(this.CommonCon.classLevels).id && details && details.length === 1) return null;
      this.initLevelType = this.CommonCon.classLevels;
    } else if (this.keys.active == 3) {
      this.initLevelType = this.CommonCon.catLevels;
      if ((myParam.condition.category.val.length == 0 ? 0 : myParam.condition.category.val[0].level) == _.last(this.CommonCon.catLevels).id) return null;
    }
    return (param) => {
      //只有点击柱状图能够拽入，不是柱状图指直接return；
      if (param.seriesType != 'bar') return;

      if (this.keys.active != 2 && this.keys.active != 3) {

        switch (this.keys.active) {
          case 1:
            //按整体部分拽入；
            if (!this.param.tags || this.param.tags.length == 0) {
              this.param.tags = [param.name.substring(0, 1)];
              this.scope.$emit('serch', this.param);
              this.categoryTree = [{
                name: this.param.tags[0] + '类商品',
                level: 2,
              }]
            }

            break;
          case 7:
            //  按业态群拽入
            if (!this.param.businessOperationGroup || this.param.businessOperationGroup.length == 0) {
              this.param.businessOperationGroup = [];
              this.param.businessOperationGroup.push(this.CommonCon.abcOperationGroupSelect.filter(i => {
                return i.name === param.name;
              })[0].id);
              this.param.show = true;
              this.scope.$emit('serch', this.param);
              this.categoryTree = [{
                name: param.name,
                level: 2,
              }]
            }
            break;
          case 5:
            //按门店拽入
            if (!this.param.store.val || this.param.store.val.length == 0) {
              this.param.store.val = [];
              this.param.store.val.push({code: param.data.name, name: param.name});
              this.param.show = true;
              this.scope.$emit('serch', this.param);
              this.categoryTree = [{
                name: param.name,
                level: 2,
              }]
            }
            break;
          case 4:
            //按品牌拽入
            if (!this.param.brand.val || this.param.brand.val.length == 0) {
              this.param.brand.val = [];
              this.param.brand.val.push({code: param.data.name, name: param.name});
              this.param.show = true;
              this.scope.$emit('serch', this.param);
              this.categoryTree = [{
                name: param.name,
                level: 2,
              }]
            }
            break;
          case 8:
            //按门店拽入
            if (!this.param.newProductYear) {
              this.param.newProductYear = '';
              this.param.newProductYear = param.data.name;
              this.param.show = true;
              this.scope.$emit('serch', this.param);
              this.categoryTree = [{
                name: param.name,
                level: 2,
              }]
            }
            break;
        }

      } else {
        if (!param.data.name) return;
        const params = this.tool.buildParam(this.tool.getParam(this.param, []), this.key.special);
        if (this.keys.active == 2) {
          const levelName = this.CommonCon.classLevelCodeMap[String(param.data.name).length];
          if (levelName) {
            params.condition.classes = {[levelName]: [param.data.name]};
          }
        }
        if (this.keys.active == 3) {
          params.condition.category = {
            level: this.currCatType,
            values: [param.data.name]
          };
        }

        this.basic.checkAccess(params, () => {
          //按品类组和按类别部分处理
          this.chartKey = {
            url: this.keys.active == 2 ? "getClassParents" : "getCategoryParents",
            name: this.keys.active == 2 ? 'classCode' : "categoryCode",
            session: this.keys.active == 2 ? this.session.classes : this.session.category,
            code: param.data.name,
            level: this.keys.active == 2 ? myParam.condition.classLevel : myParam.condition.classLevel
          };
          this.tool.commonChartClick(this, param.name, this.keys.active == 2 ? this.CommonCon.classClick : this.CommonCon.categoryClick);
        })
      }
    }
  }

  /**
   * 面包屑绑定的事件
   * @param code
   * @param level
   * @param name
   */
  getParent(code, level, name) {

    if (this.keys.active == 2 || this.keys.active == 3) {
      this.chartKey.code = code;
      this.chartKey.level = level;
      this.chartKey.session = this.keys.active == 2 ? this.session.classes : this.session.category;
      this.tool.commonChartClick(this, name, this.keys.active == 2 ? this.CommonCon.classClick : this.CommonCon.categoryClick);
    } else {
      this.param.tags = [];
      this.param.businessOperationGroup = [];
      this.param.store.val = [];
      this.param.newProductYear = '';
      this.param.brand.val = [];
      this.categoryTree = [];
      this.scope.$emit('serch', this.param);

    }

  }

  /**
   * 切换层级触发
   */
  changeLevel() {
    this.param = Object.assign({}, this.param, {changeLevel: true});
  }

  getNewSum(summary) {

    this.newSum = [];
    this.field.newTable.map(s => {
      let i = {};
      let dataSpan = '';
      let yoyDataSpan = '';
      let data = '';
      let yoyData = '';
      let pctData = '';
      if (!s.includes('YoY') && !s.includes('Pct') && s.includes('Total')) {
        let info = this.fieldInfo[s];
        if (info.sale) {
          data = this.figure.thousand((summary[s] / 10000), 2) + `万元`;
          dataSpan = angular.copy(this.figure.thousand(summary[s], 2));
          yoyDataSpan = angular.copy(summary[`${s}YoYValue`] || summary[`${s}YoYValue`] == 0 ? this.figure.thousand(summary[`${s}YoYValue`], 2) : '');
          yoyData = summary[`${s}YoYValue`] || summary[`${s}YoYValue`] == 0 ? this.figure.thousand(summary[`${s}YoYValue`] / 10000, 2) + `万元` : '';
        } else {
          if (s.includes('layStoreCnt') || s.includes('skuUnitTotal')) {
            //铺市门店数不要小数点
            data = this.figure.thousand(summary[s], 0);
            yoyData = summary[`${s}YoYValue`] || summary[`${s}YoYValue`] == 0 ? this.figure.thousand(summary[`${s}YoYValue`], 0) : '';
          } else if (s == 'arrivalRateTotal') {
            data = this.figure.thousand(summary[s], 2) + '%';
            yoyData = summary[`${s}YoYValue`] || summary[`${s}YoYValue`] == 0 ? this.figure.thousand(summary[`${s}YoYValue`], 2) + '%' : '';
          } else {
            data = this.figure.thousand(summary[s], 2);
            yoyData = summary[`${s}YoYValue`] || summary[`${s}YoYValue`] == 0 ? this.figure.thousand(summary[`${s}YoYValue`], 2) : '';
          }

        }
        if (s.includes('arrivalRate')) {
          pctData = summary[`${s}YoYInc`] ? this.figure.thousand(summary[`${s}YoYInc`], 2) : '-';
        } else {
          pctData = summary[`${s}YoY`] ? this.figure.scale(summary[`${s}YoY`], true) + '%' : '-';
        }
        if (s.includes('layStoreCnt')) {
          pctData = summary[`${s}YoY`] ? this.figure.scale(summary[`${s}YoY`], true) + '%' : '';
        }

        i = {
          dataSpan: dataSpan,
          yoyDataSpan: yoyDataSpan,
          name: info.name,
          data: data,
          yoyData: yoyData,
          pctData: pctData,
        };
        this.newSum.push(i);
      }

    });
    // this.sum = this.field.newTable.map(s => {
    //   const info = this.fieldInfo[s];
    //   return {
    //     name: info.name,
    //     data: summary[s],
    //     hoverData: summary[s]
    //   }
    // })
  }

  /**
   * 构建chart所需要的数据
   * @param data
   * @param summary
   */
  setChartData(data, summary) {

    this.getNewSum(summary);
    this.getTableTree(data);
    let key = this.tool.basicKey(this.current, this.fieldInfo, data);
    this.tool.getChartOption(key, this, summary);
    if (this.sale) {
      if (this.sale.series.length > 1) {
        let newArr = [];
        let newArrYoY = [];
        let newArrNoYoY = [];
        for (let value of this.sale.series.values()) {
          if (value.name.includes('-')) {
            newArrYoY.unshift(value);
          } else {
            newArrNoYoY.unshift(value);
          }
        }
        newArr = _.concat(newArrNoYoY, newArrYoY);
        this.sale.series = newArr;
        this.sale.tooltiptrigger = 'axis';
        this.sale.tooltip.formatter = (params) => {
          let newParams = [];
          let newParamsYoY = [];
          let newParamsNoYoY = [];
          params.map(i => {
            if (i.seriesName.includes('-')) {
              newParamsYoY.unshift(i);
            } else {
              newParamsNoYoY.unshift(i);
            }
          });
          newParams = _.concat(newParamsNoYoY, newParamsYoY);
          let newString = newParams[0].axisValueLabel + '</br>';

          newParams.map(i => {
            if (i.seriesName.includes("周转天数")) {
              newString += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${i.color}"></span>` + i.seriesName + '：' + this.figure.thousand(i.value, 2) + '</br>'
            } else {
              newString += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${i.color}"></span>` + i.seriesName + '：' + this.figure.thousand(i.value, 0) + '</br>'
            }
          });
          return newString;
        }
      }

      this.sale.series.forEach(i => {
        if (i.type === 'bar') {
          i.barMaxWidth = 200;
        }
      })
    }
    let p1 = angular.copy(this.field.chart.first).bar;
    let p2 = angular.copy(this.field.chart.first).bar;
    p1 = p1.filter(d => {
      return !d.id.includes('YoYValue')
    });
    p2 = p2.filter(d => {
      return d.id.includes('YoYValue')
    });

    this.pie1 = this.abcService.buildPieChart(p1, summary, this.fieldInfo);
    if (JSON.stringify(summary) == "{}") {
      this.pie1.legend = {};
      this.sale.legend = {};
    }
    if (p2.length) {
      this.showPie2 = true;
      this.pie2 = this.abcService.buildPieChart(p2, summary, this.fieldInfo);
      if (JSON.stringify(summary) == "{}") {
        this.pie2.legend = {};
      }
    } else {
      this.showPie2 = false;
      delete this.pie2;
    }
  }

  changeTabClick(curr, self) {
    let data = {
      active: this.keys.active,
      selfData: self
    };
    self.scope.$emit('changeTab', data)

  }

  /*
  * 构造table tree 数据
  * data：后台获取的数据
  */
  getTableTree(data) {
    switch (this.keys.active) {
      case 1:
        data.forEach(s => {
          s.operationsName = s.abcTagName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.abcTagName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 2:
        data.forEach(s => {
          s.operationsName = ' [' + s.classCode + '] ' + s.className;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.className + '[' + d.abcTag + ']')
          }
        });
        break;

      case 3:
        data.forEach(s => {
          s.operationsName = ' [' + s.categoryCode + '] ' + s.categoryName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.categoryName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 4:
        data.forEach(s => {
          s.operationsName = s.brandName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.brandName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 5:
        data.forEach(s => {
          s.operationsName = ' [' + s.storeCode + '] ' + s.storeName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.storeName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 6:
        data.forEach(s => {
          s.operationsName = ' [' + s.productCode + '] ' + s.productName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.productName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 7:
        data.forEach(s => {
          s.operationsName = s.businessOperationName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.businessOperationName + '[' + d.abcTag + ']')
          }
        });
        break;
      case 8:
        data.forEach(s => {
          s.operationsName = s.newProductName;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = s.newProductName + '[' + d.abcTag + ']')
          }
        });
        break;

    }

    let tableField = this.field.newTable.map(item => {
      if (item.includes('Total')) {
        return item;
      }
    });


    if (data.length == 1 && data[0].operationsName == "整体合计") {
      data = [];
    }
    this.tableTreeData = {
      data: data,
      field: _.compact(tableField)
    };

  }

  /**
   * 构建dataTable的column
   */
  buildColumn() {
    //固定列配置
    this.fix = [
      {
        code: this.current.title,
        render: (data, t, f) => {
          let key = {
            code: f[this.current.code]
          };
          // levelMap
          if (key.code) {
            key.level = this.CommonCon.classLevelMap[key.code.toString().length];
          }
          if (this.keys.active == 3) {
            if (key.code) {
              key.level = this.CommonCon.catLevelMap[key.code.toString().length];
            }
          }
          if (data == '整体合计' || data == undefined) {
            data = '整体合计';
            return data;
          } else {
            this.root.showLine = 2;
            return this.tool.buildPopover(data, f._id, key, this);
          }
        }
      }
    ];
    if (this.keys.active != 8 && this.keys.active != 1) {
      this.fix.push(this.current.showCode ? this.current.showCode : this.current.code)
    }
    const fieldInfo = this.Field.abc;
    this.newTableSort(this.field.newTable);
    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, fieldInfo);
  };

  goTab(id, ctrl, tags) {
    this.scope.$emit('showLine', true);
    //如果是子类跳转 那么加上ABC类型
    if (tags) {
      const contentBig = angular.copy(ctrl.currPopover);
      let routerkeyBig = {
        code: 'tags',
        value: [contentBig.abcType]
      };
      let dataBig = {
        key: {sign: 'tags'},
        value: routerkeyBig.value,
      };
      this.key.param.condition.tags = routerkeyBig.value;
      this.scope.$emit(this.CommonCon.changeTab, dataBig);
    }

    // 下面代码根据前人所写逻辑进行重写，虽然也不好，但已尽力
    const arrayCon = ['[A]', '[B]', '[C]'];
    //如果不是子类  的处理逻辑
    const conditionField = [
      {id: 1, field: 'tags', array: 1},
      {id: 7, field: 'businessOperationGroup', array: 1},
      {id: 8, field: 'newProductYear'},
    ];
    const activeTab = conditionField.find(c => c.id === this.keys.active);
    if (activeTab) {
      const content = angular.copy(ctrl.currPopover);
      let haveABC = [];
      arrayCon.forEach(str => {
        const type = str.substring(1,2);
        if (content.name.includes(str) || (this.keys.active === 1 && content.name.includes(type)))
          haveABC.push(type)
      });
      let data;
      if (haveABC.length) {
        data = [];
        data.push({
          tabIndex: id,
          key: {sign: 'tags'},
          value: haveABC,
        });
        this.key.param.condition.tags = haveABC;
      }
      if (activeTab.id !== 1) {
        const value = activeTab.array ? [Number(content.code)] : Number(content.code);
        const item = {
          tabIndex: id,
          key: {sign: activeTab.field},
          value: value,
        };
        if (data && data.length) data.push(item);
        else data = item;
        this.key.param.condition[activeTab.field] = value;
      }
      this.scope.$emit(this.CommonCon.changeTab, data);
    } else {
      // 这个补丁是=>搜索条件上不要带abc的分类，也不要code
      ctrl.getTags = data => {
        const currPopover = angular.copy(ctrl.currPopover);
        const name = currPopover.name.split(`[${currPopover.code}]`)[0];
        const res = [];
        arrayCon.forEach(str => {
          let dataContent = data.value.val[0].name;
          const code = data.value.val[0].code;
          // 判断,将ABC去掉
          if (name.includes(str)) {
            const tags = {
              tabIndex: id,
              key: {sign: 'tags'},
              value: [str.substring(1,2)]
            };
            res.push(tags);
            data.value.val[0].name = _.trim(dataContent.replace(str, ''));
          }
          // 判断,将code去掉
          if (data.value.val[0].name.includes(`[${code}]`))
            data.value.val[0].name = data.value.val[0].name.replace(`[${code}]`, '');
        });
        if (this.keys.active === 6) {
          let dataContent = data.value.val[0].name;
          const tableData = ctrl.table.data;
          const productCode = tableData.find(t => t.productId === Number(data.value.val[0].code)).productCode;
          data.value.val[0].name = _.trim(dataContent.replace(`[${productCode}]`, ''));
        }
        if (res.length) res.push(data);

        return res.length ? res : data;
      };
      this.tool.goTab(id, ctrl)
    }
  };

  //表格重新排序；
  newTableSort(value) {
    let newTable = [];
    let skuTable = [];
    // 遍历当前表格数据
    _.forEach(value, (item, index) => {
      //提取当前循环的表头信息
      newTable = _.concat(newTable, _.slice(value, [0], [1]));
      _.pullAll(value, [value[0]]);
      _.forEach(value, (item, index) => {
        // 检测当前数组是否包含
        if (item.match("skuUnitTotal")) {
          skuTable.push(item);
          if (item === "skuUnitTotal") {
            skuTable.unshift(item);
          }
        }
        ;
        if (item.match(_.last(newTable))) {
          newTable.push(item)

          // 包含
        }
      });
      // 数组去重
      this.field.newTable = _.uniq(_.concat(newTable, skuTable));
    })


  }

}

angular.module('hs.classesAnalyze.sub').component('abcChartTable', {
  templateUrl: 'app/classesAnalyze/subPage/directives/abc/catGroup/abcChartTable.tpl.html',
  controller: AbcChartTableController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
