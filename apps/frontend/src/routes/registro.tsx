import type { SignUpPayload } from "@repo/schemas/user";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient, RegisterForm } from "@/modules/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const Route = createFileRoute("/registro")({
  component: RegistroPage,
});

function RegistroPage() {
  const navigate = useNavigate();

  const handleRegister = async (data: SignUpPayload) => {
    const result = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Error al registrarse");
      return;
    }

    toast.success("¡Cuenta creada exitosamente!");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="font-bold text-3xl">Crear cuenta</CardTitle>
          <CardDescription className="text-base">
            Regístrate para comenzar a compartir contenido
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RegisterForm onSubmit={handleRegister} />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link
              to="/iniciar-sesion"
              className="cursor-pointer text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
