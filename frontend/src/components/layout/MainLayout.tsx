import React from 'react';
import Navbar from '../common/Navbar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      <Navbar />
      <main className="flex p-6">{children}</main>
    </div>
  );
};
