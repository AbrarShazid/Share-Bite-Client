import React from 'react';
import { Link } from 'react-router';

const Blog = () => {
  return (
    <div>
      Its a blog page 
<Link to={'/'} className='btn bg-gray-600 text-white px-4 py-2 rounded-md '>
Go home
</Link>
     
    </div>
  );
};

export default Blog;