class UploadImageController {
  constructor(Upload, $scope) {
    this.Upload = Upload;
    this.$scope = $scope;
  }

  init() {
    this.$scope.$watch("hs.file", file => {
      if (!file) return;

      this.upload(file);
      // this.img =
      //   "https://img.alicdn.com/imgextra/i2/1792368114/TB24_UaktFopuFjSZFHXXbSlXXa_!!1792368114.jpg";
      // this.progress = 100;
    });
  }

  upload(file) {
    this.Upload.upload({
      url: "/api/common/uploadCertFile",
      file: file
    })
      .progress(evt => {
        let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log("progress: " + progressPercentage + "% ");

        this.progress = progressPercentage;
      })
      .success((data, status, headers, config) => {
        this.img = data.data.filePath;
      })
      .error((data, status, headers, config) => {
        console.log("error status: " + status);
      });
  }
}

angular.module("SmartAdmin.Directives").component("hsUploadImage", {
  templateUrl: "app/directive/common/image/upload.image.tpl.html",
  controller: UploadImageController,
  controllerAs: "hs",
  bindings: {
    img: "=",
    progress: "="
  }
});
