
export default function Footer() {
  return (
    <footer className="bg-green-500">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-6">
          <div className="max-w-sm">
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">OJT SYSTEM</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Quick Links</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">Main</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">About Us</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">Connect With Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Follow Us</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 1</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 2</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 3</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Contact</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 1</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 2</a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">Link 3</a>
              </li>
            </ul>
          </div>


        </div>
      </div>

    </footer>
  )
}