import Image from "next/image";

export default function HteCard() {
  const hte_data = {
    name: "Department of Information Technology",
    location: "Indang, Cavite"
  }

  return (
    <div className="flex flex-row border-2 w-full min-h-30 grow mx-10 p-3">
      {/*HTE Image Container */}
      <div className="w-30 h-30 relative flex-shrink-0 mb-5">
        <Image 
          src="/sample_hte_pfp.png"
          fill 
          alt="Hte Profile Picture"
          className="object-cover border-2 border-black"
        />
      </div>

      {/*HTE details preview */}
      <div className="flex flex-col mx-10">
        <span className="text-xl font-bold text-green-800">{hte_data.name}</span>
        <span>{hte_data.location}</span>
        <span>Other details</span>
        <span>Other details</span>
      </div>
      
      <div>
        <button className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-600">
          Check Profile
        </button>
      </div>
      
    </div>
  );
}