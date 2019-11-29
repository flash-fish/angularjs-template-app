angular.module('hs.warning').factory("WarningService", (basicService, CommonCon) => {
  return {
    initTabByAccess(data, key) {
      // 判断岗位
      const storeAccess = data.dataAccess.reduce((total, curr) => {
        return ["1", "3", "5"].includes(curr.dataAccessCode)
          ? total.concat(curr.accesses)
          : total;
      }, []);

      key.onlyShowStore = storeAccess.length;

      key.active = key.onlyShowStore ? 2 : 1;
    },

    buildPageCondition(filter, com) {
      let copyFilter = angular.copy(filter);
      _.forIn(copyFilter, (val, key) => {
        if (val.check === false) {
          delete com.filterCondition[key];
          return;
        }

        const data = val.data;
        if (val.sale) data.number = data.number * 10000;

        // com.filterCondition[key] = typeof(data) === 'string' ? parseInt(data) : data;
        com.filterCondition[key] = data;

        basicService.setSession(CommonCon.session_key.filterParams, filter);
      });
    },

    dealOtherCommon(list, pushFunc, sortObj, com, otherCommon) {
      let lowHeight, sortField, cont, name, copyCom = angular.copy(com);
      let filterCondition = copyCom.filterCondition;

      //转化为万元
      let dealMoney = (m) => {
        let money = m ? m / 10000 : m;
        money += CommonCon.millionUnit;
        return money;
      };

      if(!filterCondition) return;

      if (typeof filterCondition === "object") {
        _.forIn(filterCondition, (m, n) => {
          if (typeof m === "object") {
            cont = otherCommon[n].sale ? dealMoney(m.number) : m.number;
            lowHeight = m.compare ? CommonCon.compare[m.compare] : '';
          } else {
            cont = m;
          }

          name = otherCommon[n].name;
          if (lowHeight) cont = lowHeight + cont;
          sortField = sortObj[n];

          pushFunc(name, cont, sortField);
        })
      } else {
        name = otherCommon.name;
        cont = otherCommon.content + dealMoney(filterCondition);

        pushFunc(name, cont, sortField);
      }

    }
  }

});
