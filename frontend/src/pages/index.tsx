import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Demo from '../components/Demo';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Contact from '@/components/Contact';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const Home: NextPage = () => (
  <>
    <Head>
      <title>STEM Bot</title>
      <meta name="description" content="Explore the world of STEM with our AI chatbot" />
    </Head>

    <Header />

    <section className="bg-white p-3">
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Explore the world of STEM with a chatbot
          </h1>
          <p className="text-gray-700 mb-6">
            Chat with our AI assistant to learn about science, technology, engineering, and math.
          </p>
          <Link href="/chat" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2 flex items-center justify-center px-6 mt-8 md:mt-0">
          <Image
            src={assets.robot_image}
            alt="Science illustration"
            className="w-96 h-96 md:w-full md:h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>

    <Demo />

    <Features />

    <Contact />

    <Footer />
  </>
);

export default Home;
