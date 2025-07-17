import LoginForm from "@/app/components/auth/LoginForm";


const handleLogin = () => {};

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">     
      <div>
        <h2 className="text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
        
        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Sign in with CvSU Email
        </button>
      </div>
    </div>
  );
}