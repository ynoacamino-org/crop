import type { SignInPayload } from "@repo/schemas";
import { Lock, Mail } from "lucide-react";
import type { FieldType } from "@/shared/types/form/field";
import { SUPPORTED_FIELDS } from "@/shared/types/form/supported-fields";

export const loginFormStruct: FieldType<keyof SignInPayload>[] = [
  {
    name: "email",
    label: "Correo electrónico",
    type: SUPPORTED_FIELDS.EMAIL,
    icon: Mail,
    placeholder: "tu@email.com",
  },
  {
    name: "password",
    label: "Contraseña",
    type: SUPPORTED_FIELDS.PASSWORD,
    icon: Lock,
    placeholder: "••••••••",
  },
];
