import { redirect } from "next/navigation";

export function errorFallback(error, fallbackPage = "/", fallbackLabel = "Go back") {
  const errorMessage = error?.message || error?.toString() || error || "An unexpected error occurred";
  const params = new URLSearchParams({
    error: errorMessage,
    fallback: fallbackPage, 
    fallbackLabel: fallbackLabel
  });

  redirect(`/error?${params.toString()}`);
}