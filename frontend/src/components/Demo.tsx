import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';

const Demo: React.FC = () => (
  <section
    id="demo"
    className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center"
  >

    <div className="hidden md:flex md:w-1/3 lg:w-2/5 justify-center mb-8 md:mb-0 relative md:-left-12">
      <Image
        src={assets.science_image}
        alt="Robot conducting a scientific experiment"
        className="w-full h-auto rounded-lg"
      />
    </div>

    <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col bg-white rounded-2xl shadow-lg h-[80vh] overflow-hidden">
      <div className="bg-green-600 text-white p-4 flex items-center rounded-t-2xl">
        <Image
          src={assets.logo_icon}
          alt="STEM Bot Logo"
          className="w-6 h-6 mr-2"
        />
        <h2 className="text-lg font-semibold">STEM Bot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-100 text-gray-800">
            Hello! How can I help you with STEM today?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-green-100 text-green-900">
            I have a question about physics.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-100 text-gray-800">
            Sure! Ask me anything.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-green-100 text-green-900">
            Can you explain Newton’s second law?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-100 text-gray-800">
            Absolutely—Newton’s second law is <strong>F = m × a</strong>, meaning force equals
            mass times acceleration. It tells us how an object’s velocity changes
            when it’s pushed or pulled.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-green-100 text-green-900">
            Nice, thanks! What about an example?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-100 text-gray-800">
            Sure—if a 2 kg toy car accelerates at 3 m/s², the force required is
            F = 2 kg × 3 m/s² = 6 N.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-green-100 text-green-900">
            That makes sense—thank you!
          </div>
        </div>
        <div className="flex justify-start">
          <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-100 text-gray-800">
            You’re welcome! Anything else on your mind?
          </div>
        </div>
      </div>

      <div className="p-4 bg-white flex items-center border-t border-gray-200 rounded-b-2xl">
        <Input placeholder="Type your message..." className="flex-1 mr-2" />
        <Button>
          <Send size={20} />
        </Button>
      </div>
    </div>
  </section>
);

export default Demo;
