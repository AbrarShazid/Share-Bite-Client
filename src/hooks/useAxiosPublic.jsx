// src/hooks/useAxiosPublic.js
import axios from 'axios';

const useAxiosPublic = axios.create({
  baseURL: 'https://share-bite-server.vercel.app'
});

export default useAxiosPublic;