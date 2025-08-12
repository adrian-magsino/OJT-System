import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { siteConfig } from "@/lib/config/site";

const main_headline = "Connecting CvSU Students to the Right Training Establishments";
const subtext = `
${siteConfig.name} is a web-based platform developed to 
provide assistance for students in searching for HTEs.
Our goal is to ensure that students find internship opportunities 
that match their skills and field of specialization.
`

export default function Home() {
  return (
    <div id="Home" className="flex items-center justify-center min-h-screen">   
      <div className="flex-col max-w-xl">       
        <p className="mt-4 text-2xl font-bold">
          {main_headline}
        </p>
        <p className="mt-4">
          {subtext}
        </p>
      </div>
      <div className="mt-10 bg-green-600 p-10 ml-15 mr-20 shadow-2xl rounded-xl">
        <h1 className="text-4xl font-bold mb-5">
          CvSU - {siteConfig.name}
        </h1>
        <GoogleAuthButton />
      </div>

    </div>
  );
}