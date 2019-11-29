class IndexChartCtrl {
  constructor($http, FigureService, Field, $scope, basicService, toolService, dataService, CommonCon, indexCompleteService) {
    this.figure = FigureService;
    this.$http = $http;
    this.Field = Field;
    this.scope = $scope;
    this.tool = toolService;
    this.dataService = dataService;
    this.basicService = basicService;
    this.CommonCon = CommonCon;
    this.indexComplete = indexCompleteService;

    this.isNotNull =true;
    this.radarTitle = '';
    this.flag = false;
    this.section = {
      active: 1
    };
  }

  init() {
    this.scope.$watch("ctrl.cur", newVal => {
      if ($.isEmptyObject(newVal)) return;

      if(newVal.null){
        //接口返回data不存在时 chart不显示
        this.isNotNull = false;
      }else{
        this.isNotNull = true;
        this.row = newVal;
        this.indexRowSelect(this.row)
      }

    });

    this.trendSelect = this.CommonCon.indexLineSelect[this.params.curName];
    this.interfaceName = this.params.treeInterfaceName;
    this.interfaceLineName = this.params.chartInterfaceName;
    this.select = '1';
  }

  /**
   * 指标达成页面的行点击事件
   */
  indexRowSelect(row) {
    this.flag = true;

    //只有点击了行才能显示chart
    this.show = true;
    this.row = row;

    if(row) this.radar = this.indexComplete.getRaderChart(row, this.params);

    //开始月和结束月相等时 不执行
    if (this.params.condition.date.from != this.params.condition.date.to) {
      this.getLineData(row)
    }
  }

  /**
   * 折线图
   */
  getLineChart(data, select) {
    this.trend = this.indexComplete.buildIndexLineChart(data, select, {
      showLabel: this.showLineLabel
    });
  }

  /**
   * 获取折线图的数据
   */
  getLineData(row) {
    //构建折线图的请求参数
    let params = this.indexComplete.buildLineParams(row, this.params, this.select);

    this.basicService.packager(this.dataService[this.interfaceLineName](params), res => {
      this.trendData = [];

      this.trendData = res.data;

      this.radarTitle = row.nodeCode ? '[' + row.nodeCode + ']' + (row.nodeName ? row.nodeName : '-') : (row.nodeName ? row.nodeName : '-');

      this.getLineChart(this.trendData, this.trendSelect[parseInt(this.select) - 1]);

    });
  }

  /**
   * 查找匹配的行
   * data：接口返回数据
   * row：当前行数据
   */
  findNode(data, row) {
    const levels = this.params.flag ? this.CommonCon.indexClassLevel : this.CommonCon.indexStoreLevel;

    let d = data.filter(i => {
      if (row.nodeName == '整体') {
        return true;
      } else {
        if (row.nodeCode && row[levels[0].code] && row[levels[1].code] && row[levels[2].code]) {
          return (i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code] && i[levels[1].code] == row[levels[1].code] && i[levels[2].code] == row[levels[2].code])
        } else if (row.nodeCode && row[levels[0].code] && row[levels[2].code]) {
          return (i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code] && i[levels[2].code] == row[levels[2].code])
        } else if (row.nodeCode && row[levels[0].code]) {
          return i.nodeCode == row.nodeCode && i[levels[0].code] == row[levels[0].code]
        }
      }
    });
    if (!d.length) {
      if (data[0].nodes) {
        data[0].nodes.forEach(p => {
          this.findNode([p], row)
        })
      }
    } else {
      row = d[0];
      this.radar = this.indexComplete.getRaderChart(row, this.params);
    }
  };


  /**
   * select变化时
   */
  changeTrend() {
    this.getLineData(this.row);
  }

}

angular.module('hs.synthesizeAnalyze').component('indexChart', {
  templateUrl: 'app/synthesizeAnalyze/directives/indexChart.tpl.html',
  controller: IndexChartCtrl,
  controllerAs: 'ctrl',
  bindings: {
    params: '<',
    cur: '<',
    show: '<'
  }
});
