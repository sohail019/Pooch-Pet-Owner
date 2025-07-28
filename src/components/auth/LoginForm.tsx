import { useNavigate } from "react-router-dom";
import { AuthForm } from "../common/AuthForm";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/authSlice";
import { login as loginApi, LoginPayload } from "@/controllers/auth/authController";
import { toast } from "react-toastify";

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <AuthForm
      title="Welcome back"
      description="Login with your Apple or Google account"
      fields={[
        {
          id: "emailOrPhone",
          label: "Email or Phone",
          type: "text",
          placeholder: "m@example.com or 98210...",
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      ]}
      buttonText="Login"
      bottomText={
        <>
          Don&apos;t have an account?{" "}
          <a className="underline underline-offset-4" href="/register">
            Sign up
          </a>
        </>
      }
      onSubmit={(values: Record<string, string>) => {
        const payload: LoginPayload = {
          emailOrPhone: values.emailOrPhone,
          password: values.password,
        };
        console.log("Login payload:", payload);
        loginApi(payload)
          .then((data) => {
            console.log("Login API response:", data);
            const { user, accessToken } = data.data;
            dispatch(setToken({ token: accessToken, user }));
            localStorage.setItem("token", accessToken);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
          })
          .catch((err: unknown) => {
            console.error("Login error:", err);
            toast.error(
              (typeof err === "object" &&
                err !== null &&
                "response" in err &&
                (err as any).response?.data?.message) ||
                "Login failed. Please check your credentials."
            );
          });
      }}
    />
  );
}
