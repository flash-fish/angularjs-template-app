angular.module('hs.saleStock')
  .constant('channelTypes', {
    buyerTypes: [
      {id: 1, name: '按费用代码'},
      {id: 2, name: '按品类组-费用代码'},
      {id: 3, name: '按费用代码-品类组'}
    ],
    storeTypes: [
      {id: 1, name: '按费用代码'},
      {id: 2, name: '按门店-费用代码'},
      {id: 3, name: '按费用代码-门店'}
    ]
  })
  .constant('subChannelTypes', {
    buyer: [
      {id: 1, field: 'buyerChannelCode'},
      {id: 2, field: 'byCatChannelCode'},
      {id: 3, field: 'byChannelCodeCat'}
    ],
    store: [
      {id: 1, field: 'storeChannelCode'},
      {id: 2, field: 'byStoreChannelCode'},
      {id: 3, field: 'byChannelCodeStore'}
    ]
  })
  .constant('channelField', {
    channelCode: {name: '费用代码'},
    channelCodeName: {name: '费用名称'},
    // dataTypeName: {name: '费用类型'},
    feeKindName: {name: '费用性质'},
  })
  .constant('channelTreeFix', {
    buyer: {
      classCode: {code: 'classCode', title: '按品类组-费用代码', other: 'channelCode'},
      channelCode: {code: 'channelCode', title: '按费用代码-品类组', other: 'classCode'}
    },
    store: {
      storeCode: {code: 'storeCode', title: '按门店-费用代码', other: 'channelCode'},
      channelCode: {code: 'channelCode', title: '按费用代码-门店', other: 'storeCode'}
    }
  });
