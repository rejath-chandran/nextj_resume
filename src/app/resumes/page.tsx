"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Trash2 } from "lucide-react";

interface Resume {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this resume?")) {
      await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">ResumeBuilder</span>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Home</Button>
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Resumes</h1>
              <p className="text-neutral-600 text-sm">Manage your saved resumes</p>
            </div>
            <Link href="/builder">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Resume
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading...</p>
            </div>
          ) : resumes.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="p-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                <h2 className="font-semibold mb-2">No resumes yet</h2>
                <p className="text-neutral-600 text-sm mb-4">Create your first resume</p>
                <Link href="/builder">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold truncate">{resume.fullName || "Untitled"}</h3>
                    <p className="text-sm text-neutral-600 truncate">{resume.email}</p>
                    <p className="text-xs text-neutral-400 mt-2">{new Date(resume.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/builder?id=${resume.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">Edit</Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(resume.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
