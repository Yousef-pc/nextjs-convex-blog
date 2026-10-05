"use client"

import { loginSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  function onSubmit(data: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "Logged in successfuly",
            })
            router.push("/")
          },
          onError: (error) => {
            toast.add({
              type: "error",
              description: error.error?.message ?? "Could not login",
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
          Login
        </CardTitle>
        <CardDescription>
          Login to get started right away
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
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
                  <span>Login</span>
                )
              }
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default LoginPage