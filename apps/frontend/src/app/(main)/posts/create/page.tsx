"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { RichTextEditor } from "@/shared/components/lexical/rich-text-editor";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Form } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

const formSchema = z.object({
  username: z.string().min(1),
  bio: z.string(),
});

export default function CreatePostPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast(
        <pre className="mt-2 w-85 rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch {
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 py-10"
      >
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="shadcn"
            {...form.register("username")}
          />
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldError>{form.formState.errors.username?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea
            id="bio"
            placeholder="Placeholder"
            {...form.register("bio")}
          />
          <FieldDescription>
            You can @mention other users and organizations.
          </FieldDescription>
          <FieldError>{form.formState.errors.bio?.message}</FieldError>
        </Field>
        <RichTextEditor />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
