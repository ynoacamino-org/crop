import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import type { FieldType } from "@/shared/types/form/field";
import { SUPPORTED_FIELDS } from "@/shared/types/form/supported-fields";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { PasswordInput } from "../ui/password";

function InferItem<
  FieldName extends string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FieldType<FieldName> &
    ControllerRenderProps<TFieldValues, TName> & {
      fieldState: ControllerFieldState;
    },
) {
  const { type, label, description, fieldState, ...rest } = props;

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>
        {props.icon && <props.icon className="" size={16} />}
        {label}
      </FieldLabel>
      {(() => {
        switch (type) {
          case SUPPORTED_FIELDS.PASSWORD:
            return <PasswordInput {...rest} />;

          default:
            return null;
        }
      })()}
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export { InferItem };
