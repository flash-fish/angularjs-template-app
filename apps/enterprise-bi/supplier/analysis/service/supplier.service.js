angular.module("hs.supplier.adviser")
  .factory("supplierService", (CommonCon, FigureService, basicService, dataService,
                               toolService, Symbols, Chart, tableService, $templateCache, QuaConst, Field) => {
    return {
      // 供应商表格一构建
      buildFirstColumn(field, fieldInfo){
        const fix = [
          {
            code: "quadrantName",
            render: (data) => {
              let _Index = _.indexOf(QuaConst.quaName.map(s => s.name ), data);
              let content = '', title = '';

              if(_Index >= 0){
                content = $templateCache.get(`${QuaConst.quaName[_Index].icon}.html`);
                content = content ? content.replace("<div>", "").replace("</div>", "") : '';
                title = `<span title="${content}">`+
                  `${data}<em style="margin-left: 7px; cursor: pointer;">`+
                  `<i class="glyphicon glyphicon-info-sign"></i></em>`+
                  `</span>`;
              }else title = `<span>${data}</span>`;

              return title;
            }
          },
          {
            code: "count",
            render: (data, type, full) => {
              if (!data) return "";
              let _Link = full.quadrantName === "整体合计";
              let _Ele;
              _Ele = _Link
                ? data
                : '<a href="javascript:void(0);" style="color: #368bf8;" class="a-link hover-bold">' + data + '</a>';
              return _Ele;
            }
          }
        ]; // 维度

        const  [ fixInfo, _field] = [
          Object.assign({}, Field.common, QuaConst.commonFix), _.clone(field).slice(1)
        ];
        return tableService.anyColumn(tableService.fixedColumn(fix, fixInfo), _field, fieldInfo);
      },



      // chart 设定
      firChartOption(data){
        const legends = data.map(s => s['quadrantName']);
        let arr = [], chartOption;
        _.forEach( data, s => {
          arr.push({value: s.count, name: s.quadrantName})
        });
        const title = '供应商数';
        chartOption = {
          color: ['#007ADB', '#26C08C', '#FFC467', '#FF905C', '#EA5B66', '#A948CC'],
          tooltip: {
            trigger: 'item',
            confine: true,
            formatter: (a) => {
              return a.marker + a.name + '<br>' + `${title}：${a.value}`
            },
            textStyle:{ align:'left' },
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            data: legends,
            y: '80%',
          },
          series: [
            {
              name: name ? name : '',
              label: {
                normal: {
                  formatter: '{d}%',
                  textStyle: { fontWeight: 'normal', fontSize: 12 }
                }
              },
              labelLine:{ normal:{ length:3 } },
              type: 'pie',
              radius: '52%',
              center: ['50%', '32%'],
              data: arr,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
            }
          ]
        };
        return chartOption;
      },

      // 订阅事件
      onEvent(self, key){
        key = key || {};

        const rememberCom = (noCopy) => {
          if (self.showCondition) self.showCondition();

          /*if (key.rememberCom) {
            key.isSubMenu
              ? toolService.commonSetSub(self.param, self.subSession)
              : toolService.commonSetTop(self.param, key.removeField);
          }*/

          if (!noCopy)
            self.param = Object.assign({}, self.param);
        };

        function InitShow(ele, type) {
          if (!ele.val.length) return;

          if (key.paramShow === true ||
            (_.isArray(key.paramShow) && key.paramShow.includes(type)))
            self.show = true;
        }

        // 点击chart 中 class的面包屑触发
        self.scope.$on(CommonCon.classClick, (e, d) => {
          InitShow(d, "classes");
          self.com.classes = d;
          self.param.classes = d;

          rememberCom();
        });
      },

      supplierIdGet(self, supplierId, func){
        const _face = "getSupplierInfoByIds";
        self.com.supplier.val = [];

        basicService.packager(dataService[_face](supplierId), res => {
          const groupSupplier = res.data;
          let suppArr = [];
          groupSupplier.forEach( s => {
            suppArr.push({code: s.supplierId, name: s.supName, showCode: s.supplierCode,})
          });
          self.com.supplier.val = suppArr;

          if (func) func ();
        });
      }



    }
  });
