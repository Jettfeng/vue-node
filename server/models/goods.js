var mongoose = require('mongoose')
// 定义表模型
var Schema = mongoose.Schema
var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productNum":Number,
  "checked":String,
  "productImage":String
});
// 输出模型
module.exports = mongoose.model('Good',productSchema)
