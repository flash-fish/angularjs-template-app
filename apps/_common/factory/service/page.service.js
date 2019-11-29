angular.module("SmartAdmin.Factories")
  .factory("pageService", () => {
    return {

      /**
       * 表格排序分页时 隐藏body数据
       */
      hideBody(opacity) {
        $(".DTFC_LeftBodyWrapper").css('opacity', opacity);
        $(".dataTables_scrollBody").css('opacity', opacity);
      },

      /**
       * 表格排序分页时 隐藏body数据
       */
      hideFooter(opacity) {
        $(".dt-toolbar-footer").css('opacity', opacity);
      },
    }
  });
