const express = require('express');
const app = express();

const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payment');
const profileRoutes = require('./routes/Profile');
const userRoutes = require('./routes/User');
const contactUsRoute = require("./routes/Contact");

const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const{cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const { default: redisClient } = require('./config/redis');
const configureCore = require('./config/configureCors');
dotenv.config();

const PORT = process.env.PORT || 4000

//database connect
dbConnect();

//cloudinary connect
cloudinaryConnect();
//add middlewares
app.use(express.json());
app.use(cookieParser());
app.use(configureCore());
// app.use(cors())

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }) 
)

app.use("/api/v1/auth", userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes)
app.use("/api/v1/reach", contactUsRoute);

//default route
app.use('/' , (req,res)=>{
    return res.json({
        success:true,
        message:"Your Server is running"
    })
});

//test redis
app.get('/test-redis' ,async (req,res)=>{
  try {
    await redisClient.set("test", "working", "EX", 20);
    const data = await redisClient.get("test");

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

//activate the server
 app.listen(PORT , ()=>{
    console.log(`Server is running at ${PORT} port`)
 })

