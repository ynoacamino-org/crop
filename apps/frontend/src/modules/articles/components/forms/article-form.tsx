import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateArticleInput } from "@repo/schemas/article";
import { createArticleSchema } from "@repo/schemas/article";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { articleFormStruct } from "@/modules/articles/lib/form-struct/article-form-struct";
import { InferItem } from "@/shared/components/form/infer-field";
import { Button } from "@/shared/components/ui/button";
import { Form, FormField } from "@/shared/components/ui/form";

interface ArticleFormProps {
  initialValues?: Partial<CreateArticleInput>;
  mode?: "create" | "edit";
  onSubmit?: (data: CreateArticleInput) => Promise<void>;
  onCancel?: () => void;
}

export function ArticleForm({
  initialValues,
  mode = "create",
  onSubmit,
  onCancel,
}: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: initialValues?.title || "",
      slug: initialValues?.slug || "",
      excerpt: initialValues?.excerpt || "",
      content: initialValues?.content || "",
      status: initialValues?.status || "DRAFT",
    },
  });

  // Auto-generate slug from title (only in create mode)
  const titleValue = form.watch("title");
  useEffect(() => {
    if (mode === "create" && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      if (form.getValues("slug") !== slug) {
        form.setValue("slug", slug, { shouldValidate: true });
      }
    }
  }, [titleValue, form, mode]);

  const handleSubmit = async (data: CreateArticleInput) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isLoading
    ? mode === "edit"
      ? "Guardando cambios..."
      : "Creando artículo..."
    : mode === "edit"
      ? "Guardar cambios"
      : "Crear Artículo";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {articleFormStruct.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
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

        <div className="flex justify-end gap-4 border-t pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
