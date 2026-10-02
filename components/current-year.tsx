"use client";
import { useState, useEffect } from "react";

export default function CurrentYear() {
	const [time, setTime] = useState<number | null>(null);

	useEffect(() => {
		// This runs strictly on the client after hydration
		setTime(new Date().getFullYear());
	}, []);

	if (!time) return <p>Loading time...</p>;
	return <p className="text-sm text-primary-foreground/60">© {time} Jobify</p>;
}
