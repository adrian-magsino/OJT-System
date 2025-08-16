import { siteConfig, external_links } from "@/lib/config/site";
import Image from "next/image";

const about_system = `
${siteConfig.name} is a web-based platform 
connecting CvSU students to the right 
Host Training Establishments and 
assisting coordinators in managing OJT documentation.
`

export default function Footer() {
  return (
    <footer className="bg-green-600">
      <div className="mx-auto w-full max-w-screen-xl px-12 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-15">
          {/* Logo and Description Section */}
          <div className="flex-1 max-w-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 relative">
                <Image 
                  src="/cvsu_logo.png"
                  alt="CVSU Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <h2 className="ml-2 text-lg font-semibold text-white uppercase">{siteConfig.name}</h2>
            </div>
            <p className="text-white text-sm leading-relaxed">
              {about_system}
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 lg:gap-8 ">
            <a href="#Home" className="text-white hover:underline text-sm font-medium">
              Home
            </a>
            <a href="#About" className="text-white hover:underline text-sm font-medium">
              About
            </a>
            <a href={external_links.quick_links.main} className="text-white hover:underline text-sm font-medium">
              CvSU
            </a>
            <a href={external_links.quick_links.connect_with_us} className="text-white hover:underline text-sm font-medium">
              Connect With CvSU
            </a>
            <a href={external_links.socials.facebook} className="text-white hover:underline text-sm font-medium">
              CvSU Facebook Page
            </a>
            <span className="text-white text-sm font-medium">
              {external_links.contact.location}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}