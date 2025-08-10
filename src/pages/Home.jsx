import React from 'react';
import Banner from '../Components/Home/Banner';
import FeatureFood from '../Components/Home/FeatureFood';
import AboutUs from '../Components/Home/AboutUs';
import Testimonials from '../Components/Home/Testimonials';

const Home = () => {
  return (
    <div >


      <Banner></Banner>
      <FeatureFood></FeatureFood>
      <AboutUs></AboutUs>
      <Testimonials></Testimonials>

    </div>
  );
};

export default Home;