

export default async function Page({
  searchParams,
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div>
        <p>Sorry, something went wrong</p>
      </div>
      <div>
        {params?.error ? (
          <p className="text-sm text-muted-foreground">
            Code error: {params.error}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            An unspecified error occurred.
          </p>
        )}
      </div>
      
    </div>
  );
}
