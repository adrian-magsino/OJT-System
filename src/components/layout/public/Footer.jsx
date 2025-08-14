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
    <footer className="bg-green-500">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-6">
          <div className="max-w-sm">
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
            <h2 className="ml-2 text-lg font-semibold text-gray-900 uppercase">{siteConfig.name}</h2>
          </div>
           
            <p>
              {about_system}
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Quick Links</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <a href={external_links.quick_links.main} className="hover:underline">Main</a>
              </li>
              <li className="mb-4">
                <a href={external_links.quick_links.about_us} className="hover:underline">About Us</a>
              </li>
              <li className="mb-4">
                <a href={external_links.quick_links.connect_with_us} className="hover:underline">Connect With Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Follow Us</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <a href={external_links.socials.facebook} className="hover:underline">Facebook</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Contact</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <p>{external_links.contact.location}</p>
              </li>

            </ul>
          </div>


        </div>
      </div>

    </footer>
  )
}