"use client";

import { singUpSchema } from "@/app/schemas/auth"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

const SingUpPage = () => {
  const form = useForm({
    resolver: zodResolver(singUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    }
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: z.infer<typeof singUpSchema>) {
    startTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "Account created successfully",
            })
            router.push("/")
          },
          onError: (error) => {
            toast.add({
              type: "error",
              description: error.error?.message ?? "Could not sing up",
              priority: "high",
            })
          }
        },
      });
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sing up
        </CardTitle>
        <CardDescription>
          Create an account to get started
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>
                      Full Name
                    </FieldLabel>

                    <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>
                      Email
                    </FieldLabel>

                    <Input aria-invalid={fieldState.invalid} placeholder="john@doe.com" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>
                      Password
                    </FieldLabel>

                    <Input aria-invalid={fieldState.invalid} placeholder="*****" type="password" {...field} />
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
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Sing up</span>
                )
              }
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default SingUpPage