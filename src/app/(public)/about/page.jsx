import { Globe, LayoutList, CalendarClock } from "lucide-react";

const features = [
  {
    title: 'Centralized HTE Directory',
    description: 'Browse for HTEs and view relevant information with our comprehensive database.',
    icon: Globe,
    color: 'from-green-600 to-green-700'
  },
  {
    title: 'Personalized HTE Recommendations',
    description: 'Match your skills and specialization to relevant work tasks using our smart algorithm.',
    icon: LayoutList,
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    title: 'Time-Saving Process',
    description: 'Reduce manual work for students and coordinators with our streamlined platform.',
    icon: CalendarClock,
    color: 'from-green-500 to-yellow-400'
  },
]

export default function About() {
  return (
    <div id="About" className="flex flex-col justify-center min-h-screen bg-gradient-to-b from-white to-green-50 px-4 py-8 lg:py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Why Choose Our Platform?
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how our innovative platform transforms the way students find and connect with training establishments.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 md:gap-8 lg:gap-10 justify-center items-center md:items-start">
          {features.map(({ title, description, icon: Icon, color }, index) => (
            <div key={title} className="text-center w-full max-w-xs md:max-w-sm lg:w-xs group hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-300 rounded-4xl">
              <div className={`mx-auto bg-gradient-to-br ${color} inline-flex items-center justify-center rounded-full p-6 sm:p-8 lg:p-10 mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                <Icon 
                  className="text-white" 
                  size={50} 
                  strokeWidth={1.75} 
                  aria-hidden="true"
                  style={{ 
                    width: 'clamp(40px, 8vw, 70px)', 
                    height: 'clamp(40px, 8vw, 70px)' 
                  }}
                />
              </div>
              
              <h3 className="text-green-800 font-bold text-base sm:text-lg lg:text-xl mb-3">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                {description}
              </p>
              
              {/* Feature number indicator */}
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 bg-yellow-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}