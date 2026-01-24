'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

interface SignInFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function SignInForm({ onSuccess, onError }: SignInFormProps) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError("");
        try {
            await login(data.email, data.password);

            // Successful login
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dashboard/tasks');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'An error occurred during login';
            setError(errorMsg);
            if (onError) {
                onError(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                    <Input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        placeholder="name@example.com"
                        className="bg-zinc-900/50 border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600 h-12 rounded-xl transition-all"
                    />
                    {errors.email && <span className="text-red-400 text-[10px] font-medium ml-1">{String(errors.email.message)}</span>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                    </div>
                    <Input
                        {...register("password", {
                            required: "Password is required"
                        })}
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-900/50 border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600 h-12 rounded-xl transition-all"
                    />
                    {errors.password && <span className="text-red-400 text-[10px] font-medium ml-1">{String(errors.password.message)}</span>}
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 premium-gradient hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/10 font-bold text-white rounded-xl mt-2"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Signing in...</span>
                    </div>
                ) : 'Sign In to Workspace'}
            </Button>

            <div className="pt-2 text-center">
                <p className="text-sm text-zinc-500">
                    New here?{' '}
                    <a href="/auth/sign-up" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Create your account</a>
                </p>
            </div>
        </form>
    );
}