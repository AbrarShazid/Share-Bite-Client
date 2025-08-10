import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import { Link } from 'react-router';

const fetchTopFoods = async () => {
  const res = await axios.get('https://share-bite-a11-server.vercel.app/featured-foods');
  return res.data;
};

const FeatureFood = () => {
  const { data: foods = [], isLoading, error } = useQuery({
    queryKey: ['topFoods'],
    queryFn: fetchTopFoods,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">Something went wrong.</p>;

  return (
    <section className="px-[5%] -mt-20 py-32 bg-gradient-to-b from-[#fffaf5] to-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#ff6d03]">Featured Foods</h2>
        <p className="text-gray-600 mt-2">Top shared meals based on quantity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {foods.map((food) => (
          <Link
            key={food._id}
            to={`/food/${food._id}`}
            className="block hover:no-underline"
          >
          <div className="bg-white p-6 rounded-2xl shadow-md border-0 hover:border hover:border-[#ff6d0332] transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[450px]">

              <div className="relative overflow-hidden rounded-xl h-48 mb-3">
                <img
                  src={food.img}
                  alt={food.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex flex-col  justify-between flex-wrap items-center gap-2 text-sm mb-1">
                 <h3 className="text-center lg:text-left text-2xl font-semibold text-[#ff6d03] mb-1">{food.name}</h3>
               <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                📍 {food.location}
              </span>
              </div>
             
              <div className="flex flex-col lg:flex-row flex-wrap items-center gap-2 text-sm mb-3">
               
                {/* <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  📍 {food.location}
                </span> */}
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 text-center">{food.notes}</p>
               <div className="flex justify-center mt-4">
                            <button
    
                              className="inline-block mt-auto text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300          "
                            >
                              View Details
                            </button>
                          </div>
            </div>

            
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link className="relative inline-block px-8 py-3 bg-[#ff6d03] text-white font-semibold text-lg rounded-full shadow-lg transition-all duration-300 hover:bg-[#e65c00] hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6d03]" to="/available-food">
          
            <span className="relative z-10">Show All</span>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition duration-300"></span>
         
        </Link>
      </div>
    </section>
  );
};

export default FeatureFood;
