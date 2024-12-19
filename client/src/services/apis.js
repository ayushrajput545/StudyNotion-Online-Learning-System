const BASE_URL = "http://localhost:3000/api/v1"


export const endpoints ={
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
}

export const categories={
    CATEGORIES_API: BASE_URL + "/course/showAllCategories"
}