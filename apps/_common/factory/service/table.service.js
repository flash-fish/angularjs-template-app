angular
  .module('SmartAdmin.Factories')
  .factory('tableService', (DTOptionsBuilder, CommonCon, FigureService, $templateCache,
                            DTColumnBuilder, basicService, Field, $compile, $sce, Symbols) => {
    return {
      /**
       * 构建固定列的数据
       * @param fix
       */
      fixedColumn(fix,newfield) {
        let Common_Field = newfield ? newfield : Field.common;
        return fix.map(s => {
          const isObj = typeof s === 'object';
          const field = isObj ? s.code : s;
          const title = isObj && s.title ? s.title : Common_Field[field].name;

          let builder = DTColumnBuilder.newColumn(field)
            .withOption('defaultContent', '-')
            .withTitle(title);

          // 如果当前为排名字段
          if (s === '_id') builder.withClass("table-fix-id");

          // 默认禁止排序
          if (!isObj || (isObj && !s.sort)) builder.notSortable();
          if (isObj && s.render) builder.renderWith(s.render);
          if (isObj && s.class) builder.withClass(s.class);
          if (isObj && s.visible) builder.notVisible();

          return builder;
        })
      },

      /**
       * 处理接口返回数据
       * @param data 列表元数据
       * @param keys 配置项
       *
       * keys: {
       *  addId: 添加id -> [default]: false 如果有值 作为当前页start传入
       *  addSum: 添加合计记录 -> [default]: true
       * }
       */
      dealResp(data, keys) {
        keys = keys || {};
        const list = !_.isUndefined(data.details) ? data.details : data;

        if (!list) return;

        const addId = keys.addId;
        const addSum = keys.addSum;

        list.forEach((d, i) => {
          if (!_.isUndefined(addId)) d._id = i + 1 + addId;
        });

        let dealSum = addSum && data.summary;

        if (dealSum) {

          if(dealSum) data.summary[addSum] = "整体合计";

          data.details.push(data.summary);
        }
      },

      /**
       * 构建 排序和分页参数
       * @param fields
       * @param params
       * @param option
       * @returns {*}
       */
      params: (fields, params, option) => {
        if (!Object.keys(params).length) return fields;

        if (option && option.sort) {
          fields['sortBy'] = {
            field: option.sort[0],
            direction: option.sort[1]
          }
        } else {
          fields['sortBy'] = {
            field: params.columns[params.order[0].column].data,
            direction: params.order[0].dir === 'asc' ? 1 : -1
          };
        }

        // 如果表格的分页禁用 取第三方的分页信息
        if (params.length < 0 && option && option.page) {
          fields['pagination'] = {
            size: 10,
            page: option.page
          };
        } else {
          fields['pagination'] = {
            size: params.length,
            page: params.start / params.length + 1
          };
        }
        return fields;
      },

      pageNo: function (params, callback, total, list) {
        return callback({
          draw: parseInt(params.draw),
          recordsTotal: total ? total : 0,
          recordsFiltered: total ? total : 0,
          data: list ? list : []
        });
      },

      /**
       * dataTable 数据配置
       * @param source
       * @param key
       *
       * key: {
       *  sort: 排序,
       *  fixed: Number类型时, 认为只设置左固定; Object类型时, 自定义设置
       * }
       * @returns {*}
       */
      fromSource: (source, key) => {
        const optionBuilder = DTOptionsBuilder.fromSource(source)
          .withOption('scrollX', true)
          .withOption('autoWidth', true)
          .withOption('processing', false)
          .withPaginationType('full_numbers')
          .withOption('sAjaxDataProp', 'data')
          .withLanguage({
            sEmptyTable: '没有数据',
            sInfo: '共 _TOTAL_ 条数据',
            sInfoEmpty: '',
            sZeroRecords: '没有数据',
            loadingRecords: '正在加载中...',
            processing: '正在加载中...',
            oPaginate: {
              sNext: '>',
              sPrevious: '<',
              sFirst: '第一页',
              sLast: '最后一页'
            }
          })
          .withDOM(
            '<\'dt-toolbar\'r>' +
            't' +
            '<\'dt-toolbar-footer\'<\'col-sm-3 col-xs-12 hidden-xs\'i><\'col-xs-12 col-sm-9\'p>>'
          )
          .withBootstrap();

        if (!key) key = {};

        // 默认第一列降序，类型为Number时默认降序 类型为数组时指定全配置
        let index = 0, dir = "asc";
        if (key.sort) {
          dir = "desc";
          if (typeof (key.sort) === 'object') {
            index = key.sort[0];
            dir = key.sort[1];
          } else
            index = key.sort;
        }
        optionBuilder.withOption('order', [index, dir]);

        // 固定列配置
        if (key.fixed) {
          let fix = typeof(key.fixed) === "number" ? {leftColumns: key.fixed} : key.fixed;
          optionBuilder.withFixedColumns(fix);
        }

        // 动态编译表头
        if (key.compileHeader) {
          optionBuilder.withOption("headerCallback", (header) => {
            $compile(angular.element(header).contents())(key.compileHeader);
          });
        }

        let wait_compile_DTFC_Left; // 固定列编译已经开始，只需等待固定列dom生成就可以
        const rowCallback = (row, rowData) => {
          // 只有固定列需要编译的情况 并且 处于非等待编译Dom：如：popover
          if (key.compileFixColumn && !wait_compile_DTFC_Left) {
            const interval = setInterval(() => {
              const leftFixed = angular.element('.DTFC_LeftBodyLiner table tr');
              if (leftFixed) {
                $compile(leftFixed.contents())(key.compileBody);
                wait_compile_DTFC_Left = false;
                clearInterval(interval);
              }
            }, 1000);
            wait_compile_DTFC_Left = true;
          }
          if (key.row) key.row(row, rowData);
        };

        // 行 回调函数 / 固定列需要编译的时候
        if (key.compileFixColumn || key.row)
          optionBuilder.withOption("rowCallback", rowCallback);
        // 动态编译表格内容
        else if (key.compileBody) {
          optionBuilder.withOption("createdRow", (row) => {
            $compile(angular.element(row).contents())(key.compileBody);
          });
        }

        // 初始化设置分页的起始位置
        if (key.start) optionBuilder.withOption("displayStart", key.start);

        // 设置每页显示条数
        optionBuilder.withOption("pageLength", key.pageLength || 15);

        if(key.pageLength) {
          optionBuilder.withOption("scrollY", 550);
          optionBuilder.withOption("scrollCollapse", true);
        }

        //禁用分页
        if(key.noPage){
          optionBuilder.withOption('paging', false)
        }

        // 分页的定制化
        optionBuilder.withPaginationType(key.page ? key.page : "full_numbers");

        // 表格数据处理模式
        optionBuilder.withOption('serverSide', !_.isUndefined(key.serverSide) ? key.serverSide : true);

        return optionBuilder;
      },


      /**
       * 根据请求参数动态筛选需要的column
       * @param data
       * @param newFields
       * @param fieldInfo
       * @param pageKey
       * @returns {*[]}
       */
      anyColumn(data, newFields, fieldInfo, pageKey) {
        let config = pageKey || {};

        let columns = [].concat(data);
        const allField = fieldInfo ? fieldInfo : Field.sale;
        const info = angular.copy(basicService.buildField(allField));
        let column;

        newFields.forEach(s => {
          const key = typeof s === 'object' ? s : info[s];
          const code = typeof s === 'object' ? s.code : s;
          // have_border 是否给表格添加线 text-right compare-border 为对应的class样式;
          let have_border = '';
          if (key) {
            let name = config.compareTableTitle && key.page ? key.page[config.compareTableTitle.page] : key.name;
            let title = key.sale ? `${name}(万元)` : key.singleSale ? `${name}(元)` : name;

            // title添加对比名称 是否加线
            if(key.message){
              function configBorder(text,) {
                let c_t = _.clone(title);
                if(info.extendText) {
                  // 判断title字符是否需要截取
                  if(!key.cut) {
                    title = `(${text})<br />${ c_t }`;
                    have_border = 'compare-border-one';
                  }
                  else{
                    title =
                      `(${text})<br />${c_t.substring(0,6)}<br />${c_t.substring(6,title.length)}`;
                    have_border = 'compare-border-one';
                  }
                }
              }
              if(key.text_one) {
                let info_one = info.extendText.one ? info.extendText.one : '';
                configBorder(info_one);
              }
              if(key.text_two){
                let info_two = info.extendText.two ? info.extendText.two : '';
                configBorder(info_two);
              }
            }else {
              // 构建表头
              if (!config.headerSilent) title = basicService.buildTitle(key, title, config);
              have_border = 'text-right';
            }

            if (key.icon) {
              const icon = key.icon;
              const isArray = angular.isArray(icon);
              if ((isArray && icon[1].includes(config.pageId)) || angular.isString(icon)) {

                let content = $templateCache.get(`${isArray ? icon[0] : icon}.html`);
                content = content.replace("<div>", "").replace("</div>", "");
                title = `<span title="${content}"><i class="glyphicon glyphicon-info-sign"></i>${title}</span>`;
              }
            }

            column = DTColumnBuilder.newColumn(code)
              .withTitle(title)
              .withClass(have_border)
              .renderWith((data, type, full) => {
                if (data && _.isString(data)) {
                  return data;
                }

                function getTitleData(d) {
                  const point = -0.005 < d && d <= -0.0001 ? 4 : 2;
                  return FigureService.thousand(d, point)
                }

                let unit = "", formatData, titleData = getTitleData(data), bClass, endElement;


                // 和钱有关的逻辑
                if (key.sale) {
                  unit = "元";
                  formatData = Math.abs(data) < 50 && Math.abs(data) > 0.5
                    ? FigureService.amount(data, 4)
                    : FigureService.amount(data);
                } else if (key.singleSale) {
                  unit = "元";
                  formatData = FigureService.thousand(data);
                } else {
                  let mid_number = !_.isUndefined(key.point) ? key.point : 2;
                  formatData = FigureService.thousand(data, mid_number);
                }

                // 和百分号有关的逻辑
                if (key.scale) formatData = FigureService.scale(data, true, true);

                // 特殊的增幅指标 即增长
                // 1. 基础指标非百分比，增长指标直接format --> inc === 1
                // 2. 基础指标为百分比，增长指标先乘以100再format --> inc === 2
                if (key.inc) {
                  formatData = FigureService.thousand(key.inc === 1 ? data : data * 100);
                }

                // 当该指标数据不存在时 大多数情况format成 "-" 特殊指标format成 "∞"
                if (key.infinite && _.isEqual(formatData, Symbols.bar)) {
                  formatData = Symbols.infinite;
                }

                // 和时间有关
                // 1. key.date = true --> 默认格式化为 YYYY/MM/DD
                // 2. key.date类型为字符串 --> 格式化读取key.date
                if (key.date) {
                  const array = typeof key.date === 'string' ? [data, key.date] : [data];
                  formatData = `<span>${FigureService.dataTransform(...array)}</span>`;
                }

                // 判断指标是否需要添加颜色
                if (key.color) {
                  // 当当前的列渲染的颜色需要根据其他列来计算的时候 读取key.value的配置
                  const value = key.value ? full[key.value] - full[code] : data;

                  let style = `color: ${_.isNumber(value) ? value < 0 ? 'green' : 'red' : ''}`;
                  formatData = `<span style="${style}">${formatData}</span>`;
                }

                // 类似门店动销率 给的是乘过100的只需要保留两位小数，并加上百分号
                if (key.percent && data) {
                  formatData = Number(data).toFixed(2) + Symbols.percent;
                }

                // @param value 判断两个值相对大小后需要相比的值
                // @param color table里需要改变的颜色

                if (key.value) {
                  let mid_Number;

                  // 和钱有关的逻辑
                  if (key.sale) {
                    unit = "元";
                    mid_Number = Math.abs(data) < 50 && Math.abs(data) > 0
                      ? FigureService.amount(data, 4)
                      : FigureService.amount(data);
                  } else {
                    mid_Number = FigureService.thousand(data);
                  }
                  let style = full[key.value] - full[code] >= 0 ? 'color: red' : 'color: green';

                  formatData = `<span style="${style}">${mid_Number}</span>`;
                }

                // 定义表格返回元素
                if(key.sale || key.singleSal){
                  endElement = `<span title="${titleData}${unit}">${formatData}</span>`
                }
                else if(
                  key.click && config.realRate
                  && (formatData !== Symbols.reRate || key.zeroClick)
                  && formatData !== Symbols.bar
                  && full._id !== Symbols.symTotal
                ) {
                  bClass = key.tagName ? key.tagName : '';
                  endElement = `<a href='javascript: void(0);' class="${bClass}">${formatData}</a>`;
                }else{
                  endElement  = `<span>${formatData}</span>`
                }

                return config.invalidFieldColor
                  ? endElement
                  : basicService.addColumnColor(data, endElement);
              });

            // 当前列配置为不可排序 则禁用排序
            if (key.notSort) column.notSortable();

            columns.push(column);

          }
        });

        if (config.noTitle) {
          columns.forEach(s => delete s.sTitle);
        }

        return columns;
      },

    };
  });
