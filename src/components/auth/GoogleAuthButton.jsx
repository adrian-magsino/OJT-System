import Image from "next/image";

const handleLogin = () => {}

export default function GoogleAuthButton() {
  return (
    <div className="bg-green-600 p-5">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in using your CvSU Email
        </h2>
        
        <button
          type="button"
          className="mt-10 flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Image alt="Google" src="/icons/google_icon.svg" width={30} height={30}/>
          <span className="text-center text-xl mx-10 text-gray-900"> Sign in </span>
         
        </button>
      </div>
  )
}