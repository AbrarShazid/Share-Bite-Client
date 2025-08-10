
import loadingAnimation from "../assets/loading_animation.json"
import Lottie from "lottie-react";
const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center '>
  

       <Lottie className="w-[50%]" animationData={loadingAnimation} loop={true} />




    </div>
  );
};

export default LoadingSpinner;