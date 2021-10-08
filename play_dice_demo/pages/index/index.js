//index.js

const util = require('../../utils/util.js')

Page({

  data: {
    //清除选择骰子的个数
    pickerRange:[1,2,3,4,5,6,7,8,9],  //最多9个最少1个骰子，注意如果拓展到十几甚至几十个，将导致下方whetherOverlap反复执行甚至死循环
    number:6,                         //初始指定个6骰子
    switchText:'隐藏骰子',
    diceList:[],
    //countList，下标i存放的是点数(i+1)的个数
    countList:['?','?','?','?','?','?'],
    countSum:'???',
    clicked:false,              //用于指示是否已经开始执行
     //先判断clicked的值，若为true说明正在动画中，不再摇骰子；若为false则继续
    //同时判断switchText的值，当用户隐藏时，不再摇骰子，相当于暂时关闭了摇一摇功能
    // 创建titleList用于存放头衔
     tilteList:['金花','六杯红','遍地锦','六杯黑','五红','五子登科','四点红','对堂','三红','四进','二举','一秀']
  },

  onLoad: function (options) {
    //摇一摇
    util.shake(this.play)
  },

  onReady: function () {

  },

  onShow: function () {
    this.setData({
      clicked: false
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  /*此处有改动，代码块注释掉，拒绝用户选择骰子个数*/
 
  //用户点击switchText
  // changeSwitch:function(){
  //   var switchText = this.data.switchText
  //   if(switchText == '隐藏骰子'){
  //     switchText = '展示骰子'
  //   }
  //   else{
  //     switchText = '隐藏骰子'
  //   }
  //   this.setData({
  //     switchText:switchText,
  //     clicked:false
  //   })
  // },

  /*注释掉了*/

  //用户改变骰子个数
  // changeNumber:function(event){
  //   var value = event.detail.value
  //   this.setData({
  //     number:Number(value) + 1
  //   })
  // },

  //用户摇晃手机超过阈值，执行回调函数
  play:function(){
    var that = this
    //先判断clicked的值，若为true说明正在动画中，不再摇骰子；若为false则继续
    //同时判断switchText的值，当用户隐藏时，不再摇骰子，相当于暂时关闭了摇一摇功能
    if(that.data.clicked || that.data.switchText == '展示骰子'){
      return
    }
    else{
      //立即把clicked赋值为true，避免用户多次摇晃反复执行，动画结束后再把clicked置回false
      that.setData({
        clicked: true
      })
      wx.showLoading({
        title:'执行中…',
        mask:true
      })
      //先销毁之前的骰子，直接把diceList清空
      that.setData({
        diceList:[]
      })
      that.creatediceList()
      that.start()
    }
  },

  //以骰子个数为基础实例化新的骰子数组
  creatediceList:function(){
    var that = this
    var number = that.data.number
    var tempdiceList = []
    for(let i=0;i<number;i++){
      tempdiceList.push({
        value:1,
        animationData:null
      })
    }
    that.setData({
      diceList:tempdiceList
    })
  },

  //开始摇骰子
  start:function(){
    var that = this
    var diceList = that.data.diceList
    var length = diceList.length
    var valueList = that.creatValueList(length)   //获取各个骰子的4个value值，用于产生骰子的点数和动画
    for(let i=0;i<length;i++){
      diceList[i].value = valueList[i].value
      diceList[i].animationData = that.createAnimationData(valueList[i].left,valueList[i].top,valueList[i].rotate)
    }
    that.setData({
      diceList:diceList
    })
    wx.hideLoading()
  },

  //随机产生各个骰子的点数、最终位置、旋转角度，并计算出countList里的6个取值和countSum的值
  creatValueList:function(num){
    var valueList = []
    var countList = [0,0,0,0,0,0]
    var countSum = 0
    //此函数用于判断骰子最终位置是否与之前的骰子重叠
    function whetherOverlap(left,top){
      for(let j=0;j<valueList.length;j++){
        if((Math.pow((valueList[j].left - left),2) + Math.pow((valueList[j].top - top),2)) < 15000){
          //此时两个骰子中心连线的线段长度的平方小于15000
          console.log('overlap!')
          return true
        }
      }
      //至此for循环结束，那么本次随机产生的位置与之前的均无重叠（连线的平方均>=15000）
      return false
    }
    for(let i=0;i<num;i++){
      let temp1 = parseInt(Math.random() * 6)   //随机产生骰子的点数(0~5)
      let temp2 = 0
      let temp3 = 0
      do{
        temp2 = Math.random() * 650             //随机产生骰子的最终left(0~650)
        temp3 = Math.random() * 737 + 200       //随机产生骰子的最终top(200~937)
      }while(whetherOverlap(temp2,temp3))
      let temp4 = Math.random() * 360 + 360     //随机产生骰子的旋转角度(360~720)
      valueList.push({
        value:temp1+1,
        left:temp2,
        top:temp3,
        rotate:temp4
      })
      countList[temp1]++
      countSum += (temp1 + 1)
    }
    this.setData({
      countList:countList,
      countSum:countSum
    })
    return valueList
  },
  


    // title: '恭喜您',
    // content: '您获得的称号是：',
    // success: function (res) {
    //   if (res.confirm) {
    //     console.log('用户点击确定')

    //   } else {
    //     console.log('用户点击取消')
    //   }
    // }







  //根据骰子的最终位置和旋转角度创建动画数据
  createAnimationData:function(left,top,rotate){
    var animation = wx.createAnimation({
      duration:1500,
      timingFunction:'ease-out'
    })
    animation.left(String(left) + 'rpx')
    animation.top(String(top) + 'rpx')
    animation.rotate(rotate)
    animation.step()
    return animation.export()
  },
  // 此函数返回博饼的称号
  // getTitle:function(countList){
  //   var countList=this.data.countList,
  //   if(this.data.countList[3]>=1){
  //     return (this.data.tilteList[11])
  //   }
  // },
  // 动画结束的回调函数
  end:function(){
    //每次动画结束，把clicked置回false
    //检查一下countList是啥
    var index_title=-1
    var ct=this.data.countList
    var tl=this.data.tilteList
    if(ct[3]==4&&ct[0]==2){
      index_title=0
    }else if(ct[3]==6){
      index_title=1
    }else if(ct[0]==6){
      index_title=2
    }else if(ct[5]==6){
      index_title=3
    }else if(ct[3]==5){
      index_title=4
    }else if(ct[4]==5){
      index_title=5
    }else if(ct[3]==4){
      index_title=6
    }else if(ct[0]==ct[1]==ct[2]==ct[3]==ct[4]==ct[5]){
      index_title=7
    }else if(ct[3]==3){
      index_title=8
    }else if(ct[1]==4){
      index_title=9
    }else if(ct[3]==2){
      index_title=10
    }else if(ct[4]==1){
      index_title=11
    }
    
    
    
    // wx.showModal({
    //   title:'本次博饼获得称号',
    //   content:tl[index_title],
    //     // success: function (res) {
    //     //   if (res.cancel) {//这里是点击了确定以后
    //     //     return
        
          
    //     //   } else {//这里是点击了取消以后
    //     //     return
    //     //   }
    //     //   }
    // })
    if(index_title!=-1){
      wx.showToast({
        title: tl[index_title],
        duration:4000
      })
    }else{
      wx.showToast({
        title: '未获得称号',
        duration:4000
      })
    }
    
    this.setData({
      clicked:false
    })
  }

})
