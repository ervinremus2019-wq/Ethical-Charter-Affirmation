import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Verify from "@/pages/Verify";
import Admin from "@/pages/Admin";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, Lock } from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  
  const getActiveTab = () => {
    if (location === "/") return "home";
    if (location.startsWith("/verify")) return "verify";
    if (location.startsWith("/admin")) return "admin";
    return "home";
  };

  return (
    <div className="bg-white border-b sticky top-0 z-50 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
        <Link href="/">
          <div className="font-serif font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2 cursor-pointer">
            <Shield className="h-6 w-6" />
            <span className="hidden sm:inline">IECC</span>
          </div>
        </Link>
        
        <Tabs value={getActiveTab()} className="w-auto">
          <TabsList className="bg-transparent border-none">
            <Link href="/">
              <TabsTrigger value="home" className="data-[state=active]:bg-slate-100 gap-2 cursor-pointer">
                <Shield className="h-4 w-4" /> Charter
              </TabsTrigger>
            </Link>
            <Link href="/verify">
              <TabsTrigger value="verify" className="data-[state=active]:bg-slate-100 gap-2 cursor-pointer">
                <Search className="h-4 w-4" /> Verify
              </TabsTrigger>
            </Link>
            <Link href="/admin">
              <TabsTrigger value="admin" className="data-[state=active]:bg-slate-100 gap-2 cursor-pointer">
                <Lock className="h-4 w-4" /> Admin
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/verify/:id?" component={Verify} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
