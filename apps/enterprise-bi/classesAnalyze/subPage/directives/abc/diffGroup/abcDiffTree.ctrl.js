class AbcDiffTreeCtrl {
  constructor(dataService, $scope, $sce, Field, basicService,
              tableService, FigureService, toolService, CommonCon, indexCompleteService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.Field = Field;
    this.CommonCon = CommonCon;
    this.indexComplete = indexCompleteService;
    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.abc);
  }

  init() {
    this.config = {
      fix: [
        {code: "operationsName", width: 190},
      ],
      root: "nodes",
      other: {
        treeInterfaceName: this.name.tree,
        fieldName: 'abc'
      },
      noHeight: true,
      columnGroups: []
    };

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;
      this.field.newTable = this.calculateTableField(this.field.table, this.keys);
      this.getData();

    });

    // 监听keys变动
    this.scope.$watch('ctrl.keys', newVal => {
      // 初始化时候的处理
      if (!newVal || !this.noInit) return;
      this.field.newTable = this.calculateTableField(newVal, this.keys);

      this.getData();
    });

    // 树形表示的分类是没有图表设定的
    this.scope.$emit("tree-hide", true);
  }

  getData() {
    this.config.finish = false;

    let param = this.tool.buildParam(this.tool.getParam(this.param, this.field));

    this.config.other.fields = param.fields;
    this.config.other.date = param.condition.date;
    this.config.other.condition = param.condition;

    const name = param.condition.activeOperationStore;
    param.condition[name] = {
      condition1: name != 'storeContrast' ? param.condition.activeOperation1 : param.condition.store[0],
      condition2: name != 'storeContrast' ? param.condition.activeOperation2 : param.condition.store2[0],
    };

    delete param.condition.activeOperationStore;
    delete param.condition.activeOperation1;
    delete param.condition.activeOperation2;
    delete param.condition.supplier;
    delete param.condition.store;
    delete param.condition.store2;

    if (this.keys.special.pageId) {
      param.pageId = this.keys.special.pageId
    }

    this.basic.setSession('diffAbcParam', param);
    this.basic.packager(this.dataService[this.name.tree](param), res => {
      let data = res.data.details;
      this.summary = res.data.summary;
      let operations = angular.copy(this.CommonCon.abcOperationSelect);

      if (this.keys.diffType != "storeContrast") {
        //  对比类为业态时候的处理
        data.forEach(s => {
          s.operationsName = operations.filter(i => {
            return this.keys.operations[0] == i.id
          })[0].name + s.name;
          if (s.nodes) {
            s.nodes.forEach(d => {
              d.operationsName = operations.filter(i => {
                return this.keys.operations[1] == i.id
              })[0].name + d.name;
            })
          }
        });
      } else {
        //  对比类为门店时候的处理
        data.forEach(s => {
          s.operationsName = this.param.store.val[0].name + s.name;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = this.param.store2.val[0].name + d.name)
          }
        });
      }
      //默认都没选的时候 只展开一级
      this.indexComplete.expand(data, true);
      let tableField = [];
      tableField = [...this.field.newTable];

      if (this.keys.diffType != "storeContrast") {
        tableField = [...this.field.newTable];
      } else {
        tableField = [...this.field.newTable];
        // this.field.newTable.map((item,index)=>{
        //     if(item.indexOf(param.condition.storeContrast.condition1)>3){
        //       tableField[index]=item.replace(param.condition.storeContrast.condition1,1);
        //     }
        //   if(item.indexOf(param.condition.storeContrast.condition2)>3){
        //     tableField[index]=item.replace(param.condition.storeContrast.condition2,2);
        //   }
        // });
      }

      this.table = {
        data: data,
        field: tableField,
      };
      this.data = data;
      this.keys.finish = true;
      this.noInit = true;
    },()=>{
      let res = {
        data: {
          details: [],
          offset: null,
          summary: {},
          total: 0,
        },
      };
      let data = res.data.details;
      this.summary = res.data.summary;
      let operations = angular.copy(this.CommonCon.abcOperationSelect);

      if (this.keys.diffType != "storeContrast") {
        //  对比类为业态时候的处理
        data.forEach(s => {
          s.operationsName = operations.filter(i => {
            return this.keys.operations[0] == i.id
          })[0].name + s.name;
          if (s.nodes) {
            s.nodes.forEach(d => {
              d.operationsName = operations.filter(i => {
                return this.keys.operations[1] == i.id
              })[0].name + d.name;
            })
          }
        });
      } else {
        //  对比类为门店时候的处理
        data.forEach(s => {
          s.operationsName = this.param.store.val[0].name + s.name;
          if (s.nodes) {
            s.nodes.forEach(d => d.operationsName = this.param.store2.val[0].name + d.name)
          }
        });
      }
      //默认都没选的时候 只展开一级
      this.indexComplete.expand(data, true);
      let tableField = [];
      tableField = [...this.field.newTable];

      if (this.keys.diffType != "storeContrast") {
        tableField = [...this.field.newTable];
      } else {
        tableField = [...this.field.newTable];
      }

      this.table = {
        data: data,
        field: tableField,
      };
      this.data = data;
      this.keys.finish = true;
      this.noInit = true;
    })
  }

  /**
   *  计算table指标
   * @param field 预定义好的指标结构
   * @returns {Array} 返回计算好的指标集合
   */
  calculateTableField(field, keys) {
    let topField = [], totalList = [];
    /**
     * 处理需要拼接的指标
     * @param list 当前大模块的指标集合
     * @param needTop 是否需要拼接top指标
     */
    const buildField = (list, needTop) => {
      const basic = list.filter(s => s.join === 1);
      const scale = list.filter(s => s.join === 2);

      const addField = (b, i, t) => {
        const inc = b.inc;
        const field = t ? t + b.id : b.id;


        if (b.id.includes("&")) {//&表示多个指标
          b.id.split("&").forEach((d) => totalList.push(d));

        } else if (b.operation) { //拼接业态指标
          //跨行合并
          this.config.columnGroups.push({text: b.name, name: b.id});
          keys.operations.forEach(s => {
            const field = b.id + s;
            totalList.push(field);
          });

        } else {
          const field = t ? t + b.id : b.id;
          totalList.push(field);
        }

        scale.forEach(s => {
          if (!s.model) return;

          // 当前的增幅字段可能只有部分基础指标需要
          if (s.disKey && !s.disKey.includes(i)) {
            return;
          }

          //&表示多个指标
          if (b.id.includes("&")) {
            b.id.split("&").forEach((d) => totalList.push(d + s.id));
          } else {
            if (b.operation) {
              keys.operations.forEach(d => {
                const field = b.id + d;
                totalList.push(field + s.id);
              });
            } else {
              totalList.push(field + s.id);
            }

          }

          if (s.two) {
            if (inc) {
              if (b.id.includes("&")) {
                b.id.split("&").forEach((d) => totalList.push(d + s.id.replace("Value", "Inc")));
              } else {
                totalList.push(field + s.id.replace("Value", "Inc"));
              }
            } else {
              if (b.id.includes("&")) {
                b.id.split("&").forEach((d) => totalList.push(d + s.id.replace("Value", "")));
              } else {
                totalList.push(field + s.id.replace("Value", ""));
              }
            }
          }
        })
      };

      basic.forEach((b, i) => {
        if (!b.model) return;
        needTop && !b.noType ? topField.forEach(t => addField(b, i, t)) : addField(b, i);
      });

      // 将独立的指标直接push到集合中 join === -1表示该指标独立
      totalList = totalList.concat(list.filter(s => s.join === -1 && s.model).map(s => s.id));
    };

    // 遍历所有的field 输出计算好的数组
    _.forIn(field, (v, k) => {
      const join = v.key.join;

      // 先取出最靠前的field
      if (join === 1) {
        topField = v.list.filter(s => s.model).map(s => s.id);
      }

      buildField(v.list, join > 1);
    });

    const isskuPct = angular.copy(totalList).filter(d => {
      return d == 'skuUnitPct';
    });
    //有售sku占比必须存在
    if (isskuPct.length <= 0) totalList.push('skuUnitPct');
    return totalList;
  }

}

angular.module('hs.classesAnalyze.sub').component('abcDiffTree', {
  templateUrl: 'app/classesAnalyze/subPage/directives/abc/diffGroup/abcDiffTree.tpl.html',
  controller: AbcDiffTreeCtrl,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    name: '<',//接口名字
    keys: '=',
    data: '=', //chart需要的数据
    summary: '=', //table需要的数据
  }
});
