import { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from '../components/LoginForm';

const LoginPage: NextPage = () => (
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

export default LoginPage;
