class SupplierAbnormalCtrl {
  constructor($sce, CommonCon, DTColumnBuilder, tableService, dataService,
              FigureService, $scope, basicService, toolService, $compile, CommSearchSort,
              popupDataService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.sort = angular.copy(CommSearchSort);
    this.sort = _.omit(this.sort, ['date']);
    Object.assign(this.sort, {other: 1});

    this.interfaceName = 'getAbnormalSupplierBySales';

    this.instance = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      other: {
        modelType: this.CommonCon.saleOrProfit[0].id
      }
    }, ["product"], true);

    // 异步中需要处理的数据
    this.back = {finish: false};
    this.scope.$watch('ctrl.back', (newVal, oldVal) => {
      this.noInit = newVal.noInit;
      if (newVal.finish !== oldVal.finish)
        this.back.finish = true;
    }, true);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};
  }

  init() {
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));

    // 初始化构建dataTables
    this.buildColumn();

    this.basic.packager(this.dataService.getBaseDate(), res => {
      const date = res.data.baseDate;
      const start = moment(date, "YYYYMMDD").subtract(29, 'days').format("YYYY/MM/DD");
      this.date = `${start}-${moment(date, "YYYYMMDD").format("YYYY/MM/DD")}`;
    });

  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, null, ["other"], {
      job: this.job,
      reset: ['classes']
    });

    // 如果session（父子页面跳转）里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    if (this.basic.getSession('fromSupplierToAbnormal', true)) {
      let num = this.basic.getSession('fromSupplierToAbnormalIndex', true);
      console.log(num);
      if (num) this.com.other.modelType = this.CommonCon.saleOrProfit[num - 1].id;

    }

    this.curr = [this.com.other.modelType];

    if (this.com.operation.val.length > 0
      || this.com.district.val.length > 0
      || this.com.store.val.length > 0
      || this.com.storeGroup.val.length > 0) {
      this.visible = true;
    }

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['brand', 'supplier', 'district', 'storeGroup']);

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    }, true);
  }

  //切换 销售额/毛利额 指标时执行的内容
  search() {
    this.com.other.modelType === "allAmount"
      ? this.basic.setSession(this.CommonCon.session_key.hsField, ["allAmount"])
      : this.basic.setSession(this.CommonCon.session_key.hsField, ["allProfit"]);

    // 合并当前选中的值和权限中的值
    this.visible = this.com.operation.val.length > 0
      || this.com.district.val.length > 0
      || this.com.store.val.length > 0
      || this.com.storeGroup.val.length > 0;

    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, ["other"]);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.change = !this.change;
      this.buildColumn(this.change);
    });
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.other = this.CommonCon.saleOrProfit.find(s => s.id === com.other.modelType).name;
    this.sortCom = this.tool.dealSortData(com, this.sort, {other: {name: "异常维度"}});
  }

  /**
   * 构建column
   *
   * @param changed 用于重绘表格
   */
  buildColumn(changed) {
    const fix = [
      '_id',
      'supplierCode',
      {
        code: 'supplierName',
        render: (data) => {
          return this.tool.buildLink(data);
        },
      },
      {
        code: 'spAllAmount',
        title: this.com.other.modelType !== 'allAmount' ? '最近30天' + '</br>' + '毛利额(万元)' : '最近30天' + '</br>' + '销售额(万元)',
        class: 'text-right',
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true
      },
      {
        code: 'spAllAmountToTValue',
        title: this.com.other.modelType !== 'allAmount' ? '上个周期' + '</br>' + '毛利额(万元)' : '上个周期' + '</br>' + '销售额(万元)',
        class: 'text-right',
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
      },
      {
        code: 'spAllAmountToT',
        title: this.com.other.modelType !== 'allAmount' ? '毛利额' + '</br>' + '较上周期增幅' : '销售额' + '</br>' + '较上周期增幅',
        class: 'text-right',
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
      },
      {
        code: 'spRetailAmountToT',
        title: this.com.other.modelType !== 'allAmount' ? '毛利额(零售)' + '</br>' + '较上周期增幅' : '销售额(零售)' + '</br>' + '较上周期增幅',
        class: 'text-right',
        render: (data, a, b, meta) => {
          let formatData = this.FigureService.scale(data, true, true);
          let title = this.FigureService.number(b.spRetailAmountToTValue, true, true) + '万元' + '->' + this.FigureService.number(b.spRetailAmount, true, true) + '万元';
          return data > -0.1 ? `<span style="background-color:yellow" title="${title}">${formatData}</span>` : `<span title="${title}">${formatData}</span>`
        },
      },
      {
        code: 'storeCountToT',
        title: '有销售门店数' + '</br>' + '较上周期增幅',
        class: 'text-right',
        render: (data, a, b) => {
          let formatData = this.FigureService.scale(data, true, true);
          let title = this.FigureService.thousand(b.storeCountToTValue, 0) + '家' + '->' + this.FigureService.thousand(b.storeCount, 0) + '家';
          return data < -0.2 ? `<span style="background-color:yellow" title="${title}">${formatData}</span>` : `<span title="${title}">${formatData}</span>`
        },
        visible: this.visible,
      },
      {
        code: 'productCountToT',
        title: '有销售商品数' + '</br>' + '较上周期增幅',
        class: 'text-right',
        render: (data, a, b) => {
          let formatData = this.FigureService.scale(data, true, true);
          let title = this.FigureService.thousand(b.productCountToTValue, 0) + '个' + '->' + this.FigureService.thousand(b.productCount, 0) + '个';
          return data < -0.2 ? `<span style="background-color:yellow" title="${title}">${formatData}</span>` : `<span title="${title}">${formatData}</span>`
        },
      },
      {
        code: 'spHotAllAmountToTSummary',
        title: `<span title="上周期按销售额/毛利额排名前3的商品"><i class="glyphicon glyphicon-info-sign"></i>热销单品</br>较上周期增幅</span>`,
        class: 'text-right',
        render: (data, a, b) => {
          let hot = b.hotProductBeans ? '(' + b.hotProductBeans.length + '个热销单品' + ')' : '';
          let formatData = this.FigureService.scale(data, true, true);
          let title = '';
          if (b.hotProductBeans) {
            b.hotProductBeans.forEach((v, i) => {
              let spec = v.spec !== '-' ? '_' + v.spec : '';
              title += '[' + v.productId + ']' + v.productName + spec + "->" + this.FigureService.scale(v.spHotAllAmountToT, true, true) + "\n";
            });
          }
          return data < -0.3 ? `<span style="background-color:yellow" title="${title}">${formatData}${hot}</span>` : `<span>${formatData}</span>`
        },
      },
      {
        code: 'analysis',
        title: '分析',
        class: 'text-right'
      },
    ];

    const column = this.tableService.fixedColumn(fix);

    if (!_.isUndefined(changed)) {
      if (changed)
        column.push(this.DTColumnBuilder.newColumn("_id").notVisible());
    }

    this.column = column;
  }

  /**
   * 构建表格数据
   */
  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.curr),
      addSum: false,
      special: {
        pageId: this.CommonCon.page.page_supplier_warning
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {
        pageLength: 100,
        fixed: 3,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 3,
      })
      .withOption("rowCallback", (row, aData) => this.rowCallback(row, aData));
  }

  rowCallback(row, rowData) {
    angular.element('.a-link', row).unbind('click').click(() => {

      const com = angular.copy(this.copyCom);
      com.date  = this.date;
      this.tool.goSupplierDetail(com, this.back, rowData, "app.supAnalyse.subSaleStock");
    });
  }

  /**
   * popup 接口
   */

  // 门店
  openStoreList() {
    const promise = this.popupDataService.openStore({selected: this.com.store.val});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupDataService.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 品类组
  openClasses() {
    const promise = this.popupDataService.openClass({selected: this.com.classes.val});

    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 地区
  openDistrict() {
    const promise = this.popupDataService.openDistrict({selected: this.com.district.val});

    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  // 业态
  openOperation() {
    const promise = this.popupDataService.openOperation({selected: this.com.operation.val});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupDataService.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

}


angular.module("hs.supplier.adviser").controller("supplierAbnormalCtrl", SupplierAbnormalCtrl);

