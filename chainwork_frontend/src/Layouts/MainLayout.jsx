import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}