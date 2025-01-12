const BASE_URL = "http://localhost:3000/api/v1"


export const endpoints ={
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

export const categories={
    CATEGORIES_API: BASE_URL + "/course/showAllCategories"
}

// CONTACT-US API
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SSETTINGS-API ENDPOINTS
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
  }