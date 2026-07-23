"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Trash2, LogOut, Pencil, Check, X, Loader2 } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface Resume {
  id: number;
  fullName: string;
  email: string;
  resumeName: string | null;
  createdAt: string;
}

export default function ResumesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleRename = async (id: number, newName: string) => {
    try {
      const response = await fetch("/api/resumes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resumeName: newName }),
      });
      if (response.ok) {
        const updated = await response.json();
        setResumes(prev =>
          prev.map(r => (r.id === id ? { ...r, resumeName: updated.resumeName } : r))
        );
      }
    } catch (error) {
      console.error("Error renaming resume:", error);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
              Resume<span className="text-violet-600">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session?.user && (
              <span className="hidden sm:inline text-sm text-slate-500 font-medium">
                {session.user.email}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="gap-2 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                My Resumes
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Manage, rename, and edit your saved resumes
              </p>
            </div>
            <Link href="/builder">
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20 rounded-xl px-5 py-2.5 font-semibold">
                <Plus className="w-4 h-4" />
                New Resume
              </Button>
            </Link>
          </div>

          {/* Resume Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              <span className="ml-3 text-slate-500 font-medium">Loading resumes…</span>
            </div>
          ) : resumes.length === 0 ? (
            <Card className="max-w-md mx-auto text-center border-slate-200/80 shadow-xs rounded-2xl">
              <CardContent className="p-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-slate-300" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 mb-1">No resumes yet</h2>
                <p className="text-slate-500 text-sm mb-6">Create your first resume to get started</p>
                <Link href="/builder">
                  <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-2.5 font-semibold shadow-md shadow-violet-500/20">
                    <Plus className="w-4 h-4" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────── Resume Card with Inline Rename ─────────────────────── */

function ResumeCard({
  resume,
  onDelete,
  onRename,
}: {
  resume: Resume;
  onDelete: (id: number) => void;
  onRename: (id: number, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(resume.resumeName || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = resume.resumeName || resume.fullName || "Untitled Resume";

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    onRename(resume.id, trimmed);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(resume.resumeName || "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <Card className="group relative border-slate-200/80 shadow-xs hover:shadow-lg hover:border-violet-200/60 transition-all duration-300 rounded-2xl overflow-hidden">
      {/* Subtle top accent */}
      <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-5 sm:p-6">
        {/* Resume Name (editable) */}
        {editing ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Resume name…"
              className="flex-1 min-w-0 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
            <button
              onClick={handleSave}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
              title="Save"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <button
              onClick={handleCancel}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-base text-slate-900 truncate leading-snug">
              {displayName}
            </h3>
            <button
              onClick={() => {
                setDraft(resume.resumeName || resume.fullName || "");
                setEditing(true);
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:text-violet-600 hover:bg-violet-50 transition-all opacity-0 group-hover:opacity-100"
              title="Rename resume"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Meta info */}
        <p className="text-sm text-slate-500 truncate">{resume.fullName}</p>
        <p className="text-xs text-slate-400 mt-1">
          {new Date(resume.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <Link href={`/builder?id=${resume.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl font-semibold text-xs hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-colors"
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(resume.id)}
            className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
