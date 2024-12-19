import toast from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setLoading,setToken } from "../../slices/authSlice";


    const {

        SENDOTP_API ,
        LOGIN_API,
        RESETPASSTOKEN_API,
        
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
            toast.error("Could not send OTP")
        }
        // dispatch(setLoading(false))
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
        }
        catch(err){

        }
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