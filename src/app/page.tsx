import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Zap, 
  Palette, 
  Users, 
  Check, 
  ArrowRight, 
  Play,
  Star,
  Shield,
  LayoutTemplate,
  CloudSync,
  Code2
} from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: Zap, title: "Real-time Preview", desc: "See changes instantly as you type." },
    { icon: Palette, title: "Beautiful Templates", desc: "Professionally designed, ATS-optimized." },
    { icon: Download, title: "Instant PDF Export", desc: "Download with one click." },
    { icon: LayoutTemplate, title: "Multiple Versions", desc: "Different resumes for different jobs." },
    { icon: CloudSync, title: "Cloud Storage", desc: "Access your resumes anywhere." },
    { icon: Shield, title: "ATS Optimized", desc: "Beat applicant tracking systems." },
  ];

  const useCases = [
    { icon: Users, title: "Fresh Graduates", desc: "Land your first job", color: "bg-blue-500" },
    { icon: Zap, title: "Career Changers", desc: "Highlight transferable skills", color: "bg-amber-500" },
    { icon: Star, title: "Executives", desc: "Showcase leadership", color: "bg-violet-500" },
    { icon: Code2, title: "Tech Professionals", desc: "Display technical skills", color: "bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">ResumeBuilder</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-neutral-600 hover:text-neutral-900">Features</a>
              <a href="#use-cases" className="text-sm text-neutral-600 hover:text-neutral-900">Use Cases</a>
              <a href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900">Pricing</a>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/resumes">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">My Resumes</Button>
              </Link>
              <Link href="/builder">
                <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 mb-6">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Powered by AI</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Build Your{" "}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Resume
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                Create professional, ATS-optimized resumes in minutes with real-time preview and instant PDF export.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/builder">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-purple-500/25">
                    Start Building Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-neutral-600 ml-1">10,000+ users</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
              <p className="text-neutral-600">Powerful tools to land your dream job</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-neutral-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Use Cases</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for everyone</h2>
              <p className="text-neutral-600">From graduates to executives</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full ${useCase.color} flex items-center justify-center mx-auto mb-4`}>
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{useCase.title}</h3>
                    <p className="text-sm text-neutral-600">{useCase.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2>
              <p className="text-neutral-600">Start free, upgrade when needed</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Free</h3>
                  <p className="text-sm text-neutral-600 mb-4">Get started</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-neutral-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["1 Resume", "Basic Templates", "PDF Export"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/builder">
                    <Button variant="outline" className="w-full">Start Free</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-violet-50">
                <CardContent className="p-6">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium mb-4">
                    Popular
                  </div>
                  <h3 className="font-semibold mb-1">Pro</h3>
                  <p className="text-sm text-neutral-600 mb-4">For job seekers</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-neutral-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["Unlimited Resumes", "Premium Templates", "Priority Support", "ATS Optimization"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-purple-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/builder">
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Enterprise</h3>
                  <p className="text-sm text-neutral-600 mb-4">For teams</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-neutral-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["Everything in Pro", "Team Management", "API Access", "Custom Branding"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {f}
                      </li>
                  ))}
                  </ul>
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to land your dream job?</h2>
            <p className="text-purple-100 mb-8">Join 10,000+ job seekers who trust ResumeBuilder</p>
            <Link href="/builder">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-neutral-100 shadow-xl">
                Create Your Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">ResumeBuilder</span>
            </div>
            <p className="text-sm text-neutral-400">© 2026 ResumeBuilder AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
