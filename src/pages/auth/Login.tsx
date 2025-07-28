import { LoginForm } from '@/components/auth/LoginForm';
import { DogIcon } from "lucide-react";
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <DogIcon className="size-4" />
          </div>
          Pooch Pet Owner
        </a>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;