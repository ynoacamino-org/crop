"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SignUpPayload } from "@repo/schemas";
import { SignUpPayloadSchema } from "@repo/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { InferItem } from "@/shared/components/form/infer-field";
import { Button } from "@/shared/components/ui/button";
import { Form, FormField } from "@/shared/components/ui/form";
import { registerFormStruct } from "../../lib/form-struct/register-struct";

interface RegisterFormProps {
  onSubmit?: (data: z.infer<typeof SignUpPayloadSchema>) => Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpPayload>({
    resolver: zodResolver(SignUpPayloadSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data: SignUpPayload) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
        {registerFormStruct.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField, fieldState }) => (
              <InferItem {...field} {...formField} fieldState={fieldState} />
            )}
          />
        ))}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </Form>
  );
}
