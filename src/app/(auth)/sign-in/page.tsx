'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts'
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sginInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

export default function SignInForm() {
  
  

  const router = useRouter();
  const { toast } = useToast();
  

  const form = useForm<z.infer<typeof sginInSchema>>({
    resolver: zodResolver(sginInSchema),
    defaultValues: {
      identifier:'',
      password: '',
    },
  });

  

  const onSubmit = async (data: z.infer<typeof sginInSchema>) => {
   const result =  await signIn('credentials',{
        redirect: false,
        identifier:data.identifier,
        password: data.password
    })

    if(result?.error){
      if (result.error === 'CredentialsSignin'){
        toast({
            title: "Login Failed",
            description: "Incorrect username/email or password",
            variant:"destructive"
        })
      }
    }

    if(result?.url){
        router.replace('/dashboard')
    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to Hide MyWord
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full' type="submit">Sign In</Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
}