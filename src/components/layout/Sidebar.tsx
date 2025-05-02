import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {LayoutDashboardIcon, LogOutIcon, PenIcon} from 'lucide-react';

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'GU';
    const parts = email.split('@');
    return parts[0].substring(0, 2).toUpperCase();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboardIcon size={15} /> },
    { name: 'Tasks', href: '/tasks', icon: <PenIcon size={15} /> }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Avatar>
            <AvatarImage src={currentUser?.photoURL || ''} />
            <AvatarFallback>{getInitials(currentUser?.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{currentUser?.displayName || currentUser?.email || 'Guest User'}</span>
            {currentUser?.email && (
              <span className="text-xs text-sidebar-foreground/70">{currentUser.email}</span>
            )}
          </div>
        </div>
        
        <Separator className="my-4 bg-sidebar-border" />
        
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start border-sidebar-border text-sidebar-foreground"
          onClick={handleLogout}
        >
          <span className="text-lg mr-2">
            <LogOutIcon />
          </span>
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className=" z-20 absolute top-0 left-0 m-3">
          <Button variant="outline" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 h-screen overflow-y-auto border-r border-sidebar-border">
        {sidebarContent}
      </div>
    </>
  );
}