class DatePickerController {
  constructor($scope) {
    this.scope = $scope;

    this.changeEvent = 'date-changed';

    this.config = {
      startView: 'day',
      minView: 'day',
      modelType: 'moment',
      renderOn: this.changeEvent,
      dropdownSelector: '.dropdown-toggle'
    };
  }

  init() {
    moment.locale('zh-cn');

    const key = this.key;

    this.format = key.format ? key.format : 'YYYY-MM-DD';

    this.scope.$watch("ctrl.date", newVal => {
      if (!newVal) return;

      this.pickerDate = typeof newVal !== 'object' ? moment(newVal, "YYYYMMDD") : newVal;
      this.value = this.pickerDate.format(this.format);

      // 表示当前获取的date是否为异步获取(true: 异步)
      const mode = key.mode;

      if (mode) {
        this.max = key.max ? key.max(newVal) : moment(newVal, "YYYYMMDD");
        this.min = key.min ? key.min(newVal) : null;
      } else {
        this.max = key.max ? moment(key.max, "YYYYMMDD") : null;
        this.min = key.min ? moment(key.min, "YYYYMMDD") : null;
      }

      this.beforeRender = this.beforeRenderFunc;
    });
  }

  beforeRenderFunc($view, $dates) {
    if ($view === 'year' || $view === 'month') return;

    if (this.max) {
      $dates.filter(date => this.filter(date))
        .forEach(date => date.selectable = false);
    }
  }

  filter(date) {
    let filter = this.min ? date.localDateValue() < this.min.valueOf() : false;

    if (this.max) {
      filter = filter || date.localDateValue() > this.max.valueOf();
    }
    return filter;
  }

  dateChange() {
    this.scope.$broadcast(this.changeEvent);

    this.value = this.pickerDate.format(this.format);
    this.date = this.pickerDate.format("YYYYMMDD");
  }
}


/**
 * 单个日期选择控件
 *
 * @param date 选中的日期 Date
 * @param key  配置项
 *
 * 当date为异步数据时 max min 根据date进行配置 并且类型为function
 *
 * key: {
 *  min: 最小日期 默认（明天） string类型 YYYYMMDDD
 *  max: 最大日期 无默认值 string类型 YYYYMMDDD
 *  format: 日期的格式化 默认（YYYY-MM-DD）
 * }
 */
angular.module("SmartAdmin.Directives").component("singleDatePicker", {
  templateUrl: "app/directive/common/date.single.picker/date.single.picker.tpl.html",
  controller: DatePickerController,
  controllerAs: "ctrl",
  bindings: {
    date: "=",
    key: "<"
  }
});
