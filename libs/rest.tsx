
import axios, {Axios} from 'axios';
import {HOST} from "@/constants";

const API: Axios = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  }
})

export { API };
