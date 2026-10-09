"use client";

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "@/app/schemas/blog";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const CreateRoute = () => {
  const mutation = useMutation(api.posts.createPost);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
    }
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof blogSchema>) {
    startTransition(async () => {
      try {
        await mutation({
          body: values.content,
          title: values.title,
        })
        toast.add({ type: "success", description: "Post created!" })
        router.push("/blog")
      } catch (error) {
        toast.add({
          type: "error",
          description: error instanceof Error ? error.message : "Could not create post",
          priority: "high",
        })
      }
    })
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Creat Post</h1>
        <p className="text-xl text-muted-foreground pt-4">Share your thoughts with the big world...</p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create blog article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel>
                        Title
                      </FieldLabel>

                      <Input aria-invalid={fieldState.invalid} placeholder="Super cool title" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel>
                        Content
                      </FieldLabel>

                      <Textarea aria-invalid={fieldState.invalid} placeholder="Super cool blog content" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />

              <Button type="submit" disabled={isPending}>
                {
                  isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Pending...</span>
                    </>
                  ) : (
                    <span>Create Post</span>
                  )
                }
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRoute