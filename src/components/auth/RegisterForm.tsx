import { useNavigate } from "react-router-dom";
import { AuthForm } from "../common/AuthForm";

export function RegisterForm() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Create your account"
      description="Register with your Apple or Google account"
      fields={[
        { id: "name", label: "Name", type: "text", placeholder: "Your name" },
        { id: "email", label: "Email", type: "email", placeholder: "m@example.com" },
        { id: "phone", label: "Phone", type: "tel", placeholder: "Your phone" },
        { id: "password", label: "Password", type: "password", placeholder: "Password" },
      ]}
      buttonText="Register"
      bottomText={
        <>
          Already have an account?{" "}
          <a className="underline underline-offset-4" href="/login">
            Login
          </a>
        </>
      }
      onSubmit={(values) => {
        localStorage.setItem("token", "dummy-token");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
          })
        );
        navigate("/");
      }}
    />
  );
}