var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')
// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1/dumall')
// 链接成功
mongoose.connection.on('connected', function () {
  console.log('mongodb connected succsss')
})
// 链接失败
mongoose.connection.on('error', function () {
  console.log('mongodb connected fail')
})
mongoose.connection.on('disconnected', function () {
  console.log('mongodb connected disconnected')
})

router.get('/list', function (req, res, next) {
  // res.send('hello goods list')
  // 在MongoDB里面叫文档
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let priceLevel = req.query.priceLevel
  let sort = req.query.sort
  let skip = (page - 1) * pageSize
  var priceGt = ''
  var priceLte = ''
  let params = {}
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 500;
        break;
      case '1':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '2':
        priceGt = 1000;
        priceLte = 2000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }


  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message//err返回一个message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc//doc为查出来的集合
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = "100000077"
  var productId = req.body.productId
  var User = require('../models/user')
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      console.log('userDoc:' + userDoc)
      if (userDoc) {
        let goodsItem = ''
        // 判断购物车里面是否有改商品
        userDoc.cartList.forEach((item,index)=>{
          if(item.productId == productId){
            goodsItem = item
            item.productNum++
          }
        })
        // 如果有该商品，商品数量++，保存到doc里面；否则先查找在保存在doc里面
        if(goodsItem){
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              })
            } else {
              res.json({
                status: "0",
                msg: "",
                result: "suc"
              })
            }
          })
        }else{
          Goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                status: "1",
                msg: err1.measure
              })
            } else {
              if (doc) {
                doc.productNum = 1
                doc.checked = 1
                userDoc.cartList.push(doc)
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: "0",
                      msg: "",
                      result: "suc"
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})
module.exports = router

