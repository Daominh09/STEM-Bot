import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';

const SignupPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/chat');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create Account – STEM Bot</title>
        <meta name="description" content="Create a new STEM Bot account" />
      </Head>

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <SignupForm />
      </main>

      <Footer />
    </>
  );
};

export default SignupPage;
