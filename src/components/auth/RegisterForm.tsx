import { useNavigate } from "react-router-dom";
import { AuthForm } from "../common/AuthForm";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/authSlice";
import { register as registerApi, RegisterPayload } from "@/controllers/auth/authController";
import { toast } from "react-toastify";
import { z } from "zod";

// Define validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  
  email: z.string()
    .email("Please enter a valid email address"),
  
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = (values: Record<string, string>) => {
    try {
      registerSchema.parse(values);
      return null; // No errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a user-friendly format
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0].toString();
            errors[field] = err.message;
          }
        });
        return errors;
      }
      return { form: "Validation failed" };
    }
  };

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
      validate={validateForm}
      onSubmit={async (values: Record<string, string>) => {
        // Validate the form again just to be safe
        const errors = validateForm(values);
        if (errors) {
          // Show first error as toast
          const firstError = Object.values(errors)[0];
          if (firstError) {
            toast.error(firstError);
            return;
          }
        }

        const payload: RegisterPayload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
        };
        
        try {
          const data = await registerApi(payload);
          // Use accessToken, not token!
          const { accessToken, user } = data.data;
          dispatch(setToken({ token: accessToken, user }));
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          
          console.log("Registration successful, navigating to onboarding");
          navigate("/onboarding/add-pet");
        } catch (err: any) {
          console.error("Registration error:", err);
          toast.error(
            err?.response?.data?.message ||
              "Registration failed. Please try again."
          );
        }
      }}
    />
  );
}