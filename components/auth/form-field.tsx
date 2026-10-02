"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	id: string;
	error?: string;
};

export default function FormField({
	label,
	id,
	error,
	type,
	className,
	...props
}: FormFieldProps) {
	const [show, setShow] = useState(false);
	const isPassword = type === "password";
	const inputType = isPassword ? (show ? "text" : "password") : type;

	return (
		<div className="space-y-2">
			<Label htmlFor={id} className="text-sm font-medium">
				{label}
			</Label>
			<div className="relative">
				<Input
					id={id}
					type={inputType}
					aria-invalid={!!error}
					aria-describedby={error ? `${id}-error` : undefined}
					className={cn(
						isPassword && "pr-10",
						error && "border-destructive focus-visible:ring-destructive",
						className,
					)}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShow((s) => !s)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						aria-label={show ? "Hide password" : "Show password"}
						tabIndex={-1}
					>
						{show ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				)}
			</div>
			{error && (
				<p id={`${id}-error`} className="text-xs text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
