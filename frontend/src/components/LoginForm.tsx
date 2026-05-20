import React, { useContext, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

const LoginForm: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('LoginForm must be used within an AuthProvider');
  }
  const { login } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
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

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

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
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-gray-700 mt-4">
        Don't have an account?{' '}
        <Link href="/signup" className="text-green-500 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
