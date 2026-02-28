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
import { Scale, Shield, FileCheck, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null);
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">International Ethical Commitment Charter</h1>
        <p className="text-xl font-medium tracking-widest uppercase opacity-80">Truth • Dignity • Accountability</p>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <section className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-3xl font-serif border-b pb-4 mb-6">Preamble</h2>
          <p className="text-lg leading-relaxed text-slate-700">
            Recognizing the inherent dignity and the equal and inalienable rights of all members of the human family as the foundation of freedom, justice, and peace in the world...
          </p>
          <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg">
              <Scale className="h-10 w-10 text-slate-900 mb-4" />
              <h3 className="font-bold">Equality</h3>
              <p className="text-sm text-slate-600">Universal application of ethical standards to all individuals.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg">
              <Shield className="h-10 w-10 text-slate-900 mb-4" />
              <h3 className="font-bold">Protection</h3>
              <p className="text-sm text-slate-600">Safeguarding human rights against threats and violations.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg">
              <FileCheck className="h-10 w-10 text-slate-900 mb-4" />
              <h3 className="font-bold">Integrity</h3>
              <p className="text-sm text-slate-600">Maintaining the highest level of personal and professional conduct.</p>
            </div>
          </div>
          <h2 className="text-3xl font-serif border-b pb-4 mb-6">The Declaration</h2>
          <p className="text-slate-700">
            By affirming this charter, I commit to upholding these principles in my daily life and professional practice, ensuring that my actions contribute to a world governed by mutual respect and ethical responsibility.
          </p>
        </section>

        {!affirmation ? (
          <Card className="border-slate-300 shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>Digital Affirmation</CardTitle>
              <CardDescription>Affirm your commitment to the charter</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Legal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I voluntarily affirm this declaration and agree to its principles.
                          </FormLabel>
                          <p className="text-xs text-slate-500">
                            Your name and timestamp will be stored securely for verification purposes.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg">
                    Digitally Affirm Charter
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-900 border-2 shadow-xl bg-white overflow-hidden animate-in zoom-in duration-300">
            <div className="h-4 bg-slate-900" />
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-2">
                <p className="uppercase tracking-[0.2em] text-slate-500 text-sm font-bold">Certificate of Affirmation</p>
                <h2 className="text-4xl font-serif text-slate-900">{affirmation.fullName}</h2>
              </div>
              
              <div className="max-w-md mx-auto py-6 border-y border-slate-100 italic text-slate-600">
                "Has solemnly affirmed their commitment to the principles of the International Ethical Commitment Charter, pledging to uphold truth, dignity, and accountability."
              </div>

              <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto bg-slate-50 p-4 rounded-lg border">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Certificate ID</p>
                  <code className="text-sm font-mono text-slate-900">{affirmation.certificateId}</code>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Timestamp (ISO)</p>
                  <p className="text-sm text-slate-900">{new Date(affirmation.timestamp).toISOString()}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Link href={`/verify/${affirmation.certificateId}`}>
                  <Button className="bg-slate-900 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Public Registry
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center py-12 border-t text-slate-400 text-sm">
          <p>© 2026 International Ethical Commitment Charter</p>
          <div className="mt-4 space-x-4">
            <Link href="/admin" className="hover:text-slate-600 transition-colors">Admin Portal</Link>
            <Link href="/verify" className="hover:text-slate-600 transition-colors">Verify Certificate</Link>
          </div>
          <p className="mt-8 max-w-lg mx-auto leading-relaxed">
            Minimal data collection. No advertising tracking. No data resale. This platform is dedicated to the advancement of human rights and ethical accountability.
          </p>
        </footer>
      </main>
    </div>
  );
}
