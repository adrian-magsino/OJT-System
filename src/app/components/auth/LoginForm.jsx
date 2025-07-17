export default function LoginForm() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div>
        <h1 className="text-center text-2xl/9 font-bold tracking-tight ">
          Login to your account
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium">
              CvSU Email Address
            </label>
            <div className="mt-2">
              <input 
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:outline-offset-2 focus:outline-green-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium ">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input 
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:outline-offset-2 focus:outline-green-600 sm:text-sm/6"
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Login
            </button>
          </div>

        </form>
        
      </div>
    </div>
  )
}