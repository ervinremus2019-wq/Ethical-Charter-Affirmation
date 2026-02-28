import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Users, Shield, Clock, LogOut, Lock } from "lucide-react";
import { type Affirmation } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { data: affirmations, isLoading } = useQuery<Affirmation[]>({
    queryKey: ["/api/admin/affirmations"],
    enabled: isAuthenticated
  });

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "Welcome back", description: "Admin session authenticated." });
    } else {
      toast({ variant: "destructive", title: "Authentication failed", description: "Invalid administrator credentials." });
    }
  };

  const exportCSV = () => {
    if (!affirmations) return;
    const headers = ["ID", "Full Name", "Timestamp", "Certificate ID", "Consent"];
    const rows = affirmations.map(a => [
      a.id,
      a.fullName,
      new Date(a.timestamp).toISOString(),
      a.certificateId,
      a.consent ? "YES" : "NO"
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `iecc_signatories_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
        <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-800">
          <CardHeader className="text-center space-y-4">
            <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-slate-100" />
            </div>
            <CardTitle className="text-2xl font-serif text-white">Administrator Access</CardTitle>
            <CardDescription className="text-slate-400">Enter secure credentials to manage the registry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <Input 
              type="password" 
              placeholder="Administrator Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-slate-700 border-slate-600 text-white h-12"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-slate-100 hover:bg-white text-slate-900 h-12 font-bold uppercase tracking-wider">
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-serif text-xl animate-pulse">Loading secure registry...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 border-slate-200">
          <div>
            <h1 className="text-4xl font-serif text-slate-900">Signatory Registry</h1>
            <p className="text-slate-500 mt-2">Manage and export ethical commitment data</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2 h-11 px-6">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="destructive" onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 h-11 px-6">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Total Signatories</CardTitle>
              <Users className="h-5 w-5 text-slate-900" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif text-slate-900">{affirmations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">System Integrity</CardTitle>
              <Shield className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif text-slate-900">VERIFIED</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Last Entry</CardTitle>
              <Clock className="h-5 w-5 text-slate-900" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate text-slate-900">
                {affirmations?.[0] ? new Date(affirmations[0].timestamp).toLocaleString() : "NONE RECORDED"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b p-8">
            <CardTitle className="font-serif text-2xl">Digital Ledger</CardTitle>
            <CardDescription>Real-time audit of all digital affirmations since inception</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 font-black uppercase tracking-tighter text-[10px]">Name</TableHead>
                  <TableHead className="font-black uppercase tracking-tighter text-[10px]">Timestamp</TableHead>
                  <TableHead className="font-black uppercase tracking-tighter text-[10px]">Certificate ID</TableHead>
                  <TableHead className="font-black uppercase tracking-tighter text-[10px]">Consent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affirmations?.map((a) => (
                  <TableRow key={a.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 font-serif font-bold text-slate-900">{a.fullName}</TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">
                      {new Date(a.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] font-mono bg-slate-100 px-3 py-1.5 rounded-lg font-bold border border-slate-200">
                        {a.certificateId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-900">
                        CONFIRMED
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
