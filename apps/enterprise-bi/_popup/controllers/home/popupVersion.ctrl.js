class PopupVersionController {
  constructor(context, $uibModalInstance) {
    this.uibModalInstance = $uibModalInstance;
    this.context = context;
    this.message = angular.copy(this.context.versionInfo);
  }

  init() {
    this.message.dateCode = moment(this.message.dateCode, 'YYYYMMDD').format('YYYY/MM/DD');
    // 换行符替换成<br>
    const replaceStr = ['\\r\\n', '\\n'];
    replaceStr.forEach(r => {
      if (this.message.content.includes(r)) {
        const content = this.message.content.split(r);
        if (content.length > 1) this.message.content = content.join('<br>');
      }
    });
  }

  cancel() {
    this.uibModalInstance.close();
  }
}

angular.module('hs.popups').controller('popupVersionCtrl', PopupVersionController);
