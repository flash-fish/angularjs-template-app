angular.module("hs.popups")
  .constant("Pop", {

    module: 5,

    unlimited: 'unlimited',

    levelMap: {
      1: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5
    },

    catLevels: [
      {id: 1, name: '部门', active: true, len:1},
      {id: 2, name: '大分类', active: false, len:3},
      {id: 3, name: '中分类', active: false, len:4},
      {id: 4, name: '小分类', active: false, len:5},
      {id: 5, name: '子类', active: false, len:6}
    ],

    classLevels: [
      {id: '2', name: '部门', active: true, code: 'classSectionCode', len:2},
      {id: '3', name: '部组', active: false, code: 'classSubSectionCode', len:3},
      {id: '4', name: '品类组', active: false, code: 'classCode', len:5},
    ],

    types: [
      {id: 1, sign: "store", name: "门店", code: "storeCode", title: "storeName", count: 20},

      {
        id: 2, sign: "category", name: "类别", code: "categoryCode", title: "categoryName", count: 20,
        level: {code: "levelCode", name: "levelName"}
      },

      {id: 3, sign: "operation", name: "业态", code: "businessOperationCode", title: "businessOperationName", count: 20},

      {
        id: 4, sign: "classes", name: "品类组", code: "classCode", title: "className", count: 20,
        level: {code: "levelCode", name: "levelName"}
      },

      {id: 5, sign: "district", name: "地区", code: "districtCode", title: "districtName", count: 20, initOpen: true},
      {id: 6, sign: "brand", name: "品牌", code: "brandId", title: "brandName", count: 20, initOpen: true},
      {id: 7, sign: "product", name: "商品", code: "productId", title: "productName", count: 20, initOpen: true, showCode: "productCode"},
      {id: 8, sign: "", name: "店群", code: "groupId", title: "groupName", count: 20, initOpen: true},
      {id: 9, sign: "supplier", name: "供应商", code: "supplierId", title: "supName", count: 20, initOpen: true, showCode: "supplierCode"},
      {id: 10, sign: "newProduct", name: "新品", code: "productId", title: "productName", count: 20, initOpen: true, showCode: "productCode"},
      {id: 11, sign: "", name: "整体", code: "abcTagCode", title: "abcTagName", count: 20},
      {id: 12, sign: "", name: "新品年份", code: "newProductYear", title: "newProductName", count: 20},
      {id: 13, sign: "", name: "费用代码", code: "channelCode", title: "channelName", count: 10},
    ],

    actTypes: [
      {id: 1, sign: "store", name: "门店", code: "storeCode", title: "storeName", count: 20, initOpen: true},
      {
        id: 2, sign: "category", name: "类别", code: "categoryCode", title: "categoryName", count: 20, initOpen: true,
        level: {code: "levelCode", name: "levelName"}
      },
      {id: 3, sign: "operation", name: "业态", code: "businessOperationCode", title: "businessOperationName", count: 20, initOpen: true},
      {
        id: 4, sign: "classes", name: "品类组", code: "classCode", title: "className", count: 20, initOpen: true,
        level: {code: "levelCode", name: "levelName"}
      },
      {id: 5, sign: "district", name: "地区", code: "districtCode", title: "districtName", count: 20, initOpen: true},
      {id: 6, sign: "brand", name: "品牌", code: "brandId", title: "brandName", count: 20, initOpen: true},
      {id: 7, sign: "product", name: "商品", code: "productId", title: "productName", count: 20, initOpen: true, showCode: "productCode"},
      {id: 8, sign: "storeGroup", name: "店群", code: "groupId", title: "groupName", count: 20, initOpen: true},
      {id: 9, sign: "supplier", name: "供应商", code: "supplierId", title: "supName", count: 20, initOpen: true, showCode: "supplierCode"},
    ],

    supplierTypes:[
      {id: 1, sign: "store", name: "门店", code: "storeCode", title: "storeName", count: 20},
      {
        id: 2, sign: "category", name: "类别", code: "categoryCode", title: "categoryName", count: 20,
        level: {code: "levelCode", name: "levelName"}
      },
      {id: 3, sign: "operation", name: "业态", code: "businessOperationCode", title: "businessOperationName", count: 20},
      {
        id: 4, sign: "classes", name: "品类组", code: "classCode", title: "className", count: 20,
        level: {code: "levelCode", name: "levelName"}
      },
      {id: 5, sign: "district", name: "地区", code: "districtCode", title: "districtName", count: 20, initOpen: true},
      {id: 6, sign: "brand", name: "品牌", code: "brandId", title: "brandName", count: 20, initOpen: true},
      {id: 7, sign: "product", name: "商品", code: "productId", title: "productName", count: 20, initOpen: true, showCode: "productCode"},
      {id: 8, sign: "", name: "店群", code: "groupId", title: "groupName", count: 20, initOpen: true},
    ],

    commonOperation: [
      {list: [
          {code: '11', name: '大卖场'},
          {code: '12', name: '标超'},
          {code: '13', name: '综超'},
          {code: '14', name: '购物中心'},
          {code: '43', name: '精超'}
        ],  name: '常用业态', selected: true},// 快速选中 大卖场/标超/综超/购物中心/精超
      {list: [
          {code: '21', name: '配送中心'}
        ], name: '不包含配送中心', selected: false}// 快速选中 不包含配送中心以外所有的
    ]

  });
