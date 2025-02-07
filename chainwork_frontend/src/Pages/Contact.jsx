import React from "react";

const Contact = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-lg bg-white shadow-lg rounded-lg p-8 w-full dark:bg-gray-900 dark:border-white border-[2px] dark:text-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center dark:text-white">Contact Us</h1>
        <p className="text-gray-600 text-center mb-6 dark:text-white">
          Have questions? Reach out to us and we'll get back to you as soon as possible.
        </p>
        <form className="space-y-4">
          <div className="text-black m-1">
            <label className="block text-gray-700 dark:text-white font-medium">Name</label>
            <input type="text" className="w-full p-2 border dark:bg-gray-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Name" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">Email</label>
            <input type="email" className="w-full p-2 border dark:bg-gray-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Email" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">Message</label>
            <textarea className="w-full p-2 border dark:bg-gray-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;
