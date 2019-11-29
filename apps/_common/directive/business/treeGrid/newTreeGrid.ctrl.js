class NewTreeGridController {
  constructor($http, FigureService, Field, $scope, basicService, toolService,
              dataService, $sce, $compile, Pop, CommonCon, indexCompleteService,
              Symbols, $templateCache) {
    this.$http = $http;
    this.Field = Field;
    this.scope = $scope;
    this.Symbols = Symbols;
    this.tool = toolService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.basicService = basicService;
    this.sce = $sce;
    this.Pop = Pop;
    this.compile = $compile;
    this.indexComplete = indexCompleteService;
    this.$templateCache = $templateCache;

    //指标达成
    this.flag = false;
  }

  init() {
    //指标达成
    this.indexConfig = this.key.index;

    //默认需要排序，若不需要，sort设置为fasle
    if (this.key.sort === undefined) {
      this.key.sort = true;
    }

    this.scope.$watch("ctrl.table", newVal => {
      if (!newVal) return;
      this.key.finish = true;
      this.jqWidget();
      this.compile($('#treeGrid'))(this.scope);
    });
  }

  loopData(data, tableField) {
    if (!tableField) return;

    data.forEach(s => {
      tableField.forEach(f => {
        if (_.isUndefined(s[f])) s[f] = this.Symbols.least;
      });

      if (!s.nodes || !s.nodes.length) return;

      this.loopData(s[this.key.root], tableField);
    });
  }

  jqWidget() {
    const data = this.table.data;
    const tableField = this.table.field;
    const treeGrid = $('#treeGrid');

    // 遍历data 增补数据
    this.loopData(data, tableField);

    // 指标达成页面
    // 默认显示总和行的
    this.indexCurRow = data.length ? data[0] : {'null': true};

    this.show = false;

    // 如果data为空 显示没有数据
    this.empty = !data || !data.length;

    let dataAdapter = new $.jqx.dataAdapter({
      dataType: 'json',
      dataFields: this.buildDataField(),
      hierarchy: {
        root: this.key.root
      },
      localData: data
    });

    let treeGridConfig = {
      width: "100%",
      columnsHeight: 60,
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
    treeGrid.off('rowExpand').on('rowExpand', () => {
      //noHeight 不需要固定高度
      if (!this.key.noHeight) this.setHeight();
      this.compile($('#treeGrid'))(this.scope);
    });

    //行收起
    treeGrid.off('rowCollapse').on('rowCollapse', () => {
      if (!this.key.noHeight) this.setHeight();
      this.compile($('#treeGrid'))(this.scope);
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

    const dynamic = this.table.field.map(s => {
      return {name: s, type: 'number'}
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
      const col = {
        dataField: code,
        sortable: s.sort ? s.sort : false,
        pinned: true
      };

      col.renderer = (name) => {
        const noSort = s.sort ? '' : 'no-sort';
        return `<div title="${name}" class="head-render-box ${noSort}">${name}</div>`;
      };

      col.text = s.title ? s.title : this.Field.common[code].name;

      if (s.cellsRenderer) col.cellsRenderer = s.cellsRenderer;

      if (s.max) col.maxWidth = s.max;
      if (s.min) col.minWidth = s.min;
      if (s.width) col.width = s.width;

      return col;
    });

    const dynamic = this.table.field.map(s => {

      // 所有指标的对照关系
      const curr = this.key.detailField ? this.Field[this.key.detailField][s] : this.Field.sale[s];

      if (curr) {
        //ignore 不显示这个指标
        if (curr.ignore) return;

        let renderHead = (name) => {

          let unit = curr.sale && !this.key.headerWrap ? '(万元)' : '';

          if (this.key.headerWrap) name = this.basicService.buildTitle(curr, name);

          if (curr.icon) {
            const isArray = angular.isArray(curr.icon);
            if (isArray && curr.icon[1].includes(this.key.pageId) || angular.isString(curr.icon)) {
              let content = this.$templateCache.get(`${isArray ? curr.icon[0] : curr.icon}.html`);
              content = content.replace("<div>", "").replace("</div>", "");
              return `<div title="${content}" class="head-render-box text-right"><i class="glyphicon glyphicon-info-sign"></i>${name}</div>`;
            }
          }
          return `<div class="head-render-box text-right">${name}${unit}</div>`;
        };

        const col = {
          dataField: s,
          text: curr.name,
          align: "right",
          cellsAlign: "right"
        };

        //跨行head
        if (curr.rowSpan)
          col.columnGroup = curr.operation ? s.replace(/[0-9]/ig, '') : s;

        col.renderer = renderHead;

        //手动设置宽度
        col.minWidth = this.key.minWidth ? this.key.minWidth : 200;
        if (curr.graph === 2) col.minWidth = 220;
        if (curr.minWidth) col.minWidth = curr.minWidth;
        if (curr.fixWidth) {
          col.minWidth = curr.fixWidth;
          col.width = curr.fixWidth;
        }

        let formatData;
        let unit = '';

        col.cellsRenderer = (row, column, value, rowData) => {
          if (_.isUndefined(value) || _.isNull(value) || value === "" || value === this.Symbols.least) {
            return this.Symbols[curr.infinite ? 'infinite' : 'bar'];
          }

          if (curr.sale) {
            unit = '元';
            formatData = Math.abs(value) < 50 && Math.abs(value) > 0
              ? this.figure.amount(value, 4)
              : this.figure.amount(value);
          } else {
            let mid_number = !_.isUndefined(curr.point) ? curr.point : 2;
            formatData = this.figure.thousand(value, mid_number);
          }

          let color = '';
          if (curr.scale) {
            formatData = this.figure.scale(value, true, true);
            if (curr.color) color = value <= 0 ? 'green' : 'red';
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

          if (curr.graph) {//图形 1箭头 2进度条
            return this.indexComplete.buildGraphHtml(curr.graph, value, curr);
          } else {
            return curr.sale
              ? `<div class="ellipsis" title="${this.figure.thousand(value)}${unit}" style="color: ${color}">${formatData}${formatData2}</div>`
              : `<div class="ellipsis"><span title="${formatData}${formatData2}" style="color: ${color}">${formatData}${formatData2}</span></div>`;
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
}


angular.module('SmartAdmin.Directives').component('newTreeGrid', {

  templateUrl: 'app/directive/business/treeGrid/treeGrid.tpl.html',
  controller: NewTreeGridController,
  controllerAs: "ctrl",
  bindings: {
    table: '<',
    key: '<',
    show: '<'
  }
});
