const express = require('express')
const router = express.Router()

const db = require('./models/db.js')
const userCtrler = require('./controllers/user')
const topicCtrler = require('./controllers/topic')
const commentCtrler = require('./controllers/comment')
const sessionCtrler = require('./controllers/session')

//验证登录
function checkLogin(req,res,next){
	const user = req.session.user
	if(!user){
		return res.status(401).json({
			error:'unauthorized'
		})
	}
	next()
}

//验证话题
async function checkTopic(req,res,next){
	const {id} = req.params//params获取动态路由参数即:id
    try{
    	//先数组解构赋值再对象解构赋值,因为查询操作返回值是个[{}]对象数组
		const [{user_id}] = await db.query(`select user_id from topics where id = ${id}`)
		if(!user_id){
			return res.status(404).json({
				error:'topic is gone'
			})
		}
		if(user_id != req.session.user.id){
			return res.status(400).json({
				error:'request invalid',
				user_id:user_id,
				session:req.session.user.id
			})
		}
		next()
	}catch(err){
		next(err)
	}
}

//用户数据
router.get('/users',userCtrler.get)
router.post('/users',userCtrler.post)
router.patch('/users/:id',userCtrler.patch)//:id表示动态的id,模糊匹配,如/users/1,/users/2
router.delete('/users/:id',userCtrler.delete)

//话题数据
router.get('/topics',topicCtrler.get)
router.post('/topics',checkLogin,topicCtrler.post)
router.patch('/topics/:id',checkLogin,checkTopic,topicCtrler.patch)
router.delete('/topics/:id',checkLogin,checkTopic,topicCtrler.delete)

//评论数据
router.get('/comments',commentCtrler.get)
router.post('/comments',checkLogin,commentCtrler.post)
router.patch('/comments/:id',checkLogin,commentCtrler.patch)
router.delete('/comments/:id',checkLogin,commentCtrler.delete)

//会话数据
router.get('/session',sessionCtrler.get)
router.post('/session',sessionCtrler.post)
router.patch('/session/:id',sessionCtrler.patch)
router.delete('/session',sessionCtrler.delete)

module.exports = router
