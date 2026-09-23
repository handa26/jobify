"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn } from "@/lib/auth/auth-client";

export default function SignIn() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(
					result.error.message ?? "Failed to sign in. Something went wrong!",
				);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
			setError("An unexpected error occured.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-white p-4">
			<Card className="w-full max-w-md border-gray-200 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-black dark:text-foreground">
						Sign In
					</CardTitle>
					<CardDescription className="text-gray-600 dark:text-muted-foreground">
						Enter your credentials to access your account.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<CardContent className="space-y-4">
						{error && (
							<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700 dark:text-muted-foreground">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="john@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700 dark:text-muted-foreground">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								minLength={8}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 dark:text-foreground"
							disabled={loading}
						>
							{loading ? "Logging in..." : "Sign In"}
						</Button>
						<p className="text-center text-sm text-gray-600 dark:text-muted-foreground">
							Don't have an account?{" "}
							<Link
								href="/sign-up"
								className="font-medium text-primary hover:underline"
							>
								Sign Up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
