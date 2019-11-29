angular.module('app.datas').directive('sumBrand', function (FigureService, $window) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="hs-sum">' +
    '  <div class="field-box">' +
    '    <div class="one-field" ng-repeat="s in showList" ng-style="{\'min-width\': minWidth + \'px\'}">' +
    '      <p>{{s.name}}</p>' +
    '      <p title="{{s.hoverData}}">{{s.data}}<span>{{s.key.sale ? \'万元\' : s.key.unit ? s.key.unit : \'\'}}</span></p>' +
    '      <p ng-if="s.diffData">' +
    '        <span>{{s.diffData.name}}</span>' +
    '        <span>{{s.diffData.data}}{{s.key.unit ? s.key.unit : \'\'}}</span>' +
    '      </p>' +
    '    </div>' +
    '  </div>' +
    '  <div ng-show="showMore">' +
    '    <toggle-button show="toggleHide" name="\'更多数据\'" local="null"></toggle-button>' +
    '  </div>' +
    '</div>',
    scope: {
      sum: '<',
    },
    link: function ($scope, element) {

      $scope.minWidth = '220';

      $scope.getDom = function () {
        return {'width': element[0].offsetWidth};
      };

      $scope.wWidth =  function() {
        return { 'wWidth' : $window.innerWidth }
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

        $scope.showMore = $scope.list.length > $scope.count;
        $scope.showList = $scope.showMore ? $scope.list.slice(0, $scope.count) : $scope.list;
      };

      $scope.$watch($scope.getDom, newVal => {
        $scope.$watch($scope.wWidth, n => {
          let _Width = n.wWidth || '';

          if (_Width <= 1100 ) $scope.minWidth = '120';

          if(_Width > 1100 && _Width <= 1500) $scope.minWidth = '200';

          if(_Width > 1500 && _Width < 2000) $scope.minWidth = '260';
        },true);

        setList();

      }, true);


      $scope.$watch("sum", newVal => {
        if (!newVal) return;

        $scope.toggleHide = false;

        const flattenArray = _.flatten(newVal);
        $scope.list = flattenArray.filter(s => s.addSum || s.conf ? s.conf : !s.name.includes("占比"));

        // 如果包含同期指标 需要计算同期差值
        addDiff();

        setList();
      }, true);

      $scope.$watch("toggleHide", newVal => {
        if(!$scope.list) return;
        $scope.showList = !newVal ? $scope.list.slice(0, $scope.count) : $scope.list;
      });

    }
  }
});
