import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, EyeOff, Database, Fingerprint } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <ShieldCheck className="h-16 w-16 text-slate-900 mx-auto mb-4" />
          <h1 className="text-4xl font-serif text-slate-900">Privacy & Ethics</h1>
          <p className="text-slate-500 mt-2">Our commitment to transparency and data sovereignty</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-slate-900 p-2 rounded-lg">
                <EyeOff className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Zero Tracking Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                We believe in an internet free from surveillance. This platform does not utilize advertising tracking, cross-site cookies, or intrusive third-party analytics scripts. Your interaction with the charter remains your own.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Minimal Data Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                We only store the name you voluntarily provide during affirmation. This is strictly for the purpose of generating your digital certificate and maintaining the public verification registry. No other personal identifiers are harvested.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle>No Data Resale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Your data is not a commodity. We do not sell, lease, or trade signatory information with any third party. Our goal is ethical accountability, not commercial gain.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Fingerprint className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Data Integrity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Every affirmation is assigned a unique Certificate ID and an ISO-standard timestamp, ensuring that your commitment is recorded accurately and can be verified by anyone you choose to share it with.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-slate max-w-none bg-white p-8 rounded-xl border border-slate-200 mt-12 shadow-sm">
          <h2 className="font-serif text-slate-900">Legal Compliance</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This platform operates in alignment with global privacy standards, including the principles of data minimization and purpose limitation. By affirming the charter, you consent to the storage of your provided name and the associated timestamp for the sole purpose of public verification.
          </p>
        </div>

        <footer className="text-center text-slate-400 text-xs py-12">
          <p>© 2026 International Ethical Commitment Charter • Truth • Dignity • Accountability</p>
        </footer>
      </div>
    </div>
  );
}
