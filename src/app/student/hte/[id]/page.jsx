import HteProfile from "@/components/ui/hte/HteProfile";
import Link from "next/link";


export default async function HteProfilePage({ params }) {
  const { id } = await params;

  return (
    <div className="w-full min-h-screen">
      <div className="p-4">
        <Link
          href={"/student"}
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