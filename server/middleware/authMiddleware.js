const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

module.exports = async function(req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({message: "Не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        const email = decoded.email
        const isReal = await User.findOne({where: {email}})
        if(!isReal) return res.status(401).json({message: "Неверный токен"})
        next()
    } catch (error) {
        res.status(401).json({message: "Не авторизован"})
    }
}