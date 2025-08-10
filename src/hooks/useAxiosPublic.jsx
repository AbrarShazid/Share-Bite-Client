// src/hooks/useAxiosPublic.js
import axios from 'axios';

const useAxiosPublic = axios.create({
  baseURL: 'https://share-bite-a11-server.vercel.app'
});

export default useAxiosPublic;