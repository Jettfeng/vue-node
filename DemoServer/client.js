let http = require('http')
let util = require('util')

http.get('http://www.imooc.com/index/getstarlist',(res)=>{
  let data = ''
  res.on('data',function(chunk){
    // 数据是一步一部读取的，最后data需要累加起来
    data+=chunk
  })
  res.on('end',function(){
    let result = JSON.parse(data)
    // console.log('result'+result)
    // console.log('result:'+util.inspect(result))
    // console.log(result.data.list)
  })
})
