import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { setUser } from "../../slices/profileSlice"
import { logout } from "./authAPI"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } = settingsEndpoints

  // Display and upload Picture
  export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiconnector(
          "PUT",
          UPDATE_DISPLAY_PICTURE_API,
          formData,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        )
        console.log(
          "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
          response
        )
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Display Picture Updated Successfully")
        dispatch(setUser(response.data.data))
        localStorage.setItem("user", JSON.stringify(response.data.data))
      } catch (error) {
        console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
        toast.error("Could Not Update Display Picture")
      }
      toast.dismiss(toastId)
    }
  }

  // Update Profile Details
  export function updateProfile(token,formData){
    return async(dispatch)=>{
      const toastId = toast.loading("Loading...")
      console.log("Token hai bhai",token)

      try{
        const response = await apiconnector("PUT" , UPDATE_PROFILE_API , formData , { Authorization: `Bearer ${token}`,} )
        console.log("UPDATE_PROFILE_API API RESPONSE............", response)

        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`

        dispatch(
          setUser({ ...response.data.updatedUserDetails, image: userImage })
        )
        localStorage.setItem("user", JSON.stringify(response.data.updatedUserDetails))
        

        toast.success("Profile Updated Successfully")


      }
      catch(err){
        console.log("UPDATE_PROFILE_API API ERROR............", err)
        toast.error("Could Not Update Profile")
      }

      toast.dismiss(toastId)
    }
  }

  // Change Password API
  export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiconnector("POST", CHANGE_PASSWORD_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CHANGE_PASSWORD_API API RESPONSE............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password Changed Successfully")
    } catch (error) {
      console.log("CHANGE_PASSWORD_API API ERROR............", error)
      toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
  }

  // Delete ACcount
  export function deleteProfile(token, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiconnector("DELETE", DELETE_PROFILE_API, null, {
          Authorization: `Bearer ${token}`,
        })
        console.log("DELETE_PROFILE_API API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Profile Deleted Successfully")
        dispatch(logout(navigate))
      } catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
      }
      toast.dismiss(toastId)
    }
  }