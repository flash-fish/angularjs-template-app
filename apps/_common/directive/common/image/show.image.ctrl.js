class ShowImageController {
  constructor($scope) {
    this.$scope = $scope;

    this.current = 0;
    this.hide = false;
  }

  init() {
    /**
     * 配置的具体参数
     * max: 最多显示的图片个数 默认为 4
     * updateOSS: 是否需要更新原始的url
     */
    const keys = this.keys;

    this.max = keys.max ? keys.max : 4;
    this.updateOSS = keys.updateOSS;

    this.$scope.$watch("hs.progress", newVal => {
      if (!newVal) return;

      this.show = newVal == 100;
    });

    this.$scope.$watch("hs.img", newVal => {
      if (!newVal) return;

      if (newVal instanceof Array) this.images = this.images.concat(newVal);
      else this.images.push(newVal);

      this.change();
    });
  }

  change() {
    this.hide = this.images.length >= this.max;

    if (this.hide) {
      this.images = this.images.slice(0, this.max);
    }
  }

  /**
   * 图片旋转
   * @param index
   */
  rotate(index) {
    this.current = (this.current + 90) % 360;

    if (this.updateOSS) {
      const name = "?x-oss-process=image/rotate,";
      const img = this.images[index];

      if (img.indexOf(name) >= 0) {
        const url = img.split(name);
        this.images[index] = url[0] + name + this.current;
      } else {
        this.images[index] += name + this.current;
      }
    } else {
      $(".image-cur")[index].style.transform =
        "rotate(" + this.current + "deg)";
    }
  }

  /**
   * 删除图片
   * @param index
   */
  delete(index) {
    this.images.splice(index, 1);

    this.change();
  }
}

angular.module("SmartAdmin.Directives").component("hsShowImage", {
  templateUrl: "app/directive/common/image/show.image.tpl.html",
  controller: ShowImageController,
  controllerAs: "hs",
  bindings: {
    img: "=", // 输入的图片
    images: "=", // 输出的图片URL list
    progress: "=", // 进度条
    keys: "=" // 配置项
  }
});
