import type { LucideProps } from "lucide-react";
import type React from "react";
import type { SelectOption, UploadFileConfig } from "./config-field";
import type { SUPPORTED_FIELDS } from "./supported-fields";

export type SupportedFieldType =
  (typeof SUPPORTED_FIELDS)[keyof typeof SUPPORTED_FIELDS];

type BaseField<T extends string> = {
  name: T;
  label: string;
  icon?: React.ComponentType<LucideProps>;
  description?: string;
  placeholder?: string;
  readonly?: boolean;
};

export type FieldType<T extends string> = BaseField<T> &
  (
    | {
        type:
          | typeof SUPPORTED_FIELDS.TEXT
          | typeof SUPPORTED_FIELDS.EMAIL
          | typeof SUPPORTED_FIELDS.TEXTAREA
          | typeof SUPPORTED_FIELDS.PASSWORD
          | typeof SUPPORTED_FIELDS.NUMBER
          | typeof SUPPORTED_FIELDS.RICH_TEXT;
      }
    | {
        type: typeof SUPPORTED_FIELDS.UPLOAD_FILE;
        contig: UploadFileConfig;
      }
    | {
        type: typeof SUPPORTED_FIELDS.SELECT;
        options: SelectOption[];
      }
  );
