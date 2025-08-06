import Link from "next/link";


export default async function ErrorPage({ searchParams }) {
  const params = await searchParams;
  const errorMessage = params?.error || "An unexpected error occured";
  const fallbackPage = params?.fallback || "/";
  const fallbackLabel = params?.fallbackLabel || "Go back";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <p className="text-lg font-semibold">Sorry, something went wrong</p>
        </div>
        
        <div>
          {params?.error ? (
            <p className="text-sm text-muted-foreground">
              Error: {errorMessage}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              An unspecified error occurred.
            </p>
          )}
        </div>

        {/* Add fallback navigation */}
        <div className="space-y-3">
          <Link
            href={fallbackPage}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {fallbackLabel}
          </Link>
          
          <div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

}