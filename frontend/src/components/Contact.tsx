// src/components/ContactSection.tsx
import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const ContactSection: React.FC = () => (
  <section id="contact" className="bg-white py-16">
    <div className="container mx-auto px-6">
      <p className="text-center text-sm text-gray-600 mb-2">Connect with me</p>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
        Get in touch
      </h2>
      <p className="max-w-2xl mx-auto text-center text-gray-700 mb-8">
        I’d love to hear from you! If you have any questions, comments, or feedback, please use the form below.
      </p>
      <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="text" name="name" placeholder="Enter your name" />
        <Input type="email" name="email" placeholder="Enter your email" />
        <Textarea name="message" placeholder="Enter your message" rows={6} className="md:col-span-2" />
        <div className="md:col-span-2 flex justify-center">
          <Button className="px-8 py-3">Submit now →</Button>
        </div>
      </form>
    </div>
  </section>
);

export default ContactSection;
