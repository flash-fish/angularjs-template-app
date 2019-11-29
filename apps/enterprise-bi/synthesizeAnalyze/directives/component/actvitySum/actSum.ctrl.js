angular.module('app.datas').directive('actSums', function (FigureService) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="hs-sum">' +
    '  <div class="field-box">' +
    '    <div class="one-field" ng-repeat="s in showList" ng-style="{\'min-width\': minWidth + \'px\'}">' +
    '      <p>{{s.name}}</p>' +
    '      <p title="{{s.hoverData}}">{{s.data}}<span>{{s.key.sale ? \'万元\' : s.key.unit ? s.key.unit : ""}}</span></p>' +
    '      <p ng-if="s.diffData">' +
    '        <span>{{s.diffData.name}}</span>' +
    '        <span>{{s.diffData.data}}{{s.key.unit ? s.key.unit : ""}}</span>' +
    '      </p>' +
    '    </div>' +
    '  </div>' +
    '' +
    '  <div class="field-box">' +
    '    <div class="one-field" ng-repeat="s in endSumList" ng-style="{\'min-width\': minWidth + \'px\'}">' +
    '      <p>{{s.name}}</p>' +
    '      <p title="{{s.hovers}}{{s.unit ? s.unit : \'\'}}">{{s.val}}<span>{{s.ty ? s.ty : \'\'}}</span></p>' +
    '      <p ng-if="s.diffData">' +
    '        <span>{{s.diffData.name}}</span>' +
    '        <span>{{s.diffData.data}}{{s.key.unit ? s.key.unit : ""}}</span>' +
    '      </p>' +
    '    </div>' +
    '  </div>' +
    '' +
    '  <div ng-show="showMore">' +
    '    <toggle-button show="toggleHide" name="\'更多数据\'" local="null"></toggle-button>' +
    '  </div>' +
    '</div>',
    scope: {
      asum: '<',
      sum: '<',
      changes: '<',
      default: '<'
    },
    link: function ($scope, element) {

      $scope.toggleHide = true;
      $scope.showMore = true;
      $scope.changes_arr = [];
      $scope.minWidth = '180';
      $scope.getDom = function () {
        return {'width': element[0].offsetWidth};
      };

      const addDiff = () => {
        const code = "YoYValue";
        const sameTimeData = $scope.list.filter(s => s.id.includes(code));

        if (!sameTimeData.length) return;

        sameTimeData.forEach(s => {
          const nowData = $scope.list.find(l => _.eq(s.id.replace(code, ""), l.id));

          if (_.isNumber(s.originData) && nowData && _.isNumber(nowData.originData)) {
            const isSale = s.key.sale, isScale = s.key.scale;
            const point = !_.isUndefined(s.key.point) ? s.key.point : 2;

            const diffData = nowData.originData - s.originData;
            const data = isSale ? `${FigureService.amount(diffData)}万元` :
              isScale ? FigureService.scale(diffData, true, true) : FigureService.thousand(diffData, point);

            s.diffData = {data, name: "差值"};
          }
        });
      };

      const setList = () => {
        if (!$scope.list) return;

        $scope.toggleHide = false;

        // 根据当前加载时的dom容器宽度 判断最大值
        const width = angular.element(".hs-sum").width();
        $scope.count = _.floor(width / $scope.minWidth);

        $scope.showList = $scope.showMore ? $scope.list.slice(0, $scope.count) : $scope.list;
      };

      $scope.$watch('changes', n_val => {
        if (!n_val) return;
        $scope.toggleHide = false;
        $scope.changes_arr = _.clone(n_val);
        $scope.$watch('default', juVal => {
          if(!juVal) return;
          if(juVal.dateY){
            let change_one_arr = $scope.changes_arr;
            watchSum(change_one_arr);
          }else{
            let noCompare = $scope.changes_arr;
            _.forIn(noCompare, (value,key) => {
              if( key.match('YoYValue') ) { delete noCompare[key] }
            });
            watchSum(noCompare);
          }
        });
      });

      // 监听合计数据
      const watchSum = (changearr) => {
        $scope.$watch("sum", newVal => {
          if (!newVal) return;
          $scope.sumList = [];
          let SumKey = [], InitSum = [];
          let listenVal = _.clone(newVal);
          // 有值显示，无值补- 获取键值对合计
          _.forIn(changearr, (value,key) => { SumKey.push(key); });
          _.forIn(listenVal, (value,key) => { InitSum.push(key);  });

          // 重构合计结构
          _.forEach(SumKey , (s,i) => {

            if(InitSum.includes(s)){
              if (changearr[s].sale) {
                $scope.sumList.push(
                  {
                    name: changearr[s].name,
                    val: FigureService.amount(listenVal[s]),
                    hovers: FigureService.thousand(listenVal[s]),
                    ty: '万元',
                    unit: '元'
                  });
              } else{
                $scope.sumList.push( { name: changearr[s].name, val: listenVal[s] });
              }
            }else {
              $scope.sumList.push({ name: changearr[s].name,  val: '-' })
            }
          });

          $scope.endSumList = [];

        });
      };

      $scope.$watch($scope.getDom, newVal => {
        setList();
      }, true);


      $scope.$watch("asum", newVal => {
        if (!newVal) return;

        $scope.toggleHide = false;

        const flattenArray = _.flatten(newVal);
        $scope.list = flattenArray.filter(s => s.addSum || !s.name.includes("占比"));

        // 如果包含同期指标 需要计算同期差值
        addDiff();

        setList();
      }, true);

      $scope.$watch("toggleHide", newVal => {
        $scope.showList = !newVal ? $scope.list.slice(0, $scope.count) : $scope.list;
        $scope.endSumList = !newVal ? [] : $scope.sumList;
      });

    }
  }
});

