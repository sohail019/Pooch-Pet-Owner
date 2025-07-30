import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const getUser = async () => {
  try {
    const res = await axiosInstance.get("/user/profile");
    return res.data.data;
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to fetch user details."
    );
    throw err;
  }
};
