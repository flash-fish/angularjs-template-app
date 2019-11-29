class TreeGridController {
  constructor($http, FigureService, Field, $scope, basicService, toolService,
              dataService, $sce, $compile, Pop, CommonCon, indexCompleteService,
              Symbols, $templateCache, brandCommon, brandService, newState, newItemService) {
    this.Pop = Pop;
    this.sce = $sce;
    this.$http = $http;
    this.Field = Field;
    this.scope = $scope;
    this.Symbols = Symbols;
    this.tool = toolService;
    this.compile = $compile;
    this.newState = newState;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.brandService = brandService;
    this.basicService = basicService;
    this.brandCommon = brandCommon;
    this.newService = newItemService;
    this.indexComplete = indexCompleteService;
    this.$templateCache = $templateCache;

    //指标达成
    this.flag = false;
  }

  init() {
    //指标达成
    this.indexConfig = this.key.index;

    //标识其他页
    this.otherConfig = this.key.other || {};

    this.icon = this.indexConfig ? this.indexConfig.icon : this.otherConfig ? this.otherConfig.icon : null;
    //默认需要排序，若不需要，sort设置为fasle
    if (this.key.sort === undefined) {
      this.key.sort = true;
    }

    this.scope.$watch("ctrl.table", newVal => {
      if (!newVal) return;
      if (this.key.tab && newVal.data.length == 1 && newVal.data[0].operationsName === '整体合计') {
        newVal.data = [];
      }
      //按整体部分不展示子节点；
      if (this.key.tab == 1 || this.key.tab == 6) {
        newVal.data = newVal.data.map(item => {
          delete item.nodes;
          return item;
        })
      }
      // 不明白这里为什么要这么做，先注掉
      // if (newVal.data.length < 5 && newVal.data.length != 0 && this.key.tab) {
      //   let cha = 5 - newVal.data.length;
      //   for (let i = 0; i < cha; i++) {
      //     newVal.data.push({})
      //   }
      // }

      // 构建基准数组
      this.InitData = _.clone(this.table.data);

      this.key.finish = true;
      this.jqWidget();
      this.compile($('#treeGrid'))(this.scope);
    });

  }

  loopData(data, tableField) {
    if (!tableField) return;

    data.forEach(s => {
      tableField.forEach(f => {
        if (_.isUndefined(s[f])) s[f] = this.Symbols.bar;
      });

      if (!s.nodes || !s.nodes.length) return;

      this.loopData(s.nodes, tableField);
    });
  }

  jqWidget() {
    const data = this.table.data;
    const tableField = this.table.field;
    const treeGrid = $('#treeGrid');

    // 初始化基准数据
    this.InitData = angular.copy(data);

    let MidData = _.clone(data);

    // 价格带
    if(this.key.brandSurvey && this.key.brandSurvey.isBrand){
      MidData = this.brandService.ExpandData(this, data);
    }

    // 遍历data 增补数据
    this.loopData(MidData, tableField);

    // 默认显示总和行的
    this.indexCurRow = data.length ? data[0] : {'null': true};

    this.show = false;

    // 如果data为空 显示没有数据
    this.empty = !data || !data.length;

    let dataAdapter = new $.jqx.dataAdapter({
      dataType: 'json',
      dataFields: this.buildDataField(),
      hierarchy: {
        root: 'nodes'
      },
      localData: data
    });

    let treeGridConfig = {
      width: "100%",
      columnsHeight: 60,
      // sortable: false,
      columnsResize: true,
      sortable: this.key.sort === 0 ? false : true,
      source: dataAdapter,
      columns: this.buildColumn(),
    };

    // pageSize
    if (this.key.height) treeGridConfig.height = this.key.height;

    //跨行head
    if (this.key.columnGroups) treeGridConfig.columnGroups = this.key.columnGroups;

    treeGrid.jqxTreeGrid(treeGridConfig);

    //行展开
    treeGrid.off('rowExpand').on('rowExpand', (row) => {
      //noHeight 不需要固定高度
      if (!this.key.noHeight) this.setHeight();
      this.compile($('#treeGrid'))(this.scope);
      // 价格带页面
      this.brandService.EmitRow(row,this)
    });

    //行收起
    treeGrid.off('rowCollapse').on('rowCollapse', (row) => {
      if (!this.key.noHeight) this.setHeight();
      this.compile($('#treeGrid'))(this.scope);
      // 价格带页面
      this.brandService.EmitRow(row,this)
    });

    //行选择事件
    if (!this.key.tab) {
      treeGrid.off('rowSelect').on('rowSelect', (event) => {
        this.compile($('#treeGrid'))(this.scope);
        let args = event.args;
        let row = args.row.nodeName == '整体' ? this.table.data[0] : args.row;

        if (this.indexConfig) {
          this.show = true;
          this.indexCurRow = row;
        }

        treeGrid.jqxTreeGrid({
          width: '100%',
        });
      });

    } else {
      //abc部分行选择时不需要高亮显示；
      $('#treeGrid').on('rowUnselect', function (event) {
        $('#treeGrid').jqxTreeGrid({selectionMode: "custom"});
      });
      $("#treeGrid").jqxTreeGrid('unselectRow', 1);
      $('#treeGrid').jqxTreeGrid({enableHover: false});
    }

    this.compile($('#treeGrid'))(this.scope);

    // 初始化排序
    const field = this.key.sort ? this.table.field[0] : null;
    const sortDir = this.key.sortDir ? this.key.sortDir : 'desc';
    if (field) treeGrid.jqxTreeGrid('sortBy', field, sortDir);

    this.resizeTreeTable();

    //解决某些情况下表格列宽问题
    setTimeout(() => {
      treeGrid.jqxTreeGrid({
        width: '100%',
      });

      if (!this.key.noHeight) this.setHeight();
    }, 200)
  }

  /**
   * treeGrid设置table高度
   * 因为tree的滚动条是自己生成的，css无法控制
   * 所以只能通过设置高度控制纵向滚动条
   */
  setHeight() {
    //table的最大高度
    const maxHeight = 495;

    //table的头部高度
    const headHeight = $('.jqx-grid-header').height();

    //table的横向滚动条
    const bar = $('#jqxScrollThumbhorizontalScrollBartreeGrid');

    //table的原始高度
    const originaHeight = bar.css('visibility') == 'hidden'
      ? (headHeight + $('#pinnedtabletreeGrid').height())
      : headHeight + $('#pinnedtabletreeGrid').height() + bar.height();

    let height = originaHeight < maxHeight ? originaHeight : maxHeight;

    if (originaHeight <= maxHeight) {
      $('#treeGrid').jqxTreeGrid({
        height: 'auto'
      });
    } else {
      $('#treeGrid').jqxTreeGrid({
        height: height
      });
    }
  }

  /**
   * 构建treeGrid的dataField
   * @returns {Array}
   */
  buildDataField() {
    const fix = this.key.fix.map(s => {
      const code = typeof s === 'string' ? s : s.code;
      return {name: code, type: 'string'}
    });

    // 定义行内数据格式value || string (number 过滤单位)
    const dynamic = this.table.field.map(s => {
      const isStr = this.key.isString || [];
      let Ele;
      Ele = isStr.includes(s)
        ? {name: s, type: 'string'}
        : { name: s, type: 'number' };
      return Ele;
    });

    const root = [
      {name: this.key.root, type: 'array'},
      {name: 'expanded', type: 'bool'},
    ];

    return _.concat(fix, dynamic, root);
  }

  /**
   * 构建treeGrid的column
   * @returns {Array}
   */
  buildColumn() {
    const fix = this.key.fix.map(s => {
      const code = typeof s === 'string' ? s : s.code;

      //指标达成
      let renderIndexFix = (row, dataField, value, rowData) => {
        const content = rowData.nodeCode
          ? '[' + rowData.nodeCode + ']' + (rowData.nodeName ? rowData.nodeName : '-')
          : rowData.nodeName;
        return '<span title="' + content + '">' + content + '</span>';
      };

      let renderHead = (name) => {
        const noSort = s.sort ? '' : 'no-sort';
        return `<div title="${name}" class="head-render-box ${noSort}">${name}</div>`;
      };

      let renderIndexFixNoOver = (row, dataField, value, rowData) => {
        const content = rowData.operationsName;

        if (this.key.popover && content != '整体合计') {
          if (rowData.nodes || this.key.tab == 1 || this.key.tab == 6) {
            //有子节点的处理逻辑
            let item = {};
            this.table.data.forEach(i => {
              if (i.operationsName == value) {
                item = angular.copy(i);
              }
            });
            _.forIn(item, (val, key) => {
              if (key.includes('Code') || key.includes('newProductYear') || key.includes('brandId')) {
                item.code = val;
              }
            });
            if (row <= 1) item.position = 'right-top';
            if (row >= this.table.data.length - 2) item.position = 'right-bottom';
            if (item.productId) item.code = angular.copy(item.productId);

            if (item.productId) {
              item.code = angular.copy(item.productId);
              item.showCode = angular.copy(item.productCode);
            }
            if(value.includes(`[${item.productCode}]`) || value.includes(`[${item.code}]`))
              item.func = (data) => this.tool.filterName(item.productCode ? this.tool.filterName(data, `[${item.productCode}]`) : data, `[${item.code}]`);
            item.templateName = "popover_tree.html";

            let aTab = this.tool.buildPopover(value, item.code || row, item, this);
            if (item) {
              return aTab;
            } else {
              return
            }
          } else {
            //没有子节点的处理逻辑
            if (rowData.parent) {
              let item = {};
              let parentValue = rowData.parent.operationsName;
              this.table.data.forEach(i => {
                if (i.operationsName === parentValue) {
                  item = angular.copy(i);
                }
              });
              if (row === '0_0')  item.position = 'right-top';
              if (row === `${this.table.data.length - 2}_2`)  item.position = 'right-bottom';
              _.forIn(item, (val, key) => {
                if (key.includes('Code') || key.includes('newProductYear') || key.includes('brandId')) {
                  item.code = val;
                }
                if (key.includes('productId')) {
                  item.code = val;
                }
              });
              if(parentValue.includes(`[${item.productCode}]`) || parentValue.includes(`[${item.code}]`))
                item.func = (data) => this.tool.filterName(item.productCode ? this.tool.filterName(data, `[${item.productCode}]`) : data, `[${item.code}]`);
              let newRow = '';
              if (_.split(row, '_', 2)[0] !== '0') {
                newRow = _.split(row, '_', 2)[0] + _.split(row, '_', 2)[1];
              } else {
                newRow = this.table.data.length + _.split(row, '_', 2)[1];
              }
              item.abcType = rowData.abcTag;
              item.templateName = "popover_tree.html";
              let aTab = this.tool.buildPopover(parentValue, newRow, item, this);
              return aTab
            }
          }
        }
        else if(this.key.newSateAnalyze &&　!rowData.parent){ //新品状态页面 | (按品类组)
          let _Element;
          let [
            titleCate, titleCode
          ]  = [
            this.key.isNewCategory ? 'categoryName' : 'className',
            this.key.isNewCategory ? 'categoryCode' : 'classCode',
          ];
          const [rowName, midField] = [
            rowData[titleCate],
            this.InitData.filter( s => s[titleCate] === rowData[titleCate] )
          ];
          _Element = `<span title="${rowName}">`
            +`[${midField[0][titleCode]}]${rowName ? rowName : ''}</span>`;

          return _Element;
        } else {
          return '<span title="' + content + '">' + content ? content : '' + '</span>';
        }

      };

      const col = {
        dataField: code,
        sortable: s.sort ? s.sort : false,
        pinned: true
      };

      col.renderer = renderHead;

      let renderSurvey = (row, codeName, value, rowData) => {
        const content = rowData.operationsName;
        let midContent = '';
        if(codeName === 'categoryCode'){
          let [ code, level ] = [ rowData.categoryCode, rowData.level ];
          midContent = `<div><a href="javascript:void(0);" ng-click="PriceClickMethod(${code},${level})">${code}</a></div>`;
        }else{
          midContent = '<span title="' + content + '">' + content ? content : '' + '</span>';
        }
        return midContent;
      };

      // 树形结构行内点击事件定义
      this.ClickFunction();

      //指标达成
      if (this.indexConfig) {
        col.cellsRenderer = renderIndexFix;
        col.text = this.indexConfig.flag
          ? this.Field.common[code].name
          : this.CommonCon.indexComplete.storeTreeHeadName;
      }
      else if(this.key.brandSurvey) {
        col.cellsRenderer = renderSurvey;
        col.text = s.title ? s.title : this.Field.common[code].name;
      }
      else if(this.key.brandPrice){
        // 自定义field common指标
        let midField = this.key.fieldsSet
          ? Object.assign({}, this.Field.common, this.key.fieldsSet)
          : this.Field.common;
        col.cellsRenderer = renderIndexFixNoOver;
        col.text = s.title ? s.title : midField[code].name;
      } else{
        col.cellsRenderer = renderIndexFixNoOver;
        col.text = s.title ? s.title : this.Field.common[code].name;
      }

      if (s.max) col.maxWidth = s.max;
      if (s.min) col.minWidth = s.min;
      if (s.width) col.width = s.width;

      return col;
    });

    const dynamic = this.table.field.map(s => {
      // 所有指标的对照关系
      let _Field;

      _Field = this.Field.sale;

      //活动分析页面
      if(this.key.actCompare){
        _Field = Object.assign({}, this.Field.sale, this.Field.actAnalyze)
      }

      // 价格带页面
      if(this.key.brandPrice || (this.key.brandSurvey && this.key.brandSurvey.isBrand)){
        _Field = this.indexComplete.MergeField(this.Field.sale, this.Field.brandStructure)
      }

      // 新品分析
      if(this.key.newSateAnalyze){
        _Field = Object.assign({}, this.Field.sale, this.Field.newSate)
      }

      const curr = this.indexConfig
        ? this.Field[this.indexConfig.curName][s]
        : (this.otherConfig.fieldName ? this.Field[this.otherConfig.fieldName][s] : _Field[s]);

      if (curr) {
        //ignore 不显示这个指标
        if (curr.ignore) return;

        let renderHead = (name) => {

          if (this.key.tab) {
            //abc表格添加自定义排序功能
            if (curr.sale) {
              this.sortByNum = 0;
              return `<div ng-click="ctrl.sortBy('${name}')" title="${name}(万元)" class="head-render-box text-right">${name}(万元)<i style="padding: 0px 10px" ng-if="${this.key.sortBy != 'abcTagName' && this.nowSort == name}" class="fa fa-play fa-rotate-${this.key.sortNum == 1 ? 270 : 90}"></i></div>`;
            }else {
              return `<div ng-click="ctrl.sortBy('${name}')" title="${name}" class="head-render-box text-right">${name}<i style="padding: 0px 10px" ng-if="${this.key.sortBy != 'abcTagName' && this.nowSort == name}" class="fa fa-play fa-rotate-${this.key.sortNum == 1 ? 270 : 90}"></i></div>`;
            }
          }else if(this.key.brandPrice){
            let Unit = '';
            if(curr.sale){
              Unit = '(万元)';
            }else if(curr.chief){ Unit = '(元)' }
            return `<div class="head-render-box text-right">${name}${Unit}</div>`;
          }else {
            if (this.key.headerWrap) name = this.basicService.buildTitle(curr, name);
            if (this.icon && curr.icon) {
              const isArray = angular.isArray(curr.icon);
              if (isArray && curr.icon[1].includes(this.key.pageId) || angular.isString(curr.icon)) {
                let content = this.$templateCache.get(`${isArray ? curr.icon[0] : curr.icon}.html`);
                content = content.replace("<div>", "").replace("</div>", "");
                return `<div title="${content}" class="head-render-box text-right"><i class="glyphicon glyphicon-info-sign"></i>${name}</div>`;
              }
            }
            return `<div class="head-render-box text-right">${name}${unit}</div>`;
          }

        };

        const confSort = this.key.confSort || [];

        const col = {
          dataField: s,
          sortable: confSort.includes(s) ? false: true, // 非排序字段设置
          text: curr.name,
          align: "right",
          cellsAlign: "right"
        };

        //跨行head
        if (curr.rowSpan) {
          col.columnGroup = curr.operation ? s.replace(/[0-9]/ig, '') : s;
        }

        col.renderer = renderHead;

        //手动设置宽度
        col.minWidth = this.key.minWidth ? this.key.minWidth : 200;
        if (curr.graph == 2) col.minWidth = 220;
        if (curr.width) col.minWidth = curr.width;
        if (curr.fixWidth) {
          col.minWidth = curr.fixWidth;
          col.width = curr.fixWidth;
        }

        let formatData;
        let unit = '';

        // 监听父级 | （新品状态页面）
        this.scope.$on(this.CommonCon.changeNewYear, (e,d) => { this.key.newYear = d });

        // 新品状态点击事件
        this.scope.newStateMethod = (ele, one, two) => {
          this.newService.newMethod(this, ele, one, two, this.key.type);
        };

        // 新品状态获取当前状态
        this.scope.OwnMethod = (one, two, sta) => {
          this.newService.OwnMethod(this, one, two, sta, this.key.type);
        };

        col.cellsRenderer = (row, column, value, rowData) => {
          if (_.isUndefined(value) || _.isNull(value) || value === "" || value === this.Symbols.least) {
            return this.Symbols[curr.infinite ? 'infinite' : 'bar'];
          }
          // 行内指标参数验证
          if (curr.sale) {
            unit = '元';
            formatData = Math.abs(value) < 50 && Math.abs(value) > 0
              ? this.figure.amount(value, 4)
              : this.figure.amount(value);
          } else {
            let mid_number = !_.isUndefined(curr.point) ? curr.point : 2;
            formatData = this.figure.thousand(value, mid_number);
          }
          //abc部分 涉及百分比的需要加颜色区分
          if (this.key.tab) {
            if (curr.scale && curr.name.includes('增幅')) {
              formatData = this.figure.scale(value, true, true);
              return `<div style="color:${value > 0 ? 'red' : '#05BC90'}">${formatData}</div>`
            } else {
              if (curr.scale) formatData = this.figure.scale(value, true, true);
            }
          } else {
            if (curr.scale) formatData = this.figure.scale(value, true, true);
          }

          // 特殊的增幅指标 即增长
          // 1. 基础指标非百分比，增长指标直接format --> inc === 1
          // 2. 基础指标为百分比，增长指标先乘以100再format --> inc === 2
          if (curr.inc) {
            formatData = this.figure.thousand(curr.inc === 1 ? value : value * 100);
          }

          // 当该指标数据不存在时 大多数情况format成 "-" 特殊指标format成 "∞"
          if (curr.infinite && _.isEqual(formatData, this.Symbols.bar)) {
            formatData = this.Symbols.infinite;
          }

          // 判断指标是否需要添加颜色
          if (curr.color) {
            let style = `color: ${_.isNumber(value) ? value < 0 ? 'green' : 'red' : ''}`;
            formatData = `<span style="${style}">${formatData}</span>`;
          }

          //筛选出占比
          const fields = angular.copy(this.table.field);
          const pctfields = fields.filter(d => {
            return d == column + 'Pct'
          });
          let formatData2 = '';

          if (curr.two && pctfields[0]) {//two 一个格子显示两个kpi
            const two = this.figure.scale(rowData[column + curr.two], true, true);
            formatData2 = two == this.Symbols.bar ? '' : `<br>(${two})`;
          }

          // 新品状态点击事件
          if(curr.rowClick){
            let Element;
            if(formatData === this.Symbols.bar){
              Element = `<span >${formatData}</span>`;
            }else{
              let midCatName = this.key.isNewCategory ? 'categoryName' : 'className';
              const [ midRow, uidPam]  = [
                this.InitData.filter( s => s[midCatName] === rowData[midCatName])[0], "" + rowData.uid
              ];
              let [ currValue, curLink ] = [
                !rowData.parent ? midRow[curr.addValue] : rowData[curr.addValue],
                curr.linkClick
              ];
              const [ pamOne, pamTwo ] = [
                + uidPam.split('_')[0], uidPam.split('_').length > 1 ? + uidPam.split('_')[1] : null
              ];
              if(curr.addValue){
                if(curr.usual) {
                  Element = `<span  style="cursor: pointer">`
                    + `<a href="javascript:;" ng-click="newStateMethod(${curLink},${pamOne},${pamTwo})">${formatData}</a></span>`
                }else{
                  Element = `<span  style="cursor: pointer">`
                    + `<a href="javascript:;" ng-click="newStateMethod(${curLink},${pamOne},${pamTwo})">${formatData}</a>`
                    +`<em>(${currValue})</em></span>`
                }
              }
              if(curr.ownState){
                const sta = curr.ownState[column];
                Element = `<span  style="cursor: pointer">`
                  + `<a href="javascript:;" ng-click="OwnMethod(${pamOne},${pamTwo},${sta})">${formatData}</a></span>`
              }
            }
            return Element;
          }


          if (curr.graph) { //图形 1箭头 2进度条
            return this.indexComplete.buildGraphHtml(curr.graph, value, curr);
          }

          // 价格带 | 指标
          // 1> 规格
          if(curr.spc || curr.brand || curr.nState){
            formatData = value;
            return `<div title="${formatData}">${formatData}</div>`
          }

          if(curr.chief){
            let mid_number = !_.isUndefined(curr.point) ? curr.point : 2;
            formatData = this.figure.thousand(value, mid_number);
            return `<div title="${formatData}元">${formatData}</div>`
          }

          // 2> 日期
          if(curr.date && value !== this.Symbols.bar){
            formatData = this.figure.dataTransform(value, 'YYYY/MM/DD');

            return `<div title="${this.figure.dataTransform(value)}">${formatData}</div>`
          } else {
            const data1 = curr.invalidFieldColor ? formatData
              : this.basicService.addColumnColor(value, formatData);

            const data2 = curr.invalidFieldColor ? formatData2
              : this.basicService.addColumnColor(value, formatData2);

            let content;
            content = curr.sale
              ? `<div class="ellipsis" title="${this.figure.thousand(value)}${unit}">${data1}${data2}</div>`
              : `<div class="ellipsis"><span>${data1}${data2}</span></div>`;
            return content
          }
        };
        return col;
      }
    });
    return _.compact(_.concat(fix, dynamic));
  }

  sortBy(name) {
    this.sortByNum++;
    if (this.sortByNum == 1) {
      this.nowSort = name;
      this.scope.$emit('sortBy', name);
    }
  }

  /**
   * 重置表格列宽
   */
  resizeTreeTable() {
    $(window).resize(() => {
      this.tool.resizeTree();
      this.compile($('#treeGrid'))(this.scope);
    });
  }

  goTab(id, ctrl) {
    let data = {
      id: id,
      ctrl: this,
    };
    switch (this.key.tab) {
      case 1:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 11)[0];
        this.interfaceName = 'getDataByDate';
        break;
      case 2:
        // 初始化cat type下拉框
        this.catType = angular.copy(this.CommonCon.classLevels);
        this.newCatType = angular.copy(this.CommonCon.classLevels);
        this.currCatType = this.catType[0].id;
        this.current = this.Pop.types.filter(s => s.id === 4)[0];
        //动态获取tab切换的index、调用不同的接口！
        this.interfaceName = 'getClassForABC';
        this.isCatOrClass = true;
        break;
      case 3:
        // 初始化cat type下拉框
        this.newCatType = angular.copy(this.CommonCon.catLevels);
        this.catType = angular.copy(this.CommonCon.catLevels);
        this.currCatType = this.catType[0].id;
        this.current = this.Pop.types.filter(s => s.id === 2)[0];
        this.interfaceName = 'getDataByCategory';
        this.isCatOrClass = true;
        break;
      case 4:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 6)[0];
        this.interfaceName = 'getABCBrandChartTable';
        break;
      case 5:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 1)[0];
        this.interfaceName = 'getDataByStore';
        break;
      case 6:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 7)[0];
        this.interfaceName = 'getDataByProduct';
        break;
      case 7:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 3)[0];
        this.interfaceName = 'getDataByOperation';
        break;
      case 8:
        //动态获取tab切换的index、调用不同的接口！
        this.current = this.Pop.types.filter(s => s.id === 12)[0];
        this.interfaceName = 'getDataByNewProduct';
        break;
    }

    if (this.currPopover.abcType) {
      data.tags = [this.currPopover.abcType];
    }
    this.scope.$emit('goTab', data);
  }

  // 行内点击事件集合
  ClickFunction(){
    this.scope.PriceClickMethod = (code, level) =>{
      const basicData = this.InitData;
      let midParam;
      // 根据categoryCode取得行列的信息
      function StArr(ele) {
        let Arr = [];
        ele.map( s => s.nodes).forEach( a => Arr = [...Arr,...a] );
        return Arr;
      }

      if(basicData){
        if(level === 0){
          let zero = _.indexOf(basicData.map(s => s.categoryCode), code);
          midParam = basicData[zero];
        }

        if(level === 1){
          let ArOne = StArr(basicData);
          let one = _.indexOf(ArOne.map(s => s.categoryCode), code);
          midParam = ArOne[one];
        }

        if(level === 2){
          let ArTwo = StArr(basicData);
          let midTwo = StArr(ArTwo);
          let two = _.indexOf(midTwo.map(s => s.categoryCode), code);
          midParam = midTwo[two];
        }

        if(level === 3){
          let ArThree = StArr(basicData);
          let midThree = StArr(ArThree);
          let basThree = StArr(midThree);
          let three = _.indexOf(basThree.map(s => s.categoryCode), code);
          midParam = basThree[three];
        }

        if(level === 4){
          let ArFour = StArr(basicData);
          let midFour = StArr(ArFour);
          let basFour = StArr(midFour);
          let endFour = StArr(basFour);
          let four = _.indexOf(endFour.map(s => s.categoryCode), code);
          midParam = endFour[four];
        }

        midParam.level = midParam.categoryLevel;

        this.scope.$emit(this.CommonCon.brandTreeGridClick, midParam);
      }
    };

  }

}


angular.module('SmartAdmin.Directives').component('treeGrid', {

  templateUrl: 'app/directive/business/treeGrid/treeGrid.tpl.html',
  controller: TreeGridController,
  controllerAs: "ctrl",
  bindings: {
    table: '<',
    key: '<',
    show: '<'
  }
});
