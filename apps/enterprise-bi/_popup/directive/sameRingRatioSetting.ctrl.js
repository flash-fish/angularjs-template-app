class SameRingRatioSettingController {
  constructor(Table) {
    this.Table = Table;
  }

  init() {
    this.options = this.options ? this.options : angular.copy(this.Table.YoYToTSetting);
    this.options.line.show = false;
  }

  selectAll() {
    this.options.group.forEach(g => {
      if (this.options.all.value) {
        g.list.forEach(l => {
          l.value = true;
          l.enabled = true;
        })
      } else {
        g.list.forEach(l => {
          l.value = angular.copy(l.defaultValue);
          l.enabled = !angular.copy(l.defaultValue);
        })
      }
    })
  }

  selectOne(obj, parentIndex) {
    _.forIn(this.options.group, (v, i) => {
      if (parentIndex === parseInt(i)) {
        const m = v.list.filter(l => l.value);
        // 不能将全部勾去掉后，但点击依然是勾的值已经绑定了，所以要复原这次的点击前的状态
        if (m.length === 0) {
          v.list.forEach(l => {
            if (_.eq(l.key, obj.key)) {
              l.value = true;
              l.enabled = false;
            } else {
              l.enabled = true;
            }
          })
        }
        // 当去掉一个勾的时候，另一个勾就得显示禁用样式
        if(m.length === 1) {
          v.list.forEach(l => {
            l.enabled = _.eq(l.key, obj.key);
          })
        }
        // 当两个勾的都在的时候， 样式要恢复
        if(m.length === 2) {
          v.list.forEach(l => {
            l.enabled = true;
          })
        }
      }
    });
    //单选影响全选状态
    let all = true;
    this.options.group.forEach(g => {
      if (!g.list.every(l => l.value))
        all = false;
    });
    this.options.all.value = all;
  }
}

angular.module("hs.popups").component("sameRingSetting", {
  templateUrl: 'app/_popup/directive/sameRingRatioSetting.tpl.html',
  controller: SameRingRatioSettingController,
  controllerAs: 'ctrl',
  bindings: {
    options: '='
  }
});
