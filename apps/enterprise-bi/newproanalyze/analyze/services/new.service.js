angular.module("hs.productAnalyze.news")
  .factory("newItemService", (toolService, Symbols, FigureService, dataService, $location,
                              basicService, CommonCon) => {
    return {

      /**
       * 初始化年月
       * @param self 当前页面实例
       * @param func 逻辑函数体
       */
      initYearMonth(self, func) {
        let nowYear = Number(moment().format('YYYY'));
        const param = [nowYear, nowYear - 1];
        basicService.packager(dataService.getEstimationDateByCategory(param), res => {
          let Ar = [];
          res.data.forEach(s => {
            Ar.push({view:FigureService.dataTransform(s,'YYYY/MM'),name:s});
          });
          self.years = Ar;
          if(Ar.length !== 0){
            self.year_mothSelect = `${Ar[0].name}`;
            self.com.dateCode = res.data[0];
          }
          if (func) func();
        })
      },

      // 新品类别分析初始化逻辑代码
      anaInit(self, func) {
        // 监听 sessionParam
        self.scope.$on(CommonCon.session_key.sessionParam, (e, d) => {
          const data = angular.copy(d);

          _.forIn(data, (v, k) => {
            if (!_.isUndefined(self.com[k])) {
              self.com[k] = v;
              if(k === 'filterCondition'){
                if(_.isUndefined(self.com[k].avgAllAmount)){
                  self.select_saleroom = angular.copy(CommonCon.new_Select_A.saleroom);
                }
                if(_.isUndefined(self.com[k].avgAllProfit)){
                  self.select_gross = angular.copy(CommonCon.new_Select_A.gross);
                }
                if(_.isUndefined(self.com[k].avgSellStoreCnt)){
                  self.select_store = angular.copy(CommonCon.new_Select_A.store);
                }
                if(_.isUndefined(self.com[k].avgTurnoverDays)){
                  self.select_day = angular.copy(CommonCon.new_Select_A.day);
                }
              }
              if(k === 'importYear') self.model_date = v;
            }
          });
        });

        if (!self.com.dateCode) {
          this.initYearMonth(self, () => func());
        } else {
          func();
        }
      },


      /**
       * 权限转换
       * @param element
       * @constructor
       */
      TransAccess(self,element,func){
        _.forIn(element,(value,key) => {
          if(key === 'category'){
            if(FigureService.haveValue(value.val)){
              let param = { values:[] }; let flag = false;
              value.val.forEach((s,i) => {
                if(s.level < 3) {  flag = true; param.level = 3 ; param.values.push(s.code); }
              });
              if(flag){
                basicService.packager(dataService.getTargetLevelCategoryCodes(param), res => {
                  let transData = res.data; let newArray = [];
                  $.each(transData,(key,value) => { newArray.push({code:key, level:3, name: `中分类-${value}`}) });

                  self.com = angular.copy(element);

                  self.com.category.val = newArray;

                  self.accessCom = angular.copy(self.com);

                  if(func) func();
                })
              } else {
                self.com = angular.copy(element);
                func();
              }
            }else {
              self.com = angular.copy(element);
              func();
            }
          }
        });
      },

      /**
       * @param self
       * @constructor
       */
      YearMonthListen(self)
      {
        self.scope.$watch('ctrl.model_date',(n_val,o_val) => {
          if(n_val === o_val) return;
          const param = [n_val, o_val];
          basicService.packager(dataService.getEstimationDateByCategory(param), (res) => {
            let Ar = [];
            res.data.forEach(s => {
              Ar.push({view:FigureService.dataTransform(s,'YYYY/MM'),name:s});
            });
            self.years = Ar;
            if(Ar.length !== 0){
              self.year_mothSelect = `${Ar[0].name}`;
            }
          });
        });
      },

      /**
       * scatter 类型图表
       * @ curr 当前x轴需要显示的指标
       * @ key 数据
       * @
       * */
      scatter_Chart(curr, key) {
        const data = key.data, fieldInfo = key.info;
        key.seriesType = _.uniq(_.keys(curr));
        const seriesObj = toolService.getSeriesData(curr, data, fieldInfo, key.xData);
        const xData = data.map(o => {
          return key.xData.code === 'dateCode'
            ? moment(o[key.xData.code], "YYYYMMDD")
              .format(_.toString(o[key.xData.code]).length > 6 ? "YYYY/MM/DD" : "YYYY/MM")
            : o[key.xData.title];
        });
        // 获取chart基础样式
        const basic = toolService.basicChartStyle(seriesObj.field, xData, fieldInfo, key);
        basic.legend.show = false;
        basic.color = ['#2A80D8', '#FCCE10', '#78BF57'];
        basic.yAxis[1].show = false;
        // 配置tooltip显示项
        let newOption = {
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {type: 'shadow'},
            textStyle: {align: 'left'},
            formatter: this.scatter_formatData(seriesObj.field, fieldInfo, data, key)
          },
          series: (() => {
            return this.scatter_buildSeries(seriesObj, key);
          })()
        };
        return Object.assign(basic, newOption);
      },

      /**
       *
       * @param fields
       * @param fieldInfo
       * @returns {function(*): string}
       */
      scatter_formatData(fields, fieldInfo, data, key) {
        const newField = _.flattenDeep(fields), other_data = data;
        return (p) => {
          let info = "", field = p[0].name;
          p.forEach((s, i) => {
            let own;
            const codeKey = fieldInfo[newField[i].id];
            const isSale = codeKey.sale;
            const point = codeKey.point;
            let value = s.seriesType === "line"
              ? s.value === Symbols.bar
                ? s.value
                : codeKey.scale
                  ? `${s.value}%`
                  : FigureService.thousand(s.value)
              : FigureService.thousand(isSale ? s.value * 10000 : s.value);

            if ((!s.value || s.value === Symbols.bar) && codeKey.infinite) value = Symbols.infinite;

            if (isSale) {
              own = `${value}元`;
            } else if (!_.isUndefined(point)) {
              own = value.slice(0, value.indexOf('.'));
            } else {
              own = value;
            }
            const mid_val = [
              {number: other_data[s.dataIndex].newAvgSellStoreCnt},
              {number: other_data[s.dataIndex].allAvgSellStoreCnt},
            ];
            let store_Number = FigureService.thousand(mid_val[i].number);

            let a_store = key.tool_view ? `（平均铺货门店数：${store_Number}）` : '';

            info += "<br />" + s.marker + s.seriesName + " : " + own + a_store;

          });
          return field + info;
        }
      },

      /**
       *
       * @param seriesObj
       * @param key
       */
      scatter_buildSeries(seriesObj, key) {
        let series = []; let bar;
        seriesObj.series.splice(1, 0, seriesObj.series[0]);
        seriesObj.series.forEach((s, i) => {
          if (i === 0) {
            let barScale = s.length > 1 ? '33%' : '50%';
            let bars = s.map(x => {
              bar = {
                type: 'bar',
                name: x.curr.name,
                data: x.list,
                barGap: '0%',
                barCategoryGap: barScale,
                silent: true,
                label: {
                  normal: {
                    show: key.barLabel,
                    position: 'top',
                    fontSize: 9,
                    formatter: (p) =>  FigureService.thousand(p.value, 0),
                  }
                },
                itemStyle: {
                  normal: {
                    color: function(params) {
                      const colorList = ['#007ADB','#FFC467'];
                      let mid_data = key.data[params.dataIndex];
                      let mid_color;
                      if(key.color_show){
                        mid_color = mid_data.newAvgSellStoreCnt - mid_data.allAvgSellStoreCnt > 0
                          ? colorList[0]
                          : colorList[1];
                      }else mid_color = colorList[0];
                      return mid_color;
                    }
                  },
                },
              };
              return bar;
            });
            series = [...series, ...bars];
          } else if (i === 1) {
            let bars_yellow = s.map(a => {
              let bar_yellow;
              bar_yellow = {
                type: 'bar', name: `${a.curr.name}（平均门店铺货数低于商品）`,
                data: [],barGap: '-50%',
                label: { normal: { show: key.label,  } },
                itemStyle: { normal: { color:'#FFC467'}, },
              };
              return bar_yellow;
            });
            series = [...series, ...bars_yellow];
          } else {
            const curr_router = $location.url().includes('newItem_cateGory');
            let lines = s.map(x => {
              return {
                type: curr_router ? 'bar' : 'line',
                name: x.curr.name,
                yAxisIndex: 0,
                silent: true,
                data: x.list,
                symbolSize: 15,
                itemStyle: {
                  normal: {color: '#26C08C' , },
                },
                label: { normal: {
                  show: key.barLabel,
                  position: 'top',
                  fontSize: 9,
                  formatter: (p) =>  FigureService.thousand(p.value, 0),
                } },
              }
            });
            series = [...series, ...lines];
          }
        });
        return series;
      },

      // 新品年份构建
      StrNewYear(){
        let nowYear = Number(moment().format('YYYY'));
        let _Year;
        _Year = [
          {id: nowYear.toString(), name: nowYear + '年新品', active: true},
          {id: (nowYear-1).toString(), name: nowYear-1 + '年新品', active: false}
        ];
        return _Year;
      },

      // 新品点击 | （品类组）
      newMethod(self, ele, one, two, type){
        let [titleCate, titleCode]  = [
          self.key.isNewCategory ? 'categoryName' : 'className',
          self.key.isNewCategory ? 'categoryCode' : 'classCode',
        ];
        let rowInfo = {
          year: self.key.newYear,
          typ: type
        };
        const Data = self.InitData;
        let _basInfo = !_.isNull(two)
          ? Data[one].nodes[two]
          : Data[one];

        rowInfo.code =  !_.isNull(two)
          ? Data[one][titleCode]
          : _basInfo[titleCode];
        rowInfo.link = _basInfo[self.newState.CliIndex[ele]];
        rowInfo.Name = Data[one][titleCate];
        rowInfo.Select = ele;

        self.scope.$emit(self.CommonCon.newMetClick, rowInfo)
      },

      // 新品点击 | （类别）
      OwnMethod(self, one, two, sta, type){
        let [titleCate, titleCode]  = [
          self.key.isNewCategory ? 'categoryName' : 'className',
          self.key.isNewCategory ? 'categoryCode' : 'classCode',
        ];
        let rowInfo = {
          year: self.key.newYear,
          typ: type
        };
        const Data = self.InitData;
        let _basInfo = !_.isNull(two)
          ? Data[one].nodes[two]
          : Data[one];

        rowInfo.code =  !_.isNull(two)
          ? Data[one][titleCode]
          : _basInfo[titleCode];
        rowInfo.Name = Data[one][titleCate];
        rowInfo.state = sta;

        self.scope.$emit(self.CommonCon.newMetClick, rowInfo)
      }

    }
  });
