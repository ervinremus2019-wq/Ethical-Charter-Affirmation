import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
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
      const res = await fetch(`/api/affirmations/verify/${id}`);
      if (!res.ok) throw new Error("Certificate not found");
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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <ShieldCheck className="h-16 w-16 text-slate-900 mx-auto mb-4" />
          <h1 className="text-3xl font-serif">Certificate Verification</h1>
          <p className="text-slate-500 mt-2">Enter a unique Certificate ID to verify its authenticity</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input 
                placeholder="IECC-XXXX-XXXX-XXXX" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="font-mono uppercase"
              />
              <Button 
                onClick={() => handleSearch(searchId)}
                disabled={loading}
                className="bg-slate-900"
              >
                <Search className="h-4 w-4 mr-2" /> Verify
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && <div className="text-center py-8">Searching registry...</div>}

        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">Please check the ID and try again.</p>
          </div>
        )}

        {result && (
          <Card className="border-green-200 bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="h-2 bg-green-500" />
            <CardHeader>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-bold uppercase tracking-wider text-xs">Authentic Record Found</span>
              </div>
              <CardTitle className="text-2xl font-serif">{result.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6 py-4 border-y">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">Certificate ID</p>
                  <code className="text-sm font-mono text-slate-900">{result.certificateId}</code>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">Timestamp</p>
                  <p className="text-sm text-slate-900">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic">
                This individual has verified their commitment to the International Ethical Commitment Charter. This record is permanent and cryptographically generated.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
