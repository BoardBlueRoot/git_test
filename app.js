const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const router = require('./router.js')

const app = express()

//配置bodyParser中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//配置session中间件
app.use(session({
	secret:'itcast',
	resave:false,
	saveUninitialized:false
}))

//将路由全部挂载到app实例上
app.use(router)

//统一处理500错误的中间件
app.use((err,req,res,next) => {
	res.status(500).json({
		error:err.message
	})
})


app.listen(329,() => {
	console.log('app is running at port 329.')
	console.log('please visit http://127.0.0.1:329/')
})