import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { siteConfig } from "@/lib/config/site";
import Image from "next/image";

const main_headline = "Find the Right Training Establishment For You";
const subtext = `
${siteConfig.name} is a web-based platform developed to 
provide assistance for students in searching for HTEs.
Our goal is to ensure that students find internship opportunities 
that match their skills and field of specialization.
`

export default function Home() {
  return (
    <div id="Home" className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 px-4 py-8 gap-8 lg:gap-12">   
      <div className="flex-col w-full max-w-md lg:max-w-lg xl:max-w-xl px-4 sm:px-0">       
        <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 text-center lg:text-left leading-tight mb-2">
          {main_headline}
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto lg:mx-0 mb-6"></div>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-center lg:text-left text-gray-700 leading-relaxed">
          {subtext}
        </p>
        
      </div>

      <div className="w-full max-w-sm sm:max-w-md bg-white border-2 border-green-200 p-6 sm:p-8 lg:p-10 shadow-2xl rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-yellow-400"></div>
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 sm:mb-6 text-green-800 text-center">
          C<span className="text-amber-400">v</span>SU - {siteConfig.name}
        </h1>
        <GoogleAuthButton />
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Secure authentication with Google</p>
        </div>
      </div>
    </div>
  );
}