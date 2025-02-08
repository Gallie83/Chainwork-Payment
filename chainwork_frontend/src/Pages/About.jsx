import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8 dark:bg-gray-900 border-[2px] dark:boreder-white ">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">About ChainWork</h1>
        <p className="text-gray-600 mb-4 dark:text-white">
          ChainWork is a decentralized freelancing platform leveraging blockchain and AI 
          to ensure secure, transparent, and efficient task completion.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 dark:text-white">Why Choose ChainWork?</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-white">
          <li>Blockchain-based secure payments</li>
          <li>AI-powered freelancer assistance</li>
          <li>Transparent task evaluation system</li>
        </ul>
      </div>
    </div>
  );
};

export default About;

