import { Globe, LayoutList, CalendarClock } from "lucide-react";

const sample_text = `
Lorem ipsum dolor sit amet consectetur adipiscing elit. 
Consectetur adipiscing elit quisque faucibus ex sapien vitae. 
Ex sapien vitae pellentesque sem placerat in id. 
Placerat in id cursus mi pretium tellus duis. 
Pretium tellus duis convallis tempus leo eu aenean.
`

// centralize the display data for easy reuse
const features = [
  {
    title: 'Centralized HTE Directory',
    description: 'Browse for HTEs and view relevant information',
    icon: Globe
  },
  {
    title: 'Personalized HTE Recommendations',
    description: 'Match your skills and specialization to relevant work tasks.',
    icon: LayoutList
  },
  {
    title: 'Time-Saving Process',
    description: 'Reduce manual work for students and coordinators alike.',
    icon: CalendarClock
  },
]

export default function About() {

  return (
    <div id="About" className="flex flex-col justify-center min-h-screen">
      <div className="flex lg:flex-row gap-10 justify-center">
        {features.map(({ title, description, icon: Icon }) => (
          <div key={title} className="text-center w-xs">
            <div className="mx-auto bg-green-700 inline-flex items-center justify-center rounded-full p-10 mb-3 shadow-xl">
              <Icon className="text-white" size={70} strokeWidth={1.75} aria-hidden="true"/>
            </div>
            
            <h3 className="text-green-800 font-bold text-lg">{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}