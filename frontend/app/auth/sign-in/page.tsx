'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SignInForm from "@/components/auth/signin-form";

export default function SignInPage() {
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden px-4">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 -z-10 bg-zinc-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <Card className="w-full max-w-md glass-card p-6 rounded-[2rem] border-white/5 relative overflow-hidden group shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                {/* Top decorative gradient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>

                <CardHeader className="space-y-3 pb-8">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center mx-auto mb-2 shadow-xl shadow-indigo-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <CardTitle className="text-3xl font-black text-center tracking-tighter text-white">
                        Welcome <span className="premium-text-gradient">Back</span>
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-500 font-medium">
                        Securely sign in to your TODO<span className="text-indigo-500">PRO</span> workspace
                    </CardDescription>
                </CardHeader>
                <div className="px-2">
                    <SignInForm />
                </div>
            </Card>
        </div>
    );
}