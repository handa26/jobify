import Link from "next/link";
import { Suspense } from "react";
import { Briefcase } from "lucide-react";

import CurrentYear from "../current-year";

type AuthLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
	footer: React.ReactNode;
};

export default function AuthLayout({
	title,
	description,
	children,
	footer,
}: AuthLayoutProps) {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			{/* Brand panel — hidden on mobile */}
			<div className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70 lg:flex lg:flex-col lg:justify-between lg:p-12">
				<Link
					href="/"
					className="flex items-center gap-2 text-primary-foreground"
				>
					<Briefcase className="h-6 w-6" />
					<span className="text-xl font-bold tracking-tight">Jobify</span>
				</Link>

				<div className="space-y-4 text-primary-foreground">
					<h2 className="text-3xl font-bold leading-tight">
						Track every application.
						<br />
						Land the offer.
					</h2>
					<p className="max-w-md text-primary-foreground/80">
						A simple kanban board to organize your job search — from wishlist to
						signed offer.
					</p>
				</div>

				<Suspense fallback={<div>Loading dynamic content...</div>}>
					<CurrentYear />
				</Suspense>

				{/* Decorative blur */}
				<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
			</div>

			{/* Form panel */}
			<div className="flex items-center justify-center bg-background p-6 lg:p-12">
				<div className="w-full max-w-sm space-y-6">
					{/* Mobile logo */}
					<Link
						href="/"
						className="flex items-center gap-2 text-foreground lg:hidden"
					>
						<Briefcase className="h-5 w-5 text-primary" />
						<span className="text-lg font-bold">Jobify</span>
					</Link>

					<div className="space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							{title}
						</h1>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>

					{children}

					<div className="text-center text-sm text-muted-foreground">
						{footer}
					</div>
				</div>
			</div>
		</div>
	);
}
