import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, XCircle, ShieldCheck, Download, Calendar, Fingerprint } from "lucide-react";
import { type Affirmation } from "@shared/schema";

export default function Verify() {
  const [, params] = useRoute("/verify/:id?");
  const [searchId, setSearchId] = useState(params?.id || "");
  const [result, setResult] = useState<Affirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      handleSearch(params.id);
    }
  }, [params?.id]);

  async function handleSearch(id: string) {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/affirmations/verify/${id.toUpperCase()}`);
      if (!res.ok) throw new Error("Certificate record not found in registry.");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center">
          <ShieldCheck className="h-20 w-20 text-slate-900 mx-auto mb-6" />
          <h1 className="text-4xl font-serif text-slate-900">Registry Verification</h1>
          <p className="text-slate-500 mt-2 text-lg">Enter a unique Certificate ID to verify its authenticity and record status.</p>
        </div>

        <Card className="shadow-lg border-slate-200">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="IECC-XXXX-XXXX-XXXX" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                className="font-mono h-12 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchId)}
              />
              <Button 
                onClick={() => handleSearch(searchId)}
                disabled={loading}
                className="bg-slate-900 h-12 px-8 font-bold text-base"
              >
                {loading ? "Searching..." : "Verify Record"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-2xl text-center animate-in slide-in-from-top-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-900 font-bold text-lg">{error}</p>
            <p className="text-red-700 mt-2">Please verify the ID format and try again. All IDs are case-sensitive.</p>
          </div>
        )}

        {result && (
          <Card className="border-green-500 border-[3px] bg-white overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="h-4 bg-green-500" />
            <CardHeader className="p-10 border-b">
              <div className="flex items-center gap-3 text-green-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
                <span className="font-black uppercase tracking-widest text-sm">Authentic Registry Record Found</span>
              </div>
              <CardTitle className="text-4xl font-serif text-slate-900">{result.fullName}</CardTitle>
              <CardDescription className="text-lg italic mt-2">Verified signatory of the International Ethical Commitment Charter.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 bg-slate-50 p-6 rounded-xl border">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Fingerprint className="h-4 w-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Unique Certificate ID</span>
                  </div>
                  <code className="text-lg font-mono font-bold text-slate-900 block">{result.certificateId}</code>
                </div>
                <div className="space-y-3 bg-slate-50 p-6 rounded-xl border">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] uppercase font-black tracking-wider">Verification Timestamp</span>
                  </div>
                  <p className="text-lg font-serif font-bold text-slate-900">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                <p className="text-green-800 leading-relaxed font-medium italic">
                  "This record confirms that the individual above has solemnly affirmed their commitment to truth, dignity, and accountability as defined by the International Ethical Commitment Charter."
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button variant="outline" className="flex items-center gap-2 px-8 h-12" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Export Verification Result
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
