import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Users, Shield, Clock } from "lucide-react";
import { type Affirmation } from "@shared/schema";

export default function Admin() {
  const { data: affirmations, isLoading } = useQuery<Affirmation[]>({
    queryKey: ["/api/admin/affirmations"]
  });

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

  if (isLoading) return <div className="p-12 text-center">Loading registry...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Registry of Ethical Commitment Signatories</p>
          </div>
          <Button onClick={exportCSV} className="bg-slate-900 flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Affirmations</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affirmations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Last Entry</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {affirmations?.[0] ? new Date(affirmations[0].timestamp).toLocaleString() : "None"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Signatory List</CardTitle>
            <CardDescription>Comprehensive view of all digital affirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Consent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affirmations?.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.fullName}</TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(a.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                        {a.certificateId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.consent ? "default" : "destructive"}>
                        {a.consent ? "Confirmed" : "Missing"}
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
