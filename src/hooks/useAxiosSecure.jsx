


import axios from "axios";
import React, {  useEffect ,use} from "react";
// import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthContext";

const axiosInstance = axios.create({
    baseURL: `https://one-roof-a12-server.vercel.app`
//  baseURL: `http://localhost:5000`
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = use(AuthContext);
  const navigate=useNavigate()

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // Add request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        }
      );

      // Add response interceptor
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (res) => res,
        (err) => {
          const status=err?.response?.status;
          if (status === 401) {
            logOut()
              .then(() => {
                navigate('/login');
              })
              .catch(console.error);
          }
          else if(status===403){
            navigate('/error')
          }
          return Promise.reject(err);
        }
      );
      // Cleanup to prevent multiple interceptors on re-renders
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading,logOut]);

  return axiosInstance;
};

export default useAxiosSecure;

    