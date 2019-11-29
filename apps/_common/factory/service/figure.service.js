angular.module('SmartAdmin.Factories')
  .factory('FigureService', (Symbols) => {
    return {
      changeNull: (data) => {
        return _.isUndefined(data) || _.isNull(data) || _.isNaN(data) ? '-' : data;
      },

      amount: (data, point) => {
        let p = !_.isUndefined(point) ? point : 2;

        if (_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data))
          return Symbols.bar;

        return accounting.formatNumber(data / 10000, p, ",");
      },

      thousand: (data, point) => {
        const p = !_.isUndefined(point) ? point : 2;

        if (_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data))
          return Symbols.bar;

        return accounting.formatNumber(data, p, ",");
      },

      thousandOfSmall: (data) => {
        let str;
        if (_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data))
          return Symbols.bar;

        function amount(d, point) {
          let p = !_.isUndefined(point) ? point : 2;
          str = accounting.formatNumber(d / 10000, p, ",");
          return str;
        }

        str = Math.abs(data) < 50 && Math.abs(data) > 0.5
          ? amount(data, 4)
          : amount(data);

        return str;
      },

      /**
       * 百分比数字格式化
       * @param data 原始数据
       * @param abs 是否取绝对值( 默认是取绝对值，true是不取绝对值，false取绝对值 )
       * @param percent 是否加百分号
       * @param fixed 百分比字符需要保留小数的位数（历史原因默认保留2位）
       * @returns {string|*}
       */
      scale: (data, abs, percent, fixed) => {
        // 默认小数两位
        if (_.isUndefined(fixed)) fixed = 2;
        data = parseFloat(data);
        if (_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data))
          return Symbols.bar;

        let str = abs ? Number(data * 100).toFixed(fixed) : Math.abs(Number(data * 100)).toFixed(fixed);
        str = percent ? str + Symbols.percent : str;

        return str;
      },

      /**
       * 万分比数字格式化
       * @param data 原始数据
       * @param un 是否加万分号
       * @returns {string|*}
       */
      universal: (data, un) => {

        if (_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data))
          return Symbols.bar;

        return un ? Number(data * 10000).toFixed(2) + Symbols.extremely : Number(data * 10000).toFixed(2);
      },


      /*
        保留两位小数
      * isTable 是否需要/10000
      * */
      scaleOther: (data, isTable, thousand) => {
        data = parseFloat(data);
        if ((_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data)))
          return Symbols.bar;

        let str = isTable ? Number(parseFloat(data) / 10000).toFixed(2) : Number(parseFloat(data)).toFixed(2);

        if (thousand) str = accounting.formatNumber(str, 2, ",");
        return str;
      },

      /*
         判断一些不需要做处理的数据是否存在
       */
      isDefine: (data) => {
        if ((_.isNull(data) || _.isUndefined(data) || data === Symbols.bar)) {
          return Symbols.bar;
        }else {
          return data;
        }

      },

      /*
        取整
       */
      changeInt: (data, ) => {
        if ((_.isNull(data) || _.isUndefined(data) || data === Symbols.bar) || isNaN(data)) {
          return Symbols.bar;
        }else {
          return parseInt(data);
        }
      },

      /**
       * 数据格式处理
       * @param data     原始数据
       * @param flag     是否需要除以10000
       * @param thousand
       * @param point    小数位
       * @returns {*}
       */
      number: (data, flag, thousand, point) => {

        data = parseFloat(data);
        if ((_.isNull(data) || _.isUndefined(data) || data === Symbols.bar || isNaN(data)))
          return Symbols.bar;

        let str = flag ? Number(parseFloat(data) / 10000) : parseFloat(data);

        if (thousand) str = accounting.formatNumber(str, !_.isUndefined(point) ? point : 2, ",");

        return str;
      },

      have: (obj, name) => {
        return obj.indexOf(name) >= 0;
      },

      haveValue: (arrs) => {
        return arrs && arrs.length > 0;
      },

      jumpToOther: (pageId) => {
        angular.element(pageId).click();
      },

      addPercent(data) {
        return data === Symbols.bar ? data : `${data}%`;
      },

      /**
       * 日期格式转换
       * @param data
       * @param format
       * @returns {string}
       */
      dataTransform(data, format) {
        const tran = format ? format : "YYYY/MM/DD";
        return data ? moment(data, "YYYYMMDD").format(tran) : '-';
      }
    }
  });
