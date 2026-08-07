import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { RichTextEditor } from "@/shared/components/lexical/rich-text-editor";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/ui/password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import type { FieldType } from "@/shared/types/form/field";
import { SUPPORTED_FIELDS } from "@/shared/types/form/supported-fields";

function InferItem<
  FieldName extends string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FieldType<FieldName> &
    ControllerRenderProps<TFieldValues, TName> & {
      fieldState: ControllerFieldState;
      disabled?: boolean;
    },
) {
  const {
    type,
    label,
    description,
    fieldState,
    icon: Icon,
    placeholder,
    readonly,
    disabled,
    ...rest
  } = props;

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>
        {Icon && <Icon className="mr-2" size={16} />}
        {label}
      </FieldLabel>
      {(() => {
        switch (type) {
          case SUPPORTED_FIELDS.TEXT:
            return (
              <Input
                type="text"
                placeholder={placeholder}
                readOnly={readonly}
                disabled={disabled}
                {...rest}
              />
            );

          case SUPPORTED_FIELDS.EMAIL:
            return (
              <Input
                type="email"
                placeholder={placeholder}
                readOnly={readonly}
                disabled={disabled}
                {...rest}
              />
            );

          case SUPPORTED_FIELDS.PASSWORD:
            return (
              <PasswordInput
                placeholder={placeholder}
                readOnly={readonly}
                disabled={disabled}
                {...rest}
              />
            );

          case SUPPORTED_FIELDS.TEXTAREA:
            return (
              <Textarea
                placeholder={placeholder}
                readOnly={readonly}
                disabled={disabled}
                {...rest}
              />
            );

          case SUPPORTED_FIELDS.NUMBER:
            return (
              <Input
                type="number"
                placeholder={placeholder}
                readOnly={readonly}
                disabled={disabled}
                {...rest}
              />
            );

          case SUPPORTED_FIELDS.RICH_TEXT:
            return (
              <RichTextEditor
                value={rest.value}
                onChange={rest.onChange}
                disabled={disabled}
              />
            );

          case SUPPORTED_FIELDS.SELECT:
            return (
              <Select
                value={rest.value}
                onValueChange={rest.onChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {"options" in props &&
                    props.options.map((option) => (
                      <SelectItem key={option.key} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            );

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
