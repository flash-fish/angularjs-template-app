angular.module("SmartAdmin.Factories")
  .factory("toolService", (FigureService, tableService, dataService, CommonCon,
                           Common, ajaxService, action, Symbols, basicService,
                           DTColumnBuilder, Field, $state, popupToolService, Pop,
                           $rootScope, $templateCache, $location, abcService, pageService, commonP, $stateParams, Version) => {
    return {
      /**
       * dataTable中popover基础设置
       */
      buildPopover(data, id, key, self) {
        if (!data) return "";

        // 通道收益（门店，类别），跳转
        if(self.keys && self.keys.noLink && _.isArray(self.keys.noLink) && self.keys.noLink.find(nl => nl === self.keys.active)) return data;

        let val = angular.copy(data);
        if (key.func) {
          val = key.func(val);
        }

        self.originColumnData = val;

        key = key || {};
        const p = key.position ? key.position : "right";
        const name = key.templateName ? key.templateName : 'popover.html';

        let newData = `${key.abcType ? '[' + key.abcType + ']' : ''}${data}`;
        newData = newData.length > 18 ? newData.substring(0, 18) : newData;

        return `<a title="${key.abcType ? '[' + key.abcType + ']' : ''}${data}" uib-popover-template="'${name}'" popover-trigger="none" popover-popup-close-delay="50"
              popover-is-open="ctrl.popShow${id}" popover-placement="${p}"
              ng-mouseover='ctrl.tool.over(ctrl, $event, ${id}, "${key.code}", ${key.level}, "${key.abcType}", "${key.showCode}")'
              ng-mouseleave='ctrl.tool.leave(ctrl, ${id})'>${newData}</a>`;
      },

      /**
       * dateTable中a链接跳转
       */
      buildLink(data) {
        if (!data) return "";

        return '<a href="javascript:void(0);" style="color: #368bf8;" class="a-link hover-bold">' + data + '</a>';
      },

      /**
       * dataTable中popover mouseover
       */
      over(self, $event, id, code, level, abcType, showCode) {

        self.originColumnData = _.trim($event.target.innerText);
        self[`popShow${id}`] = true;
        self.currPopover = {
          code: code,
          name: self.originColumnData
        };
        if (!_.isUndefined(showCode)) self.currPopover.showCode = showCode;
        if (abcType && abcType != 'undefined') self.currPopover.abcType = abcType;
        if (level) self.currPopover.level = level;
      },

      /**
       * dataTable中popover mouseleave
       */
      leave(self, id) {

        const ele = $(".popover");
        ele.hover(() => {
          self[`hover${id}`] = true;
          self[`popShow${id}`] = true;
        }, () => {
          self[`hover${id}`] = false;
          self[`popShow${id}`] = false;
        });


        setTimeout(function () {
          if (!self[`hover${id}`]) {
            self[`popShow${id}`] = false;
          }
        }, 200);
      },

      /**
       * 计算日期控件的位置
       * @param event input容器的点击事件
       */
      dateRange_click(event) {
        let obj = event.target;

        let t = obj.offsetTop; //获取该元素对应父容器的上边距
        let l = obj.offsetLeft; //对应父容器的上边距
        //判断是否有父容器，如果存在则累加其边距
        while (obj = obj.offsetParent) {
          t += obj.offsetTop; //叠加父容器的上边距
          l += obj.offsetLeft; //叠加父容器的左边距
        }

        angular.element('.daterangepicker').css('left', l + 'px');
        angular.element('.daterangepicker').css('top', (t + 36) + 'px');
      },

      /**
       *根据localStorage中保存的结构构建出table需要的结构
       * @param local local里保存的数据结构
       * @param origin 自定义的数据结构
       * @param job 岗位
       * @param notOrigin
       * @param needBossAuth 不是老板，但需要有老板权限
       * @returns {*}
       */
      getFieldFromLocal(local, origin, job, notOrigin, needBossAuth) {
        const isBoss = this.isBoss(job);
        const isBossOrigin = isBoss && !notOrigin;
        const isOrigin = isBossOrigin || _.isUndefined(job);

        const originFiled = angular.copy(isOrigin ? origin : origin[job]);

        function dealField(v, k, type) {
          // 特殊判断，有点恶心 => 当不是Boss时，却有类似boss权限时
          let tab = !_.isUndefined(needBossAuth) && !needBossAuth ? job : type;
          const data = type || (tab && !needBossAuth) ? local[tab][k] : local[k];
          // const data = type ? local[type][k] : local[k];

          v.all = data.all;
          v.disable = data.disable;
          v.list.forEach(s => {
            const filter = data.list.filter(f => f.id === s.id)[0];
            s.model = filter && filter.model;
            s.disable = filter && filter.disable;
          });
        }

        _.forIn(originFiled, (v, k) => {
          if (isBossOrigin) {
            _.forIn(v, (tabVal, tabKey) => {
              dealField(tabVal, tabKey, k)
            })
          } else {
            dealField(v, k);
          }
        });

        // 不分tab页情况下 , 处理下同比环比的配置（获取table要去掉的fields）
        if (local.YoYToTSetting) {
          originFiled.option = popupToolService.getSameRingRatioOption(local.YoYToTSetting);
        }

        // 分tab页情况下（有些页面因权限展示没有tab，实际还是用tab的数据） , 处理下同比环比的配置（获取table要去掉的fields）
        if (local.YoYToTSettingTabs) {
          _.forIn(local.YoYToTSettingTabs, (v, k) => {
            const option = popupToolService.getSameRingRatioOption(v);
            originFiled[k] = Object.assign({}, originFiled[k], {option});
          });
        }

        return isOrigin ? originFiled : {[job]: originFiled};
      },

      /**
       *根据local中保存的结构构建出chart需要的结构
       * @param chart local中的结构
       * @param origin 原始结构
       * @param isBoss 是否为全权限
       * @returns {*}
       */
      getChartFromLocal(chart, origin, isBoss) {
        function dealField(v, k, type) {
          const localChart = type ? chart[type] : chart;

          // 获取当前柱状图的指标信息
          const barInc = localChart[k].bar.list[0].inc;

          _.forIn(v, (val, key) => {
            if (val.key.last)
              val.key.last = angular.copy(localChart[k][key].key.last);

            val.list.forEach(s => {
              const list = localChart[k][key].list;
              const curr = list.find(l => {
                return l.name === s.name;
              });

              s.check = curr ? curr.check : false;
              // if (curr && curr.disable) s.disable = curr.disable;
              s.disable = curr ? curr.disable : false;
            });
          });
        }

        _.forIn(origin, (v, k) => {
          if (isBoss) {
            _.forIn(v, (tabVal, tabKey) => {
              dealField(tabVal, tabKey, k)
            })
          } else {
            dealField(v, k);
          }
        });
      },

      /**
       * 根据原始数据要初始化结构建出chart
       * @param origin
       * @param isBoss
       */
      getOriginChartField(origin, isBoss) {
        _.forIn(origin, (val, key) => {
          if (val.bar) {
            const checkOne = val.bar.list.find(l => l.check);
            if (checkOne.disKey) {
              _.forIn(checkOne.disKey, (dv, dk)=> {
                _.flatten(dv).forEach(s => {
                  if (_.isNumber(s)) val[dk].list[s].disable = !val[dk].list[s].check;
                });
              })
            }
          }
        })
      },

      /**
       * 计算 chart 指标
       * @param chart 预定义好的chart结构
       * @param type 销售类型
       * @returns {{}}
       */
      calculateChartField(chart, type, config) {

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

          if (v.key.get) {
            field[k] = [];

            function joinField(basic, basicId) {

              if (curr.id.indexOf("&") >= 0) {
                curr.id.split("&").forEach((s, i) => {
                  field[k].push(getField(curr, basic, s, basicId));
                });
              } else
                field[k].push(getField(curr, basic, curr.id, basicId));
            }

            const basicId = basic.data.id;
            if (basicId.indexOf("&") >= 0) {
              // 如果当前为拆分的指标 但是折线指标需要合并 那么只输出合并后的折线指标
              if (basic.data.merge && curr.mergeLine) {
                const b = angular.copy(basic);
                b.data.id = b.data.merge.id;

                field[k].push(getField(curr, b, curr.id));
              } else {
                basicId.split("&").forEach((s, i) => {
                  if (!_.isUndefined(basic.data.arrayIndex) && basic.data.arrayIndex !== i) {
                    return;
                  }

                  joinField(basic, s);
                });
              }
            } else {
              joinField(basic);
            }
          }
        });

        if (type) {
          let noTypesArr;
          if(config && config.line){
            const [barList, lineList] = [
              copyChart.bar.list.filter(s => s.noType).map(s => s.id),
              copyChart.line.list.filter(s => s.noType).map(s => s.id)
            ];
            noTypesArr = [...barList, ...lineList];
          }else noTypesArr = copyChart.bar.list.filter(s => s.noType).map(s => s.id);

          _.forIn(field, (v, k) => {
            v.forEach(s => {
              const count = noTypesArr.filter(q => s.id.includes(q)).length;
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
      },

      /**
       *  计算table指标
       * @param param 预定义好的指标结构
       * @returns {Array} 返回计算好的指标集合
       */
      calculateTableField(param, key) {

        key = key || {};
        const field = angular.copy(param);

        if (field && field.option) delete field.option;

        let topField = [], totalList = [];
        /**
         * 处理需要拼接的指标
         * @param list 当前大模块的指标集合
         * @param needTop 是否需要拼接top指标
         */
        const buildField = (list, needTop) => {
          const basic = list.filter(s => s.join === 1);
          const scale = list.filter(s => s.join === 2);

          const addField = (b, i, t, needCamelCase) => {
            const inc = b.inc;
            const field = t ? needCamelCase ? _.camelCase(t + b.id) : t + b.id : b.id;

            //&表示多个指标
            if (b.id.includes("&")) {
              b.id.split("&").forEach((d) => totalList.push(d));
            } else {
              totalList.push(field);
              // 需要对比且有对比字段时
              if (key.compareField && b.compareId) totalList.push(b.compareId);
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
                totalList.push(field + s.id);
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

            if (needTop) {
              if (!b.noType) {
                topField.forEach(t => addField(b, i, t));
                return;
              }

              if (b.noType instanceof Array)
                topField.forEach(t => addField(b, i, b.noType.includes(t) ? `${t} ` : null, true));
              else
                addField(b, i);

            } else
              addField(b, i);
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

        return _.uniq(totalList);
      },

      /**
       * 特殊处理销售指标
       * @param parent 当前大模块的指标对象
       * @param fields 所有的指标对象
       */
      buildSale(parent, fields) {
        if (parent.key.name === '整体') {

          _.forIn(fields, (val, key) => {
            if (val.key.join !== 2) return;

            const zero = val.list.filter(s => s.join === 1 && s.model).length === 0;

            val.disable = zero;
            if (zero) val.all = false;

            val.list.forEach(s => {
              if (s.join === 2) s.disable = zero;
              if (zero) s.model = false;
            });
          });
        }
      },

      /**
       * 构建合计信息的结构
       */
      buildSum(chart, field, conf) {
        if (chart && chart.changeField)
          delete chart.changeField;
        let fields = [];
        let DefineSort = _.keys(_.values(chart)[0]).length > 1;
        _.forIn(chart, (val, key) => {
          let [ ownFields, saveFields] = [ [], [] ];
          _.forIn(val, (v, k) => {
            const data = v.map(s => {
              const key = angular.copy(field[s.id]);
              return {
                id: s.id,
                name: key.name,
                data: '-',
                hoverData: '-',
                addSum: s.addSum
              }
            });
            // 供货分析折线图、柱状图指标位置调换
            saveFields = [ ...saveFields, data];
            if(conf && conf.sortsChart && DefineSort){
              if(saveFields.length > 1){
                ownFields = [
                  ... ownFields,
                  ...saveFields[1],
                  ...saveFields[0]
                ]
              }
            }else{
              ownFields = [...ownFields, ...data];
            }
          });

          fields.push(ownFields);
        });

        return fields;
      }  ,

      /**
       * 构建合计数据
       * @param sum 接口返回的summary数据
       * @param pageSum 页面需要的合计数据
       * @param field
       */
      getSum(sum, pageSum, field) {
        if (!sum) return pageSum;

        pageSum.forEach(v => {
          v.forEach(s => {
            const key = angular.copy(field[s.id]);
            const point = !_.isUndefined(key.point) ? key.point : 2;
            let d, h, origin = sum[s.id];

            if (key.scale) {
              const data = FigureService.scale(origin, true);
              h = d = data === Symbols.bar ? data : `${data}%`;
            } else {
              if (key.sale) {
                d = `${FigureService.amount(origin)}`;
                h = `${FigureService.thousand(origin)}元`;
              } else
                h = d = FigureService.thousand(origin, point);
            }

            if (key.infinite && _.isEqual(d, Symbols.bar)) {
              d = h = Symbols.infinite;
            }

            s.data = d;
            s.hoverData = h;
            s.originData = origin;
            s.name = key.name;
            s.key = key;
          });
        });
      },

      /**
       * chart tooltip 格式化
       *
       * @param fields
       * @param fieldInfo 所有指标的配置
       * @param key chart配置
       */
      formatData(fields, fieldInfo, key) {
        const newField = _.flattenDeep(fields);

        // 判定是否包含同比或环比指标
        const haveToT = newField.some(s => s.id.includes("ToT"));
        const haveYoY = newField.some(s => s.id.includes("YoY"));

        return (p) => {
          let info = "", field = p[0].name.replace(/\s*/g, "");

          let curr = key.data.filter(s => s.dateCode == field.replace(/\//g, ""))[0];
          // 趋势页面并且视图为天并且没有配置noWeather
          if (_.eq(key.xData.code, "dateCode") && _.eq(key.xData.format, "MM/DD") && !key.noWeather && !key.compared) {
            let vsWeather = "";

            if (haveYoY) vsWeather += ` , 同期: ${FigureService.changeNull(curr.weatherInfoYoYValue)}`;
            if (haveToT) vsWeather += ` , 环期: ${FigureService.changeNull(curr.weatherInfoToTValue)}`;

            field = `${field} (杭州天气: ${FigureService.changeNull(curr.weatherInfo)}${vsWeather})`;
          }

          // 趋势页面并且含有对比
          if (key.trend && !_.isUndefined(key.compared)) {
            let haveDate = ['活动日期：', '对比日期：'];
            let haveYoYValue = curr.chineseCalendarYoYValue;
            field = haveYoYValue ?
              haveDate[0] + curr.chineseCalendar +
              '<br />' + haveDate[1] + haveYoYValue
              : curr.chineseCalendar;
          }

          p.forEach((s, i) => {
            const id = newField.find(n => s.seriesName === n.name).id;
            const codeKey = fieldInfo[id];
            const isSale = codeKey.sale;
            const unit = codeKey.unit ? codeKey.unit : isSale ? "元" : "";

            // 客单数（万次）
            const isTime = codeKey.time;

            let toolValue;

            const point = !_.isUndefined(codeKey.point) ? codeKey.point : 2;

            if (s.value === Symbols.bar) {
              toolValue = Symbols.bar
            } else if (codeKey.scale) {
              toolValue = `${s.value}%`;
            } else if (codeKey.inc) {
              toolValue = FigureService.thousand(codeKey.inc === 1 ? s.value : s.value * 100);
            } else if ((!s.value || s.value === Symbols.bar) && codeKey.infinite) {
              toolValue = Symbols.infinite;
            } else {
              toolValue = FigureService.thousand(isSale || isTime ? s.value * 10000 : s.value, point);
            }

            let ser_name = s.seriesName, compare_name;

            // (活动分析) 趋势页面并且含有对比
            if (!_.isUndefined(key.compared) && !_.isUndefined(key.chartInfo)) {
              if ((s.seriesIndex === 0 || key.chartInfo.InFo.includes(ser_name))) {
                compare_name = !_.isUndefined(key.compareDate.dataY) ? `${ser_name}(活动日期)` : ser_name;
              } else compare_name = ser_name;
            } else compare_name = ser_name;

            info += `<br />${s.marker}${compare_name} : ${toolValue} ${unit}`;
          });

          return field + info;
        }
      },

      /**
       * 获取series需要的数据 用于构建seriesOption
       */
      getSeriesData(field, data, info, xData) {
        let fields = [], seriesData = [];

        _.forIn(field, (v, k) => {
          const f = v.map(s => s.id);
          if (!FigureService.haveValue(f)) return;

          fields.push(v);

          let own = [];
          // 构建series数据
          v.forEach(s => {
            const curr = Object.assign({stack: s.stack}, info[s.id]);
            const point = !_.isUndefined(curr.point) ? curr.point : 2;
            s.name = curr.name;
            own.push({
              curr: curr,
              list: data.map(d => {
                const c = d[s.id];

                const value = curr.scale
                  ? FigureService.scale(c, true)
                  : FigureService.number(c, curr.time ? curr.time : curr.sale, false, point);

                return {name: d[xData.code], value: value}
              })
            });
          });
          seriesData.push(own);
        });
        return {field: fields, series: seriesData};
      },

      /**
       * 构建最后传给chart的series对象
       * @param seriesObj
       * @param key
       * @param curr 柱状图还有折线数组，判断是否是双折线（curr.bar.length > 0）
       * @returns {Array}
       */
      buildSeries(seriesObj, key, curr) {
        function getLabel(x, isShow) {
          return {
            label: {
              normal: {
                show: isShow,
                position: [10, -15],
                fontSize: 11,
                fontWeight: 'bolder',
                formatter: (p) => {
                  const isScale = x.curr.scale;
                  return isScale
                    ? FigureService.addPercent(p.value)
                    : FigureService.thousand(p.value, 0);
                }
              }
            }
          }
        }

        let series = [];
        seriesObj.series.forEach((s, i) => {
          if (i === 0 && curr.bar.length > 0) {
            let barScale = s.length > 1 ? '33%' : '50%';
            let Count = 0;
            let bars = s.map((x, barIndex) => {
              let bar = {
                type: 'bar',
                name: x.curr.name,
                data: x.list,
                barGap: '0%',
                barCategoryGap: barScale,
                silent: key.silent
              };

              bar.label = {
                normal: {
                  show: key.barLabel,
                  position: [0, -14],
                  fontSize: 11,
                  formatter: (p) => {
                    return FigureService.thousand(p.value, 0);
                  }
                }
              };

              // 判断当前的系列是否堆叠
              if (x.curr.stack) {
                bar.stack = x.curr.stack;
                bar.z = 10 - barIndex;
              }

              // 给柱形图加标配置
              if (!_.isUndefined(key.compared)
                && !_.isUndefined(key.chartInfo)) {
                if (key.chartInfo.showHash) {
                  // 判断bar的长度 保留一个 markPoint 配置
                  Count++;
                  let hashName = key.chartInfo.hashName
                    ? key.chartInfo.hashName
                    : '';
                  let x_index;
                  x.list.forEach((t, i) => {
                    if (t.name === Number(key.chartInfo.hashHoliday)) x_index = i;
                  });
                  if (Count < 2 && x_index) {
                    bar.markPoint = {
                      symbolSize: 25,
                      data: [
                        {name: hashName, xAxis: x_index, yAxis: x.list[x_index].value},
                      ],
                      itemStyle: {
                        normal: {label: {show: false,}}
                      }
                    };
                  }
                }
              }

              return bar;
            });

            series = series.concat(bars);

          } else {

            if (curr.bar.length > 0) {
              let lines = s.map(x => {
                return Object.assign({}, {
                  type: 'line',
                  z: 20,
                  name: x.curr.name,
                  yAxisIndex: 1,
                  showAllSymbol: 'true',
                  data: x.list,
                  lineStyle: {normal: {width: 4}},
                  silent: key.silent
                }, getLabel(x, key.lineLabel));
              });

              series = series.concat(lines);

            } else {
              // 恶心！
              if (curr.line.length === 4) {
                for (let i = 0; i < 4; i++) {
                  let x = s[i];
                  let lines = Object.assign({}, {
                    type: 'line',
                    z: 20,
                    name: x.curr.name,
                    yAxisIndex: i === 0 || i === 1 ? 0 : 1,
                    data: x.list,
                    lineStyle: {normal: {width: 4}},
                    silent: key.silent
                  }, getLabel(x, key.lineLabel));
                  series = series.concat(lines);
                }
              } else {
                let lines = s.map(x => {
                  return Object.assign({}, {
                    type: 'line',
                    z: 20,
                    name: x.curr.name,
                    yAxisIndex: 0,
                    data: x.list,
                    lineStyle: {normal: {width: 4}},
                    silent: key.silent
                  }, getLabel(x, key.lineLabel))
                });
                series = series.concat(lines);
              }
            }
          }
        });
        return series;
      },

      /**
       * chart 柱状图和折线图 基础样式
       * @param legend 图例
       * @param xData X轴数据
       * @param info 预定义的指标信息
       * @param key 配置
       * @returns
       */
      basicChartStyle(legend, xData, info, key) {

        if (legend.length === 0) return {};

        const nameTextStyle = {fontSize: 11, fontFamily: 'Arial', color: '#071220'};
        const axisLineAndTick = {lineStyle: {color: '#ECECEC', width: 1}};
        const axisLabel = {color: '#404040', interval: 0, fontSize: 11, fontFamily: 'Arial'};
        const isSale = info[legend[0][0].id].sale;

        let firstNameY = info[legend[0][0].id].name;
        // 定义第一个Y轴显示
        let firstY = legend[0] && legend[0][0] ? legend[0][0] : {name: "", id: ""};
        // 定义第二个Y轴显示
        let secondY = legend[1] && legend[1][0] ? legend[1][0] : {name: "", id: ""};
        let secondNameY = info[secondY.id] ? info[secondY.id].name : "";
        let isAbc = firstNameY.includes('A类商品');

        // 判断客单数（万次）
        const isFirstTime = info[legend[0][0].id].time;

        let isSecondTime;
        if (legend.length > 1) {

          isSecondTime = info[legend[1][0].id].time;
        }

        if (legend[0].length > 2) {

          secondNameY = info[legend[0][2].id].name;
        }

        // 特殊指标特殊处理 由于指标字数太多 自定义规则处理
        if (secondNameY.includes("占比综合收益额"))
          secondNameY = `${secondNameY.split("占比")[0]}占比`;

        if (firstNameY.includes("通道收益额"))
          firstNameY = "通道收益额";

        if (isAbc) {
          firstNameY = firstNameY.substring(0, firstNameY.indexOf('A类商品'));
          secondNameY = secondNameY.substring(0, secondNameY.indexOf('A类商品'))
        }

        //Y轴名称的默认值
        const NAME_Y = {left: {name: '柱状图', index: 0}, right: {name: '折线图', index: 1}};

        //坐标轴值的单位
        const UNITS = {times: '(万次)', yuan: '(万元)'};

        function getYAxisName(def, isTimes, name, isSale) {
          let nameY = name ? def.name : name;
          return isSale ? nameY + UNITS.yuan : (isTimes ? nameY + UNITS.times : nameY);
        }

        let basic = {
          color: ['#007ADB', '#26C08C', '#9243DD', '#FF905C', '#dd8fa9', '#FFC467', '#3DC7FF', '#e83329', '#6b6b6b'],
          legend: {
            left: 'center',
            width: '60%',
            textStyle: {fontSize: 11, fontFamily: 'Arial'},
            padding: [3, 30, 0, 0],
            data: _.flattenDeep(legend).map(s => {
              return info[s.id].name;
            })
          },
          grid: {
            left: '30px',
            top: key.trend ? 70 : '50px',
            right: '30px',
            bottom: key.trend ? '50px' : '30px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisTick: {show: false},
            axisLine: axisLineAndTick,
            axisPointer: {type: 'shadow'},
            axisLabel: {
              color: '#071220', fontSize: 11,
              formatter: (p) => {
                return key.xData.code === 'dateCode'
                  ? moment(p, "YYYY/MM/DD").format(key.xData.format) : p;
              }
            },
            data: xData

          },
          yAxis: [
            {
              type: 'value',
              name: getYAxisName(NAME_Y.left, isFirstTime, firstNameY, isSale),
              nameTextStyle: nameTextStyle,
              axisTick: {show: false},
              axisLine: axisLineAndTick,
              axisLabel: Object.assign({
                formatter: `{value}${info[firstY.id] && info[firstY.id].scale ? '%' : ''}`
              }, axisLabel),
              splitLine: {show: false},
              splitArea: {show: true, interval: 1, areaStyle: {color: ['rgba(0,122,219,0.03)', '#fff']}}
            },
            {
              show: key.seriesType ? key.seriesType.length > 1 : true,
              type: 'value',
              name: getYAxisName(NAME_Y.right, isSecondTime, secondNameY),
              nameTextStyle: nameTextStyle,
              axisTick: {show: false},
              axisLine: Object.assign({show: legend[1] || legend[0].length > 2}, axisLineAndTick),
              axisLabel: Object.assign({
                formatter: `{value}${info[secondY.id] && info[secondY.id].scale ? '%' : ''}`
              }, axisLabel),
              splitLine: {show: false}
            }
          ]
        };

        if (!key.xAxisNoWrap) basic.xAxis.axisLabel.interval = 0;

        return basic;
      },

      /**
       * 构建chart option
       * @param curr 当前chart所对应类型的指标结构
       * @param key 配置
       * @returns
       */
      buildChart(curr, key) {
        key.seriesType = _.uniq(_.keys(curr));

        const data = key.data, fieldInfo = key.info;
        // 获取当前指标的集合 和 系列数据
        const seriesObj = this.getSeriesData(curr, data, fieldInfo, key.xData);

        const xData = data.map(o => {
          const curr = key.xData.code === 'dateCode'
            ? moment(o[key.xData.code], "YYYYMMDD")
              .format(_.toString(o[key.xData.code]).length > 6 ? "YYYY/MM/DD" : "YYYY/MM")
            : o[key.xData.title];

          return !curr ? "" : curr;
        });

        // 获取chart基础样式
        const basic = this.basicChartStyle(seriesObj.field, xData, fieldInfo, key);

        let newOption = {
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {type: 'shadow'},
            textStyle: {align: 'left'},
            formatter: this.formatData(seriesObj.field, fieldInfo, key)
          },

          series: (() => {
            return this.buildSeries(seriesObj, key, curr);
          })()
        };

        // 添加滑条型区域缩放组件
        if (key.appendZoom) {
          newOption.dataZoom = [
            {show: true},
            {
              type: 'inside',
              bottom: 30,
              backgroundColor: 'rgba(142, 174, 195, 0)'
            }
          ];
        }

        // 添加框选型区域缩放组件
        if (key.rectZoom && key.firstRect) {
          newOption.toolbox = {
            right: key.rectZoom.right || 'auto',
            top: key.rectZoom.top || 'auto',
            show: _.isBoolean(key.rectZoom.show) ? key.rectZoom.show : true,
            feature: {
              dataZoom: {
                // yAxisIndex: false,
                title: key.rectZoom.title ? key.rectZoom.title : undefined,
                icon: key.rectZoom.icon ? key.rectZoom.icon : {},
                iconStyle: key.rectZoom.iconStyle ? key.rectZoom.iconStyle : undefined
              }
            }
          }
        }

        return Object.assign({
          notMerge: true,
          xAxisNoWrap: key.xAxisNoWrap,
          adjustOffset: key.adjustOffset
        }, basic, newOption);
      },


      /**
       * 获取select下拉列表的年份
       * 最新日期为今年
       * endYear:select的结束年
       */
      buildYearSelect(endYear, currYear) {
        if (!endYear) return [];

        let years = [];
        let nowYear = String(currYear);

        for (let i = 0; i < (nowYear - endYear + 1); i++) {
          years.push({id: nowYear - i, name: nowYear - i})
        }

        return years;
      },

      /**
       * 获取select下拉列表的12个月
       * @param nowMonth 当前月
       */
      buildMonthSelect(nowMonth) {
        //月select
        let month = [];
        let mLength = nowMonth ? nowMonth : 12;
        for (let i = 1; i <= mLength; i++) {
          let m = {id: i - 1, name: i < 10 ? '0' + i : i};
          month.push(m);
        }
        return month;
      },

      // 未来日 同比增幅||同比增长 转换
      ToTReplace(ele, basic) {
        let params = angular.copy(ele);
        if (params.condition && params.condition.date) {
          // 未来日判断条件
          if (basic < params.condition.date.to) {
            if (params.fields) {
              _.forEach(params.fields, (s, i) => {
                let [_includesYoY, _includesYoYValue] = [
                  s.includes(Symbols.YoY), s.includes(Symbols.YoYValue)
                ];
                if (_includesYoY && !_includesYoYValue) {
                  params.fields.splice(i, 1, _.replace(s, Symbols.YoY, Symbols.ToT))
                }
              })
            }
          }
        }
        return params;
      },

      /**
       * 封装dataSource的逻辑
       * @param key 携带所有接口需要的数据
       * @param back 需要影响到外界的数据
       * @param keys
       */
      getData(key, back, keys) {
        keys = keys || {};
        /**
         * 从session里获取最新的条件 包括配置（key 存放在 key.param.condition中）
         * @param key
         */
        function fromSession(key) {
          const session = CommonCon.session_key;

          const hsParam = basicService.getSession(session.hsParam, true);
          if (hsParam) key.param.condition = hsParam;

          const hsField = basicService.getSession(session.hsField, true);
          if (hsField) key.param.field = hsField;
        }

        return (param, callback) => {
          let chartSort = angular.copy(key.currSort);

          // 优先判断当前[fromSource]的触发行为 如果是重新计算列宽触发的 则终止
          if (basicService.getSession(CommonCon.session_key.columnResizing, true)) {
            return;
          }

          // 清掉key.param.condition上的sort
          if (key.param.condition) delete key.param.condition.sort;

          // 标识当前状态正在请求数据
          if (keys) keys.finish = false;
          back.outFinish = false; // 一级菜单页面的开关
          back.param = angular.copy(param);

          // 全屏loading
          $rootScope.fullLoadingShow = true;

          // 标识整体合计字段应该放在哪个列中
          let total = !_.isUndefined(key.addSum) ? key.addSum : "_id";

          // 优先取session里面的条件
          fromSession(key);

          // 将param里面的数据映射到页面条件上
          $rootScope.$broadcast(CommonCon.session_key.sessionParam, key.param.condition);

          if (key.filterParam) {
            const filterParam = basicService.getSession(CommonCon.session_key.filterParams);
            $rootScope.$broadcast(CommonCon.session_key.filterParams, filterParam)
          }

          let params = tableService.params(this.buildParam(key.param, key.special), param, key.param.condition);

          const sessionParam = key.tableParam;
          let sameOrder = true, samePage = true;

          if (sessionParam) {
            sameOrder = _.isEqual(sessionParam.order[0], param.order[0]);
            samePage = _.isEqual(sessionParam.start, param.start);
          }

          if (!sameOrder && !key.param.condition.sort) {
            key.currSort = "";
          }

          if (key.param.condition.sort) {
            const sort = key.param.condition.sort;
            chartSort = {
              name: "first",
              code: sort[1] === 1 ? 'asc' : 'desc'
            };
          }

          // 判断当前排序的对象是否存在 存在的话以此作为排序参数
          if (key.currSort) {
            const chart = key.param.field.chart[chartSort.name];
            const sortField = chart ? chart.bar[0].id : null;

            if (sortField) params.sortBy = {
              field: sortField,
              direction: chartSort.code === 'asc' ? 1 : -1
            };
          }

          // 当前页面需要追加参数的情况
          if (key.appendParam) {
            key.appendParam(params);
          }

          pageService.hideBody(0);

          // 触发chart loading效果
          back.loadChart = !back.loadChart;

          // 趋势页面触发时 请求参数删掉分页 用于渲染chart
          let isChangeTable;
          if (key.trend) {
            const sessionOrder = basicService.getSession(CommonCon.session_key.apiOrder, true);
            const changeColumn = basicService.getSession(CommonCon.session_key.changeColumn, true);

            isChangeTable = (!sameOrder || !samePage) && !sessionOrder;

            if (changeColumn) {
              isChangeTable = false;
            }

            if (!isChangeTable) {
              delete params.pagination;
              params.sortBy = {field: "dateCode", direction: 1};
            }
            // 对比日期排序字段按dateCode字段排序
            if (params.sortBy.field === 'dateCodeY') params.sortBy.field = 'dateCode';

            total = "dateCode";
          }

          // 将当前表格的信息保存到session
          key.tableParam = param;

          // 将当前的页码返回到页面控制器
          if (params.pagination) back.tablePage = params.pagination.page;

          let _Params;
          if (params.condition && params.condition.other) {
            const _basicDay = params.condition.other.baseDate;
            // 未来日 同比增幅||同比增长 YoY/YoYValue=> ToT/ToTValue
            _Params = this.ToTReplace(params, _basicDay);
          } else {
            _Params = angular.copy(params);
          }

          // 有些页面某些字段需要过滤掉
          if (keys && keys.fuzzyFilter)
            _Params.fields = _Params.fields.filter(f => !f.includes(keys.fuzzyFilter));

          function getEndDate(basicDate) {
            const year = basicDate.baseYear;
            const month = basicDate.endMonth;
            return String(year) + String(month);
          }

          //未来日模式时需要重新发起第二次请求得到总计值（条件为原始条件）
          const originDate = angular.copy(_Params.condition.date);

          //判断未来日checkbox的显隐
          if (key.showFutureToggle && key._basicDate) {
            let date = _Params.condition.date;
            let show;
            if (date.type === 'day')
            // show = !moment(date.to).isBefore(moment(key._basicDate.startDate));
              show = moment(date.to).isSame(moment(key._basicDate.baseDate));
            else {
              const _endDate = getEndDate(key._basicDate);
              show = !moment(date.to, 'YYYYMM').isBefore(moment(_endDate, 'YYYYMM'));
            }
            key.showFutureToggle(show);
          }

          //判断未来日模式的开启关闭修改param
          if (key.getOpenFuture && key.getOpenFuture()) {
            let pDate = _Params.condition.date;
            if (pDate.type === 'month') {
              const endDate = getEndDate(key._basicDate);
              const isSame = moment(pDate.to, 'YYYYMM').isSame(moment(endDate, 'YYYYMM'));
              //终了月 = 基准财务月(到当年12月)
              if (isSame) {
                pDate.to = Number(key._basicDate.baseYear + '12');
                pDate.allDate = true;
              }
            }
            if (pDate.type === 'day') {
              //终了日 = 基准日
              const isSame = moment(pDate.to).isSame(moment(key._basicDate.baseDate));
              if (isSame) {
                pDate.allDate = true;
                pDate.to = key._basicDate.endDate;
              }
            }
          }
          // 渲染表格
          const renderTable = res => {
            pageService.hideBody(1);

            $rootScope.fullLoadingShow = true;

            const data = res.data;
            let count = data.total;

            // 根据addEvent判断是否需要注册事件
            if (key.addEvent) {
              function bindFunc(chart) {
                chart.func = chart.event(key.param, data.details);
              }

              _.isArray(key.addEvent) ? key.addEvent.forEach(s => bindFunc(s)) : bindFunc(key.addEvent);
            }

            //当开启未来日模式时发起第二次请求获得原始条件的总计值
            if (key.getOpenFuture && key.getOpenFuture()) {
              if (_Params.condition.date.allDate) {
                let originParams = angular.copy(_Params);
                originParams.condition.date = originDate;
                basicService.packager(dataService[key.interfaceName](originParams), resp => {
                  key.setSum(resp.data.summary);
                }, () => key.setSum({}));
              } else key.setSum(data.summary);
            } else if (!isChangeTable && key.setSum) {
              // 设置共通合计部分 (当开启未来日模式时, 不做合计)
              key.setSum(data.summary);
            }

            // 设置图表数据
            if (!isChangeTable && key.setChart) key.setChart(data.details, data.summary);

            // 是否隐藏表格的footer信息
            pageService.hideFooter(FigureService.haveValue(data.details) ? 1 : 0);

            tableService.dealResp(data, {addId: param.start, addSum: total});
            tableService.pageNo(param, callback, count, data.details);

            $rootScope.fullLoadingShow = false;
            back.noInit = true;
            back.finish = !back.finish;
            back.outFinish = true;
            back.empty = !count;
            back.total = count;
          };

          // 请求reject的时候render一个空表格
          const renderEmptyTable = () => {
            //abc页面请求失败的话返回空数据；
            if (key.isAbc) {
              let res = {
                data: {
                  details: [],
                  offset: null,
                  summary: {},
                  total: 0,
                },
              };
              pageService.hideBody(1);

              $rootScope.fullLoadingShow = false;

              const data = res.data;
              let count = data.total;

              // 根据addEvent判断是否需要注册事件
              if (key.addEvent) key.addEvent.func = key.addEvent.event(key.param, data.details);

              // 设置共通合计部分
              if (!isChangeTable && key.setSum) key.setSum(data.summary);

              // 设置图表数据
              if (!isChangeTable && key.setChart) key.setChart(data.details, data.summary);

              // 是否隐藏表格的footer信息
              pageService.hideFooter(FigureService.haveValue(data.details) ? 1 : 0);

              // 趋势页面非table操作的场合 需要过滤接口数据
              if (key.trend && !isChangeTable) {
                data.details = data.details.slice(0, 10);
              }

              tableService.dealResp(data, {addId: param.start, addSum: total});
              tableService.pageNo(param, callback, count, data.details);

              back.noInit = true;
              back.finish = !back.finish;
              back.outFinish = true;
              back.empty = !count;
              back.total = count;
            } else {
              back.finish = !back.finish;
              back.outFinish = true;
            }

          };

          // 当有其他接口也需要同时调用的时候
          if (key.independentInterFace) {
            const allInterFaces = angular.copy(key.independentInterFace);
            allInterFaces.push(key.interfaceName);
            let allPromise = [];
            allInterFaces.forEach(i => allPromise.push(dataService[i](_Params)));
            // 枚举独立接口
            const enumInterface = {
              summary: ['getDataSummary', 'getSupplyDataSummarySupply']
            };
            // 得出当前summary交集，目前一个页面最多只有一个summary接口，所以交集应该最多就只有一个接口
            const summaryInterfaces = _.intersection(key.independentInterFace, enumInterface.summary);

            basicService.packager(Promise.all(allPromise), values => {
              // res 渲染表格同一结果， other_res 剩余接口结果
              let res = {data: {}}, other_res = {};
              allInterFaces.forEach((v, k) => {
                // 共通数据请求接口
                if (v === key.interfaceName) res = values[k];
                // 独立的summary接口
                if (summaryInterfaces.includes(v)) other_res[v] = values[k];
              });
              // 正常应该只有一个summary接口
              if (summaryInterfaces.length) res.data.summary = other_res[summaryInterfaces[0]].data.summary;
              renderTable(res);
            }, () => renderEmptyTable());
          } else {
            // 渲染表格数据的接口
            basicService.packager(dataService[key.interfaceName](_Params), res => renderTable(res), () => renderEmptyTable());
          }
        };
      },

      /**
       * 构建传给接口的field
       * @param originField 原始的指标结构
       * @param key
       */
      getFields(originField, key) {
        let field = [];

        if ((key && !key.noChart) || !key) {
          _.forIn(originField.chart, (v, k) => {
            _.forIn(v, (val, key) => {
              field = field.concat(val.map(s => s.id));
            });
          });
        }

        field = _.union(field, originField.newTable);
        _.remove(field, (f) => !f);

        return field;
      },

      getParam(condition, field) {
        return {
          condition,
          field
        }
      },

      /**
       * 构建页面初始化日期范围
       * @param baseDate
       * @returns {{currentDay: string, lastThirtyDay: string}}
       */
      buildDate(baseDate) {
        const date = moment(baseDate, Symbols.normalDate);
        const dateFormat = date.format(Symbols.slashDate);
        const lastDate = date.subtract(29, 'day');
        return {
          currentDay: dateFormat + Symbols.bar + dateFormat,
          lastThirtyDay: lastDate.format(Symbols.slashDate) + Symbols.bar + dateFormat
        };
      },

      /**
       * 构建传给接口的参数结构
       * @param term: {condition: {}, field: {}}
       * @param key
       */
      buildParam(term, key) {
        const com = angular.copy(term.condition);
        let param = {};

        // 构建condition属性
        let condition = {};

        _.forIn(com, (value, key) => {
          if (!value || typeof value !== 'object') return;

          if (!FigureService.haveValue(value.val)) return;

          if (value.id.toString() === '2') {
            condition[key] = {
              level: value.val[0].level,
              values: _.compact(value.val.map(s => s.code))
            };
          } else if (value.id.toString() === '4') {
            const name = Pop.classLevels.filter(s => s.id == value.val[0].level)[0].code;
            condition[key] = {
              [name]: value.val.map(s => s.code)
            }
          } else {
            let name = value.id.toString() === '3' ? "businessOperation" : key;
            if (name === 'newProduct') name = 'product';
            condition[name] = value.val.filter(s => !_.isUndefined(s.code)).map(s => s.code);
          }

        });

        _.forIn(com, (value, key) => {
          if (typeof value === 'object' || (!value && value !== false && value !== 0)) return;
          if (key.includes("delete")) {
            delete com[key];
            return;
          }
          condition[key] = value;
        });

        if (com.date) {
          let format = {};
          let sta;
          if (com.date.includes(Symbols.bar)) {
            sta = com.date.split(Symbols.bar)[0].replace(/\//g, '');
            let end = com.date.split(Symbols.bar)[1].replace(/\//g, '');
            format.to = parseInt(end);
          } else {
            sta = com.date.includes('/') ? com.date.replace(/\//g, '') : com.date;
          }
          format.type = sta.length === 6 ? 'month' : sta.length === 4 ? 'year' : 'day';
          format.from = parseInt(sta);
          condition.date = format;
        }

        // 根据指定指标和比例过滤数据的属性
        if (com.limit)
          condition.limit = angular.copy(com.limit);

        if (com.filterCondition)
          condition.filterCondition = angular.copy(com.filterCondition);

        if(com.newProductAbnormalDays){
          condition.newProductAbnormalDays = angular.copy(com.newProductAbnormalDays);
        }

        if (com.businessOperationGroup)
          condition.businessOperationGroup = angular.copy(com.businessOperationGroup);

        if (com.precondition)
          condition.precondition = angular.copy(com.precondition);

        if (com.dateY) condition.dateY = angular.copy(com.dateY);

        // 活动分析页面
        if (com.other) condition.other = angular.copy(com.other);

        //供货分析页面
        if(com[commonP.QRate]) condition[commonP.QRate] = angular.copy(com[commonP.QRate]);
        if(com[commonP.ARate]) condition[commonP.ARate] = angular.copy(com[commonP.ARate]);

        // 通道费用页面
        if (com.channelCode) condition.channelCode = angular.copy(com.channelCode);

        param.condition = condition;

        // 构建field属性
        param.fields = term.field instanceof Array ? term.field : this.getFields(term.field, key);

        // key.appendField 向接口中额外增加field
        if (key && key.appendField) {
          param.fields.push(...key.appendField);
        }

        // 设置pageId
        if (key && key.pageId)
          param.pageId = key.pageId;
        return param;
      },

      /**
       * 获取数据设定里的指标集合
       * @param field
       * @param isChange
       * @param key
       * @param extraFunc
       */
      changeCol(field, isChange, key, extraFunc) {
        key = key || {};

        field.newTable = this.calculateTableField(field.table, key);

        if(field.table){
          field.newTable = this.SameRingSettingField(field.newTable, field.table.option);
        }

        if (key.compareField) {
          if (key.compareField.removeInclude)
            key.compareField.removeInclude.forEach(r => field.newTable = field.newTable.filter(n => !n.includes(r)))
        }

        if (key.removePct) {
          key.removePct.forEach(r => field.newTable = field.newTable.filter(n => !n.includes(r)))
        }

        if (key && key.removeField && key.active !== 7) {
          _.remove(field.newTable, (f) => key.removeField.includes(f));
        }

        if (extraFunc) extraFunc(field);

        // 点击查询时将条件保存到session
        basicService.setSession(CommonCon.session_key.hsField, field);

      },

      /**
       * 监听共通条件的变动
       */
      watchParam(self, func, key) {
        self.scope.$watch('ctrl.param', (newVal) => {
          if (!newVal) return;

          if (func) func(newVal);

          let hsParam = Object.assign({}, newVal, self.currentLevel ? self.currentLevel : {});

          basicService.setSession(CommonCon.session_key.hsParam, hsParam);

          const table = angular.element('.dataTables_scrollBody .hs-table');

          const renderColumn = () => {
            self.initColumn(true, self.param);
            self.keys.initColumn = false;
            self.buildOption(hsParam);
            self.keys.noRelodData = true;
          };

          if (self.noInit) {
            self.loadChart = !self.loadChart;

            // 构建合计的结构
            self.sum = this.buildSum(self.field.chart, self.fieldInfo, key);

            basicService.setSession(CommonCon.session_key.hsField, self.field);

            if (self.sortInfo) {
              // 如果表格中没有当前排序的字段 则表格设置为排名升序
              !self.sortInfo.flag
                ? this.dynamicSort(hsParam, self.sortInfo.field, self.sortInfo.dir)
                : table.DataTable().order([self.sortInfo.index, self.sortInfo.dir]).draw();

            } else {
              if (self.keys.active === 1) {
                if (self.keys.initColumn)
                  renderColumn();
                else {
                  basicService.setSession(CommonCon.session_key.apiOrder, true);
                  table.DataTable().order([0, 'asc']).draw();
                }
              } else {
                if (self.keys.actCompare) table.DataTable().draw();
                if (self.keys.initColumn)
                  renderColumn();
                else
                  self.instance.reloadData();
              }
            }
          } else {
            self.buildOption(hsParam);
            if (self.keys.initColumn) renderColumn();
          }

        });
      },

      /**
       *同环比设定处理
       */
      SameRingSettingField(tableFields, option) {
        if (!option || !option.unIncludeFields.length) return tableFields;
        option.unIncludeFields.forEach(f => {
          if (f.includes('Value')) {
            tableFields = tableFields.filter(tf => !tf.includes(f));
          }
          if (!f.includes('Value')) {
            tableFields = tableFields.filter(tf => !tf.includes(f) || tf.includes(f + 'Value'));
          }
        });
        return tableFields;
      },

      /**
       * 监听table指标变动
       */
      watchTable(self, func) {
        self.scope.$watch('ctrl.field.table', (newVal, oldVal) => {
          // 初始化时候的处理
          if (!newVal || !self.noInit) return;

          if (!_.isUndefined(self.openFuturePattern)) delete self.openFuturePattern;
          let newTable = this.calculateTableField(newVal);
          let oldTable = this.calculateTableField(oldVal);

          newTable = this.SameRingSettingField(newTable, newVal.option);
          oldTable = this.SameRingSettingField(oldTable, oldVal.option);

          if (_.isEqual(_.sortedUniq(newTable), _.sortedUniq(oldTable))) return;

          if (func) func(self.param);

          // 将最新的条件保存到session
          basicService.setSession(CommonCon.session_key.hsParam, self.param);

          // 根据当前排序的信息 渲染表格
          if (self.sortInfo) {

            setTimeout(() => {
              self.field.newTable = this.calculateTableField(newVal);

              const table = angular.element('.dataTables_scrollBody .hs-table');

              // 如果表格中没有当前排序的字段 则表格设置为排名升序
              const field = self.field.chart[self.sortInfo.type].bar[0].id;
              const index = _.indexOf(self.field.newTable, field) + self.fix.length;
              self.sortInfo.flag = self.field.newTable.includes(field);
              self.sortInfo.index = index;

              !self.sortInfo.flag
                ? this.dynamicSort(self.param, field, self.sortInfo.dir)
                : table.DataTable().order([index, self.sortInfo.dir]).draw();
            }, 1000);
          }

          self.option.displayStart = 0;

          self.initColumn(true, self.param);
          if (self.isTrend) self.buildOption();
        });
      },

      /**
       * 监听chart指标变动
       */
      watchChart(self, func, key) {
        self.scope.$watch('ctrl.field.chart', (newVal, oldVal) => {

          if (_.isEqual(newVal, oldVal) && self.noInit) return;

          if (func) func(newVal, self.param);

          // 构建合计的结构
          self.sum = this.buildSum(newVal, self.fieldInfo, key);

          // chart 图表设定默认不显示未来日模式，当有同期值时才显示
          let showFutureToggle = false;

          self.sum.forEach(s => {
            if (!showFutureToggle) {
              if (s.find(f => f.id.includes('YoYValue')))
                showFutureToggle = !showFutureToggle;
            }
          });

          self.chartFieldIncludeYoYValue = showFutureToggle;

          // 初始化时候的处理
          if (!newVal || !self.noInit) return;

          basicService.setSession(CommonCon.session_key.hsField, self.field);

          // 当前页面没有图表 却需要图标设定里的指标 这时候只需要将所有指标作为参数请求即可
          if (key && key.pageNoChart) {
            self.instance.reloadData();

            return;
          }

          // chart loading
          self.loadChart = !self.loadChart;

          // 将datatable的初始页码设置为第一页
          self.option.displayStart = 0;

          if (self.sortInfo) {
            // 将最新的param保存到session
            basicService.setSession(CommonCon.session_key.hsParam, self.param);

            const table = angular.element('.dataTables_scrollBody .hs-table');

            // 如果表格中没有当前排序的字段 则表格设置为排名升序
            const field = self.field.chart[self.sortInfo.type].bar[0].id;
            const index = _.findIndex(self.column, {mData: field});
            self.sortInfo.flag = self.field.newTable.includes(field);

            !self.sortInfo.flag
              ? this.dynamicSort(self.param, field, self.sortInfo.dir)
              : table.DataTable().order([index, self.sortInfo.dir]).draw();
          } else {
            if (key && key.trend) {
              // 将param里面的数据映射到页面条件上
              $rootScope.$broadcast(CommonCon.session_key.sessionParam, self.param);

              if (self.initShowFutureToggle) self.initShowFutureToggle();

              if (self.openFuturePattern) {
                delete self.openFuturePattern;
                self.instance.reloadData();
                return;
              }

              // 当该页面存在表格 发起ajax请求时 需要全屏loading
              $rootScope.fullLoadingShow = true;

              // build 请求参数
              let param = this.buildParam(this.getParam(self.param, self.field));
              param.sortBy = {field: "dateCode", direction: 1};

              dataService[self.interfaceName](param).then(res => {
                const data = res.data;

                // 构建图表数据
                self.setChartData(data.details);

                // 构建合计数据
                this.getSum(data.summary, self.sum, self.fieldInfo);

                // 当该页面存在表格 发起ajax请求时 需要全屏loading
                $rootScope.fullLoadingShow = false;
              });
            } else if (self.keys.noRelodData) {
              // 将最新的条件保存到session
              basicService.setSession(CommonCon.session_key.hsParam, self.param);
              basicService.setSession(CommonCon.session_key.hsField, self.field);
              self.loadChart = !self.loadChart;
              delete self.keys.noRelodData;
            } else {
              // 将最新的条件保存到session
              basicService.setSession(CommonCon.session_key.hsParam, self.param);
              basicService.setSession(CommonCon.session_key.hsField, self.field);

              self.instance.reloadData();
            }
          }
        });
      },

      watchChartPage(self, func) {
        self.scope.$watch("ctrl.chartPage", (newVal, oldVal) => {
          if (!newVal || newVal === oldVal) {
            return;
          }

          if (self.clickChartPage) {

            const param = func ? func() : {};

            angular.element('.hs-table').DataTable().page(newVal - 1).draw(false);

            self.clickChartPage = false;
          }
        });
      },

      watchSort(self, func) {
        self.scope.$watch("ctrl.key.currSort", (newVal) => {
          if (!newVal) return;

          // 在order事件中标识 点击的是chart sort区域
          self.click = true;
          self.clickSort = self.click;

          // chart loading效果
          self.loadChart = !self.loadChart;

          if (func) func(self.param);

          // 将最新的条件保存到session
          basicService.setSession(CommonCon.session_key.hsParam, self.param);

          const table = angular.element('.dataTables_scrollBody .hs-table');
          const field = self.field.chart[newVal.name].bar[0].id;
          const index = _.findIndex(self.column, {mData: field});
          const contain = self.field.newTable.includes(field);

          // 将当前的排序信息保存到当前实例上
          self.sortInfo = {
            index,
            field,
            type: newVal.name,
            dir: newVal.code,
            flag: contain
          };

          // 如果表格中没有当前排序的字段 则表格设置为排名升序
          !contain
            ? this.dynamicSort(self.param, field, newVal.code)
            : table.DataTable().order([index, newVal.code]).draw();
        });
      },

      dynamicSort(param, field, sort) {
        const table = angular.element('.dataTables_scrollBody .hs-table');
        const newParam = angular.copy(param);

        newParam.sort = [field, sort === "asc" ? 1 : -1];
        basicService.setSession(CommonCon.session_key.hsParam, newParam);


        table.DataTable().order([0, "asc"]).draw();
      },

      /**
       * 监听异步中更改的属性
       */
      watchBack(self) {
        self.scope.$watch('ctrl.back', (newVal, oldVal) => {
          self.noInit = newVal.noInit;

          if (!_.isUndefined(newVal.tablePage)) {
            self.chartPage = newVal.tablePage;
          }

          if (newVal.finish !== oldVal.finish)
            self.keys.finish = true;

        }, true);
      },

      dealModal(promise, suc) {
        if (!suc) suc = () => {
        };
        promise.then(suc, () => {
        });
      },

      /**
       * 跳转时 保存当前路由信息
       */
      saveRouteInfo() {
        const cur = $state.$current;
        let info = {from: cur.name};

        // 将当前路由信息保存到session里 用于页面返回和父菜单的active选中效果
        // basicService.setCookie("subPage", info);

        return JSON.stringify(info);
      },

      /**
       * 判断是否需要显示库存的chart
       * @param field 当前图标设定的数据
       * @param key 当前页面的配置
       */
      isShowStock(field, key) {
        return key.page.haveStockChart && Object.keys(field).length > 0;
      },

      /**
       * 格式化日期
       * @param date
       * @param weather
       * @returns {*}
       */
      formatDate(date, weather, flag, full, keys) {
        if (!date) return "";

        keys = keys || {};
        const format = [
          [6, "YYYYMM", "YYYY/MM"],
          [8, "YYYYMMDD", "YYYY/MM/DD"]
        ];
        const actName = ['活动日期', '对比日期']
        const filter = format.filter(s => s[0] === date.toString().length)[0];
        const nowDate = !filter ? date : moment(date, filter[1]).format(filter[2]);
        // 月份的场合 没有天气
        if (date.toString().length < 7 || !weather || keys.noWeather) return nowDate;
        let content = '';

        if (!flag) {
          let mid_content = [];
          mid_content.push(`${nowDate} 杭州天气 : ${weather.now}`);
          if (weather.yoy) mid_content.push(`同期 杭州天气 : ${weather.yoy}`);
          if (weather.tot) mid_content.push(`环期 杭州天气 : ${weather.tot}`);
          content = mid_content.join('&#10;')
        } else {
          if (full.chineseCalendar) {
            if (keys && keys.activityCompare === 'one') content = `${actName[0]}：${full.chineseCalendar}`;
          }
          if (full.chineseCalendarYoYValue) {
            if (keys && keys.activityCompare === 'two') content = `${actName[1]}：${full.chineseCalendarYoYValue}`;
          }

        }

        return `<span title="${content}" class="hs-trend-weather">${nowDate}</span>`;
      },

      /**
       * 定义表格的日期配置
       */
      buildTableDate(field, keys) {
        const haveToT = field && field.newTable.some(s => s.includes("ToT"));
        const haveYoY = field && field.newTable.some(s => s.includes("YoY"));
        let dateParam, Show = false;
        if (keys) {
          dateParam = keys.date ? keys.date : 'dateCode';
          if (keys.flag) Show = keys.flag
        } else dateParam = 'dateCode';

        return {
          code: dateParam,
          sort: true,
          render: (data, i, full) => {
            let weather;
            if (field) {
              weather = {
                now: FigureService.changeNull(full.weatherInfo)
              };

              if (haveYoY) weather.yoy = FigureService.changeNull(full.weatherInfoYoYValue);
              if (haveToT) weather.tot = FigureService.changeNull(full.weatherInfoToTValue);
            }

            return this.formatDate(data, weather, Show, full, keys);
          }
        }
      },

      /**
       * 初始化各个指标的值
       * @param com 页面条件
       * @param data 初始值
       * @param option 配置
       */
      initByAccess(com, data, option) {
        option = option ? option : {};

        const accessCom = angular.copy(com);
        const access = data;

        _.forIn(accessCom, (value, key) => {
          const filter = access.dataAccess.filter(s => value && s.dataAccessCode == value.id)[0];

          if (!filter) return;

          value.val = filter.accesses;
        });

        if (option.setMulti && option.setMulti.first) {
          // 门店的情况下恢复第一个门店
          if (option.setMulti.first.includes('1') && accessCom.store.val.length) accessCom.store.val = _.slice(accessCom.store.val, 0, 1);
          // 业态的情况下恢复第一个业态, 门店清空
          if (option.setMulti.first.includes('3') && accessCom.operation.val.length) {
            accessCom.store.val = [];
            accessCom.operation.val = _.slice(accessCom.operation.val, 0, 1);
          }
        }


        // 添加level
        if (accessCom.category)
          accessCom.category.val = popupToolService.addLevel(accessCom.category.val, Pop.catLevels);

        if (accessCom.classes)
          accessCom.classes.val = popupToolService.addLevel(accessCom.classes.val, Pop.classLevels);

        // 将有权限的kpi存入session
        basicService.setSession(Common.conditionAccess, accessCom);

        // 当权限里 品类组和类别都存在的时候 只设置品类组, 类别不显示
        if (accessCom.category && accessCom.classes) {
          if (FigureService.haveValue(accessCom.category.val)
            && FigureService.haveValue(accessCom.classes.val)
            && !option.needCategory) {

            accessCom.category.val = [];
          }
        }

        // 将处理过的条件值存入session
        basicService.setSession(Common.updatedCondition, accessCom);

        if (option.setTopCache && !basicService.getLocal(Common.local.topCondition))
          basicService.setLocal(Common.local.topCondition, accessCom);

        return accessCom;
      },

      /**
       *
       * @param date
       * @param isFuture 未来日模式
       * @returns {boolean}
       */
      isSilentChart(date, isFuture) {
        const [sta, end] = date.split("-");
        return _.isEqual(sta, end) && sta.length > 7;
      },

      /**
       * chart 类目轴为日期时 添加事件
       * @param key
       * @param crumb
       * @param dateFunc
       * @param func
       * @param dateType
       * @returns {*}
       */
      addDateEvent(key, crumb, dateFunc, func, dateType) {

        if (this.isSilentChart(key.myParam.condition.date)) return null;

        return (param) => {

          if (dateFunc) crumb = dateFunc();

          const basicDate = key.basicDate ? key.basicDate() : {};

          function format(date) {
            return moment(date, "YYYYMMDD").format("YYYY/MM/DD");
          }

          function emitDate(sta, end, type) {
            const date = `${sta}-${end}`;
            if (crumb.length > 1) {
              crumb[1] = _.isEqual(sta, end) ? sta : date;
            } else
              crumb.push(_.isEqual(sta, end) ? sta : date);

            key.scope.$emit(CommonCon.dateChange, date);

            if (func) func(date, type);
          }

          if (param.name.length >= 8) {
            //未来日模式下，未来日不可钻入
            if (!key.showFutureToggle || !moment(param.name).isAfter(moment(format(basicDate.baseDate))))
              emitDate(format(param.name), format(param.name), 'day');
          } else {
            if (dateType) {
              // 未来日模式下，未来月不可钻入
              const endDate = basicDate.baseYear + basicDate.endMonth;
              const startDate = moment(param.name, 'YYYY/MM').format('YYYYMM');
              if (!moment(startDate).isAfter(endDate))
                emitDate(param.name, param.name);
            } else {
              dataService.getBusinessMonthDateRangeWithDate(
                parseInt(param.name.replace('/', ''))
              ).then(res => {
                // 未来日模式下，未来月不可钻入
                const startDate = format(res.data.startDate);
                const endDate = format(res.data.endDate);
                if (!moment(startDate).isAfter(endDate))
                  emitDate(startDate, endDate);
              });
            }
          }
        };
      },

      /**
       * 页面初始化之前获取用户权限
       * @param init 页面的init方法
       * @param func 定制指定函数
       */
      getAccess(init, func) {
        const session = basicService.getSession(Common.accountAccess, false);
        if (session) {

          if ($rootScope.user && _.isEqual($rootScope.user.userCode, session.userCode)) {
            init(session);
            if (func) func(session);
            return;
          }
        }

        // 获取用户的权限信息
        ajaxService.post(action.auth.access, {moduleId: Common.module}).then(function (res) {

          // basicService.setSession(Common.accountAccess, res.data);
          basicService.setSession(Common.accountAccess, res.data);
          init(res.data);
          if (func) func(res.data);
        });
      },

      /**
       * table format 格式化
       */
      formatTableData(data) {
        let newData = '';
        data === undefined || data === null ? newData = '-' : newData = data;
        return newData;
      },

      /**
       * 合并当前选中的值和权限中的值
       * @param com 本地的条件
       * @param accessCom 权限里的条件
       * @param job 当前岗位
       * @param func 自定义合并权限
       */
      unionAccess(com, accessCom, job, func) {
        /**
         * 点查询时 判断当前页面的条件状态
         * 品类组不存在 类别不存在 商品或新品不存在 保留品类组
         */
        // 采购需要按权限还原条件的（地区、业态、门店），其他时得按照条件来参照
        const needRecover = ['district', 'operation', 'store'];
        if (job && job === CommonCon.jobTypes.buyer) {
          if ((!com.category || !FigureService.haveValue(com.category.val))
            && (!com.classes || !FigureService.haveValue(com.classes.val))
            && (!com.product || !FigureService.haveValue(com.product.val))) {

            if (com.category) com.category.val = [];
            if (com.classes) com.classes.val = angular.copy(accessCom.classes.val);
          }

          needRecover.forEach(n => {
            if (accessCom[n] && accessCom[n].val && accessCom[n].val.length) com[n].val = angular.copy(accessCom[n].val);
          });
          return;
        }

        const initializeCom = initCom => {
          // 其他情况做条件初始化处理
          _.forIn(initCom, (value, key) => {
            if (value instanceof Object && value.val && value.val.length === 0)
              value.val = accessCom[key].val;
          });
        };

        // 门店、业态\地区 两个互斥处理
        // 当条件门店有值时， 业态和地区 不用管权限，按照条件走
        if (com.store && com.store.val && com.store.val.length) {
          // 所以剔除门店业态地区，其他项按照原先逻辑初始化
          let otherCom = _.omit(com, needRecover);
          initializeCom(otherCom);
          Object.assign(com, otherCom);
        } else
          initializeCom(com);

        if (func) func();
      },

      /**
       * tab 跳转
       * @param curr
       * @param self 当前控制器实例
       */
      goTab(curr, self) {
        if (self.extraClickFunc && curr === 8) {
          self.extraClickFunc(curr, self);
          return;
        }
        const content = angular.copy(self.currPopover);
        if (self.current.level) {
          const levels = self.current.id === 2 ? CommonCon.catLevels : CommonCon.classLevels;
          const levelFilter = levels.filter(s => s.id == content.level)[0];

          if (levelFilter) content.name = `${levelFilter.name}-${content.name}`;
        }

        let data = {
          tabIndex: curr,
          key: self.current,
          value: {
            id: self.current.id,
            val: [content]
          }
        };

        // 这是一个恶心的补丁=> 来自abc为了不给条件上有abc的级别和code
        if (self.getTags) {
          data = self.getTags(data);
        }

        if (self.tableCheckAccess) {
          const params = this.buildParam(this.getParam(self.param, []), self.key.special);
          if (_.eq(self.tableCheckAccess, "classes")) {

            const levelName = CommonCon.classLevelCodeMap[String(content.code).length];
            if (levelName) {
              params.condition.classes = {[levelName]: [content.code]};
            }
          } else {
            params.condition[self.tableCheckAccess] = {
              level: content.level,
              values: [content.code]
            };
          }

          basicService.checkAccess(params, () => {
            // 将当前点击的指标反映到条件上
            self.scope.$emit(CommonCon.changeTab, data);
          });

          return;
        }

        // 是否需要清空业态
        if (self.clearOperation) {
          let newData = [];
          newData.push(angular.copy(data));
          newData.push({
            key: Pop.types.find(t => t.id === 3),
            value: {
              id: "3",
              val: []
            }
          });
          data = angular.copy(newData);
        }

        // 将当前点击的指标反映到条件上
        self.scope.$emit(CommonCon.changeTab, data);

        if (self.changeTabClick) self.changeTabClick(curr, self);
      },

      /**
       * chart 点击柱子触发事件
       * @param self
       * @param name
       * @param event
       */
      commonChartClick(self, name, event, func) {
        // 表示当前场景不是切换level
        self.param.changeLevel_delete = false;

        const code = self.chartKey.name;
        const hideTree = self.chartKey.code === 'all';
        let data = angular.copy(self.chartKey.session);

        self.param = this.getParent(self.chartKey, self.param, hideTree);

        if (!hideTree) {
          // 将当前点击的分类发射到共通条件上
          const levelName = self.initLevelType.filter(s => self.chartKey.level == s.id)[0].name;
          data = {
            id: self.chartKey.session.id,
            val: [{code: self.chartKey.code, name: `${levelName}-${name}`, level: self.chartKey.level}]
          };
        } else {
          // 点击全部时 要判断当前查询的条件

          // 按品类组页面
          // 1. 查询条件没有品类组时 设定成空
          // 2, 查询条件有品类组时 设定成数据权限
          const searchData = self.searchData || {};

          if (_.eq(code, 'classCode') && searchData.classes) {
            !FigureService.haveValue(searchData.classes.val)
              ? data.val = [] : data = self.chartKey.session;
          }

          if (_.eq(code, 'categoryCode') && searchData.category) {

            if (FigureService.haveValue(self.session.classes.val)) {

              FigureService.haveValue(searchData.classes.val)
                ? data.val = [] : data = self.session.category;

            } else

              FigureService.haveValue(self.session.category.val)
                ? data = self.session.category : data.val = [];
          }

        }

        self.scope.$emit(event, data);

        if (func) func();
      },

      /**
       * 获取当前kpi的父级 渲染面包屑
       * @param key 必需的数据包含url, param, session
       * @param self
       */
      getTree(key, self) {
        // 如果数据权限只设置了一个分类 那么面包屑只取该分类及child
        const value = key.session.val;
        const one = value.length === 1;
        let param = key.code;

        if (_.isUndefined(key.code) || _.isNull(key.code)) {
          if (!one) return;
          param = value[0].code;
        }

        dataService[key.url]({[key.name]: param, moduleId: Common.module}).then(res => {
          const data = res.data;

          self.categoryTree = value[0] ? data.filter(s => s.level >= parseInt(value[0].level)) : data;
        });
      },

      /**
       * 根据给定的categoryCode获取父级
       * @param key
       * @param param
       * @param hide
       */
      getParent(key, param, hide) {
        if (!key.code) return;

        const local = angular.copy(param);
        const type = key.session.id == 2 ? 'category' : 'classes';

        // 点击全部
        key.code === 'all'
          ? local[type] = angular.copy(key.session)
          : local[type].val = [{code: key.code, level: key.level}];

        // changeLevel 点击全部时不重置 点其他重置
        return Object.assign({}, local, {hideTree_delete: hide});
      },

      /**
       * 遍历树 添加展开收起的属性
       * @param treeData 处理树形结构时所需要的数据
       * @param originData 原始树结构
       * @param parent 树节点数组
       * @param first 一级树节点
       * @param second 二级树节点
       * @param third 三级树节点
       * @param fourth 四级树节点
       */
      loopTree(treeData, originData, parent, first, second, third, fourth) {
        const selected = treeData.select.map(s => String(s.code));

        if (!FigureService.haveValue(selected)) return;
        const level = treeData.select[0].level;

        originData.forEach(s => {

          if (s.nodeName === '整体') s.expanded = true;

          if (selected.includes(String(s[treeData.code]))) {
            if (first) first.expanded = true;
            if (second) second.expanded = true;
            if (third) third.expanded = true;
            if (fourth) fourth.expanded = true;
          }

          // 选中节点等级大于等于当前节点等级 或者 子节点不存在 返回
          if (level <= originData[0].level || !s.nodes) return;

          // 将父级节点对象存入数组
          parent.push(s);

          this.loopTree(treeData, s.nodes, parent, ...parent);
        });

      },

      /**
       * 重置树的宽度
       */
      resizeTree() {
        const grid = $('#treeGrid');
        if (grid.length) {
          grid.jqxTreeGrid('resize', {
            width: '100%'
          });
        }
      },

      basicKey(current, fieldInfo, data) {
        return {
          data,
          xData: current,
          info: fieldInfo
        };
      },

      buildDate(date) {
        const start = `${date.toString().substring(0, 4)}/01`;
        return `${start}-${moment(date, "YYYYMM").format("YYYY/MM")}`;
      },

      /**
       * 监听订阅的事件
       * @param self
       * @param key 配置参数，是否生效
       * @param optionFunc 配置自定义函数
       */
      onEvent(self, key, optionFunc) {
        key = key || {};
        optionFunc = optionFunc || {};

        function InitShow(ele, type) {
          if (!ele.val.length) return;

          if (key.paramShow === true ||
            (_.isArray(key.paramShow) && key.paramShow.includes(type)))
            self.show = true;
        }

        const rememberCom = (noCopy) => {
          delete self.conditionTipsMessage;
          if (self.showCondition) self.showCondition();

          if (optionFunc.setTopCondition && key.rememberCom)
            optionFunc.setTopCondition();
          else if (key.rememberCom) {
            key.isSubMenu
              ? this.commonSetSub(self.commonParam, self.subSession)
              : this.commonSetTop(self.commonParam, key.removeField);
          }

          if (!noCopy)
            self.commonParam = Object.assign({}, self.commonParam);
        };

        // 点击chart 中 date的面包屑触发
        self.scope.$on(CommonCon.moreParamLine, (e, d) => {
          self.show = d;
        });

        // 点击chart 中 date的面包屑触发
        self.scope.$on(CommonCon.dateChange, (e, d) => {
          self.com.date = d;
          self.commonParam.date = d;

          rememberCom();
        });

        // 点击chart 中 store的柱子触发
        self.scope.$on(CommonCon.storeClick, (e, d) => {
          InitShow(d, "store");
          // 点击门店柱子的时候判断是否需要清空业态条件
          if (key.clearOperation) {
            self.com.operation.val = [];
            self.commonParam.operation.val = [];
          }
          self.com.store = d;
          self.commonParam.store = d;

          rememberCom();
        });

        // 点击chart 中 operation的柱子触发
        self.scope.$on(CommonCon.operationClick, (e, d) => {
          InitShow(d, "operation");
          self.com.operation = d;
          self.commonParam.operation = d;

          rememberCom();
        });

        // 点击chart 中 district的柱子触发
        self.scope.$on(CommonCon.districtClick, (e, d) => {
          InitShow(d, "district");
          self.com.district = d;
          self.commonParam.district = d;

          rememberCom();
        });

        // 点击chart 中 category的面包屑触发
        self.scope.$on(CommonCon.categoryClick, (e, d) => {
          InitShow(d, "category");
          self.com.category = d;
          self.commonParam.category = d;

          rememberCom();
        });

        // 点击chart 中 class的面包屑触发
        self.scope.$on(CommonCon.classClick, (e, d) => {
          InitShow(d, "classes");
          self.com.classes = d;
          self.commonParam.classes = d;

          rememberCom();
        });

        // 当点击表格中的链接切换tab时触发
        self.scope.$on(CommonCon.changeTab, (e, data) => {
          const dealCom = data => {
            self.com[data.key.sign] = data.value;
            self.commonParam[data.key.sign] = data.value;

            if (data.tabIndex)
              self.key.active = data.tabIndex;

            // 门店的场合特殊处理
            if (data.tabIndex === 5 && data.key.id === 5) {
              self.show = true;
            }
          };
          if (angular.isArray(data)) {
            data.forEach(d => dealCom(d))
          } else
            dealCom(data);
          rememberCom(true);
        });
      },

      /**
       * 获取路由信息
       * @param state 路由对象
       * @returns {null}
       */
      subMenuInfo(state) {
        const info = state.info;
        return info ? JSON.parse(info) : null;
      },

      /**
       * 从session里面获取条件的数据
       * @param curr 当前页面的条件信息
       * @param tableInfo 表格信息
       * @param key 配置
       * @param func 额外的逻辑
       * @returns {*}
       */
      getComFromSession(curr, tableInfo, key, func) {
        const sessionKey = key && key.session ? key.session : Common.condition;
        const session = basicService.getSession(sessionKey, true);

        if (!session) return curr;

        if (func) func(session);

        let condition = curr;
        _.forIn(session, (value, key) => {

          if (_.isUndefined(curr[key])) return;

          condition[key] = value;
        });

        // 设置表格信息
        if (tableInfo) {
          tableInfo.sort = session.sortInfo;
          tableInfo.page = session.pageInfo;
        }

        return condition;
      },

      /**
       * 二级菜单对应的页面条件保持
       * @param com 当前页面的条件
       * @param func 额外执行的逻辑
       * @param alone 不进行保持处理的条件
       */
      getTopCondition(com, func, alone, option, conf) {
        const localParam = conf ? conf : Common.local.topCondition;

        const topCondition = basicService.getLocal(localParam);

        if (!topCondition) return;

        _.forIn(topCondition, (value, key) => {

          if (_.isUndefined(com[key]) || (alone && alone.includes(key))) return;
          com[key] = value;
        });

        // const click = topCondition.click;
        //
        // if (click) {
        //   com[click.name] = click.value;
        // }

        if (func) func();

        // 判断最终的页面条件和权限条件的差异
        this.resetClassesAndCategory(option, com, 'topCondition');

        return topCondition;
      },

      resetClassesAndCategory(option, com, condition) {
        if (option && option.job === CommonCon.jobTypes.buyer && option.reset) {
          const cond = basicService.getLocal(Common.local[condition]);
          const reset = option.reset[0];

          if (!com[reset] || !com[reset].val.length) {
            const access = basicService.getSession(Common.conditionAccess);
            com[reset] = access[reset];
            cond[reset] = access[reset];

            basicService.setLocal(Common.local[condition], cond);
          }
        }
      },

      /**
       * remove 条件中的level
       * @param param
       */
      removeLevel(param) {
        delete param.classLevel;
        delete param.categoryLevel;
      },

      /**
       * 初始化日期范围
       * @param self 当前页面实例
       * @param func 逻辑函数体
       */
      initDate(self, func) {
        basicService.packager(dataService.getBaseDate(), res => {
          const baseDate = res.data.baseDate;

          self.baseYear = baseDate.toString().substring(0, 4);
          basicService.packager(dataService.getMonthByDate(baseDate), resp => {
            self.baseMonth = resp.data.businessMonth;
            self.com.date = this.buildDate(resp.data.businessMonth);
            if (self.dateOption) self.dateOption.date = self.com.date;
            if (func) func(baseDate);
          })
        });
      },

      /**
       * 监听权限相关的条件
       * @param self 当前页面实例
       */
      effectCondition(self) {
        // 监听品类组条件变化
        self.scope.$watch("ctrl.com.classes.val", newVal => {
          self.haveClass = FigureService.haveValue(newVal);
        });

        self.scope.$watchGroup([
          'ctrl.com.district.val',
          'ctrl.com.operation.val',
          'ctrl.com.store.val',
          'ctrl.com.storeGroup.val'
        ], newVal => {

          if (!newVal) return;
          const haveStores = newVal.filter(s => FigureService.haveValue(s))[0];
          self.haveStoreRelate = !!haveStores;
        }, true);
      },
      /**
       * 根据当前用户的权限判断其所在的岗位
       * @param access 权限覆盖后的条件
       */
      getJobByAccess(access) {
        if (!access) return;
        const types = CommonCon.jobTypes;

        if (access.classes && FigureService.haveValue(access.classes.val))
          return types.buyer;

        if ((access.store && FigureService.haveValue(access.store.val))
          || (access.operation && FigureService.haveValue(access.operation.val))
          || (access.district && FigureService.haveValue(access.district.val)))
          return types.store;

        // 默认是全权限
        return types.all;
      },

      /**
       * 构建表格的column
       */
      buildSupplierColumn(field) {
        const fix = [
          "_id",
          "supplierCode",
          {
            code: "supplierName",
            render: (data) => {
              return this.buildLink(data);
            }
          },

        ];

        return tableService.anyColumn(tableService.fixedColumn(fix), field);

      },

      /**
       * 是否需要显示更多的popover 框
       * @param com
       * @param other
       * @returns {boolean}
       */
      contrastCom(com, other) {
        let otherCom = false;

        if (other) {
          other.forEach(v => {

            let name;
            if (v.includes(".")) {
              const [sta, end] = v.split(".");
              name = com[sta][end];
            } else
              name = com[v];

            if (name && typeof name !== 'object') otherCom = true;

            if (typeof name === 'object' && FigureService.haveValue(name.val))
              otherCom = true;
          })
        }

        return otherCom;
      },

      // 根据数据权限判断身份
      authorityLevel(access) {
        let types;

        if (access === 'buyer')
          return types = {level: 'buyer', name: '(采购)'};

        if (access === 'store')
          return types = {level: 'store', name: '(营运)'};

        // 默认是全权限
        return types = {level: 'all', name: ''};
      },


      /**
       * 判断当前是否为老板
       * @param curr
       * @returns {boolean}
       */
      isBoss(curr) {
        return curr === CommonCon.jobTypes.all;
      },

      getTabTypes() {
        return [
          {id: "17", name: "按趋势/供应商", href: CommonCon.jobTypes.all, active: true},
          {id: "2", name: "按品类组", href: CommonCon.jobTypes.buyer, active: false},
          {id: "5", name: "按门店", href: CommonCon.jobTypes.store, active: false}
        ];
      },

      getProfitChart(curr, chart) {
        const types = angular.copy(chart);
        const jobs = CommonCon.jobTypes;
        const isBoss = this.isBoss(curr);

        if (isBoss) {
          let bossField = {}, bossData = {};
          _.forIn(jobs, (val, key) => {
            const data = types[val];
            const field = this.calculateChartField(data);

            bossData[val] = data;
            bossField[val] = {first: field};
          });

          return {chart: bossData, field: bossField};
        } else {
          const data = types[curr];
          const field = this.calculateChartField(data);

          return {chart: data, field: {first: field}};
        }
      },

      /**
       * 构建当前页面的chart option
       * @param key 配置
       * @param self 当前实例
       * @param summary 合计数据
       */
      getChartOption(key, self, summary) {
        key.barLabel = self.showBarLabel;
        key.lineLabel = self.showLineLabel;

        self.sale = this.buildChart(self.field.chart.first, Object.assign({}, key, {firstRect: true}));
        self.stock = this.buildChart(self.field.chart.second, key);
      },

      getHoverTab(tabs, i) {
        // 表格中hover时出现的内容
        const tab = tabs ? tabs : CommonCon.saleStockTabs;

        return tab.filter(s => s.id !== i);
      },

      pageInit(self, func, noDate) {
        // 添加初始化标识
        self.com.isInit_delete = true;

        // 监听 sessionParam
        self.scope.$on(CommonCon.session_key.sessionParam, (e, d) => {
          const data = angular.copy(d);

          _.forIn(data, (v, k) => {
            if (!_.isUndefined(self.com[k])) self.com[k] = v;
          });

        });

        // if(self.filter){
        //   // 监听 filterParams
        //   self.scope.$on(CommonCon.session_key.filterParams, (e, d) => {
        //     const noResetFilter = basicService.getSession(CommonCon.session_key.sessionParam, true);
        //     if(noResetFilter) return;
        //     const data = angular.copy(d);
        //
        //     _.forIn(data, (v, k) => {
        //       if (!_.isUndefined(self.filter[k])) self.filter[k] = v;
        //     });
        //   });
        // }

        if (noDate) {
          if (func) func();
          return;
        }

        if (!self.com.date) {
          // 初始化日期范围
          this.initDate(self, (d) => func(d));
        } else {
          self.dateOption.date = self.com.date;
          func(self.com.date);
        }
      },

      /**
       * 获取收益页面的当前tab
       */
      getCurrentTab(curr) {
        return this.getTabTypes().filter(s => {
          return s.id.includes(curr)
        })[0].href;
      },

      /**
       * 供应商排名页面 点击跳转到详细页面的处理逻辑
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       * @param name 指定特定的供应商字段
       */
      goSupplierDetail(com, back, rowData, route, name) {
        let condition = angular.copy(com);

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};

        // 设置当前点击的字段
        condition.click = {
          name: 'supplier',
          value: {
            val: [{
              code: rowData.supplierId,
              name: rowData[name ? name : 'supplierName'],
              showCode: rowData.supplierCode
            }], id: 9
          }
        };

        basicService.setSession(Common.condition, condition);

        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       * 点击跳转到详细页面的处理逻辑(通用)
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       * @param click 当前点击的类型
       */
      goSubPageDetail(com, back, rowData, route, click) {
        let condition = angular.copy(com);
        const current = Pop.types.filter(s => s.sign === click)[0];

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};

        // 设置当前点击的字段
        condition.click = {
          name: click,
          value: {
            val: [{
              code: rowData[current.code],
              name: rowData[current.title],
            }], id: current.id
          }
        };

        basicService.setSession(Common.condition, condition);

        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       * 销售异常分析子页面
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       */
      getSaleAbnormalProductInStore(com, back, rowData, route) {
        let condition = angular.copy(com);

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};

        // 设置当前点击的字段
        condition.click = {
          name: 'storeInfo',
          storeCode: rowData.storeCode,
          storeName: rowData.storeName
        };

        basicService.setSession(Common.condition, condition);
        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       * 点击跳转-动销
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       * @param click 当前点击的类型
       * @param state 页面路由
       */
      goDoorSubPageDetail(com, back, rowData, route, click, state) {
        let condition = angular.copy(com);
        const current = Pop.types.filter(s => s.sign === click)[0];

        condition.newProduct.val = [{
          code: rowData[current.code],
          name: rowData[current.title],
        }];

        condition.date = condition.date + '-' + condition.date;

        // 类别/品类组设置为空
        condition.category.val = [];
        condition.classes.val = [];

        // 标识门店动销页面
        condition.fromPage_delete = $state.$current.name;
        basicService.setSession(Common.condition, condition);

        // 点击跳转到目标页面触发的逻辑
        this.fromMenuClickToTarget(state, back, condition);

        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       * 点击跳转-首页
       * @param com 当前页面的条件
       * @param route 路由信息
       */
      goHomeSubPageDetail(com, route) {
        let condition = angular.copy(com);
        basicService.setLocal(Common.local.topCondition, condition);

        basicService.setSession("fromHomeToSaleStock", true);
        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       * 供货分析页面 点击跳转到供货率 退货率页面
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       * @param name 指定特定的供应商字段
       */
      goSupplierRate(com, back, rowData, route, name) {
        let condition = angular.copy(com);

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};
        condition.material = true;
        // 设置当前点击的字段
        condition.click = {
          name: 'product',
          value: {
            val: [{
              code: rowData.productId,
              name: rowData.productName,
              productCode: rowData.productCode
            }], id: 9
          }
        };

        if(condition.receiveQtyRate) delete condition.receiveQtyRate;
        if(condition.returnAmountRate) delete condition.returnAmountRate;

        basicService.setSession(Common.subDetailCondition, condition);

        const data = this.saveRouteInfo();
        $state.go(route, {info: data});
      },

      /**
       *
       * @param com
       * @param moduleName
       * @returns {*}
       */
      subPageCondition(com, moduleName, option) {

        moduleName = moduleName || "";

        // 如果session condition里面有值的话 优先读取session
        let fromSession = basicService.getSession(Common.condition, true);

        if (fromSession) {
          const from = {};

          _.forIn(com, (value, key) => {
            from[key] = _.isUndefined(fromSession[key]) ? value : fromSession[key];
          });

          const click = fromSession.click;
          if (click) from[click.name] = click.value;

          basicService.setLocal(Common.local.subCondition + moduleName, from);

          // 当前页面刷新后再点击返回 也要记住
          basicService.setLocal(Common.local.returnCondition + moduleName, fromSession);

        } else {
          fromSession = basicService.getLocal(Common.local.returnCondition + moduleName);
        }

        // 如果local subCondition里面有值的话 优先读取local
        let subSession = basicService.getLocal(Common.local.subCondition + moduleName);
        if (subSession) {
          let copyCom = angular.copy(com);

          _.forIn(copyCom, (value, key) => {
            copyCom[key] = _.isUndefined(subSession[key]) ? value : subSession[key];
          });

          this.resetClassesAndCategory(option, copyCom, 'subCondition');

          return {fromSession, com: copyCom};
        }

        _.forIn(subSession, (val, key) => {
          if (_.isUndefined(com[key])) delete subSession[key];
        });
        if (subSession) return {fromSession, com: subSession};

        return {fromSession};
      },

      /**
       * 除法
       * @param divisor 除数
       * @param dividend 被除数
       * @returns {*}
       */
      calculateDiv(divisor, dividend) {

        if (_.isNull(divisor) || _.isUndefined(divisor) || divisor === Symbols.bar || isNaN(divisor) || parseInt(divisor) === 0)
          return Symbols.bar;

        if (_.isNull(dividend) || _.isUndefined(dividend) || dividend === Symbols.bar || isNaN(dividend))
          return Symbols.bar;

        return dividend / divisor - 1;

      },

      /**
       * 减法
       * @param subtraction 减数
       * @param minuend 被减数
       * @returns {*}
       */
      calculateSub(subtraction, minuend) {

        if (_.isNull(subtraction) || _.isUndefined(subtraction) || subtraction === Symbols.bar || isNaN(subtraction))
          return Symbols.bar;

        if (_.isNull(minuend) || _.isUndefined(minuend) || minuend === Symbols.bar || isNaN(minuend))
          return Symbols.bar;

        return minuend - subtraction;

      },

      /**
       * 监听商品或新品的条件
       * @param self
       * @param code
       */
      watchProduct(self, code) {
        const name = code ? code : 'product';
        if (!FigureService.haveValue(self.com[name].val)) return;

        self.com.category.val = [];
        self.com.classes.val = [];

      },

      /**
       * 切换tab的共通逻辑
       * @param self
       * @param event
       * @param needList 不是放在更多条件中的 但是全局配置了
       */
      tabChanged(self, event, needList) {
        self.tabFinish = true;

        if (self.commonParam)
          self.commonParam.isTabChange_delete = true;

        const isNeed = (name) => {
          return needList ? !needList.includes(name) : true;
        };

        Pop.types.filter(s => self.com[s.sign] && s.id == self.com[s.sign].id && s.initOpen && isNeed(s.sign))
          .forEach(s => {
            const length = self.com[s.sign].val.length > 0;

            // 更多条件是否显示
            if (length) self.show = true;
          });
      },

      /**
       * 点击查询的共通逻辑
       * @param self
       * @returns {{} & any & {isSearch: boolean}}
       */
      commonSearch(self) {
        if (self.key) self.key.search = !self.key.search;

        // 点击查询时 将最新的指标
        if (self.field) basicService.setSession(CommonCon.session_key.hsField, self.field);

        basicService.setSession(CommonCon.session_key.searchData, self.com);

        return Object.assign({}, self.com, {
          isSearch_delete: true
        });
      },

      /**
       * 查询共同方法
       * @param com
       * @param func
       * @param key 配置
       * @returns {*}
       */
      commonQuery(com, func, key) {
        const copy = angular.copy(com);
        const option = key || {};

        if (!option.noSetParam) basicService.setSession(CommonCon.session_key.hsParam, copy);

        if (func) func(com);

        return copy;
      },

      storeRelatedEvent(details, self, type) {
        self.silentChart = details && details.length === 1;

        if (self.silentChart) return null;

        return (param) => {
          const click = {
            code: param.data.name,
            name: param.name
          };

          let data = {
            id: self.current.id,
            val: [click]
          };

          // 对面包屑进行设值
          self.tree = [click];
          self.hideTree = false;
          self.clickChart = true;

          // 广播柱子点击的事件
          self.scope.$emit(self.CommonCon[`${type}Click`], data);
        }
      },

      /**
       *
       * @param $state 路由
       * @param com 当前页面条件
       * @returns {{showCrumb: boolean, menuReturnCon: *|string|{}, breadcrumbs: *[]}} 面包屑：参数 是否展示 从哪里来 当前页面
       */
      getMenuCondition($state, com) {
        const menuCon = basicService.getLocal(Common.local.menuCondition, true);
        if (menuCon) basicService.setLocal(Common.local.returnMenuCondition, menuCon);

        const menuReturn = basicService.getLocal(Common.local.returnMenuCondition);
        const menuReturnCon = angular.copy(menuReturn) || null;
        const showCrumb = !!menuReturnCon;

        const breadcrumbs = [
          menuReturnCon ? menuReturnCon.fromRoute : '',
          basicService.getCurrentRoute($state)
        ];

        if (menuReturn) {
          _.forIn(menuReturn, (value, key) => {
            if (_.isUndefined(com[key])) return;
            com[key] = value;
          });

          if (menuReturn.click) {
            const click = menuReturn.click;
            com[click.name] = click.value;

            if (click.special) {
              _.forIn(click.special, (val, key) => {
                if (!_.isUndefined(com[key])) com[key] = val;
              });
            }

            if (click.pop) {
              _.forIn(click.pop, (val, key) => {
                if (!_.isUndefined(com[key])) com[key].val = val;
              });
            }
          }
        }

        return {
          showCrumb,
          menuReturnCon,
          breadcrumbs
        }
      },

      /**
       *
       * @param $state 当前路由
       * @param back 返回条件
       * @param condition 点击所传递的条件
       * @param func
       */
      fromMenuClickToTarget($state, back, condition, func) {
        // 获取当前页面路由
        condition.fromRoute = basicService.getCurrentRoute($state);

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};

        if (func) func(condition);

        basicService.setLocal(Common.local.menuCondition, condition);
      },

      /**
       *
       * @param com 共通条件
       * @param tableInfo 列表排序信息
       */
      fromTargetToBackPage(com, tableInfo) {
        const menuCon = basicService.getLocal(Common.local.menuCondition, true);
        if (menuCon) {
          _.forIn(menuCon, (value, key) => {
            if (!_.isUndefined(com[key])) com[key] = value;
          });

          // 设置表格信息
          if (tableInfo) {
            tableInfo.sort = menuCon.sortInfo;
            tableInfo.page = menuCon.pageInfo;
          }

          // 菜单级面包屑返回时 暂时不需要设置topCondition
          // 以后有需求会选择性设置
          // this.commonSetTop(com);
        }
      },

      storeRelatedTree(self, code) {
        if (code !== 'all') return;

        // 是否需要清空业态(需要根据权限判断)
        if (self.keys.clearOperation) {
          // self.param.operation.val = [];
          let access;
          this.getAccess(getAuth => access = getAuth, () => {
            const operation = access.dataAccess.find(s => s.dataAccessCode === '3');
            if (operation && operation.accesses.length) self.param.operation.val = operation.accesses.filter((v, k)=> k === 0);
          });
        }

        self.hideTree = true;

        self.param[self.current.sign] = self.session[self.current.sign];
        self.param = Object.assign({}, self.param);
      },

      /**
       * 主页面条件保持的共通处理
       * @param com 页面条件
       * @param remove 删掉部分条件
       * @param conf 其他key
       * @param lasting 自定义要保持的条件
       */
      commonSetTop(com, remove, conf, lasting) {
        const key =  conf ? conf : Common.local.topCondition;
        const topCondition = lasting ? lasting.concat(CommonCon.lastingCondition) : CommonCon.lastingCondition;

        const copy = angular.copy(com);
        _.forIn(copy, (val, key) => {
          if (!topCondition.includes(key)) delete copy[key];
        });

        const local = basicService.getLocal(key);

        if (remove) remove.forEach(s => {
          delete copy[s]
        });

        if (local) {
          _.forIn(copy, (value, key) => {
            local[key] = value;
          });
        }

        basicService.setLocal(key, local || copy);
      },

      /**
       * 子菜单页面条件保持的共通处理
       * @param com 页面条件
       * @param localed 已经存在的local值
       */
      commonSetSub(com, localed) {
        const key = Common.local.subCondition;
        const subCondition = CommonCon.lastingCondition;

        const copy = angular.copy(com);
        _.forIn(copy, (val, key) => {
          if (!subCondition.includes(key)) delete copy[key];
        });

        const localValue = basicService.getLocal(key);

        if (localValue) {
          _.forIn(copy, (value, key) => {
            localValue[key] = value;
          });
        }

        basicService.setLocal(key, localValue || copy);
      },

      getConditionByJob(job, com) {
        let condition = [];

        const types = CommonCon.jobTypes;
        const buyer = ["classes"];
        const store = CommonCon.storeRelate;
        const common = ["supplier"];

        switch (job) {
          case types.all:
            condition = _.concat(buyer, store, common);
            break;
          case types.buyer:
            condition = _.concat(buyer, common);
            break;
          case types.store:
            condition = _.concat(store, common);
            break;
        }

        condition.push("date");

        _.forIn(com, (val, key) => {
          if (!condition.includes(key)) delete com[key];
        });

        return condition;
      },

      dealTheStore(com) {
        const haveClass = com.classes && FigureService.haveValue(com.classes.val);
        if (!haveClass) return;

        _.forIn(com, (value, key) => {
          if (CommonCon.storeRelate.includes(key)) value.val = [];
        })
      },

      /**
       * 收益页面的初始化逻辑
       * @param com
       * @param alone
       * @param option
       * @returns {*}
       */
      initProfitCondition(com, alone, option) {
        return this.getTopCondition(com, () => {
          this.dealTheStore(com);
        }, alone, option);
      },

      profitSearch(topCondition, com, alone) {
        const topParam = angular.copy(topCondition);

        if (topParam) {
          _.forIn(com, (value, key) => {
            topParam[key] = value;
          });
        }

        this.commonSetTop(topParam || com, alone);
      },

      filterName(str, orgStr, newStr) {
        newStr = newStr || newStr == 0 ? newStr : '';
        return str.includes(orgStr) ? str.replace(orgStr, newStr).trim() : str;
      },

      initTableProfitField(self) {
        const table = basicService.getLocal(self.localTable);
        const job = self.jobTab ? self.jobTab : self.job;
        let YoYToTSettingTabs = {};
        if (table.YoYToTSettingTabs) {
          YoYToTSettingTabs = angular.copy(table.YoYToTSettingTabs);
          delete table.YoYToTSettingTabs;
        }
        // 当非老板，却要有老板权限的时候
        const getField = needBossAuth => needBossAuth ?
          this.getFieldFromLocal(table, self.currFileds, job, false, self.isBoss) : this.getFieldFromLocal(table, self.currFileds, job);

        const updateField = table ? getField(self.needBossAuth) : self.currFileds;

        if (self.isBoss) {
          self.tableData = angular.copy(updateField);
        } else
          self.field.table = updateField[job];

        //处理下同比环比的配置（获取table要去掉的fields）
        _.forIn(YoYToTSettingTabs, (v, k) => {
          const option = popupToolService.getSameRingRatioOption(v);
          if (self.isBoss)
            self.tableData[k] = Object.assign({}, self.tableData[k], {option});
          else if (_.eq(k, job))
            self.field.table = Object.assign({}, self.field.table, {option});
        });
      },

      getMenu(self, func) {
        // init 请求菜单接口
        basicService.packager(ajaxService.post(action.auth.userMenu, {
          moduleId: Common.module
        }), res => {
          let initMenu = angular.copy(res.data);

          this.getAccess((d) => this.initMenu(d, initMenu), func);
          this.menu = initMenu;
          if (self) self.menu = this.menu;

          basicService.setSession(Common.leftMenu, this.menu);

          this.routes = [];
          $rootScope.leftMenu = this.menu;
          this.loopMenu({children: this.menu}, this.routes);
          basicService.setSession(Common.visiblePage, this.routes);
        });
      },

      // 根据数据权限初始化菜单列表
      initMenu(initAccess, menuParam) {
        const data_access = initAccess.dataAccess.find(s => s.dataAccessCode === '2');
        let compareName = ['新品分析'];
        data_access.accesses.forEach(s => {
          if (s.level > 3) {
            let aL_menu = menuParam.filter(a => a.resName === compareName[0])[0].children;
            aL_menu.forEach((ele, index) => {
              if (ele.resUrl === 'app.newItemAnalyze.newItemCateGory') aL_menu.splice(index, 1);
            });
            menuParam.forEach(s => {
              if (s.resName === compareName[0]) s.children = aL_menu;
            });
          }
        });
      },

      loopMenu(menu, routes) {
        // 根据当前的路由判断要不要展开或是初始化选中
        menu.children.forEach(s => {
          // 供应商收益菜单特殊处理
          if (_.isEqual(s.resUrl, "app.supAnalyse.supplierProfit")) {
            const profitJob = s.resName.match(/\((.+?)\)/g);
            if (profitJob) sessionStorage.setItem(Common.profitJob, profitJob[0]);
          }

          // 将当前的resUrl保存到集合中 存入session
          if (!_.isEqual(s.resUrl, "#"))
            routes.push({curr: s.resUrl, parent: menu.id});

          if ($rootScope.from_route === s.resUrl) {
            $rootScope.from_route_p = menu.id;
            return;
          }

          if (!FigureService.haveValue(s.children))
            return;

          this.loopMenu(s, routes);
        })
      },

      /**
       * 监听未来模式
       * @param self
       * @param func
       */
      watchFuturePattern(self, func) {
        self.scope.$watch('ctrl.openFuturePattern', newVal => {
          if (_.isUndefined(newVal)) return;
          if (newVal) this.initFutureDate(self, () => self.instance.reloadData());
          else self.instance.reloadData();
        })
      },

      /**
       *未来日初始化
       * @param self
       * @param func
       */
      initFutureDate(self, func) {
        if (self.keys.finallMonth) {
          const baseYear = moment(self.keys.finallMonth, 'YYYYMM').format('YYYY');
          const endMonth = moment(self.keys.finallMonth, 'YYYYMM').format('MM');
          self.key._basicDate = Object.assign({endMonth}, {baseYear});
          if (func) func();
        } else if (self.key._basicDate) {
          if (func) func();
        } else {
          dataService.getBaseDate().then(res => {
            const baseDate = res.data.baseDate;
            const baseYear = moment(baseDate, 'YYYYMMDD').format('YYYY');

            // 基准日财务月区间
            dataService.getFutureBusinessMonthDateRangeWithDate(baseDate).then(mRes => {
              const endDate = mRes.data.endDate;
              const startDate = mRes.data.startDate;
              const endMonth = moment(endDate, 'YYYYMMDD').format('MM');
              self.key._basicDate = Object.assign({baseDate}, {endMonth}, {baseYear}, {startDate}, {endDate});
              self.initBaseDate = angular.copy( self.key._basicDate);
              if (func) func()
            });
          });
        }
      },

      /**
       * 处理搜索后条件排序
       *  @param com
       *  @param sortObj:排序对象
       *  @param other:需合并的其他对象
       *  @param func
       */
      dealSortData(com, sortObj, other, func) {
        let list = [], commonSearch = angular.copy(CommonCon.commonSearch);
        if (other) commonSearch = Object.assign(commonSearch, other);

        let pushFunc = (title, content, sort, codes, showCode) => {
          let obj = {title, content, sort, codes, showCode};
          list.push(obj);
        };

        _.forIn(com, (v, k) => {
          let common = commonSearch[k];

          if (!common) return;

          let type = common.type;
          let name = common ? common.name : '';

          let cont = v;

          let sortField = sortObj[k];

          let codes, showCode;
          if (type === 0) {//type：0 品类组、分类等条件
            if (!v.val.length) return;

            cont = v.val.map(d => d.name).join(Symbols.comma);
            // 商品、供应商、新品要显示code而不是id
            if (Number(v.id) === 7 || Number(v.id) === 9 || Number(v.id) === 10)
              codes = v.val.map(d => d.showCode).join(Symbols.eComma);
            else
              codes = v.val.map(d => d.code).join(Symbols.eComma);
            showCode = true;
          }

          //type：2 布尔类型
          if (type === 2) cont = common.bool[v];

          pushFunc(name, cont, sortField, codes, showCode);

        });

        if (func) func(list, pushFunc);

        return list
      },

      /**
       * 日期条件是否引用local和相关tips
       * @param self
       * @param date  非后台请求到的date
       * @param data 后台请求到日期data
       * @param option 日期其他配置
       */
      dateConditionSave(self, date, data, option) {
        if (!date) {
          delete self.conditionTipsMessage;
          return;
        }
        option = option || {};
        const dateArr = date.split('-');
        // 默认条件tip消息
        const defaultConditionMessage = () => {
          const maxDate = moment(String(data), 'YYYYMM').format('YYYY/MM');
          self.com.date = moment(String(data), 'YYYYMM').format('YYYY') + '/01-' + maxDate;
          // 不支持到日
          if (dateArr.length && dateArr[0].length > 7) {
            self.conditionTipsMessage = angular.copy(self.common.conditionTips.dateNoSupportDay);
          } else if (dateArr.length && dateArr[1].length === 7){
            const isBeforeMaxDate = moment(maxDate).isBefore(dateArr[1]);
            // 不支持当前月
            if (isBeforeMaxDate) {
              self.conditionTipsMessage = angular.copy(self.common.conditionTips.dateNoSupportCurrentMonth);
            } else {
              delete self.conditionTipsMessage;
              self.com.date = date;
            }
          }
        };
        // 不能跨年
        if (option.noCrossYear) {
          const isCrossYear = moment(dateArr[0].substr(0, 4)).isSame(moment(dateArr[1].substr(0, 4)));
          if (!isCrossYear) {
            self.conditionTipsMessage = angular.copy(self.common.conditionTips.dateNoSupportCrossYear);
            return;
          } else {
            // 不支持日和当前月
            if (option.noSupportDay && option.noSupportCurrentMonth)
              defaultConditionMessage();
            else {
              delete self.conditionTipsMessage;
              self.com.date = date;
            }
            return;
          }
        }
        defaultConditionMessage();
      }

    };
  })
;
