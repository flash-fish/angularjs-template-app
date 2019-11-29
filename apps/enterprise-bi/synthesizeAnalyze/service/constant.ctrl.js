angular.module('app.datas')
   /*
   大于 gtNumber
   大于等于 gtEqualNumber
   小于 ltNumber
   小于等于 ltEqualNumber
   */
  .constant("commonP", {
    gRtR:'gtEqualNumber',
    iRtR:'ltEqualNumber',
    gAtr:'gtEqualNumber',
    iAtR:'ltEqualNumber',
    QRate:'receiveQtyRate',
    ARate:'returnAmountRate',
    reRate: 'receiveQtyRateYoYValue',
    tuRate: 'returnAmountRateYoYValue',
    GoodsRt:{
      number_one: 0,
      number_two: 50,
      number_three: 0,
      number_four: 50,
      checkOne: false,
      checkTwo: false
    },
    Init:[
      'gtEqualNumber',
      'ltEqualNumber',
      'gtEqualNumber',
      'ltEqualNumber',
    ],
    getNumber:[
      'gtNumber',
      'ltEqualNumber'
    ],
    mains:[
      'receiveQtyRate',
      'returnAmountRate'
    ],
    StringsFilter:[
      '未产生退货'
    ],
    InitRate:{
      checkOne: false,
      checkTwo: false,
      receiveQtyRate: "95%以上",
      returnAmountRate: "50%以上",
    },
    InitCheck:[
      'checkOne','checkTwo'
    ],
    backDataOne:[
      "95%以上",
      "90%～95%",
      "85%～90%",
      "70%～85%",
      "50%～70%",
      "50%及以下"
    ],
    backDataTwo:[
      "50%以上",
      "10%～50%",
      "5%～10%",
      "3%～5%",
      "1%～3%",
      "1%及以下",
    ],
    local: {
      materCondition: 'materCondition',
      supCurrentSession: 'supCurrentSession',
      supplierSupplyCondition: 'supplierSupplyCondition'
    }


  })
