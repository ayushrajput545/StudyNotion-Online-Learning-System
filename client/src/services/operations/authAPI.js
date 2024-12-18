import toast from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setLoading } from "../../slices/authSlice";

export function sendOtp(email,navigate){

    const {SENDOTP_API} =endpoints 

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