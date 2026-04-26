import axios from 'axios'

export const axiosInstance = axios.create({
    withCredentials: true // make this true so that we pass cookies
})

export const apiconnector = (method , url , bodyData , headers , params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData:null,
        headers: headers ? headers:null,
        params:params ? params:null,
    })
}

export const BASE_URL = "https://studynotion-ed-tech-platform-2-ic89.onrender.com/api/v1"

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Original req", originalRequest)

    // check access token expired
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // call refresh token API (cookie will go automatically)
        await axiosInstance.post(`${BASE_URL}/auth/refresh-token`);

        // retry original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // refresh failed → logout
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);