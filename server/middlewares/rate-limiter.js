const rateLimit = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')


const sensitiveEndpointLimiter = rateLimit({
  windowMs: 1*60*1000 ,// 15 min 
  max: 3,// Maximum 50 requests allowed in 15 min.
  standardHeaders:true, // response header sent
  legacyHeaders:false,
  handler:(req,res)=>{ //If limit exceeded, custom response runs.
    console.log(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`) //Useful for monitoring attacks.
    return res.status(429).json({
    success:false,
    message:"Too Many requests"
   })
   store:new RedisStore({ //Store request counts inside Redis instead of RAM.
    sendCommand:(...args)=>redisClient.call(...args), // call commands like INCR , EXPIRE , GET
  })
  }
})

module.exports = sensitiveEndpointLimiter