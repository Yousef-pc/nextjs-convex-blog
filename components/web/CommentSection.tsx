"use client"

import { Card } from "../ui/card";
import { CardHeader } from "../ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { CardContent } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comments";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { toast } from "../ui/toast";
import { useTransition } from "react";

const CommentSection = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<"posts"> }>();
  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
    }
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment({
          body: data.body,
          postId: params.postId,
        });

        toast.add({
          type: "success",
          description: "Comment created",
        });

        form.reset();
      } catch (error) {
        toast.add({
          type: "error",
          description: error instanceof Error ? error.message : "Could not create comment",
          priority: "high",
        });
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>
                    Comment
                  </FieldLabel>

                  <Textarea
                    aria-invalid={fieldState.invalid}
                    placeholder="Share your thoughts"
                    {...field}
                  />
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
                <span>Submit</span>
              )
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CommentSection