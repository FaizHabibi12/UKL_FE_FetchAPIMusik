import axios from "axios";
import { BASE_API_URL } from "../global";

const axiosInstance = axios.create({
    baseURL: BASE_API_URL
})


export async function get<T = unknown>(url: string, token?: string): Promise<T | { message: string }> {
  try {
    const res = await axiosInstance.get<T>(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return res.data;
  } catch (error) {
    console.error("GET error:", error);
    return { message: "Network error" };
  }
}


export async function post(url: string, data: unknown, token: string) {
  const res = await axiosInstance.post(url, data, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}


  
 
export async function put(url: string, data: unknown, token: string) {
  try {
    const res = await axiosInstance.put(url, data, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return res.data;
  } catch (error) {
    console.error("PUT error:", error);
    return { message: "Network error" };
  }
}
 
export async function del(url: string, token: string) {
  try {
    const res = await axiosInstance.delete(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return res.data;
  } catch (error) {
    console.error("DELETE error:", error);
    return { message: "Network error" };
  }
}