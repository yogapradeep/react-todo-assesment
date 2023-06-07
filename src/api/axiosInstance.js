import axios from "axios";
import { MockAPI } from "../constants/apiKeys";

export const api = axios.create({
  baseURL: `https://6480ae0af061e6ec4d49b390.mockapi.io/endpoint` 
});

// https://stage.api.sloovi.com/login

