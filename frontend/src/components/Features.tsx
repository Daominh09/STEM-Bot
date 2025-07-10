import React from 'react';
import Image from 'next/image'
import { assets, featureData} from '@/assets/assets'

const Features: React.FC = () => (
  <section id="features" className="container mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featureData.map(f => (
        <div
          key={f.title}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <Image src={f.icon} alt={`${f.title} icon`} className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-600">{f.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
