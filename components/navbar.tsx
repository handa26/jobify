"use client";

import { Briefcase, LogOutIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import DropdownSignOutButton from "./dropdown-signout-btn";
import ModeToggle from "./mode-toggle";

import { useSession, signOut } from "@/lib/auth/auth-client";

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="border-b bg-background">
			<div className="container mx-auto flex h-16 items-center px-4 justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 text-xl font-semibold text-primary"
				>
					<Briefcase />
					Jobify
				</Link>
				<div className="flex items-center gap-4">
					{session?.user ? (
						<>
							<ModeToggle />
							<Link href="/dashboard">
								<Button
									variant="ghost"
									className="text-gray-700 hover:text-black dark:text-white"
								>
									Dashboard
								</Button>
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button variant="ghost" size="icon">
											<Avatar>
												<AvatarFallback className="bg-primary text-white">
													{session.user.name[0].toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</Button>
									}
								/>

								<DropdownMenuContent align="end">
									<DropdownMenuGroup>
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuItem>Profile</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownSignOutButton />
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<ModeToggle />
							<Link href="/sign-in">
								<Button
									variant="ghost"
									className="text-gray-700 hover:text-black dark:text-foreground"
								>
									Log In
								</Button>
							</Link>
							<Link href="/sign-up">
								<Button className="bg-primary hover:bg-primary/90 dark:text-foreground">
									Start for free
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
