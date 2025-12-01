import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Users, Scissors, DollarSign, Settings, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Agendamento', icon: Calendar },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/procedures', label: 'Procedimentos', icon: Scissors },
    { path: '/finance', label: 'Financeiro', icon: DollarSign },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-3">
             <Logo className="h-10 w-10" />
             <span className="font-serif font-bold text-brand-700">Bruna Maranhão</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-700">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex flex-col items-center border-b border-brand-100">
            <Logo className="h-24 w-24 mb-4" />
            <h1 className="font-serif text-xl font-bold text-brand-700 text-center">Bruna Maranhão</h1>
            <p className="text-xs text-brand-400 uppercase tracking-widest mt-1">Beauty Space</p>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-brand-700 text-white shadow-md' 
                    : 'text-brand-600 hover:bg-brand-50'
                  }
                `}
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-brand-100 text-center text-xs text-brand-300">
            &copy; {new Date().getFullYear()} BM Beauty App
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-5xl mx-auto">
             {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default Layout;