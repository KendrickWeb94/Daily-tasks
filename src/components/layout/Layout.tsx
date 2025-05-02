import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout() {
  const { currentUser } = useAuth();

  // Only show sidebar for authenticated users
  const showSidebar = !!currentUser;

  return (
    <div className="min-h-screen  flex flex-col">
      {showSidebar ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Outlet />
            </main>
            {/*<footer className="bg-white py-3 border-t">*/}
            {/*  <div className="px-4 text-center text-gray-500 text-xs">*/}
            {/*    &copy; {new Date().getFullYear()} Daily Tasks App*/}
            {/*  </div>*/}
            {/*</footer>*/}
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          {/*<footer className="bg-white py-4 border-t">*/}
          {/*  <div className="container mx-auto px-4 text-center text-gray-500 text-sm">*/}
          {/*    &copy; {new Date().getFullYear()} Daily Tasks App*/}
          {/*  </div>*/}
          {/*</footer>*/}
        </>
      )}
    </div>
  );
}
