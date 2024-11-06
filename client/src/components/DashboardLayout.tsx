import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2024 Traffic & Weather Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;