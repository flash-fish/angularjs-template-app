angular.module('SmartAdmin.Directives')
  .directive('privilege', function () {
    return {
      restrict: 'E',
      template: `
      <div ng-if="warn" class="privilege-mask">
        <div style="background-image:url({{imageUrl}})"></div>
        <div>
          <div>
            <span>您没有权限,请购买高级版本</span>
            <a href="https://www.baidu.com" class="btn btn-primary">返回</a>
          </div>
        </div>
      </div>
      `,
      scope: {
        image: '<',
        warn: '='
      }
    };
  });
