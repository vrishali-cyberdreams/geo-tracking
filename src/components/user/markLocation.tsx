"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FieldGroup } from "@/components/ui/field";
import { locationSchema } from "@/lib/schema/location.schema";
import { createLocation } from "@/actions/location.actions";

const MARK_LOCATION_KEY = "mark_location_lock";
const LOCK_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export default function MarkLocation() {
  const form = useForm<z.input<typeof locationSchema>>({
    defaultValues: {
      email: ""
    },
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: z.input<typeof locationSchema>) => {
    setLoading(true);

    const value = localStorage.getItem(MARK_LOCATION_KEY);
    if (value && Date.now() < Number(value)) {
      toast.error("Location is already marked");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const response = await createLocation({
          email: values.email,
          lat: latitude,
          long: longitude
        });

        if (response.status == 'ERROR') {
          toast.error(response.message);
        } else {
          toast.success("Location marked successfully");
        }
        setLoading(false);
        const expiresAt = Date.now() + LOCK_DURATION_MS;
        localStorage.setItem(MARK_LOCATION_KEY, expiresAt.toString());
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("User denied the request for Geolocation.");
            setLoading(false);
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            setLoading(false);
            break;
          case error.TIMEOUT:
            toast.error("The request to get user location timed out.");
            setLoading(false);
            break;
          default:
            toast.error("An unknown error occurred.");
            setLoading(false);
        }
      }
    );
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <div className="py-4 px-4">
            <CardHeader className="mb-6 text-center">
              <CardTitle>Welcome Back - User</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-2">
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
                      <div className="flex flex-col gap-3">
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Mark Location"
                          )}
                        </Button>
                        <div className="flex flex-col gap-1">
                          <p className="text-muted-foreground text-sm text-center">Don{"'"}t have an account? <Link href="/signup" className="underline">Register</Link> here</p>
                          <p className="text-muted-foreground text-sm text-center">Login as an admin? <Link href="/login" className="underline">Click</Link> here</p>
                        </div>
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
