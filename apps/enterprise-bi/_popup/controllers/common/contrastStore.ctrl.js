class ContrastStoreCtrl {
  constructor(context, $uibModalInstance, $scope, popupToolService, Pop, FigureService,
              basicService, dataService) {
    this.$scope = $scope;
    this.context = context;
    this.basic = basicService;
    this.figure = FigureService;
    this.dataService = dataService;
    this.popupTool = popupToolService;
    this.$uibModalInstance = $uibModalInstance;

    // 标识当前pop的类型
    this.type = Pop.types.filter(s => s.id === 1)[0];

    this.isMulti = true;

    this.param = angular.copy(this.context.param);

    this.options = [
      ["store", "门店"],
      ["operation", "业态"],
      ["district", "地区"],
      ["storeGroup", "店群"]
    ];

    this.field = [];
  }

  init() {
    const [start, end] = this.param.date.split("-");
    if (end.length < 8) {
      this.basic.packager(this.dataService.getBusinessMonthDateRangeWithDate(start.replace(/\//g, "")), startRes => {
        this.basic.packager(this.dataService.getBusinessMonthDateRangeWithDate(end.replace(/\//g, "")), endRes => {
          const startDate = startRes.data.startDate;
          const endDate = endRes.data.endDate;
          this.getList(startDate, endDate);
        })
      }, () => this.cancel())
    } else this.getList(start, end);
  }

  getList(start, end) {
    this.loading = true;
    this.dateArray = [start, end];

    this.basic.packager(this.context.promiseFunc(this.buildParam(...this.dateArray)), res => {
      this.loading = false;
      this.initList = res.data;
    }, () => this.cancel());
  }

  download() {
    this.dataService.downloadContrastStore({params: angular.toJson(this.buildParam(...this.dateArray, true))});
  }

  buildParam(start, end, isDownload) {
    const [handle, dataTransform, data_symbol ] = [
      this.basic.handleDate, this.figure.dataTransform, 'YYYY-MM-DD'
    ];
    let [ key, _Param]  = [
      {
        origin: "YYYY/MM/DD",
        format: start.toString().length > 7 ? data_symbol : "YYYY-MM"
      },
      { }
    ];

    if (!isDownload) {
      this.date = `${handle(start, key)} ~ ${handle(end, key)}`;
      key.subtract = [1, 'y'];
      let _Date;
      // 活动页面判断是否含有活动日期
      if(!_.isUndefined(this.param.other)){
        if( this.param.other.com_check ){
          const [ start_d, end_d] = [
            dataTransform(this.param.dateY.from,data_symbol),
            dataTransform(this.param.dateY.to,data_symbol)
          ];
          _Date = `${start_d} ~ ${end_d }`;
          _Param.lastStartDate = `${start_d}`;
          _Param.lastEndDate = `${end_d }`;
        }else _Date = `${handle(start, key)} ~ ${handle(end, key)}`;
      }else{
        _Date = `${handle(start, key)} ~ ${handle(end, key)}`;
      }
      this.vsDate = _Date;
    }

    let param = {
      startDate: moment(start, "YYYY/MM/DD").format("YYYY-MM-DD"),
      endDate: moment(end, "YYYY/MM/DD").format("YYYY-MM-DD")
    };

    _Param = Object.assign(_Param,param);

    this.options.forEach(o => {
      if (this.figure.haveValue(this.param[o[0]].val)) {
        _Param[o[0]] = this.param[o[0]].val.map(s => s.code);

        if (isDownload) return;

        const data = angular.copy(o);
        data.push(this.param[o[0]].val.map(s => s.name).join(" , "));
        this.field.push(data);
      }
    });

    return _Param;
  }

  //取消
  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module("hs.popups").controller("contrastStoreCtrl", ContrastStoreCtrl);
