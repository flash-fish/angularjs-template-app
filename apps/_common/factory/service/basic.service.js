angular.module("SmartAdmin.Factories")
  .factory("basicService", (Field, $rootScope, $location, CommonCon, dataService, alert, $stateParams, Version, Common, Symbols) => {
    return {

      average (arr) {
         _.remove(arr, s => _.isUndefined(s));
        return arr.reduce((acc, val) => acc + val, 0) / arr.length;
      },

      getCurrentRoute($state) {
        const curr = $state.$current;
        const info = $stateParams.info;

        const route = {
          code: curr.name,
          title: curr.data.title
        };

        if (info) route.param = { info };

        return route;
      },

      buildTitle(key, title, config) {
        config = config || {};
        // 对表头进行换行处理
        let unit = key.sale ? "(万元)" : key.unit ? `(${key.unit})` : "";
        // let array = key.name.split("-");
        // array.forEach(s => title += s + "<br />");
        // title += unit;
        let name = config.compareTableTitle && key.page ? key.page[config.compareTableTitle.page] : key.name;
        let [one, two, three] = name.split("-");
        two = two || "";
        three = three || "";

        let type = ["经销", "联营", "零售", "批发"];
        if (config.typeExpand)
          type = _.concat(type, config.typeExpand);
        const haveType = type.some(s => _.eq(s, one));

        const first = haveType ? `${one}<br />` : `${one + unit}<br />`;
        const second = haveType ? `${two + unit}<br />${three}` : three ? `${two}<br />${three}` : two;

        title = first + second;

        if (key.slice) title = title.slice(0, key.slice) + "<br>" + title.slice(key.slice);

        if(key.slice_one && key.slice_two){
          title = title.slice(0, key.slice_one) +
            "<br>" +
            title.slice(key.slice_one, key.slice_two) +
            "<br>" +
            title.slice(key.slice_two)
        }

        return title;
      },

      connectChart() {
        const chartDom = $(".hs-trend");
        if (!chartDom[1]) return;

        const saleChart =echarts.getInstanceByDom(chartDom[0]);
        const stockChart =echarts.getInstanceByDom(chartDom[1]);

        if (!stockChart) return;

        // 两个图表的场合 TIP联动
        echarts.connect([saleChart, stockChart]);

      },

      /**
       * 校验用户权限
       * @param params
       * @param func
       */
      checkAccess(params, func) {
        this.packager(dataService.checkAccess(params), (res) => {
          if (!res.data) {
            alert("警告", "您选择的品类组/类别超过了您的权限范围");
            return;
          }

          if (func) func();
        });
      },

      /**
       * 包装promise
       * @param promise
       * @param suc
       * @param reject
       */
      packager(promise, suc, reject) {

        promise.then((r) => {
          // $rootScope.fullLoadingShow = false;

          if (suc) suc(r);
        }, (r) => {
          // reject的场合关闭全局loading
          $rootScope.fullLoadingShow = false;

          if (reject) reject(r);
        });
      },

      /**
       * 日期操作的基础方法
       * @param curr 当前date
       * @param key 配置
       */
      handleDate(curr, key) {
        const origin = key.origin ? key.origin : "YYYYMMDD";
        const format = key.origin ? key.format : "YYYY/MM/DD";

        let date = moment(curr, origin);

        if (key.add) date.add(...key.add);
        if (key.subtract) date.subtract(...key.subtract);

        return date.format(format);
      },
      /**
       * 整合指标
       */
      buildField(field) {
        const basic = angular.copy(Field.common);
        return Object.assign(basic, field);
      },

      setSession(key, data) {
        if (!key) return;

        const filter = JSON.stringify(data);
        sessionStorage.setItem(key, filter);
      },

      getSession: (key, isRemove) => {
        if (!key) return;

        const filter = sessionStorage.getItem(key);
        if (filter && filter !== "undefined") {
          if (isRemove) sessionStorage.removeItem(key);

          return JSON.parse(filter);
        }
        return "";
      },

      setLocal(key, data, noVersion) {
        if (!key) return;

        const filter = JSON.stringify(data);

        const localKey = this.makeLocalKey(key, noVersion);

        localStorage.setItem(localKey , filter);
      },

      getLocal(key, isRemove, noVersion) {
        if (!key) return;

        const localKey = this.makeLocalKey(key, noVersion);

        const filter = localStorage.getItem(localKey);

        if (filter && filter !== "undefined") {
          if (isRemove) this.removeLocal(key);

          return JSON.parse(filter);
        }
        return "";
      },

      removeLocal(key, noVersion) {
        const localKey = this.makeLocalKey(key, noVersion);
        localStorage.removeItem(localKey);
      },

      makeLocalKey(key, noVersion) {
        let localKey;
        if (noVersion)
          localKey = key;
        else {
          const role = Symbols.underLine + $rootScope.currentJob.id + Version.current;
          localKey = key + role;
        }
        return localKey;
      },

      /**
       * 初始化条件结构
       * @param filter 过滤的条件数组
       * @param isRemove 是否删除
       * @param other Object required
       */
      initCondition(other, filter, isRemove) {
        const common = angular.copy(CommonCon.commonPro);

        if (!filter) return Object.assign(other, common);

        let condition = {};
        _.forIn(common, (val, key) => {
          const isPass = isRemove ? !filter.includes(key) : filter.includes(key);
          if (isPass) condition[key] = val;
        });

        return Object.assign(other, condition);
      },

      addZoomEvent(zoom) {
        return (param) => {
          zoom = param.batch ? param.batch[0] : param;
        }
      },

      addColumnColor(data, contentData) {
        const style = data && data < 0 ? 'color: green' : '';
        return `<span style="${style}">${contentData}</span>`;
      },

      initRootUser(data, module) {
        $rootScope.user = data;
        if (_.has($rootScope.user.moduleJobs, module)) {
          $rootScope.currentJob = $rootScope.user.moduleJobs[module].currentJob;
          $rootScope.jobs = $rootScope.user.moduleJobs[module].jobs.filter(j => j.id !== $rootScope.currentJob.id);
          this.setLocal(Common.currentJob, $rootScope.currentJob, 1);
          this.setSession(Common.currentJob, $rootScope.currentJob);
        }
      },

      isGoHome() {
        const local_job = angular.fromJson(localStorage.getItem(Common.currentJob));
        const session_job = this.getSession(Common.currentJob);
        return !local_job || (local_job &&  session_job && local_job.id !== session_job.id);
      },

      /**
       * 对象数组按某个属性排序
       * @param field：属性名
       */
      sortBy(field) {
        return function (a, b) {
          return a[field] - b[field];
        }
      }
    }
  });
