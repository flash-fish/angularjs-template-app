angular.module("hs.synthesizeAnalyze")
  .factory("indexCompleteService", (CommonCon, FigureService, basicService, dataService, toolService, Symbols, Chart, Pop, Common, commonP, $state, $stateParams) => {
    return {
      /**
       * 构建折线图的请求参数
       *
       * row: treeGrid的当前选中行数据
       * selected: 折线图的select当前选中的项
       */
      buildLineParams(row, param, selected) {
        let params = {
          condition: {}
        };

        let indexLine = angular.copy(CommonCon.indexLineSelect);
        let fieldTempName = param.curName;

        params.fields = [indexLine[fieldTempName][parseInt(selected) - 1].title, indexLine[fieldTempName][parseInt(selected) - 1].title + 'YoYValue'];
        params.condition = param.condition;

        //flag: true purchase（采购）页面, false operations（运营）页面
        const levelName = param.flag ? 'classCode' : 'storeCode';

        if (row.nodes) {
          if (param.flag) {
            params.condition.classes = {};
            params.condition.classes.classCode = this.findChildren(row, levelName)
          } else {
            params.condition.store = this.findChildren(row, levelName)
          }
        } else if (!_.isUndefined(row[levelName])) {
          if (param.flag) {
            params.condition.classes = {};
            params.condition.classes.classCode = [row[levelName]]
          } else {
            params.condition.store = [row[levelName]]
          }
        }

        params.pageId = param.flag ? 'page_indexComplete_buyer' : 'page_indexComplete_store';
        delete params.condition.supplier;
        delete params.condition.district;
        delete params.condition.storeGroup;
        delete params.condition.businessOperation;

        return params

      },

      /**
       * 筛选出不为空的
       */
      filterNotNull(value, row) {
        return value.filter(i => {
          return row[i] || row[i] === 0
        });
      },

      /**
       * 转换数据
       * flag: true *100
       */
      getCommonValue(common, data, flag) {
        let valueData = [];
        common.forEach(v => {
          if (flag) {//包含'率'的话*100
            const value = data[v]
              ? (v.includes('Rate') ? FigureService.scale(data[v], true, false)
                : FigureService.scaleOther(data[v], false))
              : (_.isNull(data) || _.isUndefined(data) ? '-' : data[v]);
            valueData.push(value);
          } else valueData.push(FigureService.scaleOther(data[v], false));
        });

        return valueData;
      },

      /**
       * hover data 转换数据
       * flag: true *100
       */
      getCommonHoverValue(common, data, flag) {
        let radarKeyValue = angular.copy(CommonCon.indexRadarKeyValue);
        let obj = {};
        common.forEach(v => {

          if (flag) {//包含'率'的话*100
            const value = data[v]
              ? (v.indexOf("Rate") != -1 ? FigureService.scale(data[v], true, false)
                : FigureService.scaleOther(data[v], false))
              : (_.isNull(data) || _.isUndefined(data) ? '-' : data[v]);
            obj[radarKeyValue[v]] = value;
          } else {
            obj[radarKeyValue[v]] = FigureService.scaleOther(data[v], false);
          }
        });

        return obj;
      },

      /**
       * 展开树
       * flag:true 只展开一级
       */
      expand(data, flag) {
        let traverseTree = (data, flag) => {
          data.forEach((d) => {
            d.expanded = true;
            if (!flag) {
              if (d.nodes) {
                traverseTree(d.nodes); //展开所有树
              }
            }
          })
        };
        traverseTree(data, flag);

        return data;
      },

      /**
       * 找到最里面的code
       */
      findChildren(data, name) {
        let code = [];
        let find = (data) => {
          data.forEach((d) => {
            if (!d.nodes) {
              code.push(d[name])
            } else {
              find(d.nodes); //展开到最里面
            }
          })
        };
        if (data.nodes) find(data.nodes);

        return code;
      },

      /**
       * 获取雷达图需要option数据
       */
      getRaderChart(data, param) {
        //首字母大写转换
        const upperName = param.curName.substring(0, 1).toUpperCase() + param.curName.substring(1);
        const common = angular.copy(CommonCon['index' + upperName + 'Radar']);
        // 实绩 指标
        let [valueData1, valueData2] = [
          this.getCommonValue(common.ra.value, data, true),
          this.getCommonValue(common.kpi.value, data, true),
        ];

        // define end basicOption
        let _mid_Option;

        //指标达成率
        let kpiRate = {};
        let radarKeyValue = angular.copy(CommonCon.indexRadarKeyValue);
        common.rate.value.forEach(d => {
          const value = data[d] ? FigureService.scale(data[d], true, false) : (data[d] === 0 ? '0.00' : '-');
          kpiRate[radarKeyValue[d]] = value;
        });

        const _Title = {
          title: {
            text: data.nodeCode ? '[' + data.nodeCode + ']' + (data.nodeName ? data.nodeName : '-')
              + '  指标达成情况' : (data.nodeName ? data.nodeName : '-') + '  指标达成情况',
            fontSize: 15
          }
        };

        // 构建基础数据
        let [base_Arr, newDate] = [[], []];
        _.forEach(common.indicator, (s, i) => {
          let _Length_C = common.indicator.length - 1;

          if (i === _Length_C) {
            base_Arr.push([
              this.distributeDay(valueData2[i], valueData1[i]),
              !isFinite(1 / this.Def(valueData2[_Length_C])) ? 1 : 1 / valueData2[_Length_C]
            ]);
          } else base_Arr.push([this.tranNumber(valueData1[i]), this.tranNumber(valueData2[i])]);

          let [_mid_rate_one, _mid_rate_two] = [
            s.name.includes('率') && i !== _Length_C
              ? Number(valueData1[i]) / 100
              : Number(valueData1[i]),
            s.name.includes('率') && i !== _Length_C
              ? Number(valueData2[i]) / 100
              : Number(valueData2[i]),
          ];
          newDate.push({
            name: s.name,
            value: [this.Def(_mid_rate_one, true), this.Def(_mid_rate_two, true)]
          });

        });

        // 雷达图配置
        const basicKey = {
          conf_name: common.indicator.map(s => s.name),
          show_legend: true,
          base_Arr: base_Arr, tool_Date: newDate,
          storeName: ['实绩', '指标'],
          leg_Position: 'center', leg_Orient: 'horizontal',
          conf_kpiRate: kpiRate
        };

        _mid_Option = Object.assign(_Title, this.DefineRadar(basicKey));
        return _mid_Option;
      },

      buildGraphHtml(graph, value, curr) {
        let color = 'blue';
        let html = '';
        //箭头 取绝对值
        if (graph == 1) {//含税销售额-指标达成同比增长...
          let percent = FigureService.scale(value, true, false);

          let contentPer = curr.inc == 2 ? FigureService.scale(value, false, false) : FigureService.scale(value, false, true);
          if (percent > 0) {
            html = '<div class="self-progress-box-parent"><i class="fa fa-arrow-up red-icon ng-scope"></i><span>'
              + contentPer
              + '</span></div>';
          } else if (percent < 0) {
            html = '<div class="self-progress-box-parent"><i class="fa fa-arrow-down green-icon ng-scope"></i><span>'
              + contentPer + '</span></div>';
          } else if (percent == 0) {
            html = percent;
          }
        } else if (graph == 2) {
          //进度条
          const temp = parseFloat(FigureService.scale(value, true, false));//非绝对值
          let widthValue = "";
          if (temp <= 100 && temp > 0) {
            widthValue = FigureService.scale(value, false, false)
          } else if (temp <= 0) {
            widthValue = 0
          } else if (temp > 100) {
            // color = 'red';
            widthValue = 100;
          }

          html = '<div class="self-progress-wrap"><div class="self-progress-box ' + color
            + '"><div class="percent" style="width:' + widthValue + '%"></div></div>'
            + '<div class="self-progress-box right">' + FigureService.scale(value, true, true) + '</div></div>';
        }

        return html;
      },

      /**
       * 指标达成 构建折线图 eChart
       */
      buildIndexLineChart(data, select, key) {
        let title = select.name;
        let d = angular.copy(data);
        let dateList = [];

        if (d && d.length) {
          dateList = d.map(date => {
            return date.dateCode;
          })
        }

        let arr = [], arr2 = [];
        arr = d.map(p => {
          if (p[select.title] === 0) {
            return Number(parseFloat(p[select.title]).toFixed());
          } else {
            return FigureService.scale(p[select.title], true);
          }
        });

        arr2 = d.map(p => {
          if (p[select.title + 'YoYValue'] === 0) {
            return Number(parseFloat(p[select.title + 'YoYValue']).toFixed());
          } else {
            return FigureService.scale(p[select.title + 'YoYValue'], true);
          }
        });

        let label = {
          normal: {
            show: key.showLabel,
            position: [10, -15],
            fontSize: 11,
            formatter: (p) => {
              return FigureService.addPercent(p.value)
            }
          }
        };

        let option = {
          color: ['#2A80D8', '#eb7841', '#EA5B66', '#26A5FF', '#9243DD'],
          title: [
            {
              left: "0",
              text: title ? title : '',
              textStyle: {
                fontSize: 12,
                fontWeight: "bold"
              },
              top: 10
            }
          ],
          legend: {
            data: [title, '上年' + title]
          },
          grid: {
            left: "80px",
            top: "40px",
            right: "50px",
            bottom: "30px"
          },
          tooltip: {
            padding: 10,
            formatter: (params) => {
              let info = '<div style="text-align: center;">' + params.name + '</div>' + params.marker + params.seriesName + '：' + params.value + '%';
              return info;
            }
          },
          xAxis: [
            {
              type: "category",
              axisTick: {lineStyle: {type: "solid", color: "#ccc", width: 3}},
              axisLine: {lineStyle: {type: "solid", color: "#ccc", width: 3}},
              axisLabel: {color: "#071220"},
              boundaryGap: false,
              data: dateList
            }
          ],
          yAxis: [
            {
              axisTick: {lineStyle: {type: "solid", color: "#ccc", width: 3}},
              axisLine: {lineStyle: {color: "#ccc", width: 3}},
              axisLabel: {
                color: "#071220",
                interval: 1,
                fontSize: 12,
                fontFamily: "Arial"
              },
              splitLine: {show: false},
              splitArea: {
                show: true,
                interval: 1,
                areaStyle: {color: ["#f9f9f9", "#fff"]}
              }
            }
          ],
          series: [
            {
              name: title,
              data: arr,
              type: 'line',
              lineStyle: {normal: {width: 4}},
              label

            },
            {
              name: '上年' + title,
              data: arr2,
              type: 'line',
              lineStyle: {normal: {width: 4}},
              label
            },
          ]
        };
        return Object.assign({xAxisNoWrap: true}, option);
      },

      /**
       * 指标达成 构建雷达图 eChart
       * kpiRate: 指标达成率
       */
      buildIndexRadarChart(data, optionData, kpiRate) {
        let d = data;

        let option = {
          title: {
            text: d.nodeCode ? '[' + d.nodeCode + ']' + (d.nodeName ? d.nodeName : '-')
              + '  指标达成情况' : (d.nodeName ? d.nodeName : '-') + '  指标达成情况',
            fontSize: 15
          },

          color: ["#007ADB", "#26C08C"],
          tooltip: {
            trigger: 'axis',
            confine: true,
            padding: 10,
            formatter: (params) => {
              let info = '';
              params.forEach((d, i) => {
                const curName = d.radarIndicator;
                const br = i === 0 ? '' : '<br />';
                let value = d.data.hoverValue[curName];

                if (curName.indexOf("率") !== -1) {
                  value = _.isUndefined(value) ? '-' + '%' : value + '%';
                } else {
                  value = FigureService.thousand(value, 2);
                }

                info += `${br}${d.name} : ${value}`;
              });

              if (params[0].radarIndicator.indexOf('率') <= 0 && params[0].radarIndicator !== '周转天数') {
                const curName = params[0].radarIndicator;
                let value = kpiRate[curName];

                const rate = kpiRate[curName] !== '-' ? value + '%' : value;
                info += `<br />指标达成率 : ${rate}`;
              }

              return `${params[0].radarIndicator}<br/>${info}`;
            }
          },
          legend: {
            data: ['指标', '实绩'],
            selectedMode: false,
          },

          radar: {
            name: {textStyle: {color: '#404040', fontSize: 14}},
            axisLine: {lineStyle: {color: '#efefef'}},
            splitLine: {lineStyle: {color: '#efefef'}},
            splitArea: {areaStyle: {color: ['#fff']}},
            indicator: optionData.indicator,
            center: ['50%', 260],
          },

          series: [{
            type: 'radar',
            data: [
              optionData.series.ra,
              optionData.series.kpi
            ]
          }]
        };

        return option;

      },

      /**
       * radar
       */
      getRadarFun(param, row) {
        if (row) return this.getRaderChart(row, param);
      },

      /**
       * 查找匹配的行
       * data：接口返回数据
       * row：当前行数据
       */
      findNode(data, row, param) {
        const levels = param.flag ? CommonCon.indexClassLevel : CommonCon.indexStoreLevel;

        let d = data.filter(i => {
          if (row.nodeName == '整体') {
            return true;
          } else {
            if (row.nodeCode && row[levels[0].code] && row[levels[1].code] && row[levels[2].code]) {
              return (i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code] && i[levels[1].code] == row[levels[1].code] && i[levels[2].code] == row[levels[2].code])
            } else if (row.nodeCode && row[levels[0].code] && row[levels[2].code]) {
              return (i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code] && i[levels[2].code] == row[levels[2].code])
            } else if (row.nodeCode && row[levels[0].code]) {
              return i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code]
            }
          }
        });


        if (!d.length) {
          if (data[0].nodes) {
            data[0].nodes.forEach(p => {
              this.findNode([p], row, param)
            })
          }
        } else {
          row = d[0];
          this.getArr = this.getRaderChart(row, param);
        }

        return this.getArr;

      },

      getArr() {
        return [];
      },

      /**
       *
       * @param years 年select数组
       * @param yearSelect 当前选中的年的id
       * @param monthStart 开始select月数组
       * @param monthEnd 结束月select数组
       * @param monthStartSelect 当前选中的开始月的id
       * @param monthEndSelect 当前选中的结束月的id
       * @returns {string}
       */
      buildComDate(years, yearSelect, monthStart, monthEnd, monthStartSelect, monthEndSelect) {
        const date = yearSelect + "/"
          + monthStart[parseInt(monthStartSelect)].name
          + "-" + yearSelect
          + "/" + monthEnd[parseInt(monthEndSelect)].name;
        return date;
      },


      /**
       * 下拉框门监听排序字段设置
       */
      listenSort(self, func) {
        // 监听chart排序字段的变化
        self.scope.$watch("ctrl.key.currSort", (newVal, oldVal) => {
          if (!newVal) return;
          // 在order事件中标识 点击的是chart sort区域
          self.click = true;
          self.clickSort = self.click;

          self.loadChart = !self.loadChart;

          if (func) func(self.param);

          // 将最新的条件保存到session
          basicService.setSession(CommonCon.session_key.hsParam, self.param);

          const table = angular.element('.dataTables_scrollBody .hs-table');
          const field = self.chartType.filter(s => s.id === parseInt(self.chartSelect))[0].title;
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
            ? toolService.dynamicSort(self.param, field, newVal.code)
            : table.DataTable().order([index, newVal.code]).draw();
        });
      },

      /**
       * 监听table指标变动
       */
      watchTable(self, func) {
        self.scope.$watch('ctrl.field.table', (newVal, oldVal) => {
          // 初始化时候的处理
          if (!newVal || !self.noInit) return;

          const newTable = toolService.calculateTableField(newVal);
          const oldTable = toolService.calculateTableField(oldVal);

          if (_.isEqual(_.sortedUniq(newTable), _.sortedUniq(oldTable))) return;

          // 将最新的条件保存到session
          basicService.setSession(CommonCon.session_key.hsParam, self.param);

          // 根据当前排序的信息 渲染表格
          if (self.sortInfo) {
            setTimeout(() => {
              self.field.newTable = toolService.calculateTableField(newVal);

              const table = angular.element('.dataTables_scrollBody .hs-table');

              // 如果表格中没有当前排序的字段 则表格设置为排名升序
              const field = self.chartType.filter(s => s.id === parseInt(self.chartSelect))[0].title;
              const index = _.indexOf(self.field.newTable, field) + self.fix.length;
              self.sortInfo.flag = self.field.newTable.indexOf(field) >= 0;
              self.sortInfo.index = index;

              !self.sortInfo.flag
                ? toolService.dynamicSort(self.param, field, self.sortInfo.dir)
                : table.DataTable().order([index, self.sortInfo.dir]).draw();
            }, 1000);
          }

          if (func) func();

          self.initColumn(true);
        });
      },

      /**
       * 获取数据设定里的指标集合
       * @param field
       * @param key
       * @param extraFunc
       */
      changeCol(field, key, extraFunc) {
        field.newTable = toolService.calculateTableField(field.table);
        if (key && key.removeField && key.active !== 7) {
          _.remove(field.newTable, (f) => key.removeField.includes(f));
        }
        if (extraFunc) extraFunc();
      },

      // 页面初始化逻辑
      anaInit(self, func) {
        // 添加初始化标识
        self.com.isInit_delete = true;

        // 监听 sessionParam
        self.scope.$on(CommonCon.session_key.sessionParam, (e, d) => {
          const data = angular.copy(d);
          let checkArr = [];
          _.forIn(data, (v, k) => {
            // 条件恢复
            if (!_.isUndefined(self.com[k])) self.com[k] = v;

            if (k === 'other') {
              self.com.other.endDaY = v.endDaY;
              if (v.vintage) self.com.other.vintage = v.vintage;
              if (v.holiday) self.com.other.holiday = v.holiday;
            }
            checkArr.push(k);
          });

          self.com_check = checkArr.includes('dateY');
        });

        if (!self.com.date) {
          this.initYearMonth(self, () => func())
        } else {
          self.dateOptionOne.date = self.com.date;
          self.dateOptionTwo.date = this.sumNumber(self.M);
          func();
        }
      },

      // 时间格式初始化 2018112 => 21080112
      time_add(element) {
        let end_V;
        end_V = Number(element) < 10 ? `0${element}` : `${element}`;
        return end_V;
      },

      // 时间格式拼接 2018 1 2 => 21080102
      time_link(element) {
        let add_yearMonth;
        add_yearMonth = `${element.year}${this.time_add(element.monthValue)}${this.time_add(element.dayOfMonth)}`;
        return add_yearMonth;
      },

      // 时间格式转换 start - end
      form_Time(element, flag) {
        if (!element) return;
        let el = element, End_Time;
        if (flag === 'one') {
          End_Time = `${FigureService.dataTransform(this.time_link(el.holidayStart))}` +
            `-${FigureService.dataTransform(this.time_link(el.holidayEnd))}`
        } else {
          End_Time = `${FigureService.dataTransform(this.time_link(el.holidayLastStart))}` +
            `-${FigureService.dataTransform(this.time_link(el.holidayLastEnd))}`
        }
        return End_Time;
      },


      // 获取节日下拉列表
      initYearMonth(self, func) {

        // 基准日接口调取
        basicService.packager(dataService.getBaseDate(), basicDates => {
          const todayBase = basicDates.data.baseDate;

          self.basicDates = basicDates;

          self.com.other.baseDate = todayBase;

          // 今年年份下拉框
          let nowYear = FigureService.dataTransform(todayBase).split(Symbols.line)[0];
          self.allVintage = [{id: 1, year: nowYear}, {id: 2, year: nowYear - 1}];
          self.com.other.vintage = `${self.allVintage[0].id}`;

          // 构造请求参数
          const trans_Param = {condition: {"year": nowYear}};

          basicService.packager(dataService.getHolidayMaintainByYear(trans_Param), res => {
            let copyUsualDay = angular.copy(res.data);
            self.allHoliday = res.data;
            if (self.allHoliday.length === 0) return;


            let baseMonth = FigureService.dataTransform(todayBase).split(Symbols.line)[1];
            let baseDay = FigureService.dataTransform(todayBase).split(Symbols.line)[2];

            let d_TIME = [], before_ARR = [], min_Index;

            copyUsualDay.forEach((element, index) => {
              let m_a = element.holidayStart;

              // 判断月份，月份应在基准日月份之前
              if (parseInt(baseMonth) > m_a.monthValue) {
                before_ARR.push(element);
              } else if (parseInt(baseMonth) === m_a.monthValue) {
                if (parseInt(baseDay) >= m_a.dayOfMonth) before_ARR.push(element);
              }

            });
            if (before_ARR.length === 0) {
              self.com.other.holiday = `${self.allHoliday[0].holidayId}`;
              self.com.date = this.form_Time(copyUsualDay[0], 'one');
              self.dateM = this.form_Time(copyUsualDay[0], 'two');
              // chart 图表加标获取日期
              self.com.other.MarkDay = this.time_link(self.allHoliday[0].holidayDate);
            } else {
              before_ARR.forEach(s => {
                let m_b = s.holidayStart;
                let comValue_a = Math.abs(parseInt(todayBase) - parseInt(this.time_link(m_b)));
                d_TIME.push(comValue_a);
              });
              min_Index = d_TIME.indexOf(Math.min(...d_TIME));

              // 日期 1 与对比日期
              self.com.date = this.form_Time(before_ARR[min_Index], 'one');
              self.dateM = this.form_Time(before_ARR[min_Index], 'two');

              // 日期下拉框默认显示
              self.com.other.holiday = `${before_ARR[min_Index].holidayId}`;

              // chart 图表加标获取日期
              self.com.other.MarkDay = this.time_link(before_ARR[min_Index].holidayDate);
            }

            if (self.dateOptionOne) self.dateOptionOne.date = self.com.date;
            if (self.dateOptionTwo) self.dateOptionTwo.date = self.dateM;

            if (func) func();

          })
        });
      },

      // 对比时间转换 format 2018/01/01 => 20180101
      transDateY(dateElement) {
        if (!dateElement) return;
        let format = {};
        let sta;
        if (dateElement.indexOf(Symbols.bar) > 0) {
          sta = dateElement.split(Symbols.bar)[0].replace(/\//g, '');
          let end = dateElement.split(Symbols.bar)[1].replace(/\//g, '');
          format.to = parseInt(end);
        } else {
          sta = dateElement.indexOf('/') ? dateElement.replace(/\//g, '') : dateElement;
        }
        format.type = sta.length === 6 ? 'month' : sta.length === 4 ? 'year' : 'day';
        format.from = parseInt(sta);
        return format;
      },

      /**
       * 趋势页面构建合计数据
       * @param self
       * @param p 后端传回的合计数据
       */
      sumNumber(self, p) {
        let t_stock = ['期初', '期末', '库存金额', '库存金额（对比日期）'];
        if (p.date) {
          let d_o = p.date;
          let date_a = `${t_stock[0]}(${d_o.split('-')[0]})${t_stock[2]}`;
          let date_b = `${t_stock[1]}(${d_o.split('-')[1]})${t_stock[2]}`;
          self.trend_params.firstDateStockCost.name = date_a;
          self.trend_params.lastDateStockCost.name = date_b;
        }
        if (p.dateY) {
          const d_t = p.dateY;
          let ar = FigureService.dataTransform(d_t.from);
          let br = FigureService.dataTransform(d_t.to);
          let dateY_a = `${t_stock[0]}(${ar})${t_stock[3]}`;
          let dateY_b = `${t_stock[1]}(${br})${t_stock[3]}`;
          self.trend_params.firstDateStockCostYoYValue.name = dateY_a;
          self.trend_params.lastDateStockCostYoYValue.name = dateY_b;
        }
        self.trend_sum = angular.copy(self.trend_params);
      },

      /**
       * 页面搜索条件重构
       */
      commonSearch(self, eleParam) {
        // 点击查询时 将最新的指标
        if (self.field) basicService.setSession(CommonCon.session_key.hsField, self.field);

        return Object.assign({}, eleParam, {
          isSearch_delete: true
        });
      },

      // 重构 chart 指标
      calculate_chart(element) {
        let result_chart = element ? element : [];
        _.forIn(result_chart, (value, key) => {
          if (key === 'bar') {
            let compare_act = _.clone(value[0]);
            compare_act.id = `${value[0].id}YoYValue`;
            if (value.length > 1) {
              value.splice(1, 1, compare_act);
            } else value.push(compare_act);
          }
        });
        return result_chart;
      },

      /**
       * element-param result-chart
       * 判断对比日期是否勾选 构建 chart 指标
       */
      DateCheck(element, result) {
        if (!element) return;

        let mid_param = angular.copy(element);
        if (mid_param.dateY) {
          this.calculate_chart(result.first);
          this.calculate_chart(result.second);
        } else {
          _.forIn(result.first, (value, key) => {
            if (key === 'bar') {
              value.splice(1, value.length)
            }
          });
          _.forIn(result.second, (value, key) => {
            if (key === 'bar') {
              value.splice(1, value.length)
            }
          });
        }
        return result;
      },

      // Field 指标合并
      MergeField(field, element) {
        let endField;
        endField = Object.assign(angular.copy(field), element);
        return endField;
      },

      // 活动分析页面 chart
      FetchChart(self) {
        // chart 初始化定义指标
        let originChart = angular.copy(Chart.ActivitySetting);
        // local chart 指标
        let getLocal_chart = basicService.getLocal(self.keys.fetchChart);
        // 重构chart
        if (getLocal_chart) {
          self.field.chart = getLocal_chart;
        } else {
          const newChart = angular.copy(originChart);
          const fieldSale = toolService.calculateChartField(newChart.sale, 'all');
          const fieldStock = toolService.calculateChartField(newChart.stock);
          self.field.chart = {first: fieldSale, second: fieldStock};
        }
      },


      // 重构chart 指标
      structureChart(f) {
        let n_arr = [], s_arr = [];
        // 无对比年份 重构 chart 值
        _.forIn(f.chart, (value, key) => {
          value.bar.forEach((s, i) => {
            if (s.id.includes('YoYValue')) {
              value.bar.splice(i, 1)
            }
          });


          if (value.line) {
            value.line.forEach((s, i) => {
              if (s.id.indexOf('YoY') > 0
                || s.id.indexOf('YoYInc') > 0) {
                delete value.line[i];
              }
            });
          }
        });

        if (f.chart.first.line) {
          f.chart.first.line.forEach(s => {
            n_arr.push(s);
          });
          if (n_arr.length === 0) {
            delete f.chart.first.line;
          } else f.chart.first.line = n_arr;
        }

        if (f.chart.second.line) {
          f.chart.second.line.forEach(s => {
            s_arr.push(s);
          });
          if (s_arr.length === 0) {
            delete f.chart.second.line;
          } else f.chart.second.line = n_arr;
        }
      },

      // moments 天数差计算  时间差计算函数封装
      calDays(v) {
        let c_date_one = v.split(Symbols.bar)[0];
        let c_date_two = v.split(Symbols.bar)[1];
        let mid_date = moment(c_date_one, Symbols.slashDate) - moment(c_date_two, Symbols.slashDate);
        return Math.floor(Math.abs(mid_date) / (24 * 3600 * 1000));

      },

      /**
       * 切换tab的共通逻辑
       * @param self
       * @param event
       * @param needList 不是放在更多条件中的 但是全局配置了
       */
      tabsWatch(self, event, needList, config) {
        self.tabFinish = true;

        if (self.commonParam)
          self.commonParam.isTabChange_delete = true;

        const isNeed = (name) => {
          return needList ? !needList.includes(name) : true;
        };

        let _Config = config ? config : Pop.actTypes;

        _Config.filter(s => self.com[s.sign] && s.id == self.com[s.sign].id && s.initOpen && isNeed(s.sign))
          .forEach(s => {
            const length = self.com[s.sign].val.length > 0;

            // 更多条件是否显示
            if (length) self.show = true;
          });
      },

      /**
       * @param f field指标
       * @param n this.param
       */
      newColumn(self, f, n) {
        if (self.keys.actCompare) {
          // 获取 localStorage chart指标
          if (self.noInit) {
            this.FetchChart(self);
          }
          let mid_Field = [];
          if (n.dateY) {
            f.newTable.forEach(s => {
              self.keys.tableIndex.includes(s) ?
                mid_Field.push(s, `${s}YoYValue`, `${s}YoYInc`)
                : mid_Field.push(s, `${s}YoYValue`, `${s}YoY`);
            });
            f.newTable = mid_Field;
          } else {
            this.structureChart(f);
          }
        }

      },


      /**
       * @param t this.field
       * @param p this.param
       */
      watchField(self, t, p) {
        let mid_field = toolService.calculateTableField(t);
        let end_Field = [];
        // 获取 localStorage chart指标
        if (self.noInit) {
          self.indexService.FetchChart(self);
        }

        if (p.dateY) {
          mid_field.forEach(s => {
            self.keys.tableIndex.includes(s) ?
              end_Field.push(s, `${s}YoYValue`, `${s}YoYInc`)
              : end_Field.push(s, `${s}YoYValue`, `${s}YoY`);
          });
          self.field.newTable = end_Field;
        } else {
          self.field.newTable = mid_field;
        }
      },

      // 未来日 同比增幅||同比增长 转换
      ToTTrans(self) {
        // 未来日 同比增幅||同比增长 转换
        let [_Params, endFields] = [self.param, self.field];
        // other 指标 活动
        if (_Params && _Params.other && _Params.date) {
          let compareDay = _Params.date.split(Symbols.bar)[1];
          if (this.transDateY(compareDay).from > _Params.other.baseDate) {
            _.forEach(endFields.newTable, (s, i) => {
              let [_iYoY, _iYoYValue] = [
                s.includes(Symbols.YoY), s.includes(Symbols.YoYValue)
              ];
              if (_iYoY && !_iYoYValue) {
                endFields.newTable.splice(i, 1, _.replace(s, Symbols.YoY, Symbols.ToT));
              }
            })
          }
        }
        self.field.newTable = angular.copy(endFields.newTable);
      },
      // 供货率 退货率 事件映射
      watchFilter(self) {
        self.scope.$on(CommonCon.rateChange, (e, d) => {
          const _rateChange = angular.copy(d);
          self.goods_other = _rateChange;
          let [_initCountOne, _initCountTwo, _number] = [0, 0, Object.keys(_rateChange)];
          _.forIn(_rateChange, (v, k) => {
            if ((k === _number[0] && v.length === 0)
              || (k === _number[1] && v.length === 0)) {
              _initCountOne++
            }
            if ((k === _number[2] && v.length === 0)
              || (k === _number[3] && v.length === 0)) {
              _initCountTwo++
            }
          });
          self.condition_state = (_initCountOne === 2 && _rateChange.checkOne === true)
          || (_initCountTwo === 2 && _rateChange.checkTwo === true) ? false : true;
        })
      },

      /**
       * chart 指标转换
       * @param self
       * @constructor
       */
      ToTChart(self) {
        // 未来日 同比增幅||同比增长 转换
        let _P = angular.copy(self.param);
        if (_P && _P.other && _P.date) {
          let _Day = _P.date.split(Symbols.bar)[1];
          if (this.transDateY(_Day).from > _P.other.baseDate) {
            _.forIn(self.field.chart, (v, k) => {
              if (k === 'first' || k === 'second') {
                _.forIn(self.field.chart[k], (val, key) => {
                  _.forEach(val, s => {
                    if (s.id.includes(Symbols.YoY) && !s.id.includes(Symbols.YoYValue)) {
                      s.id = _.replace(s.id, Symbols.YoY, Symbols.ToT)
                    }
                  })
                })
              }
            })
          }
        }
      },
      // 到货率|退货率监听
      watchGoodsRate(self, func) {
        self.scope.$watch('ctrl.goods_other', val => {
          if (!val || Object.keys(val).length === 0) return;
          self.com.remberParam = _.clone(val);
          const [gRtR, iRtR, gAtr, iAtR, QRate, ARate] = [
            commonP.gRtR, commonP.iRtR, commonP.gAtr,
            commonP.iAtR, commonP.QRate, commonP.ARate,
          ];
          self.com[QRate] = {};
          self.com[ARate] = {};
          const _Names = Object.getOwnPropertyNames(val);

          if (val[_Names[4]]) {
            if (val[_Names[0]].length !== 0) {
              self.com[QRate][gRtR] = val[_Names[0]] / 100;
            } else {
              if (self.com[QRate][gRtR]) delete self.com[QRate][gRtR];
            }
            if (val[_Names[1]].length !== 0) {
              self.com[QRate][iRtR] = val[_Names[1]] / 100;
            } else {
              self.com[QRate][iRtR] = self.com[QRate][iRtR];
              if (self.com[QRate][iRtR]) delete self.com[QRate][iRtR];
            }
          } else {
            if (self.com[QRate]) delete self.com[QRate];
          }

          if (val[_Names[5]]) {
            if (val[_Names[2]].length !== 0) {
              self.com[ARate][gAtr] = val[_Names[2]] / 100;
            } else {
              if (self.com[ARate][gAtr]) delete self.com[ARate][gAtr];
            }
            if (val[_Names[3]].length !== 0) {
              self.com[ARate][iAtR] = val[_Names[3]] / 100;
            } else {
              if (self.com[ARate][iAtR]) delete self.com[ARate][iAtR];
            }
          } else {
            if (self.com[ARate]) delete self.com[ARate];
          }
          if (func) func()
        });
      }
      ,

      // 条件回复session
      getSession(self) {
        const subDetailCondition = basicService.getSession(Common.subDetailCondition, true);
        if (subDetailCondition) {

          if (subDetailCondition.rInfo) {
            self.info = subDetailCondition.rInfo
          }

          self.key.active = 6;
          // 设置表格信息
          if (self.arriveInfo) {
            self.arriveInfo.sort = subDetailCondition.session.sortInfo;
            self.arriveInfo.page = subDetailCondition.session.pageInfo;
          }

          let comMain = commonP.mains;

          _.forIn(subDetailCondition.session, (value, key) => {
            if (comMain.includes(key)) {
              self.com[key] = value;
            } else {
              if (_.isUndefined(self.com[key])) return;
              self.com[key] = value;
            }
          });
        }
      }
      ,


      /**************************************************************雷达图共通**************************************************************/
      /*
       自定义雷达图函数封装
       * @param date 数据
       * @param key 配置
       * */
      DefineRadar(key) {
        // 定义存放雷达图 baseARR_one 指标1数据最终返回value | baseARR_two 指标2数据最终返回value
        let [baseARR_one, baseARR_two,] = [[], []];

        const [min_mid_Arr, newDate,] = [key.base_Arr, _.clone(key.tool_Date),];
        //   Mid_Rate 所有s[0]/s[1] 的集合
        // | last_Min_Rate 最大比例的集合
        // | greaterThan 指标1大于指标2个数集合
        // | bigThenOne 指标1大于指标2 的索引值
        // | 指标 0 含有 0 的个数 numberZero0
        // | 指标 1 含有 0 的个数 numberZero1
        let [
          Mid_Rate, abs_Rate, greaterThan,
          bigThenOne, numberZeroS0, numberZeroS1
        ] = [[], [], 0, [], [], []];

        // 值取绝对值
        function abs(ele) {
          return Math.abs(ele)
        }

        min_mid_Arr.forEach((s, i) => {
          // 求出比例差距最大的元素
          const [sMax, sMin] = [
            Math.max(...[abs(s[0]), abs(s[1])]),
            Math.min(...[abs(s[0]), abs(s[1])]),
          ];

          abs_Rate.push(_.divide(sMin, sMax));
          // 对比门店大于基准门店的情况下
          if (!isFinite(_.divide(s[0], s[1]))) {
            Mid_Rate.push(0)
          } else Mid_Rate.push(_.divide(s[0], s[1]));

          // 当存在指标对标 1 大于等于 对标 2 时
          if (_.divide(s[0], s[1]) >= 1) {
            greaterThan++;
            bigThenOne.push(i);
          }
          // S[0] 中 0 的个数
          if (s[0] === 0) {
            numberZeroS0.push(i)
          }

          // S[1] 中 0 的个数
          if (s[1] === 0) {
            numberZeroS1.push(i)
          }
        });

        // _Length 雷达图数据的 length
        const _Length = min_mid_Arr.length;

        // 筛选s[0] s[1]
        const [mid_Ar_S0, mid_Ar_S1] = [
          min_mid_Arr.map(s => s[0]), min_mid_Arr.map(s => s[1])
        ];

        // 指标 1 全部为 0 的情况 定义基准值
        const [maxS0, maxS1] = [_.max(mid_Ar_S0), _.max(mid_Ar_S1)];

        // 取每组值最大的比例 考虑到负值-取绝对值
        let [rateMin, maxUsual] = [
          Math.min(...Mid_Rate), Math.max(...Mid_Rate)
        ];

        // 比例差距最大的索引 最小的索引
        const [minIndex, usualIndex] = [
          _.indexOf(abs_Rate, rateMin), _.indexOf(Mid_Rate, maxUsual)
        ];

        // 最大比例的 对标1 对标2 取值
        let basicMax;

        // 五种判断情况 (自定义雷达图)
        /*****************逻辑****************/
        // 本雷达图主要是对数据自己进行重构，雷达图数据总体可分为 5 种情况
        // 1.s1/s2 全都为零 记雷达图重合 构造相同数据 numberZeroS0|numberZeroS1分别代表指标1、2含有0的个数
        // 2.s0 含有0/s1 不含有0 分两种情况 考虑 s0 全为0 和不全为0的情况
        // 3.s0 不含有0/s1 含有0 分两种情况 s[1] 全部为 0 的情况、s[1]不全为0 ( s[0]/s[1] > 0 || s[0]/s[1] < 0)即选取s[0]或者s[1]作为基准值
        // 4.s0\s1 全含 0 分为4种情况 s0全为0、 s0作为基准值、 s1全为0、 s1作为基准值
        // 5.s0\s1 全不含 0 分为两种情况 s0为基准值、s1为基准值
        // 注：基准值即为雷达图一直需要保持规律图形的基准值, eg: 6边形、三角形

        // 1. s1/s2 全都为零  -- (暂不考虑负数的情况)
        if (numberZeroS0.length === _Length && numberZeroS1.length === _Length) {
          _.forEach(min_mid_Arr, (s, i) => {
            baseARR_one.push(s[0]);
            baseARR_two.push(s[1]);
            basicMax = s[0];
          })
        } else if (numberZeroS0.length >= 1 && numberZeroS1.length === 0) { // 2. s0 含有0/s1 不含有0
          if (numberZeroS0.length === _Length) { // (1). s0 全为 0
            // 基准值为 maxS1 (指标2)，maxS1/4 即指标1为指标2的 1/4倍
            _.forEach(min_mid_Arr, () => {
              baseARR_one.push(maxS1 / 4);
              baseARR_two.push(maxS1)
            });
            basicMax = _.max(mid_Ar_S1);
          } else if (numberZeroS0.length < _Length
            && numberZeroS0.length >= 1) { // (2). s0 不全为 0
            // 1> s0 全小于 s1
            if (greaterThan === 0) {
              // 自定义 maxValue
              // maxValue 即为自定义的基准值
              // maxValue/8 指标 1 为指标2的 1/8 大小
              let maxValue = 100;
              _.forEach(min_mid_Arr, (s, i) => {
                if (s[0] === 0) {
                  baseARR_one.push(maxValue / 8)
                } else Mid_Rate[i] * 100 <= maxValue / 4
                  ? baseARR_one.push(maxValue / 4)
                  : baseARR_one.push(Mid_Rate[i] * 100);
                baseARR_two.push(maxValue);
              });
              basicMax = maxValue;
            } else {
              // 2> s0 有部分大于 s1
              // maxValue 为重构数据 s[1]的最大值
              const maxValue = min_mid_Arr[usualIndex][0];
              // 确定最大基准值 s[0]
              // maxUsual 为 s0 大于 s1 的最大比例值
              // 共分为两种 比例大于3 || 比例小于3
              if (maxUsual > 0 && maxUsual < 3) {
                if (maxUsual > 0 && maxUsual <= 1) {
                  _.forEach(min_mid_Arr, (s, i) => {
                    if (numberZeroS0.includes(i)) {
                      baseARR_one.push(maxValue / 4);
                    } else {
                      if (bigThenOne.includes(i)) {
                        baseARR_one.push(Mid_Rate[i] * maxValue > maxValue
                          ? maxValue
                          : Mid_Rate[i] * maxValue);
                      } else baseARR_one.push(Mid_Rate[i] * maxValue < maxValue / 4
                        ? maxValue / 4
                        : Mid_Rate[i] * maxValue);
                    }
                    baseARR_two.push(maxValue);
                  });
                } else {
                  // maxValue/6 为基准值1
                  // bigThenOne.includes为指标大于指标2的索引集合
                  _.forEach(min_mid_Arr, (s, i) => {
                    // s0指标里含有0的情况
                    if (numberZeroS0.includes(i)) {
                      baseARR_one.push(maxValue / 6);
                    } else {
                      if (bigThenOne.includes(i)) {
                        baseARR_one.push(Mid_Rate[i] * maxValue / 2 > maxValue
                          ? maxValue
                          : Mid_Rate[i] * maxValue / 2);
                      } else baseARR_one.push(Mid_Rate[i] * maxValue / 2 < maxValue / 4
                        ? maxValue / 4
                        : Mid_Rate[i] * maxValue / 2);
                    }
                    baseARR_two.push(maxValue / 2);
                  });
                }
              } else {
                // 当s0为0的时候 value为最大值的 1/9
                // 否则为最大值 或者 最大值的 1/4、1/8
                min_mid_Arr.forEach((s, i) => {
                  if (numberZeroS0.includes(i)) {
                    baseARR_one.push(maxValue / 9);
                  } else {
                    if (bigThenOne.includes(i)) {
                      baseARR_one.push(Mid_Rate[i] * maxValue / 4 > maxValue
                        ? maxValue
                        : Mid_Rate[i] * maxValue / 4);
                    } else baseARR_one.push(Mid_Rate[i] * maxValue / 4 < maxValue / 8
                      ? maxValue / 8
                      : Mid_Rate[i] * maxValue / 4);
                  }
                  baseARR_two.push(maxValue / 4);
                });
              }
              basicMax = maxValue;
            }
          }
        } else if (numberZeroS0.length === 0
          && numberZeroS1.length >= 1) { // 3. s0 不含有0/s1 含有0
          // (1). s[1] 全部为 0 的情况
          // maxS0为 s0的基准值 s1为 maxS0/4
          if (numberZeroS1.length === 6) {
            _.forEach(min_mid_Arr, () => {
              baseARR_one.push(maxS0);
              baseARR_two.push(maxS0 / 4)
            });
            basicMax = _.max(mid_Ar_S0);
          } else if (numberZeroS1.length < _Length
            && numberZeroS1.length >= 1) { // (2).s[1] 不全部为 0 的情况
            // 1> s[0]/s[1] > 0
            // _maxVal => s0 s1 差距最大的索引值对应的 value
            const [_maxVal] = [min_mid_Arr[usualIndex][0] / 2];
            if (greaterThan > 0) {
              if (maxUsual > 0 && maxUsual < 3) {
                _.forEach(min_mid_Arr, (s, i) => {
                  if (numberZeroS1.includes(i)) {
                    baseARR_one.push(_maxVal * 2);
                  } else {
                    if (bigThenOne.includes(i)) {
                      baseARR_one.push(Mid_Rate[i] * _maxVal > _maxVal * 2
                        ? _maxVal * 2
                        : Mid_Rate[i] * _maxVal);
                    } else baseARR_one.push(Mid_Rate[i] * _maxVal < _maxVal / 2
                      ? _maxVal / 2
                      : Mid_Rate[i] * _maxVal);
                  }
                  baseARR_two.push(_maxVal);
                });
              } else {
                _.forEach(min_mid_Arr, (s, i) => {
                  if (numberZeroS1.includes(i)) {
                    baseARR_one.push(_maxVal * 2);
                  } else {
                    if (bigThenOne.includes(i)) {
                      baseARR_one.push(Mid_Rate[i] * _maxVal / 2 > _maxVal * 2
                        ? _maxVal * 2
                        : Mid_Rate[i] * _maxVal / 2);
                    } else baseARR_one.push(Mid_Rate[i] * _maxVal / 2 < _maxVal / 4
                      ? _maxVal / 4
                      : Mid_Rate[i] * _maxVal / 2);
                  }
                  baseARR_two.push(_maxVal / 2);
                });
              }
              basicMax = _maxVal * 2;
            } else { // 2> s[0]/s[1] < 0
              let maxValue = 100;
              _.forEach(min_mid_Arr, (s, i) => {
                if (Mid_Rate[i] * 100 <= maxValue / 4) {
                  baseARR_one.push(maxValue / 4)
                } else baseARR_one.push(Mid_Rate[i] * 100);
                baseARR_two.push(maxValue);
              });
              basicMax = maxValue;
            }
          }
        } else if (numberZeroS0.length >= 1 && numberZeroS0.length <= _Length
          && numberZeroS1.length >= 1 && numberZeroS1.length <= _Length) { // 4. s0\s1 全含 0
          // 1> s[0] 全为0 s[1]不全为0
          const maxValue = 100;
          if (numberZeroS0.length === _Length && numberZeroS1.length !== _Length) {
            _.forEach(min_mid_Arr, () => {
              baseARR_one.push(maxValue / 4);
              baseARR_two.push(maxValue);
            });
            basicMax = maxValue;
          } else if (numberZeroS1.length === _Length && numberZeroS0.length !== _Length) {
            _.forEach(min_mid_Arr, () => {
              baseARR_one.push(maxValue / 4);
              baseARR_two.push(maxValue);
            });
            basicMax = maxValue;
          } else {
            // 1> s[0]/s[1] > 0
            if (greaterThan > 0) {
              // _maxVal
              const [_maxVal] = [min_mid_Arr[usualIndex][0]];
              if (maxUsual > 0 && maxUsual < 2) {
                _.forEach(min_mid_Arr, (s, i) => {
                  const _midRate = _maxVal * 3 / 4;
                  // s[0] 含有 0 的情况
                  if (s[0] === 0) {
                    baseARR_one.push(s[1] === 0 ? _midRate : _maxVal / 4);
                  } else {
                    if (bigThenOne.includes(i)) {
                      if (Mid_Rate[i] * _midRate === 0) {
                        baseARR_one.push(_maxVal);
                      } else baseARR_one.push(Mid_Rate[i] * _midRate > _maxVal
                        ? _maxVal
                        : Mid_Rate[i] * _midRate);
                    } else {
                      if (Mid_Rate[i] * _midRate === 0) {
                        baseARR_one.push(_maxVal / 4);
                      } else baseARR_one.push(Mid_Rate[i] * _midRate < _maxVal / 4
                        ? _maxVal / 4
                        : Mid_Rate[i] * _midRate);
                    }
                  }
                  baseARR_two.push(_maxVal * 3 / 4);
                });
                basicMax = _maxVal;
              } else {
                _.forEach(min_mid_Arr, (s, i) => {
                  // s[0] 含有 0 的情况
                  if (s[0] === 0) {
                    baseARR_one.push(s[1] === 0 ? _maxVal / 2 : _maxVal / 4);
                  } else {
                    if (bigThenOne.includes(i)) {
                      if (Mid_Rate[i] * _maxVal / 2 === 0) {
                        baseARR_one.push(_maxVal);
                      } else baseARR_one.push(Mid_Rate[i] * _maxVal / 2 > _maxVal
                        ? _maxVal
                        : Mid_Rate[i] * _maxVal / 2);
                    } else {
                      if (Mid_Rate[i] * _maxVal / 2 === 0) {
                        baseARR_one.push(_maxVal / 4);
                      } else baseARR_one.push(Mid_Rate[i] * _maxVal / 2 < _maxVal / 4
                        ? _maxVal / 4
                        : Mid_Rate[i] * _maxVal / 2);
                    }
                  }
                  baseARR_two.push(_maxVal / 2);
                });
                basicMax = _maxVal;
              }
            } else { // 2> s[0]/s[1] < 0
              _.forEach(min_mid_Arr, (s, i) => {
                if (s[0] === 0) {
                  baseARR_one.push(maxValue / 8);
                } else baseARR_one.push(Mid_Rate[i] * maxValue < maxValue / 4
                  ? maxValue / 4
                  : Mid_Rate[i] * maxValue);
                baseARR_two.push(maxValue);
              });
              basicMax = maxValue;
            }
          }
        } else if (numberZeroS0.length === 0 && numberZeroS1.length === 0) { // 5. s0\s1 全不含 0
          // 1> s[0]/s[1] > 0 以 s1 作为基准值
          // 确定最大比例value
          const [_midValue, _Value] = [
            min_mid_Arr[usualIndex][0] / 2,
            min_mid_Arr[usualIndex][0] / min_mid_Arr[usualIndex][1],
          ];
          if (greaterThan === 6) {
            // 确定最大值的基准值
            basicMax = _midValue * 2;
            if (maxUsual > 0 && maxUsual < 3) {
              min_mid_Arr.forEach((s, i) => {
                baseARR_one.push(Mid_Rate[i] * _midValue > basicMax
                  ? basicMax
                  : Mid_Rate[i] * _midValue);
                baseARR_two.push(_midValue);
              });
            } else min_mid_Arr.forEach((s, i) => {
              baseARR_one.push(
                Mid_Rate[i] * _midValue / 2 > basicMax
                  ? basicMax
                  : Mid_Rate[i] * _midValue / 2);
              baseARR_two.push(_midValue / 2);
            })
          } else if (greaterThan > 0 && greaterThan < 6) {
            if (maxUsual > 0 && maxUsual < 5) {
              min_mid_Arr.forEach((s, i) => {
                if (!bigThenOne.includes(i)) {
                  if (Mid_Rate[i] * _midValue < _midValue / 2) {
                    baseARR_one.push(_midValue / 2)
                  } else baseARR_one.push(Mid_Rate[i] * _midValue);
                } else baseARR_one.push(Mid_Rate[i] * _midValue);
                baseARR_two.push(_midValue);
              });
              basicMax = _Value * _midValue;
            } else {
              basicMax = _Value * _midValue;
              _.forEach(min_mid_Arr, (s, i) => {
                if (!bigThenOne.includes(i)) {
                  baseARR_one.push(basicMax / 8)
                } else baseARR_one.push(Mid_Rate[i] * basicMax / 4 > basicMax
                  ? basicMax
                  : Mid_Rate[i] * basicMax / 4);
                baseARR_two.push(basicMax / 4);
              })
            }
          } else { // 2> s[0]/s[1] < 以 s0 作为基准值
            // s[0] 参数全小于 s[1]
            const [_minVal] = [min_mid_Arr[minIndex][1],];
            _.forEach(min_mid_Arr, (s, i) => {
              if (Mid_Rate[i] * _minVal < _minVal / 8) {
                baseARR_one.push(_minVal / 8);
              } else baseARR_one.push(Mid_Rate[i] * _minVal);
              baseARR_two.push(_minVal);
            });
            basicMax = _minVal;
          }
        }

        // indecator_Arr indecator 配置 name basicMax
        let basicOption,
          config_Indecator = [],
          _supInfo = key.sup_tool_Date ? key.sup_tool_Date : false;
        if (key.conf_name) {
          _.forEach(_.clone(key.conf_name), s => {
            config_Indecator.push({name: s, max: basicMax * 1.1})
          })
        }

        //构建雷达图数据
        basicOption = {
          color: ['#007ADB', '#05BC90'],
          tooltip: {
            confine: true, trigger: 'axis',
            formatter: (param) => {
              let [title, html, a_unit, text_data, _inFo, _endInfo] = [
                param[0].radarIndicator, '', '', ['经销周转率', '指标达成率 :', '-9999999900.00'], '', ''
              ];
              _.forEach(param, (s, i) => {
                newDate.forEach((a, e) => {
                  a_unit = a.name.includes('数') ? '' : a.name.includes('率') ? '%' : '元';
                  if (a.name === s.radarIndicator) {
                    let mid_value, mid_day = '', turnover_Rate = '';
                    if (s.radarIndicator === text_data[0]) {
                      if (_supInfo) {
                        mid_value = !isFinite(1 / Number(_supInfo[e].value[i]))
                          ? '-'
                          : (1 / Number(_supInfo[e].value[i])).toFixed(3);
                        mid_day = `(经销周转天数:${_supInfo[e].value[i]}天)`
                      } else {
                        mid_value = !isFinite(1 / a.value[i]) ? '-' : (1 / a.value[i]).toFixed(3);
                        mid_day = `(经销周转天数:${a.value[i] === '-' ? '-' : a.value[i].toFixed(2)}天)`
                      }
                    } else if (a.name.includes('率')) {
                      if (_supInfo) {
                        mid_value = _supInfo[e].value[i] === '-' ? '-' : _supInfo[e].value[i].split('%')[0]
                      } else mid_value = a.value[i] === '-' ? '-' : (a.value[i] * 100).toFixed(2);
                    } else {
                      mid_value = a.value[i] === '-' ? '-' : FigureService.thousand(a.value[i]);
                      if (key.conf_kpiRate) {
                        let init_Info = key.conf_kpiRate[title] === '-' ? '-' : key.conf_kpiRate[title];
                        _inFo = `<br />${text_data[1]}${init_Info}${init_Info === '-' ? ' ' : '%'}`
                      }
                    }
                    html += `<br /> ${s.marker}${s.name} : ${mid_value === 0
                      ? '-' : mid_value}${a_unit}${mid_day}${turnover_Rate}`;
                  }
                })
              });
              _endInfo = title + html + _inFo;
              return _endInfo;
            },
            textStyle: {align: 'left'},
          },
          legend: {
            data: key.show_legend ? [{name: key.storeName[0]}, {name: key.storeName[1]}] : [],
            orient: key.leg_Orient ? key.leg_Orient : 'vertical',
            left: key.leg_Position ? key.leg_Position : 'right',
            textStyle: {color: '#404040', fontSize: 11}
          },
          radar: {
            name: {textStyle: {color: '#404040', fontSize: 12, fontWeight: 'bold'}},
            axisLine: {lineStyle: {color: '#efefef'},},
            splitLine: {lineStyle: {color: '#efefef'}},
            splitNumber: 4,
            splitArea: {areaStyle: {color: ['#fff']},},
            indicator: config_Indecator,
          },
          series: [
            {
              name: `${key.show_legend ? key.storeName[0] : ''}-${key.show_legend ? key.storeName[1] : ''}`,
              type: 'radar', label: {fontSize: 10},
              data: [
                {
                  value: baseARR_one, name: key.storeName[0],
                  areaStyle: {normal: {color: "rgba(0, 122, 219, 0.3)"}}
                },
                {value: baseARR_two, name: key.storeName[1]}
              ]
            },
          ]
        };
        return basicOption;
      }
      ,

      /****************************************************************************************************************************/
      // 判断返回值是否定义
      Def(pas, flag) {
        let element;
        element = _.isUndefined(pas) || (!pas && typeof pas !== "undefined" && pas !== 0)
          ? flag ? '-' : 0 : pas;
        return element;
      }
      ,

      // 周转天数计算函数封装
      distributeDay(ele, number) {
        let saleRate;
        let [_ele, _number] = [this.Def(ele), this.Def(number)];
        if (_ele > 1 || _ele === 0) {
          saleRate = _number === 0 || _number === '-' ? 1 : (1 / _number < 0 ? 0 : 1 / _number);
        } else if (_ele > 0 && _ele < 1) {
          saleRate = _number === 0 || _number === '-' ? 1 / _ele * 1.1 : (1 / _number < 0 ? 0 : 1 / _number);
        } else {
          saleRate = 1 / _number < 0 ? 0 : _number === '-' ? 1 : 1 / _number;
        }
        return saleRate;
      },

      // 数值转换 String -> Number
      tranNumber(ele) {
        let _Number;
        let _mid_number = typeof ele === "string" ? Number(ele) : ele;
        if (_.isUndefined(_mid_number)
          || _.isNaN(_mid_number)
          || _.isNull(_mid_number)
          || Math.sign(ele) < 0) {
          _Number = 0
        } else _Number = _mid_number;
        return _Number;
      },

      // 构建tooltip数组
      toolArrArr(self, ele, key) {
        let toolArr = [];
        _.forEach(ele, (s, i) => {
          if (i === 0 || i === 4 || i === 5) {
            toolArr.push({
              name: s, value: [
                self.indexService.Def(key.one[i], true),
                self.indexService.Def(key.two[i], true)
              ]
            })
          } else if (i === 3) {
            toolArr.push({
              name: s, value: [
                self.indexService.Def(key.one[6], true),
                self.indexService.Def(key.two[6], true)
              ]
            })
          } else {
            toolArr.push({
              name: s, value: [
                self.indexService.Def(key.one[i + 1], true),
                self.indexService.Def(key.two[i + 1], true)
              ]
            })
          }
        });
        return toolArr;
      },

      // 综合分析-供货分析
      pageInit(self, func, noDate) {
        // 添加初始化标识
        self.com.isInit_delete = true;
        // 监听 sessionParam
        self.scope.$on(CommonCon.session_key.sessionParam, (e, d) => {
          function pas(ele) {
            let _Val;
            _Val = ele.length === 0 ? '' : (ele * 100).toFixed(0);
            return _Val;
          }

          const data = angular.copy(d);
          let mebNumber = data.remberParam;
          const [Mains, Init] = [angular.copy(commonP.mains), _.clone(commonP.Init)];

          let [One, Two, nOne, nTwo, nThree, nFour
          ] = [false, false, '0', '50', '0', '50'];

          _.forIn(data, (v, k) => {
            if (!_.isUndefined(self.com[k])) self.com[k] = v;
            // 供货分析
            if (k === Mains[0]) {
              One = true;
              _.forIn(v, (val, key) => {
                if (key === Init[0]) {
                  nOne = pas(val)
                }
                if (key === Init[1]) {
                  nTwo = pas(val)
                }
              });
              if (!_.keys(v).includes(Init[0])) nOne = '';
              if (!_.keys(v).includes(Init[1])) nTwo = '';
            }
            if (k === Mains[1]) {
              Two = true;
              _.forIn(v, (val, key) => {
                if (key === Init[2]) {
                  nThree = pas(val)
                }
                if (key === Init[3]) {
                  nFour = pas(val)
                }
              });
              if (!_.keys(v).includes(Init[2])) nThree = '';
              if (!_.keys(v).includes(Init[3])) nFour = '';
            }
          });

          if (mebNumber) {
            if (!mebNumber.checkOne) {
              nOne = mebNumber.number_one ? mebNumber.number_one : 0;
              nTwo = mebNumber.number_two ? mebNumber.number_two : 50;
            }
            if (!mebNumber.checkTwo) {
              nThree = mebNumber.number_three ? mebNumber.number_three : 0;
              nFour = mebNumber.number_four ? mebNumber.number_four : 50;
            }
          }

          self.material = {
            number_one: nOne,
            number_two: nTwo,
            number_three: nThree,
            number_four: nFour,
            checkOne: One,
            checkTwo: Two
          };
        });

        if (noDate) {
          if (func) func();
          return;
        }

        if (!self.com.date) {
          // 初始化日期范围
          toolService.initDate(self, (d) => func(d));
        } else {
          self.dateOption.date = self.com.date;
          func(self.com.date);
        }
      },

      // 供应商供货
      supInit(self, func, noDate) {
        // 添加初始化标识
        self.com.isInit_delete = true;
        // 定义到货率、退货率
        self.InitSelect = angular.copy(commonP.InitRate);
        // 监听 sessionParam
        self.scope.$on(CommonCon.session_key.sessionParam, (e, d) => {
          function str(ele) {
            return ele.toString()
          }

          const data = angular.copy(d);
          const [rateMain, ArOne, ArTwo, gtNumber] = [
            commonP.mains, commonP.backDataOne, commonP.backDataTwo, commonP.getNumber
          ];

          function devAr(ele, key, arr) {
            let _Keys = Object.keys(ele);
            const [newAr, oldAr] = [
              arr.filter(s => !s.includes(Symbols.rang)),
              arr.filter(s => s.includes(Symbols.rang))
            ];
            if (_Keys.length === 1) {
              self.InitSelect[key] = newAr.filter(
                s => s.includes(_.values(ele) * 100)
              )[0];
            } else {
              if (_.values(ele)[0] === 0) {
                self.InitSelect[key] = newAr.filter(
                  s => s.includes(_.values(ele)[1] * 100)
                )[0]
              } else {
                self.InitSelect[key] = oldAr.filter(
                  s => s.includes(`${_.values(ele)[0] * 100}${Symbols.percent}`)
                    && s.includes(`${_.values(ele)[1] * 100}${Symbols.percent}`)
                )[0];
              }
            }
          }

          _.forIn(data, (v, k) => {
            if (!_.isUndefined(self.com[k])) self.com[k] = v;
            if (k === rateMain[0]) {
              devAr(v, k, ArOne);
              self.InitSelect.checkOne = true;
            }
            if (k === rateMain[1]) {
              devAr(v, k, ArTwo);
              self.InitSelect.checkTwo = true;
            }
          })
        });

        if (noDate) {
          if (func) func();
          return;
        }

        if (!self.com.date) {
          toolService.initDate(self, (d) => func(d));
        } else {
          self.dateOption.date = self.com.date;
          func(self.com.date);
        }
      },

      // 供货分析到货率监听
      receiveRateListen(self) {
        self.scope.$on(CommonCon.receiveRate, (e, d) => {
          if (!d) return;
          const rates = _.clone(d);
          const [rateIn, rateMain, InitCheck, rang, per, backData] = [
            commonP.getNumber, commonP.mains,
            commonP.InitCheck, Symbols.rang,
            Symbols.percent, commonP.backDataTwo
          ];
          self.com[rateMain[0]] = {};
          self.com[rateMain[1]] = {};

          function numbers(ele) {
            return Number(ele) / 100;
          }

          // 拼接函数封装
          function devRate(ele) {
            const [_midR, _midP] = [
              rates[ele].split(rang), rates[ele].split(per)
            ];
            if (rates[ele].includes(rang)) {
              self.com[ele][rateIn[0]] = numbers(_midR[0].split(per)[0]);
              self.com[ele][rateIn[1]] = numbers(_midR[1].split(per)[0]);
            } else {
              if (Number(_midP[0]) === 1) {
                self.com[ele][rateIn[0]] = 0;
                self.com[ele][rateIn[1]] = numbers(_midP[0]);
              } else if (Number(_midP[0]) === 50) {
                if (rates[ele].includes(backData[0])) {
                  self.com[ele][rateIn[0]] = numbers(_midP[0]);
                } else {
                  self.com[ele][rateIn[1]] = numbers(_midP[0]);
                }
              } else {
                self.com[ele][rateIn[0]] = numbers(_midP[0]);
              }
            }
          }

          if (rates[InitCheck[0]]) {
            devRate(rateMain[0]);
          } else {
            if (self.com[rateMain[0]])
              delete self.com[rateMain[0]]
          }
          if (rates[InitCheck[1]]) {
            devRate(rateMain[1]);
          } else {
            if (self.com[rateMain[1]])
              delete self.com[rateMain[1]]
          }
        })
      },


      YoYValueDateSetting(ele, basic) {
        if (!basic) return;
        let [_Param, basicTime] = [
          _.clone(ele), basic.basData.baseDate
        ];

        let basicMonArr = FigureService.dataTransform(basicTime).split(Symbols.line);

        let basicMonth = FigureService.dataTransform(basic.basicMonth).split(Symbols.line)[1];

        let midTime, oldYears, endYears;
        if (_Param.date) {
          // 判断是否年月 || 年月日
          let cakeOne, cakeTwo;
          midTime = _Param.date.split(Symbols.bar);
          oldYears = midTime[0].split(Symbols.line)[0] - 1;

          // 年月日
          if (midTime[0].length > 7) {
            cakeOne = midTime[0].slice(5);
            cakeTwo = midTime[1].slice(5);
          } else { // 年月
            // 判断 起始日期是否是当月
            if (basicMonth === midTime[0].split(Symbols.line)[1]) {
              // 财务月首日
              cakeOne = `${FigureService.dataTransform(cake).slice(5)}`;
            } else cakeOne = midTime[0].slice(5);
            // 判断 终止日期是否是当月
            if (basicMonth === midTime[1].split(Symbols.line)[1]) {
              cakeTwo = `${basicMonArr[1]}/${basicMonArr[2]}`
            } else cakeTwo = midTime[1].slice(5);
          }
          endYears = `${oldYears}/${cakeOne}-${oldYears}/${cakeTwo}`;
        }
        _Param.date = endYears;

        _Param.lastYoYValue = {years: true, date: ele.date};

        return _Param;
      },

      /**
       * 供应商供货页面 点击跳转到供货率 退货率页面
       * @param com 当前页面的条件
       * @param back 接口中影响的数据
       * @param rowData 表格行信息
       * @param route 路由信息
       */
      goSupplierRate(com, back, rowData, route, info, conf) {
        let condition = angular.copy(com);

        const order = back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: back.param.start};
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

        if (info) condition.routerInfo = info;

        basicService.setSession(conf ? conf : Common.subDetailCondition, condition);

        const data = this.saveRouteInfo();

        $state.go(route, {info: data});
      },

      saveRouteInfo() {
        const cur = $state.$current;

        let info = {from: "app.supAnalyse.supplierSupply"};
        // 将当前路由信息保存到session里 用于页面返回和父菜单的active选中效果
        return JSON.stringify(info);
      },

      /**
       * 主页面条件保持的共通处理
       * @param com 页面条件
       * @param remove 删掉部分条件
       */
      commonSetTop(com, remove, conf) {
        const key = conf ? conf : Common.local.topCondition;
        const topCondition = CommonCon.lastingCondition;

        const copy = angular.copy(com);
        _.forIn(copy, (val, key) => {
          if (!topCondition.includes(key)) delete copy[key];
        });

        const local = basicService.getLocal(key);

        if (remove) remove.forEach(s => {
          delete copy[s]
        });

        if (local) {
          if (!_.keys(copy).includes(commonP.mains[0])) delete local[commonP.mains[0]];
          if (!_.keys(copy).includes(commonP.mains[1])) delete local[commonP.mains[1]];

          _.forIn(copy, (value, key) => {
            local[key] = value;
          });
        }

        basicService.setLocal(key, local || copy);
      },

      /**
       * 当前页面基准日期 | 财务月 获取
       * @param self
       */
      getBasicDate(self) {
        basicService.packager(dataService.getBaseDate(), res => {
          if (res) {
            self.basicDate = res.data;
            basicService.packager(dataService.getBusinessMonthDateRangeWithDate(res.data.baseDate), res => {
              if (res && res.data && res.data.startDate) {
                self.cakeOne = res.data.startDate
              }
            });
            basicService.packager(dataService.getMonthByDate(res.data.baseDate), res => {
              if (res && res.data) self.basicMonth = res.data.businessMonth;
            })
          }
        });
      },

      // 到货率、退货率条件回复函数封装
      backCondition(self) {
        const localReturn = Common.local.returnSubCondition;
        let initLocal = basicService.getLocal(localReturn, true);
        let comMain = commonP.mains;
        if (initLocal) {
          _.forIn(initLocal, (v, k) => {
            if (comMain.includes(k)) self.com[k] = v
          });
        }
      },

      /**
       * 切换tab的共通逻辑
       * @param self
       * @param event
       * @param needList 不是放在更多条件中的 但是全局配置了
       */
      tabChanged(self, event, needList) {

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


    }
  });
