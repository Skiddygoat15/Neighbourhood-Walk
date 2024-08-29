import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login and Sign Up Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Section */}
          <div className="border border-black p-16 flex justify-center items-center">
            <h1 className="text-4xl font-bold">Logo</h1>
          </div>

          {/* Buttons Section */}
          <div className="space-y-4">
            <Link href="/Registration-loginform" className="block w-64 py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
              Login
            </Link>
            <Link href="/Registration-signup" className="block w-64 py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
