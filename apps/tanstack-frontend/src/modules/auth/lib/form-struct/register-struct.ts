import type { SignUpPayload } from "@repo/schemas";
import { Lock, Mail, User } from "lucide-react";
import type { FieldType } from "@/shared/types/form/field";
import { SUPPORTED_FIELDS } from "@/shared/types/form/supported-fields";

export const registerFormStruct: FieldType<keyof SignUpPayload>[] = [
  {
    name: "name",
    label: "Nombre completo",
    type: SUPPORTED_FIELDS.TEXT,
    icon: User,
    placeholder: "Juan Pérez",
  },
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
    description:
      "Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números",
  },
];
