import HteProfile from "@/components/ui/hte/HteProfile";
import Link from "next/link";


export default async function HteProfilePage({ params, searchParams }) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const fromPage = searchParamsResolved?.from_page || '1';
  const filter = searchParamsResolved?.filter || 'all';

  // Create the back URL with preserved state
  const createBackUrl = () => {
    const params = new URLSearchParams();
    params.set('page', fromPage);
    if (filter !== 'all') {
      params.set('filter', filter);
    }
    return `/student?${params.toString()}`;
  };

  return (
    <div className="w-full min-h-screen">
      <div className="p-4">
        <Link
          href={createBackUrl()}
          className="items-center gap-2 px-4 py-2 text-white bg-blue-700"
        >
          Back
        </Link>
      </div>

      <div className="p-4">
        <HteProfile hte_id={id}/>
      </div>
    </div>
  );
}