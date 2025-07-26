
export default function InfoField({ label, value}) {
  return (
    <div className="flex flex-col ">
      <span className="text-base font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-base text-gray-900">
        {value}
      </span>
    </div>
  );
}