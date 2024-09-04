import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        {/* Logo */}
        <h1 className="text-4xl font-bold mb-10">MyApp Logo</h1>

        {/* Buttons */}
        <div className="space-y-6">
          {/* Login Button */}
          <Link href="/login" className="block w-64 py-3 text-center bg-white text-black rounded-md font-semibold hover:bg-gray-200">
              Login
          </Link>
          
          {/* Sign Up Button */}
          <Link href="/register" className="block w-64 py-3 text-center bg-white text-black rounded-md font-semibold hover:bg-gray-200">
              Sign Up
          </Link>
        </div>
      </main>
    </>
  );
}
