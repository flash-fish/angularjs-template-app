class abcController {
  constructor($state) {

    const info = {
      from: $state.$current.name,
      title: $state.$current.data.title
    };

    $state.go("app.abcAnalyze.structureABC", {info: angular.toJson(info)});
  }
}

angular.module("hs.classesAnalyze.menu").controller("abcCtrl", abcController);
