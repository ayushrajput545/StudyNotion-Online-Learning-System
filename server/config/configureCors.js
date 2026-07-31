const cors = require('cors')

const configureCore = ()=>{
    return cors({

        // origin: controls which origins (domains) are allowed to access your API
        // It can be a string, array, or a function for dynamic checks.
         origin:(origin,callback)=>{
            const allowedOrigin =[
                'http://localhost:3001', // local development frontend
                'https://studynotion-edtec.netlify.app', // production domain frontend
                'http://localhost:3000'
            ]

            if(!origin || allowedOrigin.indexOf(origin) !==-1){
                callback(null , true); // giving permission so that request can be allowed
            }
            else{
                callback(new Error("Not allowed by cors")) //reject request (browser blocks)
            }
        },

        //methods -> which http methods you are allowing user to do the request
        // methods: ['GET' , 'POST' , 'PUT' , 'DELETE'],

        // allowedHeaders: request headers the client is permitted to send
        // Example: if frontend sends Authorization header, it must be declared here
        // allowedHeaders: [
        //     'Content-Type', // required for JSON body requests
        //     'Authorization',//// needed if using JWT/bearer tokens
        //     'Accept-Version'
        // ],

        // exposedHeaders: response headers that the browser is allowed to read
        // Without this, custom headers (like X-Total-Count) are invisible to JS on frontend
        // exposedHeaders:['X-Total-Count' , 'Content-Range'],
        credentials: true,// enales support for cookies and authoraiation geaders -> imp one

        // preflightContinue: if false, Express automatically ends OPTIONS preflight request
        // If true, you must handle OPTIONS response yourself
        preflightContinue:false,
        maxAge:600, //cache pre flight responses for 10mins(600 sec) -> help us to avoid sending options request multiple times
        optionsSuccessStatus:204  // provide status code to use sucessful options request , Some old browsers expect 200, default is 204 (No Content)

    })
}

module.exports = configureCore;