angular.module('SmartAdmin.Directives')
  .directive('dateMonthPicker', function ($compile, Symbols, dataService) {
    let buildRange = (date) => {
      let range = {}, resFormat = Symbols.normalDate;
      range[moment(date, resFormat).format(Symbols.slashMonth)] = [moment(date, resFormat), moment(date, resFormat)];
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
          let el, opts, monthFormat, dayFormat, max, min, ranges;
          const split_code = '-';
          const style = 'width:auto; display:none; right:auto; top:34px; left:13px';

          moment.locale('zh-cn');
          el = $(element);
          opts = $scope.opts;
          ranges = opts.ranges ? opts.ranges : [36, 12];

          let dayRangeWarn = '最大日期范围为' + ranges[0] + '天, 请使用"自定义（财务月）"来选择更长时间',
            monthRangeWarn = '最大月份范围为' + ranges[1] + '个月;';

          monthFormat = Symbols.slashYear;
          dayFormat = Symbols.slashDate;
          // 动态插入datePicker到dom中
          let buildPicker = (style) => {
            const template =
              '<div id="monthPicker" class="daterangepicker monthPicker dropdown-menu opensright show-calendar" style="' + style + '">' +
              '<div class="calendar second right">' +
              '<div class="calendar-date">' +
              '<datetimepicker class="customMonth" ng-model="opts.month2" data-on-set-time="endMonthOnSetTime()"' +
              'data-before-render="endMonthBeforeRender($view, $dates, $leftDate, $upDate, $rightDate)" ' +
              'data-datetimepicker-config="{startView:\'month\', minView:\'month\', modelType:\'moment\', renderOn: \'start-month-changed\'}"></datetimepicker>' +
              '</div>' +
              '</div>' +
              '<div class="calendar first left">' +
              '<div class="calendar-date">' +
              '<datetimepicker class="customMonth" ng-model="opts.month1" data-on-set-time="startMonthOnSetTime()" ' +
              'data-before-render="startMonthBeforeRender($view, $dates)"' +
              'data-datetimepicker-config="{startView:\'month\', minView:\'month\', modelType:\'moment\', renderOn: \'end-month-changed\'}"></datetimepicker>' +
              '</div>' +
              '</div>' +
              '<div class="range_inputs">' +
              '<button class="applyBtn btn btn-small btn-sm btn-success" type="button">确定</button>' +
              '<button class="cancelBtn btn btn-small btn-sm btn-default" type="button">取消</button>' +
              '</div>' +
              '<div class="warnStyle"><span id="warnInfo"></span></div>' +
              '</div>';
            let compileFn = $compile(template);
            compileFn($scope, (c) => {
              $('body').append(c);
            });
          };
          buildPicker(style);

          const monthPicker = $('#monthPicker');
          const warnInfo = $('#warnInfo');
          const dateOptions = $('.dateOptions');

          // 触发datePicker显示和隐藏
          el.on('click', (e) => {
            e.stopPropagation();
            monthPicker.show();
          });

          monthPicker.on('click', (e) => {
            e.stopPropagation();
          });

          $(document).on('click', () => {
            resetOptionList();
            monthPicker.hide();
          });

          $('.date-picker').on('click', () => {
            resetOptionList();
          });


          // get 财务月区间
          $scope.$watch("opts.date", newVal => {
            if (!newVal) return;

            // 初始化自定义日和自定义月的日期
            initDate(newVal.split(Symbols.bar));
            initEvent();
          });

          $('.applyBtn').on('click', () => {
            ngModel.$setViewValue($scope.opts.month1.format(monthFormat) + split_code + $scope.opts.month2.format(monthFormat));
            ngModel.$render();

            monthPicker.hide();
          });

          $('.cancelBtn').on('click', () => {
            monthPicker.hide();
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

            $scope.opts.month1 = moment(dates[0], Symbols.normalMonth);
            $scope.opts.month2 = moment(dates[1], Symbols.normalMonth);

          };

          let initDate = (dates) => {

            dataService.getBaseMonth().then(res => {
              const sta_date = res.data.startDate;
              const end_date = res.data.endDate;

              dataService.getMonthByDate(end_date).then(resp => {
                const min_date = parseInt(sta_date.toString().substring(0, 4)) - 1;

                $scope.opts.month1 = moment(dates[0], Symbols.normalMonth);
                $scope.opts.month2 = moment(dates[1], Symbols.normalMonth);


                // 构建range列表
                let range = buildRange(end_date);
                for (let key in range) {
                  const dates_range = range[key];
                  const isCommon = dates_range[0].isSame($scope.opts.day1)
                    && dates_range[1].isSame($scope.opts.day2)
                    && dates[0].length > 7;

                  let li = ``;
                  if (isCommon) {
                    li = `<li class="active">${key}</li>`;
                    $scope.isCommon = isCommon;
                  }

                  dateOptions.append(li);
                }

                // 初始化最大值和最小值和最大区间范围
                opts.maxDate ? max = opts.maxDate : max = moment(end_date, Symbols.normalDate);
                opts.minDate ? min = opts.minDate : min = moment(min_date + '0101', Symbols.normalDate);

                // 对非自定义的选项进行样式和传值的处理
                let nodeList = document.querySelectorAll('.dateOptions li.normal');
                for (let i = 0; i < nodeList.length; i++) {
                  let node = nodeList[i];
                  $(node).on('click', (event) => {

                    $scope.isCommon = true; // 标识用户点击的是共通配置的日期
                    $('.daterangepicker').width('auto');
                    $('.calendar').addClass('display-none');
                    changeOptionsStyle(event, $('.dateOptions li'));
                    let name = $(node).text();
                    let value = range[name][0].format(dayFormat) + split_code + range[name][1].format(dayFormat);
                    ngModel.$setViewValue(value);
                    ngModel.$render();

                    warnInfo.text('');
                    monthPicker.hide();
                  });
                }

              });
            });

          };

          $scope.$on('$destroy', function () {
            return monthPicker.remove();
          });

          function toggleStyle(isShow, isDay) {
            warnInfo.text('');
            if (isShow) {
              warnInfo.text(isDay ? dayRangeWarn : monthRangeWarn);
              monthPicker.find('button.applyBtn').attr('disabled', 'disabled');
            } else
              monthPicker.find('button.applyBtn').removeAttr('disabled');
          }

          function initEvent() {
            $scope.endMonthBeforeRender = endMonthBeforeRender;
            $scope.endMonthOnSetTime = endMonthOnSetTime;
            $scope.startMonthBeforeRender = startMonthBeforeRender;
            $scope.startMonthOnSetTime = startMonthOnSetTime;

            function startMonthOnSetTime() {
              $scope.$broadcast('start-month-changed');
              console.log($scope.opts.month1.format(monthFormat) + split_code + $scope.opts.month2.format(monthFormat))
            }

            function endMonthOnSetTime() {
              $scope.$broadcast('end-month-changed');
              console.log($scope.opts.month1.format(monthFormat) + split_code + $scope.opts.month2.format(monthFormat))
            }

            function startMonthBeforeRender($view, $dates) {
              if ($view === 'year') return;
              let month2 = $scope.opts.month2;
              let month1 = $scope.opts.month1;
              if (month1) {
                $dates.filter(date => date.localDateValue() > month2.valueOf() || date.localDateValue() < min.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.month2', function (newMonth) {
                  if (!newMonth) return;
                  let range_month = newMonth.diff(month1, $view) + 1;
                  toggleStyle(range_month > ranges[1], false);
                });
              }
            }

            function endMonthBeforeRender($view, $dates) {
              if ($view === 'year') return;
              let month2 = $scope.opts.month2;
              let month1 = $scope.opts.month1;
              if (month2) {
                $dates.filter(date => date.localDateValue() < month1.valueOf() || date.localDateValue() > max.valueOf())
                  .forEach(date => date.selectable = false);

                $scope.$watch('opts.month2', function (newMonth) {
                  if (!newMonth) return;
                  let range_month = newMonth.diff(month1, $view) + 1;
                  toggleStyle(range_month > ranges[1], false);
                });
              }
            }
          }
        };
      },
    };
  });
