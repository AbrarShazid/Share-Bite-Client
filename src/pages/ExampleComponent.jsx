
import React from "react";
import useUserRole from "../hooks/useUserRole";




export default function ExampleComponent() {
    const { role,  isLoading, error   } = useUserRole();
  return (
    <div>
     <div>User role: {role ?? "not set"}</div>
      
    </div>
  )
}

