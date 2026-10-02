"use client";

import Link from "next/link";
import { useState } from "react";

import AuthLayout from "@/components/auth/auth-layout";
import FormError from "@/components/auth/form-error";
import FormField from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";

import { useAuthForm } from "@/lib/auth/use-auth-form";
import { signUp } from "@/lib/auth/auth-client";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loading, error, handleSubmit } = useAuthForm(
		async (v: { name: string; email: string; password: string }) =>
		signUp.email(v),
		"Failed to sign up. Something went wrong.",
	);

	return (
		<AuthLayout
			title="Create your account"
			description="Start organizing your job search in minutes."
			footer={
				<>
					Already have an account?{" "}
					<Link
						href="/sign-in"
						className="font-medium text-primary hover:underline"
					>
						Sign in
					</Link>
				</>
			}
		>
			<form
				onSubmit={(e) => handleSubmit(e, { name, email, password })}
				className="space-y-4"
			>
				{error && <FormError message={error} />}

				<FormField
					id="name"
					label="Name"
					type="text"
					placeholder="John Doe"
					autoComplete="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>

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
					placeholder="At least 8 characters"
					autoComplete="new-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={8}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? "Creating account..." : "Create account"}
				</Button>
			</form>
		</AuthLayout>
	);
}
