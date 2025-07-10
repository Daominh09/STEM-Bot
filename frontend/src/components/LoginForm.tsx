import React, { useContext, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-auto text-center">
      <Image
        src={assets.logo_icon}
        alt="STEM Bot Logo"
        className="w-10 h-10 mx-auto mb-2"
      />
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">STEM Bot</h1>
      <h2 className="text-lg font-medium text-gray-800 mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          required
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Log in
        </Button>
      </form>

      <p className="text-sm text-gray-700 mt-4">
        Don’t have an account?{' '}
        <Link href="/signup" className="text-green-500 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;