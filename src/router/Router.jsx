import { createBrowserRouter } from "react-router";
import Error from "../pages/Error"
import HomeLayOut from "../Layout/HomeLayOut";
import Home from "../pages/Home"
import AvailableFood from "../pages/AvailableFood";
import AddFood from "../pages/AddFood";
import ManageMyFood from "../pages/ManageMyFood";
import MyFoodReq from "../pages/MyFoodReq";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import PrivateRoute from "../provider/PrivateRoute";
import FoodDetails from "../pages/FoodDetails";
import Update from "../pages/Update";
import AboutUsDetails from "../pages/AboutUsDetails";
import ForgotPass from "../pages/ForgotPass";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayOut></HomeLayOut>,
    children: [
      {
        index: true,
        element: <Home></Home>
      }
      ,
      {
        path: "/available-food",
        element: <AvailableFood></AvailableFood>
      },
      {
        path:"/about-us",
       element:<AboutUsDetails></AboutUsDetails>
      },
      {
        path: "/food/:id",
       
        element: 
          <FoodDetails></FoodDetails>
   ,
      },
      {
        path: "/add-food",

        element: <PrivateRoute>
          <AddFood></AddFood>
        </PrivateRoute>

      },
      {
        path: "/manage-my-food",
        element: <PrivateRoute>
          <ManageMyFood></ManageMyFood>
        </PrivateRoute>
      },
      {
        path: "/update/:id",
       
        element: <PrivateRoute>
          <Update></Update>
        </PrivateRoute>
      },
      {
        path: "/food-request",
        element: <PrivateRoute>
          <MyFoodReq></MyFoodReq>
        </PrivateRoute>
      },
      {
        path: "/login",
        element: <LogIn></LogIn>
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path:"/forgot-pass",
        element:<ForgotPass></ForgotPass>

      }
    ]
  },

  {
    path: "*",
    element: <Error></Error>
  },
]);

export default router;

