"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GlobalError({
	error,
	resetAction,
}: {
	error: Error & { digest?: string };
	resetAction: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	const router = useRouter();
	return (
		<html lang="en">
			<body>
				<h2>Something went wrong.</h2>
				<Button
					onClick={() => {
						router.refresh();
						resetAction();
					}}
				>
					Try again
				</Button>
			</body>
		</html>
	);
}
