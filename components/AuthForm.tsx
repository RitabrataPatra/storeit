"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.action";
import OtpModal from "./OtpModal";


type FormType = "signin" | "signup";

const AuthFormSchema = (formType : FormType) => {return z.object({
    fullName:  formType === "signup" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
  })};


const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountId, setAccountId] = useState(null);

  // 1. Define your form.
  const formSchema = AuthFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  //   this happens when you click on the submit button.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      const user = 
        type === "signup" ?
      await createAccount({
        fullName : values.fullName || "",
        email : values.email
      }) : await signInUser({email : values.email})
      setAccountId(user.accountId);
    } catch  {
      setError("Failed to create account. Please try again.");
    }finally {
      setIsLoading(false);
    }
    
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "signin" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "signup" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...field}
                        className="shad-input"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Email"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "signin" ? "Sign In" : "Sign Up"}

            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {error && <p className="error-message">{error}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "signin"
                ? "Don't have an account?"
                : "Have an account?"}{" "}
            </p>
            <Link
              href={type === "signin" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "signin" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>


      {accountId && (
        <OtpModal email = {form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
