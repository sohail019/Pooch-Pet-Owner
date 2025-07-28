import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type Field = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
};

type AuthFormProps = {
  className?: string;
  title: string;
  description: string;
  fields: Field[];
  buttonText: string;
  bottomText?: React.ReactNode;
  onSubmit: (values: Record<string, string>) => void;
};

export function AuthForm({
  className,
  title,
  description,
  fields,
  buttonText,
  bottomText,
  onSubmit,
}: AuthFormProps) {
  const [form, setForm] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full">
                Login with Apple
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-6 mb-6">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div className="grid gap-6">
              {fields.map((field) => (
                <div className="grid gap-3" key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    value={form[field.id] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">
                {buttonText}
              </Button>
            </div>
            {bottomText && (
              <div className="text-center text-sm mt-4">{bottomText}</div>
            )}
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}