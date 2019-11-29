class TargetABCCtrl {
  constructor($scope, $uibModalInstance, CommonCon, context) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.abcType = angular.copy(CommonCon.abcStructureTypes);
    // 业态群
    this.operations = {
      com: angular.copy(CommonCon.abcOperationGroupSelect)
    };
    this.selectXY = angular.copy(CommonCon.abcCrossXY);
    //整体
    this.allSelect = angular.copy(CommonCon.abcAllSelect);
    //平均
    this.avgSelect = angular.copy(CommonCon.abcAvgSelect);
    this.context = context;
  }

  init() {
    this.selectTotal = {};
    this.selectAvg = {};
    this.select = {};
    let total = angular.copy(this.operations.com);
    total.map(i => {
      i.name = '[整体ABC]' + i.name
    });
    total.unshift({id: 0, name: '整体ABC'});
    total.map(i => {

    });
    this.operations.total = total;
    this.operations.total.forEach(t => {
      this.selectTotal[t.id] = []
    });
    let avg = angular.copy(this.operations.com);
    avg.map(i => {
      i.name = '[平均ABC]' + i.name
    });
    avg.unshift({id: -1, name: '平均ABC'});
    this.operations.avg = avg;
    this.operations.avg.forEach(a => {
      this.selectAvg[a.id] = []
    });
    this.inputError = {};
    this.disabled = {};
    this.selectXY.forEach(s => {
      this.inputError[s.title] = {lower: {flag: false, msg: ''}, upper: {flag: false, msg: ''}};
      this.disabled[s.title] = false;
    });

    //根据localStorage存储的条件再次初始化
    this.initContext();

  }

  initContext() {
    if (!this.context || !this.context.condition) {
      this.context = {
        condition: {
          precondition: {
            abc: []
          },
          kpiCondition: {}
        }
      };
      return;
    }
    //初始化'平均单品库存'\'平均单品周转'\'铺设门店数'
    let precondition = this.context.condition.precondition;
    this.selectXY.forEach(s => {
      if (precondition[s.title]) {
        this.select[s.title] = precondition[s.title];
      } else {
        precondition[s.title] = {lower: '', upper: ''};
        this.select[s.title] = precondition[s.title];
      }
    });
    //初始化‘整体ABC’ \ ‘平均ABC’
    let abc = this.context.condition.precondition.abc;
    //整体ABC
    let total = abc.find(a => a.field === 'total');
    this.selectTotal[0] = total ? total.tags : [];
    //平均ABC
    let avg = abc.find(a => a.field === 'avg');
    this.selectAvg[-1] = avg ? avg.tags : [];
    this.operations.com.forEach(c => {
      //整体业态ABC
      let total = abc.find(a => a.field === ('operation_type' + c.id));
      this.selectTotal[c.id] = total ? total.tags : [];
      //平均业态ABC
      let avg = abc.find(a => a.field === ('operation_type' + c.id + '_avg'));
      this.selectAvg[c.id] = avg ? avg.tags : [];
    });
  }

  ok() {
    this.getABC(this.selectTotal, 'total');
    this.getABC(this.selectAvg, 'avg');
    this.getKpiCondition();
    _.forIn(this.select, (val, key) => {
      this.context.condition.precondition[key] = val;
    });
    this.$uibModalInstance.close(this.context);
  }


  getABC(obj, type) {
    let items = this.context.condition.precondition.abc;
    Object.keys(obj).forEach(k => {
      //整体
      if (_.eq(type, 'total')) {
        let total = items.find(a => a.field === ('operation_type' + k));
        // 0 为 field 为 total
        if (!total && !_.eq(k, '0') && obj[k].length > 0) {
          items.push({field: 'operation_type' + k, tags: obj[k]});
        } else if (_.eq(k, '0')) {
          let item = items.find(a => _.eq(a.field, type));
          if (item) {
            obj[k].length > 0 ? items[items.indexOf(item)].tags = obj[k] : items.splice(items.indexOf(item), 1);
          } else if (obj[k].length > 0) {
            items.push({field: 'total', tags: obj[k]});
          }
        } else if (total) {
          obj[k].length > 0 ? items[items.indexOf(total)].tags = obj[k] : items.splice(items.indexOf(total), 1);
        }
      }
      //平均
      if (_.eq(type, 'avg')) {
        let avg = items.find(a => a.field === ('operation_type' + k + '_avg'));
        // -1 为 field 为 avg
        if (!avg && !_.eq(k, '-1') && obj[k].length > 0) {
          items.push({field: 'operation_type' + k + '_avg', tags: obj[k]});
        } else if (_.eq(k, '-1')) {
          let item = items.find(a => _.eq(a.field, type));
          if (item) {
            obj[k].length > 0 ? items[items.indexOf(item)].tags = obj[k] : items.splice(items.indexOf(item), 1);
          } else if (obj[k].length > 0) {
            items.push({field: 'avg', tags: obj[k]});
          }
        } else if (avg) {
          obj[k].length > 0 ? items[items.indexOf(avg)].tags = obj[k] : items.splice(items.indexOf(avg), 1);
        }
      }
    });
  }

  getKpiCondition() {
    this.context.kpiCondition = '';
    Object.keys(this.select).forEach(k => {
      let select = this.selectXY.find(s => _.eq(s.title, k));
      if (select && this.select[k] && (this.select[k].lower.toString().length || this.select[k].upper.toString().length)) {
        if (this.select[k].upper.toString().length && this.select[k].lower.toString().length)
          this.context.kpiCondition += `${select.name}[${this.select[k].lower}-${this.select[k].upper}],`;
        else {
          if (this.select[k].upper.toString().length)
            this.context.kpiCondition += `${select.name}[${this.select[k].upper}],`;
          else if (this.select[k].lower.toString().length)
            this.context.kpiCondition += `${select.name}[${this.select[k].lower}],`;
        }
      }
    });
    if (this.context.kpiCondition.length) {
      this.context.kpiCondition = this.context.kpiCondition.substr(0, this.context.kpiCondition.length - 1);
    }
  }

  keyup(type, field) {
    let obj = this.select[type];
    let typeObj = this.selectXY.find(s => _.eq(s.title, type));
    if ((obj.upper && parseInt(obj.upper) !== 0)
      && (obj.lower && parseInt(obj.lower) !== 0)
      && !_.eq(obj[field], '-')
      && parseInt(obj.upper) < parseInt(obj.lower)
      || (type === 'layStoreCnt' && (parseInt(obj.upper) > 200 || parseInt(obj.lower) > 200))) {
      this.disabled[type] = true;
      this.inputError[type][field].flag = true;
      if(type === 'layStoreCnt') {
        if(obj[field] > 200)
          this.inputError[type][field].msg = `最大${typeObj.name}必须小于等于200`;
        else if(obj.lower <= 200 && obj.upper <= 200 && parseInt(obj.lower) > parseInt(obj.upper))
          this.inputError[type][field].msg = `最大${typeObj.name}必须小于等于200 且 大于等于最小${typeObj.name}`;
        else
          this.inputError[type][field].flag = false;
      } else
        this.inputError[type][field].msg = field === 'lower' ? `最小${typeObj.name}必须小于等于${obj.upper}`: `最大${typeObj.name}必须大于等于${obj.lower}`;
    } else {
      let other = field === 'lower' ? 'upper' : 'lower';
      if (this.inputError[type][other].flag)
        this.inputError[type][other].flag = false;
      this.inputError[type][field].flag = false;
      this.disabled[type] = false;
    }
  }

  blur(type, field) {
    let obj = this.select[type];
    if (obj && _.eq(obj[field], '-')) {
      obj[field] = '';
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("targetABCCtrl", TargetABCCtrl);
