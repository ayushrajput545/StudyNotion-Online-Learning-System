import toast from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setLoading,setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
 
    const {
        SENDOTP_API ,
        SIGNUP_API,
        LOGIN_API,
        RESETPASSTOKEN_API,
        RESETPASSWORD_API,  
    } =endpoints 

export function sendOtp(email,navigate){

    return async(dispatch) =>{
        const toastId = toast.loading("Loading...") 
        // dispatch(setLoading(true))
        try{
            const response = await apiconnector("POST" , SENDOTP_API , {email , checkUserPresent:true})
            console.log("SENDOTP_API RESPONSE.........." , response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("OTP sent successfully")
            navigate("/verify-email")
        }
        catch(err){
            console.log("SENDOTP_API ERROR.......",err)
            toast.error(err.response.data.message)
        }
        // dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

// signUp api

export function signUp(accountType , firstName, lastName , email , password , confirmPassword,otp,navigate){

    return async(dispatch)=>{
        const toastId = toast.loading("Loading..." )
        dispatch(setLoading(true))
        try{
            const response = await apiconnector("POST" ,  SIGNUP_API , {accountType , firstName, lastName , email , password , confirmPassword,otp})
            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Account Created! Please Login") 
            navigate('/login') 
        }
        catch(err){
              console.log("SIGNUP API ERROR............", err)
              toast.error(err.response.data.message)
              navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


//login api
export function login(email,password,navigate){

    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response =await apiconnector("POST" , LOGIN_API , {email,password})
            console.log("LOGIN API RESPONSE..........", response)
            
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Login Successfull")
            dispatch(setToken(response.data.token))
            const userImg = response.data?.user?.image ?
              response.data?.user?.image
              :
              `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
             dispatch(setUser({
                ...response.data.user,
                image:userImg
             }))

             localStorage.setItem("token" , JSON.stringify(response.data.token))
             localStorage.setItem("user", JSON.stringify(response.data.user))
             navigate("/dashboard/my-profile")
        }
        catch(err){
            console.log("LOGIN API ERROR " , err)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


// getPasswordResetToken api
export function getPasswordResetToken(email,setEmailsent){

    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
            const response = await apiconnector("POST" , RESETPASSTOKEN_API ,{email})
            console.log("RESET PASSWORD TOKEN RESPONSE......", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Reset Email Sent")
            setEmailsent(true)

        }
        catch(err){
            console.log("RESET PASSWORD TOKEN Error", err);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false))
        
    }

}


// reset-password or update password api

export function resetPassword(password , confirmPassword , token){
    
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
            const response = await apiconnector("POST" , RESETPASSWORD_API , {password , confirmPassword , token})
            console.log("RESET PASSWORD RESPONSE.......",response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Password Changed")

        }
        catch(err){
            console.log("RESET PASSWORD ERROR",err)
            toast.error(err.response.data.message)
        }
        dispatch(setLoading(false))
    }
}


//logout fucntion

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null))
        dispatch(setUser(null))
        // dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate('/')

    }
}