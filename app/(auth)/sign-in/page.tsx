"use client";

import Link from "next/link";
import { useState } from "react";

import AuthLayout from "@/components/auth/auth-layout";
import FormError from "@/components/auth/form-error";
import FormField from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";

import { useAuthForm } from "@/lib/auth/use-auth-form";
import { signIn } from "@/lib/auth/auth-client";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loading, error, handleSubmit } = useAuthForm(
		async (v: { email: string; password: string }) => signIn.email(v),
		"Failed to sign in. Something went wrong.",
	);

	return (
		<AuthLayout
			title="Welcome back"
			description="Sign in to continue tracking your applications."
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link
						href="/sign-up"
						className="font-medium text-primary hover:underline"
					>
						Sign up
					</Link>
				</>
			}
		>
			<form
				onSubmit={(e) => handleSubmit(e, { email, password })}
				className="space-y-4"
			>
				{error && <FormError message={error} />}

				<FormField
					id="email"
					label="Email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<FormField
					id="password"
					label="Password"
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={8}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? "Signing in..." : "Sign in"}
				</Button>
			</form>
		</AuthLayout>
	);
}
