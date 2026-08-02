import type { SignInPayload } from "@repo/schemas/user";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm, signIn } from "@/modules/auth";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/iniciar-sesion")({
  validateSearch: (search) => searchSchema.parse(search),
  component: IniciarSesionPage,
});

function IniciarSesionPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect } = useSearch({ from: "/iniciar-sesion" });

  const handleLogin = async (data: SignInPayload) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Error al iniciar sesión");
      return;
    }
    toast.success("¡Bienvenido de vuelta!");
    await router.invalidate();
    navigate({ to: redirect || "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="font-bold text-3xl">Crop App</CardTitle>
          <CardDescription className="text-base">
            Inicia sesión para compartir y explorar contenido
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm onSubmit={handleLogin} />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link
              to="/registro"
              className="cursor-pointer text-primary hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
