import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaQuoteLeft } from 'react-icons/fa';
import testimonialImage from '../../assets/testimonial.webp';



import love from "../../assets/love_Animation.json"
import Lottie from 'lottie-react';



const testimonialsData = [
  {
    image: "https://i.ibb.co.com/Cp78MW3n/Male-5.jpg",
    name: "John Doe",
    text: "This organization changed my life. Their support was incredible and heartfelt.",
    profession: "Businessman"
  },
  {
    image: "https://i.ibb.co.com/vxB29hp8/Female-6.jpg",
    name: "Maria Lopez",
    text: "Thanks to this team, our community received essential help right on time.",
    profession: "Lawyer"
  },
  {
    image: "https://i.ibb.co.com/27nqF0S2/kane.jpg",
    name: "Kane Williams",
    text: "A genuine force for good—professional, passionate, and always caring.",
    profession: "Cricketer"
  },
  {
    image: "https://i.ibb.co.com/vxB29hp8/Female-1.jpg",
    name: "Sofia Tran",
    text: "I’ve volunteered here and I’m amazed by the impact they make daily.",
    profession: "Journalist"
  },
  {
    image: "https://i.ibb.co.com/Vrhq5CM/Rashid.jpg",
    name: "Rashid",
    text: "They connect food, people, and compassion in ways I've never seen before.",
    profession: "Cricketer"
  },
];


const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-white py-8 lg:py-16 px-2 md:px-4 lg:px-10 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-5  items-center  min-h-[80vh]">

        {/* Left Box with Testimonial Content */}
        <div className="bg-white shadow-xl rounded-2xl p-8 lg:p-10 col-span-3 lg:-mr-20 z-10">
          <h2 className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-1">Testimonials</h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            What People Say About Our Organization
          </h1>

          <div className="w-16 h-1.5 bg-yellow-400 rounded-full mb-3" />

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
          >
            {testimonialsData.map((item, idx) => (
              <SwiperSlide className='pb-8' key={idx}>
                <div>
                  <FaQuoteLeft className="text-orange-300 text-4xl opacity-70" />
                  <p className="text-gray-600 text-base leading-relaxed mb-3">{item.text}</p>
                  <div className="flex items-center gap-4 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover  "
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm">{item.profession}</p>
                    </div>
                    <div className='absolute lg:hidden z-10 opacity-10  ml-[70%] sm:ml-[80%] mb-[2%]'>
                      <Lottie className='w-20 sm:w-32' animationData={love}></Lottie>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>









        </div>

        {/* Right Side Image */}
        <div className="hidden lg:block rounded-xl overflow-hidden col-span-2 h-full">
          <img
            src={testimonialImage}
            alt="Happy Child"
            className="w-full h-full object-cover rounded-xl shadow-xl "
          />
        </div>



      </div>
    </section>
  );
};

export default Testimonials;
