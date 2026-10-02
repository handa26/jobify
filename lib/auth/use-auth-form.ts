"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SubmitResult = { error?: { message?: string } | null };
type SubmitFn<T> = (values: T) => Promise<SubmitResult>;

export function useAuthForm<T extends Record<string, unknown>>(
	submitFn: SubmitFn<T>,
	fallbackError: string,
) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent, values: T) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await submitFn(values);
			if (result.error) {
				setError(result.error.message ?? fallbackError);
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

	return { loading, error, handleSubmit, setError };
}
