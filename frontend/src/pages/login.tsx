import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

const LoginPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/chat');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login – STEM Bot</title>
        <meta name="description" content="Log in to your STEM Bot account" />
      </Head>

      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </>
  );
};

export default LoginPage;
