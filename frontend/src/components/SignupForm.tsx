import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import Image from 'next/image';

const SignupForm: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-auto text-center">
    <Image
      src={assets.logo_icon}
      alt="STEM Bot Logo"
      className="w-10 h-10 mx-auto mb-2"
    />
    <h1 className="text-2xl font-semibold text-gray-900 mb-1">STEM Bot</h1>

    <h2 className="text-lg font-medium text-gray-800 mb-6">Create an account</h2>

    <form className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full"
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Email address"
        className="w-full"
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full"
        required
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        className="w-full"
        required
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Create account
      </Button>
    </form>

    <p className="text-sm text-gray-700 mt-4">
      Already have an account?{' '}
      <Link href="/login" className="text-green-500 hover:underline">
        Login
      </Link>
    </p>
  </div>
);

export default SignupForm;
