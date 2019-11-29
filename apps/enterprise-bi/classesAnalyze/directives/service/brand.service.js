angular.module("hs.classesAnalyze")
  .factory("brandService", (toolService, Symbols, FigureService, dataService, $location,
                              basicService, CommonCon, brandCommon, Common, Field, newState) => {
    return {
      // 字符串首字母大写
      transLetter(ele){
        let letter;
        letter = ele.substring(0,1).toUpperCase()+ele.substring(1);
        return letter;
      },
      brandBuildSumData(ele, spl){
        if(!ele) return;
        let sumData = {};
        const [prefixArr, suffixArr] = [
          brandCommon.prefixArr , brandCommon.totalField
        ];
        const [
          midSuffixOne, midSuffixTwo
        ] = [ suffixArr[0], suffixArr[1] ];

        _.forIn(ele.summary, (v,k) => {
          if(k === spl + midSuffixOne || k === spl + midSuffixTwo){
            sumData[k] = v;
          }
        });

        _.forEach(ele.details, (s,i) => {
          const _index = s.zoneType - 1;

          let [_Sku, _Amount ] = [
            prefixArr[_index] + this.transLetter(spl) + suffixArr[2],
            prefixArr[_index] + this.transLetter(spl) + suffixArr[3]
          ];
          sumData[_Sku] = s[spl + suffixArr[2]];
          sumData[_Amount] = s[spl + suffixArr[3]]
        });
        return sumData;
      },

      braGetSum(sum, pageSum, field){
        if (!sum) return pageSum;

        pageSum.forEach(s => {
          const key = angular.copy(field[s.id]);
          const point = key && !_.isUndefined(key.point) ? key.point : 2;
          let d, h, origin = sum[s.id];

          if (key.scale) {
            const data = this.scale(origin, true);
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
      },

      /**
       * 百分比数字格式化
       * @param data 原始数据
       * @param abs 是否取绝对值( 默认是取绝对值，true是不取绝对值，false取绝对值 )
       * @param percent 是否加百分号
       * @param fixed 百分比字符需要保留小数的位数（历史原因默认保留2位）
       * @returns {string|*}
       */
      scale: (data, abs, percent, fixed) => {
        // 默认小数两位
        if (_.isUndefined(fixed)) fixed = 2;
        data = parseFloat(data);
        if (_.isNull(data)
          || _.isUndefined(data)
          || data === Symbols.bar
          || isNaN(data)) {
          return Symbols.defaultRate;
        }

        let str = abs ? Number(data * 100).toFixed(fixed) : Math.abs(Number(data * 100)).toFixed(fixed);
        str = percent ? str + Symbols.percent : str;

        return str;
      },

      // 价格带页面跳转 session 存储 时间监听树点击事件
      ClickEventSave(self, special){
        self.scope.$on(CommonCon.brandTreeGridClick, (e,d) => {
          const catLevels = CommonCon.catLevels;

          const curLevel = d.level;

          let _head_name = catLevels.filter( s => + s.id === curLevel)[0].name;

          let _Name = `${_head_name}${_head_name.length > 0 ? '-' : ''}${d.categoryName}`;

          let [ data, content ] = [
            {}, {
              id: 2,
              val:[{
                code: d.categoryCode,
                level: curLevel,
                name: _Name
              }]
            }
          ];
          // 获取概况页面session
          const topCondition = basicService.getSession(brandCommon.session.surveyCondition);

          _.forIn(topCondition, (value, key) => {
            if(key === 'category') {
              data[key] = content;
            } else data[key] = value;
          });

          let params = toolService.buildParam(toolService.getParam(data, []), special);

          if(params.condition &&  params.condition.distributionSelect) {
            delete params.condition.distributionSelect;
          }

          params.condition.category = {
            level: d.level + 1,
            values: [d.categoryCode]
          };

          // 根据数据权限判断是否可点击
          basicService.checkAccess(params, () => {

            self.key.active = 2;

            data.jumpFromSurvey = true;
            // 把条件存储为session
            basicService.setSession(brandCommon.session.priceSession, data)
          });
        });
      },
      /**
       * 获取数据设定里的指标集合
       * @param field
       * @param isChange
       * @param key
       * @param extraFunc
       */
      StructureCol(field, isChange, key, extraFunc) {
        field.newTable = toolService.calculateTableField(field.table);

        field.newTable = toolService.SameRingSettingField(field.newTable, field.table.option);

        if (key && key.removeField && key.active !== 7) {
          _.remove(field.newTable, (f) => key.removeField.includes(f));
        }

        if (extraFunc) extraFunc(field);

        // 点击查询时将条件保存到session
        basicService.setSession(CommonCon.session_key.hsField, field);

      },

      /**
       * 构建当前页面的chart option
       * @param key 配置
       * @param self 当前实例
       * @param summary 合计数据
       */
      confChartOption(key, self, summary) {
        key.barLabel = self.showBarLabel;
        key.lineLabel = self.showLineLabel;

        self.sale = toolService.buildChart(
          self.field.chart.first,
          Object.assign({}, key, {firstRect: true})
        );
        self.stock = toolService.buildChart(self.field.chart.second, key);
      },

      // 饼图样式获取
      PieRender(self,data, conf){
        if(!data || !conf) return;

        const _pieDataOne = _.clone(data);
        const _pieDateTwo = _.clone(data);

        let fieldsLength, paOne, paTwo, toolOne, toolTwo;

        _.forIn(conf.field, val => {
          fieldsLength = val.bar.length;
          paOne = val.bar[0].id;
          toolOne = val.bar[0].name;
          self.conf.firstPrice = toolOne;
          if(fieldsLength > 1) {
            toolTwo = val.bar[1].name;
            self.conf.secondPrice = toolTwo;
            paTwo = val.bar[1].id;
          }else self.conf.secondPrice = '';
        });


        let [ dataOne, dataTwo, realDataOne, realDateTwo]  =  [ [], [], [], [] ];

        _.forEach(_pieDataOne, (s,i) => {
          dataOne.push({value: Math.abs(s[paOne]), name: s.zoneTypeName});
          dataTwo.push({value: Math.abs(s[paTwo]), name: s.zoneTypeName});
        });

        _.forEach(_pieDateTwo, s => {
          realDataOne.push({value: s[paOne], name: s.zoneTypeName});
          realDateTwo.push({ value: s[paTwo], name: s.zoneTypeName });
        });

        let config_Pie = {
          normal: {
            formatter: p => { if (p.percent < 6) return ""; return p.percent + '%'; } ,
            textStyle: { fontWeight: 'normal', fontSize: 12, },
            show: true, position: 'inside',
          },
          emphasis: {
            show: true, align: 'left',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 10,
            padding: 7,
            formatter: (p) => {
              if (p.name === ' ') return "未知";

              let _ele = '';

              const _Value = p.seriesIndex === 0
                ? FigureService.thousand(realDataOne[p.dataIndex].value)
                : FigureService.thousand(realDateTwo[p.dataIndex].value);

              if(isNaN(p.value)) return;

              _ele = `${p.seriesIndex === 0 ? toolOne : toolTwo}`
                + '\n'
                + `${p.name.replace(/\s*/g,"")}：`
                + `${_Value}`
                +`元(${p.percent}%)`;

              return  _ele
            }
          }
        };

        let SeriesCenter = fieldsLength > 1
          ? ['25%', '50%']
          : ['50%', '50%'];

        const pieLegend = dataOne.map( s => s.name );

        let endPie;
        endPie = {
          color: [
            '#007ADB', '#26C08C', '#FFC467', '#FF905C', '#EA5B66', '#A948CC',
            '#129FCC', '#6CD169', '#FFB358', '#FF9F75', '#FB6C93', '#E66BCF',
            '#FA7C70', '#6C58D8 ', '#C8D45D', '#FF8D50'
          ],
          legend: {
            x : fieldsLength > 1 ?  'left' : 'center',
            y : 'top',
            top: 7,
            data:pieLegend,
          },
          calculable : true,
        };

        endPie.series = [
          {
            type:'pie', selectedMode: 'single', radius : [0, 110], clockwise: false,
            label: config_Pie,
            labelLine: { normal: { show: true } },
            center : SeriesCenter,
            data:dataOne
          },
        ];
        const SeriesTwo = [
          {
            type:'pie',
            selectedMode: 'single',
            radius : [0, 110],
            label: config_Pie,
            labelLine: { normal: { show: true } },
            center : ['75%', '50%'],
            data:dataTwo
          }
        ];


        if(fieldsLength > 1){
          endPie.series = [ ...endPie.series , ...SeriesTwo ];
        }

        return endPie;
      },

      // Chart 指标数据计算
      PriceLine(self,ele, func){
        if(!ele) return;
        self.conf.analyzeShow = false;
        _.forIn(ele, (v,k) => {
          if(k === 'category' && v.val.length === 1){
            if(v.val[0].level === 5){
              self.conf.analyzeShow = true;
            }
          }
        });

        if(func) func(self.conf.analyzeShow);
      },

      // 给树状图添加展开属性
      ExpandData(self,data){
        let MidData = _.clone(data);
        // 价格带页面请求session 价格带添加 expanded 属性
        if(self.key.brandSurvey && self.key.brandSurvey.isBrand){

          const fromBrand = basicService.getSession(brandCommon.session.emitTreeSession);

          // sowState( rowExpand | rowCollapse )
          if(fromBrand){
            const  [_rowKeyAr, _rowState, _rowCode, code] = [
              fromBrand.rowKey.includes(Symbols.underLine)
                ? fromBrand.rowKey.split('_')
                : [].concat(fromBrand.rowKey),
              fromBrand.type.includes('rowExpand'),
              fromBrand.code,
              'categoryCode'
            ];
            // 遍历
            const midAr = [].concat(_rowKeyAr);
            _rowKeyAr.forEach( (s,i) => {
              if(i === 0){
                const _Zero = MidData[s];
                if(_Zero[code] === _rowCode && !_rowState){
                  _Zero.initialState = 'collapsed';
                }else _Zero.expanded = true;
              }
              if(i === 1){
                const _One = MidData[midAr[0]].nodes[s];
                if(_One[code] === _rowCode && !_rowState){
                  _One.initialState = 'collapsed';
                }else _One.expanded = true;
              }
              if(i === 2) {
                const _Two = MidData[midAr[0]].nodes[midAr[1]].nodes[s];
                if(_Two[code] === _rowCode && !_rowState){
                  _Two.sinitialState = 'collapsed';
                } else _Two.expanded = true;
              }
              if(i === 3) {
                const _Three = MidData[midAr[0]].nodes[midAr[1]].nodes[midAr[2]].nodes[s];
                if( _Three[code] === _rowCode && !_rowState){
                  _Three.initialState = 'collapsed';
                } else _Three.expanded = true;
              }
            })
          }
        }

        function ArReply(ele, MidData) {
          const [ rowKey, _rowState, name] = [
            Number(ele.rowKey),
            ele.type.includes('rowExpand'),
            ele.cateName
          ];
          MidData.forEach( (s, i, ar) => {
            if(s.categoryName === name && i === rowKey && _rowState){
              ar[i].expanded = true
            }else ar[i].initialState = 'collapsed';
          })
        }
        // 新品分析页面 | (品类组)
        if(self.key.newSateAnalyze && self.key.isNewCategory){
          const fromNewCat = basicService.getSession(newState.session.categorySession);
          if(fromNewCat ) ArReply(fromNewCat, MidData);
        }

        // 新品分析页面 | (类别)
        if(self.key.newSateAnalyze && self.key.isNewClass){
          const fromNewCla= basicService.getSession(newState.session.classSession);
          if(fromNewCla) ArReply(fromNewCla, MidData);
        }

        return MidData;
      },

      // 价格线分析 | 价格带分析 Chart
      AnalyzeBrandChart(self, Data){
        let confOption;

        let AmountData = [ ];

        _.forIn(Data.AmountData, (v,k) =>{
          AmountData.push({ key:k, value:v });
        });

        // 销售额数组对象排序 小 -> 大
        AmountData.sort( (a,b) => {
          return Number(a.key) - Number(b.key) > 0 ? 1 : -1;
        });

        // 销售额数值取两位小数点
        let [ toolAmountData, ] = [ AmountData.map( s => Number(s.key).toFixed(2)), ];

        const nameTextStyle = {fontSize: 11, fontFamily: 'Arial', color: '#071220'};
        const axisLineAndTick = {lineStyle: {color: '#ECECEC', width: 3}};

        // 求 Y1 轴最大值
        let yOneAr = AmountData.map( s => (s.value / 10000).toFixed(2));
        let yOneArMax = Math.max.apply(Math, yOneAr);

        // 总数据数量
        const DataLength = Object.keys(Data.AmountData).length;

        // X轴最大值赋值
        let xAxisMax = _.max(_.values(Data.areaData));

        let midAmData = AmountData.map(a => a.key);

        midAmData.forEach( (s,i,ar) => ar[i] = Number(s));

        let minAmData = _.min(midAmData);

        const AmData = minAmData < 0 ? Math.abs(minAmData) : minAmData;

        const minBasicAmData =AmData + DataLength;

        // 动态编译 Y2 轴的刻度
        let SpNumber = DataLength > 50 ? 10 : DataLength < 20 ? 5 : 8;

        // 销售额最小值 | 获取 Y 轴最小基准值
        let [CountO, CountT] = [0, 0];

        const skuAmData = _.clone(midAmData);

        // 定义有售、可售SKU数数据
        let skuScatterData = {}; skuScatterData.one = []; skuScatterData.two = [];

        const _skuData =  Data.skuData;

        _.forEach(skuAmData, (s,i) => {
          skuScatterData.one.push([
            s,
            _skuData.canSaleSku[i] === s
              ? minBasicAmData + CountO++
              : ''
          ]);
          skuScatterData.two.push([
            s,
            _skuData.haveSaleSku.some( a => a === s )
              ? minBasicAmData + CountT++
              : ''
          ])
        });

        const confSeries = {
          amountData: AmountData,
          data: Data,
          scatterConf: {
            basicLen: DataLength,
            smallBasicAmount: minBasicAmData,
            SkData: skuScatterData
          }
        };

        let LabelArr = [];

        // 注释 ！！******！！
        // 1> Y1 轴刻度取大于 1.25 不显示
        // 2> Y2 轴MAX最大值取 2.25 倍
        confOption = {
          color: [
            '#007ADB', '#26C08C',  '#9243DD', '#3DC7FF',
            '#dd8fa9', '#FFC467', '#FF905C', '#e83329',
            '#6b6b6b'
          ],
          legend: {
            data:['销售额', '可售SKU', '有售SKU'],
            right: '50px',
            top: '5px',
          },
          grid: { left: '30px', top: '60px', right: '30px', bottom: '30px', containLabel: true },
          tooltip: {
            trigger: 'item',
            textStyle: {align: 'left'},
            formatter: this.toolTipFormatter(toolAmountData,skuScatterData)
          },
          xAxis:  {
            type: 'value', boundaryGap: false, splitLine: { show: false },
            axisLabel:{
              color: '#071220', fontSize: 11,
              formatter: (s) => { return s === 0 ? '' : s }
            },
            axisTick: { interval: 1, },
            axisLine: {
              lineStyle: { color: '#D3D3D3', width: 3 }
            },
            max: xAxisMax,
            splitNumber:  SpNumber,
            axisPointer: {type: 'shadow'},
          },
          yAxis: [
            {
              name: '（万元）', type: 'value', splitLine: { show: false, },
              nameGap: 30,
              axisLabel: {
                color: '#071220', fontSize: 11,
                formatter: (s) => {
                  return s > yOneArMax * 1.25 ? '' : s
                }
              },
              inside: false,
              max: yOneArMax * 2,
              nameTextStyle: nameTextStyle,
              axisTick: {show: false},
              axisLine: axisLineAndTick,
            },
            {
              type: 'value', splitLine: { show: false, }, axisTick: {show: true},
              position: 'right',
              axisLabel: {
                color: '#071220', fontSize: 11, interval:1,
                formatter: (s,i) => { // 确认 Y2 轴基础坐标值 0 值确定
                  let endNumber;
                  if(s - minBasicAmData > 0) {
                    let a = parseInt(s - minBasicAmData); LabelArr.push(a);
                    if(LabelArr.length === 1) {
                      endNumber = 0
                    }
                    else if(LabelArr.length === 2) {
                      endNumber = LabelArr[1] - LabelArr[0];
                    }else endNumber = a - LabelArr[0]
                  }else endNumber = '';

                  return endNumber;
                }
              },
              max: minBasicAmData * 2, // scatter 最大值设定比例
              nameTextStyle: nameTextStyle,
              axisLine: axisLineAndTick,
              // minInterval: 1,
              splitNumber: SpNumber
            }
          ],
          series: (() => {
            return this.buildSeries(self, confSeries);
          })()
        };
        return confOption;
      },

      // 图表 formatter
      toolTipFormatter(toolAmountData, skuData){
        const skuOneName = [ '可售SKU', '有售SKU' ];
        return (s) => {
          const nowIndex = s.dataIndex;
          let [ amountValue, priceValue] = [
            FigureService.thousand(s.value[1] * 10000),
            FigureService.thousand(toolAmountData[nowIndex])
          ];
          let endToolTip;
          if(s.seriesType === 'line'){
            endToolTip = `规则化平均售价：${priceValue}元` + '<br/>' + `${s.seriesName}：${amountValue}元`
          }else {
            if(skuData.one[nowIndex][1] === skuData.two[nowIndex][1]){
              endToolTip = '<span class="sku_One"></span>' + skuOneName[0] + '：' + priceValue + '元'
                + '<br>'
                + '<span class="sku_Two"></span>' + skuOneName[1] + '：' + priceValue + '元';
            }else {
              endToolTip = `${s.marker}${s.seriesName}：${priceValue}元`;
            }
          }
          return endToolTip;
        }

      },

      // Chart Series 构建
      buildSeries(self, confSeries){
        if(!confSeries) return;
        let [basicData, serOneData, chartArea] = [ [], [], []];

        const [amData, amArea,skuDataSeries] =  [
          confSeries.amountData, confSeries.data.areaData,
          confSeries.scatterConf.SkData
        ];

        // 销售额折线图构建
        amData.forEach( (s,i) => {
          let sValue = s.value;
          serOneData.push([
            Number(s.key).toFixed(2), (sValue / 10000).toFixed(2)
          ])
        });

        // 可售SKU | 有售SKU
        const [seriesSku, seriesTwo]  = [
          ['可售SKU', '有售SKU'], []
        ];

        function midArea(numOne, colors, numTwo) {
          let _Opacity = '0.4';

          let Arr = [];
          Arr.push([
            { xAxis: numOne.toString(),
              itemStyle:{ normal:{color: colors, opacity: _Opacity}},
              silent: true
            },
            { xAxis: numTwo.toString() }
          ]);
          return Arr;
        }

        // 定义有售、可售SKU数数据
        let skuScatterData = angular.copy(skuDataSeries);

        // 定义背景区域级别
        const areaLevel = brandCommon.AreaLevel;

        self.legArea = {
          legOne: false,
          legTwo: false,
          legThree: false,
          legFour: false,
          legFive: false
        };

        // chart 背景区域构建
        _.forIn(amArea, (v,k) => {
          if(k === areaLevel[0] && v){
            chartArea = chartArea.concat(midArea(0,'#2CDEA1',v));
            self.legArea.legOne = true;
          }
          if(k === areaLevel[1] && v){
            chartArea = chartArea.concat(
              midArea(amArea[areaLevel[0]], '#F4F156', v)
            );
            self.legArea.legTwo = true;
          }
          if(k === areaLevel[2] && v){
            chartArea = chartArea.concat(
              midArea(amArea[areaLevel[1]], '#3ABAEF', v)
            );
            self.legArea.legThree = true;
          }
          if(k === areaLevel[3] && v){
            chartArea = chartArea.concat(
              midArea(amArea[areaLevel[2]], '#F49EBB', v)
            );
            self.legArea.legFour = true;
          }
          if(k === areaLevel[4] && v){
            chartArea = chartArea.concat(
              midArea(amArea[areaLevel[3]], '#ED9942', v)
            );
            self.legArea.legFive = true;
          }
        });

        // 销售额折线图
        let seriesOne = {
          name: '销售额',
          type: 'line',
          smooth: true,
          yAxisIndex:0,
          lineStyle: {normal: {width: 4}},
          data: serOneData,
        };

        let _Range = {
          name: '背景',
          type: 'line',
          smooth: true,
          yAxisIndex:0,
          lineStyle: {normal: {width: 4}},
          data: [],
          markArea: {silent: true, data: chartArea,}
        };

        // 合并折线图
        seriesTwo.push(seriesOne,_Range);

        // scatter 数据构建
        _.forEach(seriesSku, (s, i) => {
          if(i === 0) {
            seriesTwo.push({
              name: s,
              symbolSize: 6,
              type: 'scatter',
              yAxisIndex:1,
              itemStyle: { normal:{ color: '#e83329' } },
              data: skuScatterData.one,
            })
          }
          else{
            seriesTwo.push({
              name: s,
              symbolSize: 6,
              type: 'scatter',
              yAxisIndex:1,
              itemStyle: { normal:{ color: '#007ADB' } },
              data: skuScatterData.two,
            })
          }
        });
        basicData = _.clone(seriesTwo);

        return basicData;
      },

      EmitRow(row,self) {
        const emitObj = {
          rowKey: row.args ? row.args.rowKey : '',
          type:row.type,
        };
        if(self.key.brandSurvey){
          if(!self.key.brandSurvey.isBrand) return;
          emitObj.code = row.args
            ? row.args.row
              ? row.args.row.categoryCode
              : ''
            : '';
          self.scope.$emit(CommonCon.brandTreeGridrowExpand, emitObj);
        }
        if(self.key.newSateAnalyze){
          if(self.key.isNewCategory || self.key.isNewClass){
            emitObj.cateName = row.args
              ? row.args.row
                ? row.args.row.categoryName
                : ''
              : '';
            self.scope.$emit(CommonCon.newEmitState, emitObj);
          }
        }
      },

      /**
       * 合并当前选中的值和权限中的值
       * @param com 本地的条件
       * @param accessCom 权限里的条件
       * @param job 当前岗位
       */
      unionAccess(com, accessCom, job) {
        /**
         * 点查询时 判断当前页面的条件状态
         * 品类组不存在 类别不存在 商品或新品不存在 保留品类组
         */
        if (job && job === CommonCon.jobTypes.buyer) {
          if ((!com.category || !FigureService.haveValue(com.category.val))
            && (!com.classes || !FigureService.haveValue(com.classes.val))
            && (!com.product || !FigureService.haveValue(com.product.val))) {

            if (com.category) com.category.val = [];
            if (com.classes) com.classes.val = angular.copy(accessCom.classes.val);
          }

          // 需要按权限还原条件的（地区、业态、门店）
          const needRecover = ['district', 'operation', 'store'];
          needRecover.forEach(n => {
            if (accessCom[n].val.length) com[n].val = angular.copy(accessCom[n].val);
          });
          return;
        }

        // 其他情况做条件初始化处理
        _.forIn(com, (value, key) => {
          if (value instanceof Object && value.val && value.val.length === 0)
            value.val = accessCom[key].val;
        });

        // 数据权限在业态/地区上，选择门店后检索，业态/地区不回复
        const noReply = ['district', 'operation'];
        if(com['store'].val.length){
          noReply.forEach( s =>  {
            if (accessCom[s].val.length) com[s].val = [];
          });
        }
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

        if (noDate || self.fromSurvey) {
          basicService.packager(dataService.getMaxDate(), resp => {
            if (self.dateOption) self.dateOption.maxDate = resp.data;
            if (func) func();
          });
        }
        else{
          // 初始化日期范围
          this.initDate(self, (d) => func(d));
        }

      },

      /**
       * 初始化日期范围
       * @param self 当前页面实例
       * @param func 逻辑函数体
       */
      initDate(self, func) {
        basicService.packager(dataService.getMaxDate(), resp => {
          self.com.date = toolService.buildDate(resp.data);
          if (self.dateOption) {
            self.dateOption.maxDate = resp.data;
            self.dateOption.date = self.com.date;
          }
          if (func) func(resp.data);
        });
      },



    }
  });
