
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../common/AuthForm";

export function LoginForm() {
  const navigate = useNavigate();

  return (

          <AuthForm
            title="Welcome back"
            description="Login with your Apple or Google account"
            fields={[
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "m@example.com",
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
            onSubmit={() => {
              localStorage.setItem("token", "dummy-token");
              navigate("/");
            }}
          />

  );
}
