angular.module('SmartAdmin.Directives')
  .directive( 'dateCustomPicker', function ($compile, Symbols, dataService) {

    let buildRange = (staDate, date, businessMonth) => {
      let range = {}, resFormat = Symbols.normalDate, month = Symbols.normalMonth, newDate = date.toString();

      range[moment(newDate, resFormat).format(Symbols.slashMonth)] = {
        key: 'now',
        date: [moment(newDate, resFormat), moment(newDate, resFormat)]
      };
      range['月至今'] = {
        key: 'month-now',
        date: [moment(staDate, resFormat), moment(newDate, resFormat)]
      };
      range['年至今'] = {
        key: 'year-now',
        date: [moment(`${newDate.substring(0, 4)}01`, month), moment(businessMonth, month)]
      };

      return range;
    };

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        opts: '<'
      },
      compile: function () {
        return function ($scope, element, attrs, ngModel) {
          let el, opts, init, monthFormat, dayFormat, max, min, ranges, defineID, warnDefine, defineWarnInfo;
          const split_code = '-';
          // 配置 | defineID 定义时间插件存放ID容器 | defineWarnInfo 定义天数提示存放ID容器 | ranges 定义天数限制 | warnDefine 定义显示天数提示后缀
          moment.locale('zh-cn');
          el = $(element);
          opts = $scope.opts;
          // 配置style样式
          let style;
          style = 'width:auto; display:none; right:auto; top:34px; left:13px';


          defineID = opts.defineID ? opts.defineID : 'monthPicker';
          defineWarnInfo = opts.defineWarnInfo ? opts.defineWarnInfo : 'warnInfo';
          ranges = opts.ranges ? opts.ranges : [150, 12];
          warnDefine = opts.warnDefine ? opts.warnDefine : ', 请使用"自定义（财务月）"来选择更长时间';

          let dayRangeWarn = '最大日期范围为' + ranges[0] + '天'+ warnDefine,
            monthRangeWarn = '最大月份范围为' + ranges[1] + '个月;',
            yearCrossWarn = '起止时间不可以跨年',
            dateIsBeforeWarn = '终了日期不能在起始日期之前';

          monthFormat = Symbols.slashYear;
          dayFormat = Symbols.slashDate;
          // 动态插入datePicker到dom中
          let buildPicker = (style) => {
            const template =
              '<div id="' +
              defineID+
              '" ' +
              'class="daterangepicker dropdown-menu opensright show-calendar" style="' + style + '">' +
              '<div class="calendar second right">' +
              '<div class="calendar-date">' +
              '<datetimepicker class="customMonth" ng-model="opts.month2" data-on-set-time="endMonthOnSetTime()"' +
              'data-before-render="endMonthBeforeRender($view, $dates, $leftDate, $upDate, $rightDate)" ' +
              'data-datetimepicker-config="{startView:\'month\', minView:\'month\', modelType:\'moment\', renderOn: \'start-month-changed\'}"></datetimepicker>' +
              '<datetimepicker class="customDay" ng-model="opts.day2" data-on-set-time="endDateOnSetTime()"' +
              'data-before-render="endDateBeforeRender($view, $dates, $leftDate, $upDate, $rightDate)" ' +
              'data-datetimepicker-config="{startView:\'day\', minView:\'day\', modelType:\'moment\', renderOn: \'start-date-changed\' }"></datetimepicker>' +
              '</div>' +
              '</div>' +
              '<div class="calendar first left">' +
              '<div class="calendar-date">' +
              '<datetimepicker class="customMonth" ng-model="opts.month1" data-on-set-time="startMonthOnSetTime()" ' +
              'data-before-render="startMonthBeforeRender($view, $dates)"' +
              'data-datetimepicker-config="{startView:\'month\', minView:\'month\', modelType:\'moment\', renderOn: \'end-month-changed\'}"></datetimepicker>' +
              '<datetimepicker class="customDay" ng-model="opts.day1" data-on-set-time="startDateOnSetTime()"' +
              'data-before-render="startDateBeforeRender($view, $dates)"' +
              ' data-datetimepicker-config="{startView:\'day\', minView:\'day\', modelType:\'moment\', renderOn: \'end-date-changed\' }"></datetimepicker>' +
              '</div>' +
              '</div>' +
              '<div class="ranges">' +
              '<ul class="dateOptions"></ul>' +
              '<div class="range_inputs">' +
              '<button class="applyBtn btn btn-small btn-sm btn-success" type="button">确定</button>' +
              '<button class="cancelBtn btn btn-small btn-sm btn-default" type="button">取消</button>' +
              '</div>' +
              '</div>' +
              '<div class="warnStyle"><span id="' +
              defineWarnInfo +
              '"></span></div>' +
              '</div>';
            let compileFn = $compile(template);
            compileFn($scope, (c) => {
              $('body').append(c);
            });
          };
          buildPicker(style);

          // const monthPicker = $('#monthPicker');
          // const warnInfo = $('#warnInfo');
          const dateOptions = $('.dateOptions');
          const rangeDom = $(".ranges");

          init = () => {
            if (!$('#customMonth').hasClass('active') && !$('#customDay').hasClass('active')) {
              $('.calendar').addClass('display-none');
            }
            $('#currentDay').text(moment().format('MM/DD'));

            dateOptions.css("display", opts.onlyShowCustom ? 'none' : 'block');
            opts.onlyShowCustom
              ? rangeDom.addClass("hide-date-range")
              : rangeDom.removeClass("hide-date-range");
          };
          init();

          // 触发datePicker显示和隐藏
          el.on('click', (e) => {
            e.stopPropagation();

            const inputDate = ngModel.$modelValue.split(Symbols.bar);

            if (!$scope.end_date) {
              initDate(inputDate, () => {
                initEvent();
                if (!$scope.isCommon) resetOptionList();
              });
            } else {
              if ($scope.isCommon) {
                let isCommon, name = "";
                _.forIn($scope.range, (val, key) => {
                  const common = val.date[0].isSame(moment(inputDate[0], "YYYYMMDD"))
                    && val.date[1].isSame(moment(inputDate[1], "YYYYMMDD"));
                  if (common) {
                    isCommon = common;
                    name = val.key;
                  }
                });

                if (isCommon) {
                  dateOptions.find(".active").removeClass("active");
                  dateOptions.find(`.${name}`).addClass("active");

                } else resetOptionList();

              } else resetOptionList();
            }


            setTimeout(function () {
              $('#' + defineID).show();
            }, 100);
          });

          $('#' + defineID).on('click', (e) => {
            e.stopPropagation();
          });

          $(document).on('click', () => {
            $('#' + defineID).hide();
          });

          $('.applyBtn').on('click', () => {
            if ($('#customMonth').hasClass('active')) {
              ngModel.$setViewValue($scope.opts.month1.format(monthFormat) + split_code + $scope.opts.month2.format(monthFormat));
              ngModel.$render();
            } else {
              if($scope.opts.day1 && $scope.opts.day2){
                ngModel.$setViewValue($scope.opts.day1.format(dayFormat) + split_code + $scope.opts.day2.format(dayFormat));
                ngModel.$render();
              }
            }
            $('#' + defineID).hide();
          });
          $('.cancelBtn').on('click', () => {
            $('#' + defineID).hide();
            resetOptionList();
          });

          let changeOptionsStyle = (event, nodes) => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].innerText == event.target.innerText) {
                $(nodes[i]).addClass('active');
              } else {
                $(nodes[i]).removeClass('active');
              }
            }
          };

          let resetOptionList = () => {
            if (!ngModel.$modelValue) return;

            const dates = ngModel.$modelValue.split(Symbols.bar);

            // 当前格式是日，用户最后点击的是月，重置成日
            if (dates[0].length > 7) {
              $scope.opts.day1 = moment(dates[0], dayFormat);
              $scope.opts.day2 = moment(dates[1], dayFormat);

              $scope.opts.month1 = moment(dates[1], Symbols.normalMonth);
              $scope.opts.month2 = moment(dates[1], Symbols.normalMonth);
              $('#customDay').click();
            }

            // 当前格式是月，用户最后点击的是日，重置成月
            if (dates[0].length <= 7) {
              $scope.opts.day1 = moment($scope.end_date, Symbols.normalDate);
              $scope.opts.day2 = moment($scope.end_date, Symbols.normalDate);

              $scope.opts.month1 = moment(dates[0], Symbols.normalMonth);
              $scope.opts.month2 = moment(dates[1], Symbols.normalMonth);
              $('#customMonth').click();
            }

            // 日期配置 | 只显示月
            if (_.isEqual(opts.onlyShowCustom, "month")) {
              $('.customDay').addClass('display-none');
              $('.customMonth').removeClass('display-none');
            }

            // 日期配置 | 只显示日
            if (_.isEqual(opts.onlyShowCustom, "day")) {
              $('.customMonth').addClass('display-none');
              $('.customDay').removeClass('display-none');
            }
          };

          let initDate = (dates, func) => {

            dataService.getBaseMonth().then(res => {
              const sta_date = res.data.startDate;
              $scope.end_date = res.data.endDate;

              dataService.getMonthByDate($scope.end_date).then(resp => {

                const businessMonth = opts.maxDate ? opts.maxDate : resp.data.businessMonth;
                const min_date = parseInt(sta_date.toString().substring(0, 4)) - 2;

                // 将财务月保存到scope上
                $scope.businessMonth = moment(businessMonth, Symbols.normalMonth);

                // 构建range列表
                $scope.range = buildRange(sta_date, $scope.end_date, businessMonth);

                for (let key in $scope.range) {
                  const current = $scope.range[key];
                  const dates_range = current.date;
                  const isCommon = dates_range[0].isSame($scope.opts.day1)
                    && dates_range[1].isSame($scope.opts.day2);

                  const className = `${current.key} ${isCommon ? "active" : "normal"}`;
                  dateOptions.append(`<li class="${className}">${key}</li>`);

                  if (isCommon) $scope.isCommon = isCommon;
                }

                // 初始化最大值和最小值和最大区间范围
                max = opts.maxDate ? opts.maxDate : moment($scope.end_date, Symbols.normalDate);

                // 默认为去年年初
                min = opts.minDate ? opts.minDate : moment(`${min_date}0101`, Symbols.normalDate);

                // 对非自定义的选项进行样式和传值的处理
                let nodeList = document.querySelectorAll('.dateOptions li.normal');
                for (let i = 0; i < nodeList.length; i++) {
                  let node = nodeList[i];
                  $(node).on('click', (event) => {

                    $scope.isCommon = true; // 标识用户点击的是共通配置的日期

                    $('.daterangepicker').width('auto');
                    $('.calendar').addClass('display-none');

                    changeOptionsStyle(event, $('.dateOptions li'));

                    const name = $(node).text();
                    const format = $scope.range[name].date[0]._f === Symbols.normalMonth ? monthFormat : dayFormat;
                    const value = $scope.range[name].date[0].format(format) + split_code + $scope.range[name].date[1].format(format);

                    ngModel.$setViewValue(value);
                    ngModel.$render();

                    $('#' + defineWarnInfo).text('');
                    $('#' + defineID).hide();
                  });
                }

                // 自定义tab 相关设置
                dateOptions.append('<li id=\'customDay\'>自定义(日)</li>');
                dateOptions.append('<li id=\'customMonth\'>自定义(财务月)</li>');

                $('#customMonth').on('click', (event) => {
                  $('#' + defineID).find('button.applyBtn').removeAttr('disabled');
                  changeOptionsStyle(event, $('.dateOptions li'));
                  $('.customDay').addClass('display-none');
                  $('.customMonth').removeClass('display-none');
                  $('.calendar').removeClass('display-none');

                  // 先清掉warn信息 判断当前选择日期是否合理 不合理设置warn信息
                  toggleStyle($scope.opts.month2.diff($scope.opts.month1, 'month') + 1 > ranges[1], false);
                });

                $('#customDay').on('click', (event) => {
                  $('#' + defineID).find('button.applyBtn').removeAttr('disabled');
                  changeOptionsStyle(event, $('.dateOptions li'));
                  $('.customMonth').addClass('display-none');
                  $('.customDay').removeClass('display-none');
                  $('.calendar').removeClass('display-none');

                  // 先清掉warn信息 判断当前选择日期是否合理 不合理设置warn信息
                  toggleStyle($scope.opts.day2.diff($scope.opts.day1, 'day') + 1 > ranges[0], true);
                });

                func();
              });
            });

          };

          $scope.$on('$destroy', function () {
            return $('#' + defineID).remove();
          });

          // type 0: 正常, 1: 日期超过范围, 2: 月份超过范围 3: 跨年 4:起始日期>结束日期
          function toggleStyle(type) {
            $('#' + defineWarnInfo).text('');
            const apply = $('#' + defineID).find('button.applyBtn');
            if (!type) {
              apply.removeAttr('disabled');
              return;
            }

            $('#' + defineWarnInfo).text(type === 1 ? dayRangeWarn : type === 2 ? monthRangeWarn : type === 3 ? yearCrossWarn: dateIsBeforeWarn);
            apply.attr('disabled', 'disabled');
          }

          function checkDateRange(date1, date2, type) {
            let result = 0;
            // 跨年
            if (date1.year() !== date2.year() && opts.noCrossYear) result = 3;
            // 日期超范围
            else if (type === 'day') {
              let range_one = date2.diff(date1, 'day');
              if (range_one + 1 > ranges[0]) result = 1;
              if (date2.isBefore(date1)) result = 4;
            } else if (type === 'month') {
              if (date2.diff(date1, 'month') + 1 > ranges[1]) result = 2;
              if (date2.isBefore(date1)) result = 4;
            }
            toggleStyle(result);
          }

          function initEvent() {
            $scope.endDateBeforeRender = endDateBeforeRender;
            $scope.endDateOnSetTime = endDateOnSetTime;
            $scope.startDateBeforeRender = startDateBeforeRender;
            $scope.startDateOnSetTime = startDateOnSetTime;

            $scope.endMonthBeforeRender = endMonthBeforeRender;
            $scope.endMonthOnSetTime = endMonthOnSetTime;
            $scope.startMonthBeforeRender = startMonthBeforeRender;
            $scope.startMonthOnSetTime = startMonthOnSetTime;

            function startMonthOnSetTime() {
              $scope.$broadcast('start-month-changed');
            }

            function endMonthOnSetTime() {
              $scope.$broadcast('end-month-changed');
            }

            function startDateOnSetTime() {
              $scope.$broadcast('start-date-changed');
            }

            function endDateOnSetTime() {
              $scope.$broadcast('end-date-changed');
            }

            function startDateBeforeRender($view, $dates) {
              // if ($view === 'year' || $view === 'month') return;
              let day2 = angular.copy($scope.opts.day2);
              let day1 = angular.copy($scope.opts.day1);
              if (day1) {
                $dates.filter(date => date.localDateValue() > max.valueOf() || date.localDateValue() < min.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.day1', function (newDay) {
                  if (!newDay) return;
                  checkDateRange(day1, day2, 'day');
                });
              }
            }

            function endDateBeforeRender($view, $dates) {
              // if ($view === 'year' || $view === 'month') return;
              let day2 = angular.copy($scope.opts.day2);
              let day1 = angular.copy($scope.opts.day1);
              if ($view === 'year') day1 = day1.startOf('year');
              if ($view === 'month') day1 = day1.startOf('month');

              if (day2) {
                $dates.filter(date => date.localDateValue() < min.valueOf() || date.localDateValue() > max.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.day2', function (newDay) {
                  if (!newDay) return;
                  checkDateRange(day1, day2, 'day');
                });
              }
            }

            function startMonthBeforeRender($view, $dates) {
              let month2 = angular.copy($scope.opts.month2);
              let month1 = angular.copy($scope.opts.month1);
              if (month1) {
                $dates.filter(date => date.localDateValue() > $scope.businessMonth.valueOf() || date.localDateValue() < min.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.month2', function (newMonth) {
                  if (!newMonth) return;
                  checkDateRange(month1, newMonth, 'month');
                });
              }
            }

            function endMonthBeforeRender($view, $dates) {
              let month2 = angular.copy($scope.opts.month2);
              let month1 = angular.copy($scope.opts.month1);
              if ($view === 'year') month1 = month1.startOf('year');

              if (month2) {
                $dates.filter(date => date.localDateValue() < min.valueOf() || date.localDateValue() > $scope.businessMonth.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.month2', function (newMonth) {
                  if (!newMonth) return;
                  checkDateRange(month1, newMonth, 'month');
                });
              }
            }
          }
        };
      },
    };
  });
