angular.module("hs.classesAnalyze.sub")
  .factory("abcService", (CommonCon, $rootScope, basicService) => {
    return {
      /**
       * 监听ABC分析下 store门店变动
       * 如果门店选了 平均ABC禁用 选中整体ABC
       * 门店与业态群互斥（二者只能选一个）
       */
      watchABCStore(self) {
        self.scope.$watch('{a:ctrl.com.store.val, b:ctrl.key.active}', newVal => {
          if (newVal === undefined) return;
          //如果门店选了 平均ABC禁用，
          if (newVal.a.length > 0 || newVal.b == 5) {
            self.abcType = angular.copy(CommonCon.abcStructureDisabledTypes);
            self.com.total = self.abcType.find(a => a.active).id;
            self.typeActive = self.abcType[0].id;
            if (newVal.a.length) self.activeOperationGroup = '';
          } else {
            self.abcType = angular.copy(CommonCon.abcStructureTypes);
          }
        })
      },

      /**
       * 监听ABC分析下 业态群变动
       * 门店与业态群互斥（二者只能选一个）
       */
      watchABCOperationGroup(self) {
        self.scope.$watch('ctrl.activeOperationGroup', newVal => {
          if (!newVal) return;
          if(self.com.store){
            self.com.store.val = [];
          }
        })
      },

      /**
       * 新品select
       * @returns array
       */
      buildNewProductSelect() {
        let nowYear = Number(moment().format('YYYY'));
        return [
          {id: nowYear, name: nowYear + '新品'},
          {id: nowYear - 1, name: (nowYear - 1) + '新品'},
          {id: 1, name: '旧品'}
        ]
      },

      // 本地存储跳转数据
      setLocalGoStructure(data){
        basicService.setLocal('toStructure', data);
      },
      // 本地获取跳转数据
      getLocalGoStructure(){
        return basicService.getLocal('toStructure');
      },

      /**
       * 构建chart pie
       * @param curr 当前chart所对应类型的指标结构
       * @param summary:合计数据
       * @param fieldInfo 全局field定义
       */
      buildPieChart(curr, summary, fieldInfo) {
        const field = curr;
        const currId = field[0].id;
        const info = fieldInfo[currId];
        //是否为同比
        const isYoY = currId.includes('YoYValue');

        const name = info.name.substring(0, info.name.indexOf('A'));
        const title = !isYoY ? name : name + '上年同期';

        field.forEach((s, i) => {
          field[i].name = fieldInfo[field[i].id].name.replace(name, '');
        });

        let pieData = field.map(d => d.name);

        // 获取当前指标合计的集合
        const seriesObj = summary;

        let newOption = {
          color: ['#2A80D8', '#78BF57', '#eb7841'],
          title: {
            text: title,
            left: 'center',
            textStyle: {
              fontSize: 13,
              fontWeight: 'normal'
            },
            top: '30px'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: pieData
          },
          series: (() => {
            return this.buildPieSeries(field, seriesObj);
          })()
        };
        return newOption;
      },

      /**
       * chart 饼图 series
       * @param seriesObj 指标数据
       * @param summary 合计数据
       */
      buildPieSeries(seriesObj, summary) {
        let series = [

          {
            noDataLoadingOption:{
              effect:"bubble",
              text:"暂无数据",
              effectOption:{
                effect:{
                  n:0
                }
              },
              textStyle:{
                fontSize:32,
                fontWeight:"bold"
            }
            },
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            label: {
              normal: {
                formatter: '{d}%',
                position: 'inside',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 12,
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: []
          }
        ];

        seriesObj.forEach(s =>{ if(summary[s.id]!=0){series[0].data.push({value: summary[s.id], name: s.name})}});
        return series;
      },

      /**
       * 获取select下拉列表的12个月(abc里可以视为共通的方法)
       */
      buildMonthSelect(year, maxMonth) {
        //月select
        let month = [];
        let mLength = maxMonth ? maxMonth : 12;
        for (let i = 1; i <= mLength; i++) {
          let currDate = `${year}/${i > 9 ? i : `0${i}`}`;
          let lastDate = (moment(currDate, "YYYY/MM").subtract(11, 'months')).format("YYYY/MM");
          let val = `${lastDate}-${currDate}`;
          let date = {id: val, name: val};
          month.push(date);
        }
        return month;
      }
    }
  });
