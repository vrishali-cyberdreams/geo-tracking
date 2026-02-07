"use client";

import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { signInUserSchema } from "@/lib/schema/user.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FieldGroup } from "@/components/ui/field";

export default function LoginUserForm() {
  const form = useForm<z.input<typeof signInUserSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: z.input<typeof signInUserSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message ?? "Invalid credentials");
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("User logged in successfully");
          redirect("/");
        },
        onRequest: () => {
          setLoading(true);
        },
      }
    );
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <div className="py-4 px-4">
            <CardHeader className="mb-6 text-center">
              <CardTitle>Welcome Back - Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-2">
                {/* <Field>
                  <Button variant="outline" type="button" className="text-black" onClick={googleSignupHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </Field>
                <p className="text-muted-foreground text-sm text-center">Or continue with</p> */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Email</Label>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Password</Label>
                              <Input type="password" {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "SignIn"
                          )}
                        </Button>
                        <p className="text-muted-foreground text-sm text-center">Login as a user? <Link href="/user" className="underline">Click</Link> here</p>
                      </div>
                    </div>
                  </form>
                </Form>
              </FieldGroup>
            </CardContent>
          </div>
        </Card>
      </div>
    </>
  );
}
