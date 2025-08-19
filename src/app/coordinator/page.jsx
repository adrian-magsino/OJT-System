import Link from 'next/link';
import { PanelsTopLeft, LayoutList, BookText, Plus, FileText } from 'lucide-react';

export default function CoordinatorDashboard() {
  const dashboardCards = [
    {
      title: "Host Training Establishments",
      description: "Manage and view all HTEs in the system",
      href: "/coordinator/hte",
      icon: LayoutList,
      color: "bg-blue-500 hover:bg-blue-600",
      actions: [
        { label: "View All HTEs", href: "/coordinator/hte" },
        { label: "Add New HTE", href: "/coordinator/hte/create" }
      ]
    },
    {
      title: "Form 2 Submissions",
      description: "Review and manage student form submissions",
      href: "/coordinator/form2",
      icon: BookText,
      color: "bg-green-500 hover:bg-green-600",
      actions: [
        { label: "View Submissions", href: "/coordinator/form2" },
        { label: "Generate RL", href: "/coordinator/generate-rl" }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage HTEs and review student submissions</p>
      </div>

    

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {card.actions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={card.href}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${card.color}`}
                  >
                    View All
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/coordinator/hte/create"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New HTE
          </Link>
          
          <Link
            href="/coordinator/form2"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <BookText className="h-4 w-4 mr-2" />
            Review Submissions
          </Link>
          
          
          <Link
            href="/coordinator/generate-rl"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate RL
          </Link>
        </div>
      </div>
    </div>
  );
}