angular.module("SmartAdmin.Factories")
  .constant("BasicColor", {
    normal: {color: "rgba(42, 128, 216, 0.5)", borderColor: "#2A80D8"},
    selected: {color: "rgba(255, 144, 92, 0.5)", borderColor: "#ff6f56"}
  })


  .factory("chartService", (basicService, BasicColor, alert) => {
    return {

      /**
       * chart容器大小发生变化时触发 需要重新计算graphic的位置
       * @param chart
       * @param chartBack
       */
      resizeChart(chart, chartBack) {
        if (!chart) return;

        let oldOption = chart.getOption();
        if (!oldOption || !oldOption.graphic || !oldOption.graphic.length) return;

        // 获取坐标轴刻度极值点偏移量
        chartBack.pixelPoint = chart.convertToPixel('grid', chartBack.point);
        const axis = this.getAxisCoordinate(chartBack.point, chartBack.axisMost, chart);

        // 计算y轴分割线的位置
        const yLine = oldOption.graphic[0].elements[1];
        yLine.position = axis.yPixelStart;
        yLine.shape = {y2: axis.yPixelEnd[1] - axis.yPixelStart[1]};

        // 计算x轴分割线的长度
        const xLine = oldOption.graphic[0].elements[2];
        xLine.position = axis.xPixelStart;
        xLine.shape = {x2: axis.xPixelEnd[0] - axis.xPixelStart[0]};

        // 计算矩形的位置和长宽
        const rectWidth = axis.xPixelEnd[0] - axis.xPixelStart[0];
        const rectHeight = axis.yPixelEnd[1] - axis.yPixelStart[1];
        const rect = oldOption.graphic[0].elements[0];
        rect.shape = {
          x: axis.xPixelStart[0],
          y: axis.yPixelStart[1],
          width: rectWidth,
          height: rectHeight
        };

        chart.setOption({
          graphic: oldOption.graphic
        });
      },

      /**
       * 处理散点图重复的点的场合
       * @param details 接口details数据
       * @param points 重复的点x, y轴数据名称
       * @param type 显示的数据类型
       */
      duplicatePoint(details, points, type) {
        let ba_data = [], newData = [];
        let dataCopy = details ? angular.copy(details) : [];

        _.forIn(_.groupBy(dataCopy, function(s) {
          return s[points[0]] + '' + s[points[1]];
        }), (val, key) => {
          if (val.length > 1) {
            const name = val.map(s => s[type.title]).join(",");
            val.forEach(s => s[type.title] = name);
            newData.push(...val);
          } else {
            newData.push(val[0]);
          }
        });


        newData.forEach(s => {
          ba_data.push([...points.map(p => s[p]), s[type.title], s[type.code]]);
        });

        return ba_data;
      },

      /**
       * 获取坐标轴刻度极值
       *
       * @param point 交叉点
       * @param axisMost 坐标轴极值点
       * @param chart 实例
       */
      getAxisCoordinate(point, axisMost, chart) {
        const yPixelStart = chart.convertToPixel('grid', [point[0], axisMost.yMax[1]]);
        const yPixelEnd = chart.convertToPixel('grid', [point[0], axisMost.yMax[0]]);

        const xPixelStart = chart.convertToPixel('grid', [axisMost.xMax[0], point[1]]);
        const xPixelEnd = chart.convertToPixel('grid', [axisMost.xMax[1], point[1]]);

        return {xPixelStart, xPixelEnd, yPixelStart, yPixelEnd};

      },

      /**
       * 获取坐标系中点的平均值
       *
       * @param newData
       * @returns {Array}
       */
      getPoint(newData) {
        const point = [];
        [0, 1].forEach(i => {
          point.push(basicService.average(newData.map(s => s.value[i])));
        });

        return point;
      },

      /**
       * 获取坐标轴刻度极值 以及 偏移量
       *
       * @param chart
       * @param key
       */
      getAxisMost(chart, key) {
        key = key || {};

        // 获取坐标轴刻度极值
        const yScale = chart._model._componentsMap._ec_yAxis[0].axis.scale;
        const xScale = chart._model._componentsMap._ec_xAxis[0].axis.scale;

        const yMax = key.logAxis ? yScale._extent.map(s => {return Math.pow(yScale.base, s)}) : yScale._extent;
        const xMax = key.logAxis ? xScale._extent.map(s => {return Math.pow(xScale.base, s)}) : xScale._extent;

        // 获取坐标轴刻度极值点偏移量
        const yMaxPixel = chart.convertToPixel('grid', [xMax[0], yMax[1]]);
        const xMaxPixel = chart.convertToPixel('grid', [xMax[1], yMax[0]]);

        return {xMax, xMaxPixel, yMax, yMaxPixel};
      },

      /**
       * 追加 chart graphic属性
       *
       * @param option chart 配置
       * @param back 影响当前页面作用域的值
       * @param key 定制化的配置
       *
       * key : {
       *    dom: 默认id == 'graphicChart'
       * }
       */
      appendGraphic(option, back, key) {
        key = key || {};

        let newData = option.series[0].data;
        if(angular.isArray(newData) && !newData.length)
          return;
        const onePoint = newData.find(n => n.value.length && !_.isUndefined(n.value[0]) && !_.isUndefined(n.value[1]));
        if(!onePoint)
          return;

        const domSelector = key.dom || "graphicChart";

        const chartDom = $(`#${domSelector}`);

        if (!chartDom.length) return;

        // 获取chart实例
        const chartInstance = echarts.getInstanceByDom(chartDom[0]);

        if (!chartInstance || !chartInstance._model)
          return;

        if (key.resetZoom) {
          chartInstance.dispatchAction({
            type: 'dataZoom',
            start: 0,
            end: 100,
          })
        }

        let vertex = "", relativeX = "", relativeY = "";
        let xDrag = 0, yDrag = 0;

        let backLastDataZoom = false;

        // 获取坐标轴刻度极值
        back.axisMost = this.getAxisMost(chartInstance, key);

        // 初始化区域缩放的点的集合
        back.zoomSelected = angular.copy(newData);

        const originPoint = this.getPoint(newData);
        back.point = angular.copy(originPoint);
        back.pixelPoint = chartInstance.convertToPixel('grid', back.point);

        const axis = this.getAxisCoordinate(back.point, back.axisMost, chartInstance);

        const rectWidth = axis.xPixelEnd[0] - axis.xPixelStart[0];
        const rectHeight = axis.yPixelEnd[1] - axis.yPixelStart[1];


        // 监听区域缩放事件
        chartInstance.off('dataZoom');
        chartInstance.on('dataZoom', (e) => {
          back.focusArea = false;

          if (backLastDataZoom) {
            if (_.isObject(e) && e.dataZoomIndex === 1) backLastDataZoom = false;
            return;
          }

          // 获取区域缩放后的点的集合
          const indices = chartInstance._chartsViews[0]._symbolDraw._data.indices;
          back.zoomSelected = indices.map(s => {return newData[s]});

          // 区域缩放完成后自动取消区域缩放选中状态
          const toolbox = chartInstance && chartInstance._componentsViews.length
            && chartInstance._componentsViews.find(s => s.__id.includes('0_toolbox'));
          if(!chartInstance || !toolbox) return;
          // 关闭区域缩放
          const dataZoom = toolbox.group._children.find(s => s.__title === '区域缩放');
          if (dataZoom && dataZoom.__isEmphasis) dataZoom._$handlers.click[0].h();

          // 选中空白区域时 不进行缩放
          if (!back.zoomSelected.length) {
            backLastDataZoom = true;

            chartInstance.dispatchAction({
              type: 'dataZoom',
              dataZoomIndex: 0,
              startValue: back.axisMost.xMax[0],
              endValue: back.axisMost.xMax[1],
            });

            chartInstance.dispatchAction({
              type: 'dataZoom',
              dataZoomIndex: 1,
              startValue: back.axisMost.yMax[0],
              endValue: back.axisMost.yMax[1],
            });

            //这个地方要将区域缩放还原关闭
            const resetZoom = toolbox.group._children.find(s => s.__title === '区域缩放还原');
            if (resetZoom && resetZoom.__isEmphasis) resetZoom._$handlers.click[0].h();

            return;
          }

          // 当前配置
          const oldOption = chartInstance.getOption();

          // 当前系列数据
          const series = oldOption.series[0];

          // 获取坐标轴刻度极值
          back.axisMost = this.getAxisMost(chartInstance, key);

          // 根据偏移量获取交点坐标
          back.point = chartInstance.convertFromPixel('grid', back.pixelPoint);

          // 获取坐标轴刻度极值点偏移量
          const axis = this.getAxisCoordinate(back.point, back.axisMost, chartInstance);
          const rectWidth = axis.xPixelEnd[0] - axis.xPixelStart[0];
          const rectHeight = axis.yPixelEnd[1] - axis.yPixelStart[1];

          // 重新计算分割线的位置和长度
          const graphic = oldOption.graphic[0];
          if (graphic) {
            // 计算x轴分割线的位置
            const xLine = graphic.elements[2];
            xLine.position = axis.xPixelStart;
            xLine.shape = {x2: axis.xPixelEnd[0] - axis.xPixelStart[0]};

            // 计算y轴分割线的位置
            const yLine = graphic.elements[1];
            yLine.position = axis.yPixelStart;
            yLine.shape = {y2: axis.yPixelEnd[1] - axis.yPixelStart[1]};
          }

          // 计算矩形的位置和长宽
          const rect = graphic.elements[0];
          rect.shape = {
            x: back.axisMost.yMaxPixel[0],
            y: back.axisMost.yMaxPixel[1],
            width: rectWidth,
            height: rectHeight
          };

          // 将当前标域透明
          series.markArea = {itemStyle: {normal: {color: 'rgba(255, 255, 255, 0)'}}};

          // 更新系列的颜色
          series.data.filter(s => s.itemStyle && s.itemStyle.normal.color === BasicColor.selected.color).forEach(s => {
            s.itemStyle = {normal: BasicColor.normal}
          });

          chartInstance.setOption({
            series: oldOption.series,
            graphic: oldOption.graphic
          });

        });


        function onLineXDragStart(e) {
          xDrag = e.offsetX;
          yDrag = e.offsetY;
        }

        const onLineXDragging = (e) => {
          const position = chartInstance.convertFromPixel('grid', e.target.position);
          back.point[0] = position[0];
          back.pixelPoint = chartInstance.convertToPixel('grid', back.point);

          // 垂直分割线不允许上下偏移
          if (e.offsetY !== yDrag)
            e.target.position[1] = chartInstance.convertToPixel('grid', [0, back.axisMost.yMax[1]])[1];

          // 垂直分割线最小偏移量 == y轴最大刻度水平方向偏移量
          if (back.pixelPoint[0] <= back.axisMost.yMaxPixel[0])
            e.target.position[0] = back.axisMost.yMaxPixel[0];

          // 垂直分割线最大偏移量 == x轴最大刻度水平方向偏移量
          if (back.pixelPoint[0] >= back.axisMost.xMaxPixel[0])
            e.target.position[0] = back.axisMost.xMaxPixel[0];


          setSeriesOption(back.point);
        };

        const onLineYDragging = (e) => {
          const position = chartInstance.convertFromPixel('grid', e.target.position);
          back.point[1] = position[1];
          back.pixelPoint = chartInstance.convertToPixel('grid', back.point);

          // 水平分割线不允许左右偏移
          if (e.offsetX !== xDrag)
            e.target.position[0] = chartInstance.convertToPixel('grid', [back.axisMost.xMax[0], 0])[0];

          // 水平分割线最小偏移量 == y轴最大刻度垂直方向偏移量
          if (back.pixelPoint[1] <= back.axisMost.yMaxPixel[1])
            e.target.position[1] = back.axisMost.yMaxPixel[1];

          // 水平分割线最大偏移量 == x轴最大刻度垂直方向偏移量
          if (back.pixelPoint[1] >= back.axisMost.xMaxPixel[1])
            e.target.position[1] = back.axisMost.xMaxPixel[1];

          setSeriesOption(back.point);
        };

        const setSeriesOption = (point) => {
          if (!vertex || !back.focusArea) return;

          back.filter = back.zoomSelected.filter(n => {
            const s = n.value;
            const xx = relativeX > 0 ? s[0] >= point[0] : s[0] <= point[0];
            const yy = relativeY > 0 ? s[1] >= point[1] : s[1] <= point[1];

            return xx && yy;
          });

          // Update markArea
          let oldOption = chartInstance.getOption();
          const series = oldOption.series[0];
          series.markArea.data = [[
            {coord: vertex},
            {coord: point}
          ]];


          // Update series color
          series.data.forEach(s => {
            const isSelected = back.filter.map(s => s.name).includes(s.name);
            s.itemStyle = {
              normal: isSelected ? BasicColor.selected : BasicColor.normal
            }
          });

          chartInstance.setOption({
            series: oldOption.series
          });

        };

        const click = (d, dx, dy) => {
          back.focusArea = true;

          const current = chartInstance.convertFromPixel('grid', [dx.offsetX, dx.offsetY]);
          back.point = chartInstance.convertFromPixel('grid', back.pixelPoint);

          relativeX = current[0] - back.point[0];
          relativeY = current[1] - back.point[1];

          back.filter = back.zoomSelected.filter(n => {
            const s = n.value;
            const xx = relativeX > 0 ? s[0] >= back.point[0] : s[0] <= back.point[0];
            const yy = relativeY > 0 ? s[1] >= back.point[1] : s[1] <= back.point[1];

            return xx && yy;
          });

          // 点击的时候获取line交点
          vertex = [back.axisMost.xMax[relativeX > 0 ? 1 : 0], back.axisMost.yMax[relativeY > 0 ? 1 : 0]];

          // Update markArea
          let oldOption = chartInstance.getOption();
          const series = oldOption.series[0];
          series.markArea = {
            z: 10,
            silent: true,
            itemStyle: {normal: {color: 'rgba(0, 122, 219, 0.15)'}},
            data: [[
              {coord: vertex},
              {coord: back.point}
            ]]
          };

          // Update series color
          series.data.forEach(s => {
            const isSelected = back.filter.map(f => f.name).includes(s.name);

            s.itemStyle = {
              normal: isSelected ? BasicColor.selected : BasicColor.normal
            }
          });

          chartInstance.setOption({
            series: oldOption.series
          });

        };

        const graphic = [
          {
            type: 'rect',
            z: 10,
            shape: {x: back.axisMost.yMaxPixel[0], y: back.axisMost.yMaxPixel[1], width: rectWidth, height: rectHeight},
            style: {
              fill: 'rgba(210, 210, 210, 0.1)'
            },
            onclick: echarts.util.curry(click, 0)
          },
          {
            type: 'line',
            z: 210,
            position: axis.yPixelStart,
            shape: {y2: axis.yPixelEnd[1] - axis.yPixelStart[1]},
            cursor: 'move',
            draggable: true,
            ondrag: echarts.util.curry(onLineXDragging),
            ondragstart: echarts.util.curry(onLineXDragStart),
            style: {stroke: '#28a87a', lineWidth: 2}
          },
          {
            type: 'line',
            z: 210,
            position: axis.xPixelStart,
            shape: {x2: axis.xPixelEnd[0] - axis.xPixelStart[0]},
            cursor: 'move',
            draggable: true,
            ondrag: echarts.util.curry(onLineYDragging),
            style: {stroke: '#28a87a', lineWidth: 2}
          }
        ];

        return Object.assign({notMerge: false}, {graphic}, option);
      },

      dataZoomOff(chartInstance, reset){
        const toolbox = chartInstance && chartInstance._componentsViews.length && chartInstance._componentsViews.find(s => s.__id.includes('0_toolbox'));
        // 区域缩放完成后自动取消区域缩放选中状态
        if(!chartInstance || !toolbox) return;
        // 关闭区域缩放
        const dataZoom = toolbox.group._children.find(s => s.__title === '区域缩放');
        if (dataZoom && dataZoom.__isEmphasis) dataZoom._$handlers.click[0].h();
        // 关闭区域缩放还原（由于title 可能被干掉了，“区域缩放还原”）
        const resetZoom = toolbox.group._children.find(s => s.__title === '' || s.__title === '区域缩放还原');
        if (resetZoom && resetZoom.__isEmphasis && reset) resetZoom._$handlers.click[0].h();
      },

      dataZoomOffAll(reset){
        const charts = $('.chart-div');
        for (let i = 0; i < charts.length; i++) {
          this.dataZoomOff(echarts.getInstanceByDom(charts[i]), reset);
        }
      },

      addZoomEvent(self, func, otherFunc) {
        return (p) => {

          const batch = _.isArray(p.batch) ? p.batch[0] : p.batch;
          if(_.isUndefined(batch.startValue) || _.isUndefined(batch.endValue)) return;
          const xData = self.sale.xAxis.data;
          //矩形缩放选择时取值会有边界溢出
          let startValue = xData[batch.startValue < 0 ? 0 : batch.startValue];
          let endValue = xData[batch.endValue > (xData.length-1) ? (xData.length-1) : batch.endValue];
          if(_.isUndefined(startValue) &&  _.isUndefined(endValue))
            return;
          else {
            _.isUndefined(startValue) ? startValue = angular.copy(endValue) : startValue;
            _.isUndefined(endValue) ? endValue = angular.copy(startValue) : endValue;
          }
          const date = startValue === endValue && startValue.length === 10 ? `${startValue}` : `${startValue}-${endValue}`;

          if(self.keys.barring_FutureDate && moment(endValue).isAfter(moment(self.keys.baseDate, 'YYYY/MM/DD'))) {
            this.dataZoomOffAll(true);
            alert('选择的日期不能含有未来日');
            return;
          }

          if(moment(startValue).isAfter(moment(self.keys.baseDate, 'YYYY/MM/DD'))) {
            this.dataZoomOffAll(true);
            alert('选择的日期不能全部是未来日');
            return;
          }

          const len = self.crumb.length;
          if (len) {
            const crumbDate = self.crumb[len - 1];
            if (len === 1 && date !== self.crumb[0] && crumbDate.length <= 7) {
              self.crumb.push(date);
            } else
              self.crumb[len - 1] = date;
          } else
            self.crumb.push(date);

          if (otherFunc) {
            otherFunc(date);
          }

          if(func) {
            const option = {startValue: batch.startValue, endValue: batch.endValue};
            func(date, option)
          } else {
            if (self.initShowFutureToggle) self.initShowFutureToggle();
            self.scope.$emit(self.CommonCon.dateChange, date.includes('-') ? date : `${date}-${date}`);
          }
          this.dataZoomOffAll();
        }
      },

      appendRectAndRegisterEvent(option, key) {
        key = key || {};

        let isMousedown = false;
        const domSelector = key.dom || "rectChart";
        const chartDom = $(`#${domSelector}`);

        if (!chartDom.length) return;

        // 获取chart实例
        const chartInstance = echarts.getInstanceByDom(chartDom[0]);
        if (!chartInstance || !chartInstance._model)
          return;

        // 注册series mousedown mouseup mouseout事件
        chartInstance.on('mousedown', (e) => mousedown(e));
        chartInstance.on('mouseup', (e) => mouseup(e));
        chartInstance.on('mouseout', (e) => mouseout(e));
        chartInstance.on('magictypechanged', (e) => {});

        // 扩展矩形范围
        function extendRect(rect) {
          const shape = angular.copy(rect);
          const extend = 20;

          shape.x -= extend;
          shape.y -= extend;
          shape.width += extend * 3 + 5;
          shape.height += extend * 2;

          delete shape.margin;
          return shape;
        }

        const rect = chartInstance._model._componentsMap._ec_xAxis[0].axis.grid._rect;
        const shape = extendRect(rect);

        function getEmphasis() {
          const child = chartInstance._componentsViews[0].group._children;
          return child.length ? child[0].__isEmphasis : false;
        }

        const mousedown = (e) => {
          if (!getEmphasis()) return;

          isMousedown = true;
        };

        function mouseup(e) {
          if (!getEmphasis()) return;

          isMousedown = false;
        }

        const mouseout = (e) => {
          if (!getEmphasis() || !isMousedown) return;

          const event = e;
          const rectOffsetXLeft = shape.x;
          const rectOffsetXRight = shape.x + shape.width;
          const rectOffsetYTop = shape.y;
          const rectOffsetYBottom = shape.y + shape.height;

          // 鼠标在按下的状态移出rect之外
          if (event.offsetX > rectOffsetXRight ||
            event.offsetX < rectOffsetXLeft ||
            event.offsetY < rectOffsetYTop ||
            event.offsetY > rectOffsetYBottom) {

            chartInstance._componentsViews[0].group._children[0]._$handlers.click[0].h();

            let dataZoom = chartInstance._componentsViews[0]._features.dataZoom;
            const brushCon = dataZoom._brushController;
            const covers = brushCon._covers;

            brushCon.group.remove(covers[0]);
            brushCon._covers.length = 0;
            brushCon._dragging = false;
          }
        };

        const graphic = [{
          shape,
          type: 'rect',
          style: {fill: 'rgba(210, 210, 210, 0)'},
          onmousedown: (e) => mousedown(e),
          onmouseup: (e) => mouseup(e),
          onmouseout: (e) => mouseout(e)
        }];

        chartInstance.setOption({ graphic })
      }
    }
  });
