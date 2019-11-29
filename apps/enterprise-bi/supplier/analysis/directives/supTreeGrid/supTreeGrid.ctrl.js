class supTreeGridController {
  constructor($http, FigureService, Field, $rootScope, $scope, basicService, toolService,
              dataService, $sce, $compile, Pop, CommonCon, Common, indexCompleteService,
              Symbols, $templateCache, $window) {
    this.$http = $http;
    this.Field = Field;
    this.scope = $scope;
    this.Common = Common;
    this.$window = $window;
    this.Symbols = Symbols;
    this.tool = toolService;
    this.CommonCon = CommonCon;
    this.basic = basicService;
    this.figure = FigureService;
    this.dataService = dataService;
    this.sce = $sce;
    this.Pop = Pop;
    this.rootScope = $rootScope;
    this.compile = $compile;
    this.indexComplete = indexCompleteService;
    this.$templateCache = $templateCache;

    //指标达成
    this.flag = false;

    // 默认下拉品类组
    this.InitCatLevel = 2;

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
      if (newVal.data.length < 5 && newVal.data.length != 0 && this.key.tab) {
        let cha = 5 - newVal.data.length;
        for (let i = 0; i < cha; i++) {
          newVal.data.push({})
        }
      }
      this.key.finish = true;

      this.jqWidget();
      this.compile($('#treeGrid'))(this.scope);
    });

    // 监听排序字段
    $('#treeGrid').off('sort').on('sort', (e) => {
      // this.compile($('#treeGrid'))(this.scope);


    });

    // 供应商四象限分析方法
    this.quaMethod();
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

  /**
   * 重置表格列宽
   */
  resizeTreeTable() {
    $(window).resize(() => {
      this.tool.resizeTree();
    });
  }

  jqWidget() {
    const _table_data = this.table || {};
    const data = _table_data.data;

    const _table_field = this.table || {};
    const tableField = _table_field.field;

    const treeGrid = $('#treeGrid');

    // 遍历data 增补数据
    this.loopData(data, tableField);

    // 初始化基准数据
    this.InitData = angular.copy(data);

    // 默认显示总和行的
    this.indexCurRow = data.length ? data[0] : {'null': true};

    this.show = false;

    // 如果data为空 显示没有数据
    this.empty = !data || !data.length;

    // 绑定完成时会触发此事件。
    // 注意：在Grid初始化之前绑定到该事件
    // 因为如果数据将Grid绑定到本地数据源并在初始化后绑定到“bindingcomplete”事件，则数据绑定将已完成。
    treeGrid.off('bindingComplete').on('bindingComplete', (event) =>{
      this.setHeight();
      this.compile($('#treeGrid'))(this.scope);
    });

    let dataAdapter = new $.jqx.dataAdapter({
      dataType: 'json',
      dataFields: this.buildDataField(),
      hierarchy: {
        root:  this.key.root ? this.key.root : 'nodes',
      },
      localData: data
    });

    let treeGridConfig = {
      theme: 'energyblue',
      width: "100%",
      columnsHeight: 60,
      columnsResize: true,
      sortable: this.key.sort === 0 ? false : true,
      source: dataAdapter,
      enableHover: false,
      columns: this.buildColumn(),
    };

    // pageSize
    if (this.key.height) treeGridConfig.height = this.key.height;

    //跨行head
    if (this.key.columnGroups) treeGridConfig.columnGroups = this.key.columnGroups;

    treeGrid.jqxTreeGrid(treeGridConfig);

    //行展开
    treeGrid.off('rowExpand').on('rowExpand', (e) => {
      if (!this.key.noHeight) this.setHeight();
    });

    //行收起
    treeGrid.off('rowCollapse').on('rowCollapse', () => {
      if (!this.key.noHeight) this.setHeight();
    });

    // 回调函数在内部或不调用jqxGrid的render函数时调用。
    treeGrid.jqxTreeGrid({ rendered: () =>{
      this.compile($('#treeGrid'))(this.scope);
    }});

    //行选择事件
    treeGrid.off('rowSelect').on('rowSelect', e => {
      treeGrid.jqxTreeGrid({ width: '100%', });
    });

    // 初始化排序
    const field = this.key.sort ? this.table.field[0] : null;
    const sortDir = this.key.sortDir ? this.key.sortDir : 'desc';
    if (field) treeGrid.jqxTreeGrid('sortBy', field, sortDir);

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
      let renderHead = (name) => {
        return '<div title="' + name + '" class="head-render-box">' + name + '</div>';
      };

      const col = {
        dataField: code,
        sortable: s.sort ? s.sort : false,
        pinned: true
      };

      col.renderer = renderHead;

      // 供应商四象限分析
      if(this.key.supQuadrants){
        col.cellsRenderer = (row, codeName, value, rowData) => {
          const content = rowData.operationsName;
          let Ele = '', Judge;
          const bData = this.InitData;

          // 判断类别级别
          const Len = bData && bData.length === 1
            && + this.InitClaLevel === 4;

          _.forEach(bData, s => {
            Judge = s.details && s.details.length === 1
          });

          if(codeName === 'className'){
            // 树级别分别为  1\2
            if(rowData.level < 1){
              const _Code = bData[row] ? bData[row].classCode : '';
              if(Len){
                Ele = `<span>[${_Code}]${value}</span>`
              }else{
                Ele = '<span>' + `[${_Code}]`
                  + `<a style="margin-left: 5px;" href="javascript:;"`
                  + `ng-click="ctrl.quaFixMethod(${_Code})">${value}</a>`
                  + '</span>';
              }
            }else Ele = '<span>' + rowData['quadrantName'] + '</span>';
          }else{
            if(rowData.level < 1){
              Ele = '<span>' + value + '</span>';
            }else{
              const [InterMeEle, _Uid] = [
                `[${rowData.classCode}]${rowData['className']}`,
                rowData.uid.split(this.Symbols.underLine)[0]
              ];
              if(Judge){
                Ele = `<span>${InterMeEle}</span>`;
              }else{
                Ele = '<span>'
                  + `<a style="margin-left: 5px;" href="javascript:;" `
                  +`ng-click="ctrl.claFixMethod(${rowData.classCode}, ${_Uid})">`
                  +`${InterMeEle}</a>`
                  + '</span>';
              }
            }
          }
          return Ele;
        };
        col.text = s.title ? s.title : this.Field.common[code].name;
      }

      if (s.max) col.maxWidth = s.max;
      if (s.min) col.minWidth = s.min;
      if (s.width) col.width = s.width;

      return col;
    });

    const dynamic = this.table.field.map(s => {
      let _Field;

      _Field = this.Field.sale;

      //供应商四象限分析
      if(this.key.supQuadrants){
        _Field = Object.assign({}, this.Field.sale, this.Field.quadrant);
      }

      const curr = (this.otherConfig.fieldName ? this.Field[this.otherConfig.fieldName][s] : _Field[s]);

      if (curr) {
        //ignore 不显示这个指标
        if (curr.ignore) return;

        let renderHead = (name) => {
          let unit = curr.sale && !this.key.headerWrap ? '(万元)' : '';

          if (this.key.headerWrap) name = this.basic.buildTitle(curr, name);

          if (this.icon && curr.icon) {
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
        if (curr.rowSpan) col.columnGroup = curr.operation ? s.replace(/[0-9]/ig, '') : s;

        col.renderer = renderHead;

        //手动设置宽度
        col.minWidth = this.key.minWidth ? this.key.minWidth : 200;
        if (curr.graph == 2) col.minWidth = 220;
        if (curr.width) col.minWidth = curr.width;
        if (curr.fixWidth) {
          col.minWidth = curr.fixWidth;
          col.width = curr.fixWidth;
        }

        // 新品状态点击事件
        this.scope.quaRowMethod = (uidone, uidtwo) => {
          this.quaRowMethod(uidone, uidtwo);
        };

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

          if (curr.scale) formatData = this.figure.scale(value, true, true);

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


          if(curr.quaClick){
            let Element = '';

            if(rowData.parent && !this.key.jobAccessConf){
              const UID = rowData.uid;
              const [uidO, uidT]  = [
                UID.split(this.Symbols.underLine)[0], UID.split(this.Symbols.underLine)[1],
              ];
              Element = `<span  style="cursor: pointer">`
                + `<a href="javascript:;" ng-click="quaRowMethod(${uidO}, ${uidT}, 0)">`
                +`${formatData}</a></span>`;
            }else Element = `<span>${formatData}</span>`;
            return Element;
          } else {
            const data1 = curr.invalidFieldColor ? formatData
              : this.basic.addColumnColor(value, formatData);

            const data2 = curr.invalidFieldColor ? formatData2
              : this.basic.addColumnColor(value, formatData2);

            const content = curr.sale
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

  // 供应商四象限分析方法
  quaMethod(){
    this.tabEmitInfomation = 1;
    // 页面下拉映射
    this.scope.$on(this.key.cateLevelConf, (e,d) => {
      this.InitCatLevel = + d < 3;
      this.InitClaLevel = d;
    });

    // tab选项 订阅
    this.scope.$on(this.key.broadClasses, (e,d) => {
      this.tabEmitInfomation = d;
    });

    // 时间监听
    this.scope.$on(this.key.emitClaCondition, (e,d) => {
      this.quaDateEmitInfo = d.date;
    })
  }

  // 新品四象限页面跳转方法 | 品类组->象限
  quaFixMethod(code){
    const emitParam = {
      code: code,
      name: this.InitData.filter( s => s.classCode === code )[0].className
    };
    this.scope.$emit(this.key.supClaCode, emitParam);
    this.setHeight();
    this.compile($('#treeGrid'))(this.scope);
  }

  // 新品四象限页面跳转方法 | 象限->品类组
  claFixMethod(code, uid){
    const emitParam = {
      code: code,
      name: this.InitData[uid].details.filter( s => s.classCode === code )[0].className
    };

    this.scope.$emit(this.key.supClaCode, emitParam);
  }

  // 新品四象限页面跳转方法 | (供应商收益页面)
  quaRowMethod(uidone, uidtwo){
    let emitParam = {}, tabType = this.tabEmitInfomation;
    const basData = this.InitData[uidone];

    // 参数存 session
    const IniAr = basData.details;

    const supplierId = IniAr[uidtwo].supplierIds;
    emitParam.emitIndefication = 'supQuadrant';
    emitParam.quaDateEmitInfo = this.quaDateEmitInfo;
    emitParam.supplierId = supplierId;


    if(tabType === 1){
      emitParam.clasInfo = {
        level: basData.classLevel,
        name: basData.className,
        code: basData.classCode
      }
    }else {
      emitParam.clasInfo = {
        level: IniAr[uidtwo].classLevel,
        name: IniAr[uidtwo].className,
        code: IniAr[uidtwo].classCode
      };
    }

    // 存 session 当前象限数据的供应商数
    this.basic.setSession(this.Common.supplierIDCondition, emitParam);

    this.scope.$emit('treeClickClass', emitParam);

    let urls = window.document.location.href;
    urls = urls.replace("sup_quadrant", "sup_profit");

    let a = $('<a href="'+urls+'" target="_blank"></a>')[0];
    let e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
  }

}


angular.module('SmartAdmin.Directives').component('supTreeGrid', {

  templateUrl: 'app/supplier/analysis/directives/supTreeGrid/supTreeGrid.tpl.html',
  controller: supTreeGridController,
  controllerAs: "ctrl",
  bindings: {
    table: '<',
    key: '<',
    show: '<'
  }
});
