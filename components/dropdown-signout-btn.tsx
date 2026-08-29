"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "./ui/dropdown-menu";

import { signOut } from "@/lib/auth/auth-client";

export default function DropdownSignOutButton() {
  const router = useRouter();

	return (
		<DropdownMenuItem onClick={async () => {
      const result = await signOut();

      if (result.data) {
        router.push("/sign-in");
      } else {
        alert("Error signing out");
      }
    }}>
			<LogOutIcon />
			Sign Out
		</DropdownMenuItem>
	);
}
