// src/hooks/useUserRole.jsx
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../provider/AuthContext";
import useAxiosSecure from "./useAxiosSecure";


const  useUserRole=()=> {
  const { user } = use(AuthContext); 
  const axiosSecure = useAxiosSecure();


  const email = user?.email ?? null;
  const queryKey = [ email];

  const {
    data: role = null,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    enabled: !!email,
    queryFn: async () => {
      if (!email) return null;
      // const res = await axiosSecure.get(`/user/role/${encodeURIComponent(email)}`);
      const res = await axiosSecure.get(`/user/role/${email}`);
      return res.data?.role ?? null;
    },
  });
 
  return {
  
    role,
    isLoading,
    error,
  };
}

export default useUserRole