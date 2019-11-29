class EditImageController {
  constructor($scope) {
    this.$scope = $scope;
    this.oWidth = "";
    this.oHeight = "";
    this.percent = 0;
    this.total = "";

    this.images = [];
    this.current = 0;

    // 放大或缩小的增减值
    this.resize = 100;

    this.params = {
      width: 500,
      height: 500,
      currentX: 0,
      currentY: 0
    };
  }

  init() {
    //解决拖动时，当鼠标移已框外时，兼听不到mouseUp，导致松开鼠标还可拖动问题
    $(window).mouseup(() => {
      this.mouseUp();
    });

    this.$scope.$watch("ctrl.img", newVal => {
      if (!newVal) return;

      console.log(newVal);
      /**
       *图片宽高初始化有以下两种情况：
       *情况1：当图片宽>高时：设宽为父元素的100%
       *情况2：当图片高>宽时：设宽为父元素的100%
       */

      //获取父元素即外层边框的宽高
      const parent = $(".image-container");
      const pWidth = parent.outerWidth();
      const pHeight = parent.outerHeight();

      //需放大的img
      const img = $(".image-cur");
      img.width(pWidth);
      let imgH = "";

      img.unbind("load");
      //图片加载完后执行
      img.load(() => {
        //需放大的img的高
        imgH = img.height();

        //获取图片的原始真实宽
        let originalImg = new Image();
        originalImg.src = img.attr("src");
        const oWidth = originalImg.width;

        if (img.height() > img.width()) {
          img.height(pHeight);
          img.width("auto");
        } else {
          //初始化img的父元素即外层边框的宽
          img.width(pWidth);
          img.height("auto");
        }

        //水平垂直居中
        img.css("top", (pHeight - img.height()) / 2 + "px");
        img.css("left", (pWidth - img.width()) / 2 + "px");

        //获取img的当前比例
        this.$scope.$apply(() => {
          this.total = img.width() / oWidth * 100;

          let originalImg = new Image();
          originalImg.src = img.attr("src");
          this.oWidth = originalImg.width;
          this.oHeight = originalImg.height;
          if (this.total > 200) {
            if (img.height() > img.width()) {
              img.height(this.oHeight * (200 / 100));
              img.width("auto");
            } else {
              img.width(this.oWidth * (200 / 100));
              img.height("auto");
            }
            //水平垂直居中
            img.css("top", (pHeight - img.height()) / 2 + "px");
            img.css("left", (pWidth - img.width()) / 2 + "px");
            //重新计算total
            this.total = img.width() / oWidth * 100;
          }

          //超出边框才可拖动，设置鼠标形状、icon是否禁用颜色
          if (img.height() > 500 || img.width() > 500) {
            img.css("cursor", "move");
            $(".fa-arrows-alt").css("color", "#404040");
          } else {
            img.css("cursor", "default");
            $(".fa-arrows-alt").css("color", "#ddd");
          }
        });

        console.log(oWidth, img.width(), this.total);
      });
    });
  }

  //旋转
  rotate() {
    this.current = (this.current + 90) % 360;
    $(".image-cur")[0].style.transform = "rotate(" + this.current + "deg)";
  }

  //检测是否百分之百
  isallPercent() {}

  fullScreen() {}

  mouseEnter() {}

  imgToSize(size) {
    const img = $(".image-cur");
    const oWidth = img.width(); //取得图片的实际宽度
    const oHeight = img.height(); //取得图片的实际高度

    img.width(oWidth + size);
    img.height(oHeight + size / oWidth * oHeight);

    if (size > 0) return;

    const left = parseFloat(img.css("left").replace("px", "")) - size;
    const top = parseFloat(img.css("top").replace("px", "")) - size;

    img.css("left", left > 0 ? 0 : left);
    img.css("top", top > 0 ? 0 : top);
  }

  //缩小
  smallit() {
    const parent = $(".image-container");
    const pWidth = parent.outerWidth();
    const pHeight = parent.outerHeight();
    //将图片缩小，失去热点
    const img = $(".image-cur");
    let originalImg = new Image();
    originalImg.src = img.attr("src");
    this.oWidth = originalImg.width;
    this.oHeight = originalImg.height;

    if (parseFloat(this.total) - 10 <= 10) {
      img.width(this.oWidth * 0.1);
      img.height(this.oHeight * 0.1);
      img.css("top", (pHeight - img.height()) / 2 + "px");
      img.css("left", (pWidth - img.width()) / 2 + "px");
      this.total = 10;
      return;
    }
    if (img.width() > this.oWidth * 0.1) {
      //最小10%
      img.width(this.oWidth * ((this.total - 10) / 100));
      img.height(this.oHeight * ((this.total - 10) / 100));
      img.css("top", (pHeight - img.height()) / 2 + "px");
      img.css("left", (pWidth - img.width()) / 2 + "px");
      this.total = parseFloat(this.total) - 10;
      const tol = Math.ceil(this.total);
      if (img.height() > 500 || img.width() > 500) {
        img.css("cursor", "move");
        $(".fa-arrows-alt").css("color", "#404040");
      } else {
        img.css("cursor", "default");
        $(".fa-arrows-alt").css("color", "#ddd");
      }
      /*
      if (tol >= 100) {
        img.css("cursor", "move");
        $(".fa-arrows-alt").css("color", "#404040");
      } else {
        img.css("cursor", "default");
        $(".fa-arrows-alt").css("color", "#ddd");
      }
      */
    }

    console.log(this.oWidth, img.width(), this.total);
  }

  //放大
  bigit() {
    const parent = $(".image-container");
    const pWidth = parent.outerWidth();
    const pHeight = parent.outerHeight();
    const img = $(".image-cur");
    let originalImg = new Image();
    originalImg.src = $(".image-cur").attr("src");
    this.oWidth = originalImg.width;
    this.oHeight = originalImg.height;

    if (200 - parseFloat(this.total) <= 10) {
      img.width(this.oWidth * 2);
      img.height(this.oHeight * 2);
      img.css("top", (pHeight - img.height()) / 2 + "px");
      img.css("left", (pWidth - img.width()) / 2 + "px");
      this.total = 200;
      return;
    }
    if (img.width() <= this.oWidth * 2) {
      //最大200%
      img.width(this.oWidth * ((this.total + 10) / 100));
      img.height(this.oHeight * ((this.total + 10) / 100));
      img.css("max-width", "unset");
      img.css("max-height", "unset");
      img.css("top", (pHeight - img.height()) / 2 + "px");
      img.css("left", (pWidth - img.width()) / 2 + "px");
      this.total = parseFloat(this.total) + 10;
      const tol = Math.ceil(this.total);
      /*if (tol >= 100) {
        img.css("cursor", "move");
        $(".fa-arrows-alt").css("color", "#404040");
      } else {
        img.css("cursor", "default");
        $(".fa-arrows-alt").css("color", "#ddd");
      }*/
      if (img.height() > 500 || img.width() > 500) {
        img.css("cursor", "move");
        $(".fa-arrows-alt").css("color", "#404040");
      } else {
        img.css("cursor", "default");
        $(".fa-arrows-alt").css("color", "#ddd");
      }
    }

    console.log(this.oWidth, img.width(), this.total);
  }

  mouseDown(event) {
    this.flag = true;

    event.preventDefault();

    this.params.currentX = event.pageX;
    this.params.currentY = event.pageY;
  }

  mouseUp() {
    this.flag = false;
  }

  //拖动
  mouseMove(event) {
    if (!this.flag) return;

    const _img = $(event.target);

    const dx = event.pageX - this.params.currentX;
    const dy = event.pageY - this.params.currentY;
    if (dx == 0 && dy == 0) {
      return false;
    }

    let newX = parseFloat(_img.css("left")) + dx;
    if (newX > 0) newX = 0;

    if (newX < this.params["width"] - _img.width())
      newX = this.params["width"] - _img.width() + 1;

    let newY = parseFloat(_img.css("top")) + dy;
    if (newY > 0) newY = 0;

    if (newY < this.params["height"] - _img.height())
      newY = this.params["height"] - _img.height() + 1;

    if (this.params["width"] >= _img.width()) {
      newX = this.params["width"] / 2 - _img.width() / 2;
    }

    if (this.params["height"] >= _img.height()) {
      newY = this.params["height"] / 2 - _img.height() / 2;
    }

    _img.css("left", newX + "px");
    _img.css("top", newY + "px");

    this.params.currentX = event.pageX;
    this.params.currentY = event.pageY;
  }
}

angular.module("SmartAdmin.Directives").component("hsEditImage", {
  templateUrl: "app/directive/common/image/edit.image.tpl.html",
  controller: EditImageController,
  controllerAs: "ctrl",
  bindings: {
    img: "<"
  }
});
