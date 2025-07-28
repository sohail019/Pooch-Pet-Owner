import axiosInstance from "@/utils/axiosInstance";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  const res = await axiosInstance.post("/user/register", payload);
  console.log("Register API response:", res.data);
  return res.data;
}

export async function login(payload: LoginPayload) {
  const res = await axiosInstance.post("/auth/login", payload);
  console.log("Login API response:", res.data);
  return res.data;
}