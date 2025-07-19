import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function Home() {
  return (
    <div id="Home" className="flex flex-col items-center justify-center min-h-screen">   
      <div className="flex-col text-center mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold">
          OJT System
        </h1>
        <p className="mt-4 text-xl ">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
        </p>
      </div>
      <div className="mt-10">
        <GoogleAuthButton />
      </div>

    </div>
  );
}