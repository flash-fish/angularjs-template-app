angular.module("hs.popups")
  .factory("popupToolService", (alert, Pop, Symbols) => {
    return {
      /**
       *
       * @param currList
       */
      dealBigModule(currList) {
        currList.filter(s => s.join === 2).forEach(s => {

          // 如果基础指标全都没有选中 那么增幅指标全部disable 并且值清空
          const zero = currList.filter(s => s.join === 1 && s.model).length === 0;
          s.disable = zero;
          if (zero) s.model = false;

          // 判断特殊的基础指标(disKey作为第一个指标是否disable的属性)
          if (s.disKey) {
            const special = currList.filter((l, i) => l.join === 1 && l.model && s.disKey.includes(i)).length === 0;
            s.disable = special;
            if (special) s.model = false;
          }

          // 当选中一些指标（可以让join = 2 可选）时，需要默认其有值
          if (s.keepActive) {
            const special = currList.filter((l, i) => l.join === 1 && l.model && s.keepActive.includes(i)).length === 0;
            s.disable = special;
            if (special) s.model = false;
            else s.model = !special;
          }

        });
      },

      /**
       *
       * @param parent
       * @param list
       * @param fields
       */
      effectBigModule(parent, list, fields) {
        // 判断当前指标是否存在disValue（用于影响其他大模块的指标）
        const disValue = parent.key.disValue;
        if (disValue) {
          disValue.forEach(dis => {
            const effect = dis.effect;
            const zero = list.filter((s, i) => dis.cause.includes(i) && s.model).length === 0;

            _.forIn(fields, (v, k) => {
              if (v.key.name === parent.key.name || !effect[k]) return;

              v.list.filter((s, i) => effect[k].includes(i))
                .forEach(s => {
                  s.disable = zero;
                  if (zero) s.model = false;
                });

              // 判断单个大指标内的逻辑
              this.dealBigModule(v.list);

              // 控制全选按钮的逻辑
              const allDisable = v.list.filter(s => !s.disable && s.id).length === 0;

              v.disable = allDisable;
              if (allDisable) v.all = false;
            });
          });
        }
      },

      /**
       * table指标 单选的基础逻辑
       * @param key 当前指标所在的父级对象key
       * @param fields 所有的指标
       */
      tableSelectOne(key, fields) {
        const parent = fields[key];
        const list = parent.list.filter(s => s.id);
        const checks = list.filter(s => s.model && s.id).length;

        // 判断全选按钮是否选中
        parent.all = checks === list.length;

        this.effectBigModule(parent, list, fields);

        // 判断单个大指标内的逻辑
        this.dealBigModule(list);

        // this.buildSale(parent, fields);
      },

      /**
       * table指标 全选的基础逻辑
       * @param curr 当前指标
       * @param fields 所有的指标
       */
      tableSelectAll(curr, fields) {
        // 全选按钮切换时 指标联动
        curr.list.forEach(s => {

          // 如果不是比率类型的指标 并且当前disable掉了 则不能选中
          s.model = s.join === 1 && s.disable && !s.readOnly ? false : s.readOnly ? true : curr.all;

          // 如果全选按钮选中 清除disable效果
          if (s.join === 2) s.disable = !curr.all;
        });

        this.effectBigModule(curr, curr.list.filter(s => s.id), fields);

      },

      changeLine(list) {
        const checks = list.filter(s => s.check);
        const error = checks.length > 2;

        // change line
        list.filter(s => s.lineDisable).forEach(s => s.lineDisable = false);

        if (checks.length) {
          list.forEach(s => {
            s.lineDisable = !_.eq(checks[0].group, s.group);
          });
        }

        return error;
      },

      /**
       * chart 指标切换时 状态的判断
       * @param val
       * @param all
       * @param curr
       * @param option 配置
       */
      changeChartState(val, all, curr, option) {
        option = option || {};
        let showError = false;

        // 折线图指标change逻辑
        if (val.key.checkbox) {
          showError = this.changeLine(val.list, curr);
        } else {
          // 柱状图指标change逻辑
          val.list.forEach(s => s.check = s.id === curr.id);
        }

        if (!val.key.basic) return showError;

        _.forIn(all, (v, k) => {
          if (v.key.basic) return;

          // 判断当前指标是否影响上年同期
          if (val.key.last) {
            val.key.last.disable = curr.last;
            if (curr.last) val.key.last.active = false;
          }

          // 判断当前指标是否影响上年同期（特殊情况下: 参照新品sku对比分析页面， 同期隐藏，而且要保持着选中状态，只有某些不需要选中）
          if (curr.disLast) {
            val.key.last.disable = curr.disLast;
            val.key.last.active = false;
          } else if (val.key.last && val.key.last.keepActive) {
            val.key.last.disable = angular.copy(!val.key.last.keepActive);
            val.key.last.active = angular.copy(val.key.last.keepActive);
          }

          // 对list中的指标进行重新检查
          v.list.forEach((s, index) => {
            const dis = curr.disKey;
            const noType = option.businessType && s.noType ? ![s.noType, 'all'].includes(option.businessType) : false;

            const disObj = dis && dis[k];

            s.disable = noType || disObj && dis[k][0].includes(index);

            // 指标联动
            const lin = curr.linkAge;

            const [linkS, ageS] = [
              lin && lin.link, lin && lin.age
            ];

            if(linkS && linkS[0].includes(index)) {
              s.check = true;
            }

            if( ageS && ageS[0].includes(index)) {
              s.check = false;
            }
          });

          const error = v.list.filter(s => s.disable && s.check);
          if (error && error.length > 0) {
            const index = v.key.forceIndex === 'end' ? v.list.length - 1 : v.key.forceIndex;
            v.list.forEach((s, i) => s.check = i === index);
          }
        });

        // 选中柱图是否影响line
        if (val.key.bindLine) {
          val.key.bindLine.forEach(v => {
            const checkup = ids => {
              if (angular.isArray(ids)) {
                ids.forEach((i, k) => ids[k] = i + v);
                all.line.list.forEach(l => {
                  l.check = ids.includes(l.id);
                });
              } else {
                all.line.list.forEach(l => {
                  l.check = l.id === (ids + v);
                });
              }
            };

            if (curr.unBindLine && curr.unBindLine.includes(v)) {
              all.line.list.forEach(l => {
                l.check = false;
              });
            } else if (curr.id.includes('&')) {
              let ids = curr.id.split('&');
              checkup(ids);
            } else checkup(curr.id);

          })
        }

        showError = this.changeLine(all.line.list);

        return showError;
      },

      /**
       * 计算table中选中的model个数
       * @param field field是table结构
       * @returns int
       * */
      calculateTableModelNum(field) {
        let num = 0;
        _.forIn(field, function (value, key) {
          num += value.list.filter(s => s.id && s.model && !s.isHidden).length;
        });

        return num;
      },

      /**
       * 由于local大小限制 所以要构建一个简单的结构保存指标
       * @param field
       * @param isBoss
       * @returns {*}
       */
      buildSimpleField(field, isBoss) {
        let localField = angular.copy(field);

        function dealField(f) {
          _.forIn(f, (val, key) => {
            delete val.key;

            val.list = val.list.map(s => {
              return {
                id: s.id,
                disable: s.disable,
                model: s.model
              }
            });
          });
        }

        if (isBoss) {
          _.forIn(localField, (val, key) => {
            dealField(val);
          });
        } else {
          dealField(localField);
        }

        return localField;
      },

      /**
       * 分类的name加上level
       */
      addLevel(selected, levels) {
        const sel = angular.copy(selected);

        if (sel.length == 0) return sel;

        const level = levels.filter(s => s.id == sel[0].level)[0].name;
        sel.forEach(s => {
          if (!s.name.includes(level + "-")) {
            s.name = level + "-" + s.name;
          }
        });

        return sel;
      },

      /**
       * 单击某一个值触发的事件
       * @param curr 当前点击的
       * @param currList 当前的列表
       * @param selected 当前已选中的
       * @param key 配置
       * @returns {*}
       */
      choose(curr, currList, selected, key, level) {

        let sel = angular.copy(selected);
        let content = key.content ? key.content
          : {code: String(curr[key.type.code]), name: curr[key.type.title]};

        if (key.type.showCode) content.showCode = curr[key.type.showCode];

        if (key.multi) {
          const i = curr.selected ? -1 : 1;
          const result = this.control(i, selected.length, key.maxCount);
          if (result) return;

          curr.selected = !curr.selected;

          //编码Tab，当选的层级和之前选中的层级不一样时，清除之前的层级
          if (level === 0 && sel.length && curr.selected) {
            if (sel[0].level !== content.level) sel = []
          }

          curr.selected
            ? sel.push(content)
            : _.remove(sel, (n) => n.code == curr[key.type.code]);

        } else {
          sel = [];
          currList.selected = curr[key.type.title];
          sel.push(key.content);
        }

        return sel;
      },

      /**
       * 重置
       * @param list
       * @param selected
       * @param isMulti
       */
      reset(list, selected, isMulti) {
        selected = [];
        let sel = angular.copy(selected);

        if (isMulti) {
          list.filter(b => b.selected === true)
            .forEach(b => b.selected = false);
        } else {
          list.selected = "";
        }

        return sel;
      },

      /**
       * 更新列表选中状态
       * @param list
       * @param selected
       * @param code
       */
      updateSelected(list, selected, code) {
        if (!list) return;

        list.forEach(b => {
          b.selected = selected.map(a => String(a.code)).includes(b[code].toString());
        });
      },

      /**
       * 检查选择的指标是否超出限制
       * @param ready 当前操作的选中的指标
       * @param selected 已经选好的指标
       * @param maxCount 最大数量
       * @returns {boolean}
       */
      control(ready, selected, maxCount) {
        const max = maxCount ? maxCount : 200;

        if (_.eq(max, Pop.unlimited)) return result;

        let result = ready + selected > max;

        if (result) alert(`最多只能选择${max}项`);

        return result;
      },

      reverse(list, select, maxCount) {
        const unSel = list.filter(s => !s.selected);
        const outLength = list.length - unSel.length;
        return this.control(unSel.length, select.length - outLength, maxCount);
      },

      all(list, select, maxCount) {
        const unSel = list.filter(s => !s.selected);
        return this.control(unSel.length, select.length, maxCount);
      },

      /**
       * 反选
       * @param list 当前显示的列表
       * @param selected 当前已选中的值
       * @param type 当前的业务类型
       * @param maxCount 最大个数
       * @param unLimit 不限制个数
       * @returns {*}
       */
      reverseChoose(list, selected, type, maxCount, unLimit, level) {
        if (this.reverse(list, selected, maxCount) && !unLimit) return;

        list.forEach(c => c.selected = !c.selected);

        const filter = list.filter(c => c.selected).map(s => {
          // 反选时和单选一样得判断是否有showCode
          return Object.assign({
            code: String(s[type.code]),
            name: s[type.level] ? `${s[type.level]}-${s[type.title]}` : s[type.title],
            level: s.level
          }, type.showCode ? {showCode: s[type.showCode]} : {});
        });

        //编码Tab，当选的层级和之前选中的层级不一样时，清除之前的层级
        if (level === 0 && selected.length && filter.length) {
          if (selected[0].level !== filter[0].level) selected = []
        }

        selected = _.union(selected, filter);

        _.remove(selected, (s) => {
          return list.filter(c => !c.selected).map(c => String(c[type.code])).includes(s.code);
        });

        return selected;
      },

      /**
       * 全选
       * @param list 当前显示的列表
       * @param selected 当前已选中的值
       * @param type 当前的业务类型
       * @param maxCount 最大个数
       * @param unLimit 不限制个数
       * @returns {*}
       */
      allChoose(list, selected, type, maxCount, unLimit, level) {
        if (this.all(list, selected, maxCount) && !unLimit) return;

        list.forEach(c => c.selected = true);

        _.remove(selected, (s) => {
          return list.filter(c => c.selected).map(c => String(c[type.code])).includes(s.code);
        });

        const filter = list.filter(c => c.selected).map(s => {
          // 全选时应和单选一样得判断是否有showCode
          return Object.assign({
            code: String(s[type.code]),
            name: s[type.level] ? `${s[type.level]}-${s[type.title]}` : s[type.title],
            level: s.level
          }, type.showCode ? {showCode: s[type.showCode]} : {});

        });

        //编码Tab，当选的层级和之前选中的层级不一样时，清除之前的层级
        if (level === 0 && selected.length && filter.length) {
          if (selected[0].level !== filter[0].level) selected = []
        }

        return _.union(selected, filter);
      },

      /**
       * 监听 销售类型
       * popup chart
       */
      watchType(scope, chart, func) {
        scope.$watch("ctrl.saleType", (newVal, oldVal) => {
          if (_.isEqual(newVal, oldVal)) return;

          const curr = chart.sale;

          const deal = (val, isLine) => {
            val.list.forEach((s, i) => {
              if (!s.noType && !isLine) return;

              const key = s.noType, types = ["all"];
              if (key) typeof key === 'string' ? types.push(key) : types.push(...key);

              s.disable = key && !types.includes(newVal);
            });

            // 重新按bar来初始化line的选择属性
            this.changeChartState(curr.bar, curr, curr.bar.list.find(l => l.check), {businessType: newVal});

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
      },

      /**
       * 检测编码tab下的搜索内容 只能输入数字、逗号
       */
      isUnvalidated(value, self) {
        if (self.level !== 0) return false;

        const pattern = /^[\d,]*$/g;
        const result = pattern.test(value);
        self.errorInfo = result ? "" : "只能输入数字、逗号(半角)，不能含空格";

        if (self.errorInfo) {
          self.initList = [];
          self.total = 0;
          return true
        } else {
          return false
        }
      },

      /**
       * 返回未匹配的code
       */
      checkReturnData(res) {
        let msg = res.message;
        if (_.isUndefined(msg)) return "";

        msg = msg.replace(/,$/gi, "");
        return msg ? `存在未匹配到Code：${msg}` : '';
      },

      /**
       * search含逗号的场合
       * 比较品类组、分类输入的内容是否为同一级别
       * @param value:search
       * @param name: 类别/品类组
       * @param self: this
       */
      compareLevel(value, name, self) {
        //去除空格
        const result = value.replace(/\s+/g, "");

        let arr = result.split(',');

        function unique(arr) {
          return Array.from(new Set(arr))
        }

        function reset() {
          self.initList = [];
          self.total = 0;
        }

        if (arr.length) {
          let warnMsg = "";
          let newArray = unique(arr).filter(m => m !== '');

          const comp = newArray[0];
          const isDiffLevel = newArray.some(e => comp.toString().length !== e.toString().length);

          if (isDiffLevel) {
            reset();
            return `查询的${name}必须为同一层级`;
          }

          if (self.dis_level === 'true') {//手动指定某个权限时
            let level = self.param.level;
            let levelObj = self.catLevels.filter(l => l.id === level)[0];

            const isDiffLength = newArray.some(e => levelObj.len !== e.toString().length);
            if (isDiffLength) {
              reset();
              return `只能查询${levelObj.name}`
            }

          } else if (self.curLevel) {//后台设置了权限时
            let level = self.curLevel;
            const catLevels = angular.copy(self.catLevels).filter(d => d.id > level - 1);

            newArray.forEach(m => {
              const sameLength = catLevels.find(c => c.len === m.toString().length);
              if (!sameLength) {
                warnMsg = this.getLevelName(self.curLevel, catLevels);
                reset();
                return
              }
            });
          }

          if (warnMsg) return warnMsg;

        }
      },

      /**
       * 获取有权限层级的name
       */
      getLevelName(curLevel, catLevels) {
        let msg = [];
        catLevels.forEach(d => {
          if (d.id > curLevel - 1) msg.push(d.name)
        });
        const result = msg.join(Symbols.slash);
        return "只能查询" + result
      },

      /**
       * search不含逗号的场合
       */
      compareLevelForOne(value, self) {
        if (!value.length) return '';

        function reset() {
          self.initList = [];
          self.total = 0;
        }

        if (self.dis_level === 'true') {//手动指定某个权限时
          let level = self.param.level;
          let levelObj = self.catLevels.filter(l => l.id === level)[0];

          const isDiffLength = levelObj.len !== value.toString().length;
          if (isDiffLength) {
            reset();
            return `只能查询${levelObj.name}`;
          }

        } else if (self.curLevel) {//后台设置了权限时
          const catLevels = angular.copy(self.catLevels).filter(d => d.id > self.curLevel - 1);

          const sameLength = catLevels.find(c => c.len === value.toString().length);
          if (!sameLength) {
            reset();
            return this.getLevelName(self.curLevel, catLevels);
          }
        }
      },

      /**
       * 同比环比设定获取
       */
      getSameRingRatioOption(options) {
        let unIncludeFields = [];
        options.group.forEach(g => {
          unIncludeFields = g.list.filter(l => !l.value).map(l => l.key).concat(unIncludeFields);
        });
        return {unIncludeFields};
      }
    }
  })
  .factory("popupDataService", ($rootScope, ajaxService, action, popups, Pop) => {

    const reject = () => $rootScope.reject();
    const rejectRequest = () => $rootScope.rejectRequest();

    return {
      openStore(param) {
        /**
         * 获取门店列表
         * @param param 门店列表初始化的值 {name: '', district: '', operation: '', selected: []}
         * @param districtFunc 地区promise
         * @param operationFunc 业态promise
         * @param storeFunc 门店promise
         * @returns {*}
         */
        let newParam = {
          name: "",
          district: "",
          operation: "",
          selected: []
        };
        Object.assign(newParam, param);

        const _district = params => {
          return ajaxService.post(action.common.getDistrictList, params);
        };
        const _operation = params => {
          return ajaxService.post(action.common.getOperationList, params);
        };
        const _store = params => {
          return ajaxService.post(action.common.getStoreList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupStore({
          param: newParam,
          districtFunc: _district,
          operationFunc: _operation,
          storeFunc: _store,
          moduleId: Pop.module
        });
      },

      /**
       * 分类的popup
       * @param param
       * @returns {*}
       */
      openCategory(param) {
        const _getCategories = params => {
          return ajaxService.post(action.common.getCategoryList, params);
        };

        const _getSubCatsByLevelAndCat = params => {
          return ajaxService.post(action.common.getSubCategoryLevelList, params);
        };

        let newParam = {
          selected: [],
          moduleId: Pop.module,
          multi: param.multi,
          level: param.selected.length ? param.selected[0].level : 0
        };

        Object.assign(newParam, param);

        if (reject()) return rejectRequest();

        return popups.popupCategory({
          param: newParam,
          getTree: _getCategories,
          getSubList: _getSubCatsByLevelAndCat
        });
      },

      openClass(param) {
        const _getClassList = params => {
          return ajaxService.post(action.common.getClassList, params);
        };

        const _getSubClassLevelList = params => {
          return ajaxService.post(action.common.getSubClassLevelList, params);
        };

        let newParam = {
          selected: [],
          moduleId: Pop.module,
          multi: param.multi,
          level: param.selected.length ? param.selected[0].level : 0
        };
        Object.assign(newParam, param);

        if (reject()) return rejectRequest();

        return popups.popupClass({
          param: newParam,
          getTree: _getClassList,
          getSubList: _getSubClassLevelList
        });
      },

      openSupplier(param) {
        /**
         * 获取供应商列表
         * @param param 供应商列表初始化的值 {selected: []}
         * @param operationFunc 供应商promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _promise = params => {
          return ajaxService.post(action.common.getSupplierList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupSupplier({
          param: newParam,
          promiseFunc: _promise,
          moduleId: Pop.module
        });
      },

      openContrastStore(param) {
        const _promise = params => {
          return ajaxService.post(action.common.getContrastStore, params);
        };

        /**
         * 获取可比门店列表
         * @param param 可比门店列表初始化的值 {selected: []}
         * @param promiseFunc 可比门店promise
         * @returns {*}
         */
        if (reject()) return rejectRequest();

        return popups.popupContrastStore({
          param: param,
          promiseFunc: _promise,
          moduleId: Pop.module
        });
      },


      openBrand(param) {
        /**
         * 获取品牌列表
         * @param param 品牌列表初始化的值 {selected: []}
         * @param operationFunc 品牌promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _promise = params => {
          return ajaxService.post(action.common.getBrandList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupBrand({
          param: newParam,
          promiseFunc: _promise,
          moduleId: Pop.module
        });
      },

      openStoreGroup(param) {
        /**
         * 获取店群列表
         * @param param 店群列表初始化的值 {selected: []}
         * @param promiseFunc 店群promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _promise = params => {
          return ajaxService.post(action.common.getStoreGroup, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupStoreGroup({
          param: newParam,
          promiseFunc: _promise,
          moduleId: Pop.module
        });
      },

      openOperation(param) {
        /**
         * 获取业态列表
         * @param param 业态列表初始化的值 {selected: []}
         * @param operationFunc 业态promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _operation = params => {
          return ajaxService.post(action.common.getOperationList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupOperation({
          param: newParam,
          promiseFunc: _operation,
          moduleId: Pop.module
        });
      },

      openDistrict(param) {
        /**
         * 获取地区列表
         * @param param 地区列表初始化的值 {selected: []}
         * @param districtFunc 地区promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);
        const _district = (params) => {
          return ajaxService.post(action.common.getDistrictList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupDistrict({
          param: newParam,
          promiseFunc: _district,
          moduleId: Pop.module
        });
      },

      openItem(param) {
        let newParam = {
          selected: [],
          name: ""
        };
        Object.assign(newParam, param);
        const _item = params => {
          return ajaxService.post(
            action.common.getProductList,
            params
          );
        };

        if (reject()) return rejectRequest();

        return popups.popupItem({
          param: newParam,
          selected: param ? param : [],
          promiseFunc: _item,
          moduleId: Pop.module
        });
      },

      /*新品popup模态窗口*/
      openNewProduct(param) {
        let newParam = {
          selected: [],
          name: "",
          years: ""
        };
        Object.assign(newParam, param);
        const _newProduct = params => {
          return ajaxService.post(
            action.common.newProductItem,
            params
          );
        };

        if (reject()) return rejectRequest();

        return popups.popupNewProduct({
          param: newParam,
          selected: param ? param : [],
          promiseFunc: _newProduct,
          moduleId: Pop.module
        });
      },

      /*单品选择*/
      openOneproItem(param) {
        /**
         * 获取全部商品
         * @param param 商品列表初始化的值 {selected: []}
         * @param districtFunc 地区promise
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _district = (params) => {
          return ajaxService.post(action.common.getDistrictList, params);
        };

        if (reject()) return rejectRequest();

        return popups.popupDistrict({
          param: newParam,
          promiseFunc: _district,
          moduleId: Pop.module
        });
      },

      /**
       * ABC指标
       * @param params
       * @returns {*}
       */
      openTargetABC(params) {
        return popups.popupTargetABC(params);
      },

      /**
       * home 也最新消息提醒
       * @param params
       * @returns {*}
       */
      popupNewMessageNotice(params) {
        return popups.popupNewMessageNotice(params);
      },

      openChannelCode(param) {
        /**
         * 获取费用代码列表
         * @param param 供应商列表初始化的值 {selected: []}
         * @param operationFunc
         * @returns {*}
         */
        let newParam = {
          selected: []
        };
        Object.assign(newParam, param);

        const _promise = params => {
          return ajaxService.post(action.enterprise.getChannelCodeList, params);
        };

        if (reject()) return rejectRequest();
        return popups.popupChannelCode({
          param: newParam,
          promiseFunc: _promise,
          moduleId: Pop.module
        });
      },
    }
  });
