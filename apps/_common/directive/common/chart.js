angular.module('SmartAdmin.Directives').directive('chart', function ($timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="chart-div"></div>',
    scope: {
      option: '<',
      event: '<',
      load: '<',
      resize: '&'
    },
    link: function ($scope, element) {

      let myChart = {};

      $scope.element = element;

      $scope.getDom = function () {
        return {
          'width': element[0].offsetWidth
        };
      };

      $scope.$on('$destroy', function () {
        return echarts.dispose(element[0]);
      });

      $scope.$watch($scope.getDom, newVal => {
        if ($scope.isResize) {
          $scope.isResize = false;
          return;
        }

        const width = newVal.width;

        if (!width) return;

        element.width(`${width}px`);
        myChart = echarts.getInstanceByDom(element[0]) || echarts.init(element[0]);


        if (this.initFinished && myChart && $scope.resize) {
          setTimeout(function () {
            $scope.resize({chart: myChart});
          }, 200);
        }

        $scope.$watch('load', newVal => {
          myChart.showLoading();
        });

        $scope.$watch('option', function (newOption) {

          if (!newOption) return;

          if (angular.isObject(newOption)) {
            const option = angular.copy(newOption);

            $timeout(() => {
              // 首页(首页切其他菜单，导致echart可能还画到一半就切了，调hideLoading时挂掉了）
              if (!myChart._zr.storage) return;

              myChart.hideLoading();

              let notMerge = true;
              if (!_.isUndefined(newOption.adjustOffset))
                delete newOption.adjustOffset;

              if (!_.isUndefined(newOption.notMerge)) {
                notMerge = newOption.notMerge;
                delete newOption.notMerge;
              }

              myChart.setOption(newOption, notMerge);

              // x轴文字换行配置
              if (!newOption.xAxisNoWrap) {
                setTimeout(function () {
                  xAxisUpdateName(myChart, newOption);
                }, 50);
              }

              // y轴轴线对齐
              if (option.adjustOffset) {
                setTimeout(adjustOffset, 50);
              }

              setTimeout(function () {
                const toolbox = myChart._componentsViews.find(s => s.__id.includes('0_toolbox'));
                if (!toolbox) return;

                const dataZoom = toolbox.group._children.find(s => s.__title === '区域缩放');
                if (dataZoom && dataZoom.__isEmphasis) dataZoom._$handlers.click[0].h();
              }, 100)

            }, 50);
          }

          // 映射事件监听
          emitWatch();
        });

        // 监听事件
        watchEvent();



        this.initFinished = true;

      }, true);

      function adjustOffset() {
        const chartDom = $(".hs-trend");
        if (!chartDom[1]) return;

        const saleChart =echarts.getInstanceByDom(chartDom[0]);
        const stockChart =echarts.getInstanceByDom(chartDom[1]);

        if (!saleChart._model || !stockChart || !stockChart._model) return;

        function getOffset(chart) {
          const domWidth = chart._dom.offsetWidth;
          const rect = chart._model._componentsMap._ec_xAxis[0].axis.grid._rect;
          const right = domWidth - (rect.x + rect.width);

          return { left: rect.x, right }
        }

        // 两个图表的场合 要保证y方向的轴线是对齐的
        const saleOffset = getOffset(saleChart);
        const stockOffset = getOffset(stockChart);

        function setGrid(type) {
          const leftDiff = saleOffset[type] - stockOffset[type];
          if (!leftDiff) return;

          const diffChart = leftDiff > 0 ? stockChart : saleChart;
          let grid = diffChart.getOption().grid[0];

          grid[type] = `${parseInt(grid[type].replace("px", "")) + Math.abs(leftDiff)}px`;

          diffChart.setOption({ grid });
        }

        setGrid("left");
        setGrid("right");

      }

      function xAxisUpdateName(myChart, option) {
        if (!option) return;

        // x轴数据
        const xAxis = option.xAxis;
        if (!xAxis) return;

        const data = _.isArray(xAxis) ? xAxis[0].data : xAxis.data;
        if (!data || !data.length) return;

        data.forEach((s, i) => {
          if (_.isString(s)) data[i] = s.split("\n").join("");
        });

        // 获取x轴模型对象
        const xAxisModel = myChart._model._componentsMap._ec_xAxis[0].axis.grid;
        const xAxisWidth = xAxisModel._rect.width;

        // 单个文字宽度
        const singleFontWidth = 11;

        // 单个类目所占用的宽度
        const singleBarWidth = (xAxisWidth / data.length) * 0.9;

        // 一行的字数
        const fontRowCount = Math.floor(singleBarWidth / singleFontWidth);

        // 最大行数，字数
        const maxRowCount = 4 ;
        const maxFontCount = fontRowCount * maxRowCount;

        data.forEach((s, index) => {
          const diff = maxFontCount - s.length;
          if(maxFontCount && diff < 0) {
            s = s.substr(0, maxFontCount - 3) + '...';
          }
          let splitName = s.split("");

          if (splitName.length <= fontRowCount) return;

          splitName.forEach((n, i) => {
            const currIndex = i + 1;

            if (currIndex % fontRowCount) return;

            splitName[i] = `${n}\n`;
          });

          data[index] = splitName.join("");
        });

        myChart.setOption({ xAxis })
      }


      function watchEvent() {
        /**
         * event 格式 {name: '', func: function}
         */
        $scope.$watch('event', function (event) {
          if (!event && typeof event === 'object') return;

          function bindEvent(event) {
            if (_.isUndefined(event)) return;
            myChart.off(event.name);

            if (angular.isFunction(event.func))
              myChart.on(event.name, event.func);
          }

          // 可能为数组 也可能为对象
          event instanceof Array ? event.forEach(s => bindEvent(s)) : bindEvent(event)

        }, true);
      }

      function emitWatch() {
        $scope.$on('LEGEND_CLICK', (e,d) => {
          console.log(d);
        })
      }

      // chart 大小自适应
      $(window).resize(_.throttle(() => {
        $scope.isResize = true;

        let ele = element[0];
        let width = $(ele).parent().width();

        if (!width) return;

        $(ele).width(width);

        let chart = echarts.getInstanceByDom(ele) || echarts.init(ele);
        chart.resize();

        if ($scope.resize) $scope.resize({chart});

        // x轴文字换行配置
        if ($scope.option && !$scope.option.xAxisNoWrap) {
          setTimeout(function () {
            xAxisUpdateName(chart, chart.getOption());
          }, 50);
        }
      }, 600));
    }
  };
});
