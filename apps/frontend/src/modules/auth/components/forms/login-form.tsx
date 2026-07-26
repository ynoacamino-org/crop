import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInPayload } from "@repo/schemas";
import { SignInPayloadSchema } from "@repo/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { InferItem } from "@/components/form/infer-field";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { loginFormStruct } from "@/modules/auth/lib/form-struct/login-struct";

interface LoginFormProps {
  onSubmit?: (data: z.infer<typeof SignInPayloadSchema>) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInPayload>({
    resolver: zodResolver(SignInPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: SignInPayload) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
        {loginFormStruct.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof SignInPayload}
            render={({ field: formField, fieldState }) => (
              <InferItem
                {...field}
                {...formField}
                fieldState={fieldState}
                disabled={isLoading}
              />
            )}
          />
        ))}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}
