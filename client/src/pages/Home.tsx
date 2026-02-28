import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAffirmationSchema, type Affirmation } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Scale, Shield, FileCheck, Download, ExternalLink, Copy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: stats } = useQuery({ queryKey: ["/api/affirmations/stats"] });
  
  const form = useForm({
    resolver: zodResolver(insertAffirmationSchema),
    defaultValues: {
      fullName: "",
      consent: false,
    },
  });

  async function onSubmit(data: any) {
    try {
      const res = await apiRequest("POST", "/api/affirmations", data);
      const result = await res.json();
      setAffirmation(result);
      toast({ title: "Affirmation successful", description: "Your digital certificate has been generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  const copyId = () => {
    if (affirmation) {
      navigator.clipboard.writeText(affirmation.certificateId);
      toast({ title: "Copied", description: "Certificate ID copied to clipboard." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">International Ethical Commitment Charter</h1>
        <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase opacity-90 mb-8">Truth • Dignity • Accountability</p>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">
          Join {stats?.count || 0} signatories committed to a global standard of integrity and human rights.
        </p>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4 space-y-16">
        <section className="prose prose-slate max-w-none bg-white p-8 md:p-16 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center border-b pb-6 mb-8">
            <h2 className="text-4xl font-serif m-0 text-slate-900">The Charter</h2>
            <Button variant="ghost" size="sm" onClick={() => window.print()} className="no-print">
              <Download className="h-4 w-4 mr-2" /> Print Charter
            </Button>
          </div>
          <p className="text-xl leading-relaxed text-slate-800 font-serif italic mb-10">
            "Recognizing the inherent dignity and the equal and inalienable rights of all members of the human family as the foundation of freedom, justice, and peace in the world."
          </p>
          <div className="grid md:grid-cols-3 gap-8 my-16 not-prose">
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
              <Scale className="h-12 w-12 text-slate-900 mb-6" />
              <h3 className="text-lg font-bold mb-2">Equality</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Universal application of ethical standards to all individuals, regardless of status.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
              <Shield className="h-12 w-12 text-slate-900 mb-6" />
              <h3 className="text-lg font-bold mb-2">Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Active safeguarding of fundamental rights against systemic threats and violations.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
              <FileCheck className="h-12 w-12 text-slate-900 mb-6" />
              <h3 className="text-lg font-bold mb-2">Integrity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Commitment to transparency and accountability in all professional and personal conduct.</p>
            </div>
          </div>
          <p className="text-slate-700 leading-loose text-lg">
            By voluntarily affirming this charter, the signatory pledges to uphold these principles as a living commitment to global ethical standards. This digital affirmation serves as a permanent record of personal accountability.
          </p>
        </section>

        {!affirmation ? (
          <Card className="border-slate-300 shadow-2xl overflow-hidden rounded-2xl no-print">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-2xl font-serif text-slate-900">Digital Affirmation</CardTitle>
              <CardDescription>Affirm your commitment to the international standards of ethics.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-slate-900">Full Legal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name as it should appear on the certificate" className="h-12 text-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-xl border p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-2 leading-none">
                          <FormLabel className="text-base font-semibold cursor-pointer text-slate-900">
                            I solemnly affirm this declaration and commit to its ethical principles.
                          </FormLabel>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            I understand that my name and the timestamp of this affirmation will be stored in a public verification registry.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-14 text-xl font-serif">
                    Digitally Affirm Charter
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-900 border-[3px] shadow-2xl bg-white overflow-hidden rounded-2xl animate-in zoom-in duration-500">
            <div className="h-6 bg-slate-900" />
            <CardContent className="p-16 text-center space-y-10">
              <div className="space-y-4">
                <Shield className="h-20 w-20 mx-auto text-slate-900 mb-4" />
                <p className="uppercase tracking-[0.4em] text-slate-400 text-sm font-black">Official Certificate of Affirmation</p>
                <h2 className="text-5xl md:text-6xl font-serif text-slate-900">{affirmation.fullName}</h2>
              </div>
              
              <div className="max-w-xl mx-auto py-10 border-y-2 border-slate-100 italic text-xl text-slate-700 font-serif leading-relaxed">
                "Has solemnly affirmed their commitment to the universal principles of the International Ethical Commitment Charter, pledging to serve as a guardian of truth, dignity, and accountability."
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-lg mx-auto bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Certificate ID</p>
                  <div className="flex items-center gap-2 group">
                    <code className="text-sm font-mono font-bold text-slate-900">{affirmation.certificateId}</code>
                    <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors no-print" onClick={copyId} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Timestamp (ISO)</p>
                  <p className="text-sm font-mono text-slate-900">{new Date(affirmation.timestamp).toISOString()}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10 no-print">
                <Button variant="outline" size="lg" className="flex items-center gap-2 px-8" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Download/Print
                </Button>
                <Button className="bg-slate-900 flex items-center gap-2 px-8 h-11" onClick={() => setLocation(`/verify/${affirmation.certificateId}`)}>
                  <ExternalLink className="h-4 w-4" /> Verify in Registry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center py-16 border-t border-slate-200 text-slate-400 text-sm no-print">
          <p className="font-serif italic text-lg text-slate-600 mb-6">Truth • Dignity • Accountability</p>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors font-medium underline decoration-slate-200 underline-offset-4">Privacy Policy</Link>
            <Link href="/verify" className="hover:text-slate-900 transition-colors font-medium underline decoration-slate-200 underline-offset-4">Public Registry</Link>
            <Link href="/admin" className="hover:text-slate-900 transition-colors font-medium underline decoration-slate-200 underline-offset-4">Admin Portal</Link>
          </div>
          <p className="max-w-xl mx-auto leading-loose opacity-70">
            This platform operates with absolute data sovereignty. Zero tracking, zero ads, zero data resale. Dedicated to the advancement of ethical accountability globally.
          </p>
        </footer>
      </main>
    </div>
  );
}
