"use client";

import { useEffect, useState } from "react";
import { Check, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type BlogForm = { _id?: string; title: string; slug: string; excerpt: string; content: string; featuredImage: string; imageAlt: string; author: string; category: string; tags: string; metaTitle: string; metaDescription: string; ogImage: string; relatedCategorySlug: string; isPublished: boolean };
const EMPTY: BlogForm = { title: "", slug: "", excerpt: "", content: "", featuredImage: "", imageAlt: "", author: "BOHOBLOCKPRINTED", category: "", tags: "", metaTitle: "", metaDescription: "", ogImage: "", relatedCategorySlug: "", isPublished: false };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<(BlogForm & { updatedAt?: string })[]>([]);
  const [form, setForm] = useState<BlogForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = async () => { const response = await fetch("/api/admin/blog", { cache: "no-store" }); const data = await response.json(); setPosts(data.posts || []); };
  useEffect(() => { load(); }, []);
  const edit = (post: BlogForm) => setForm({ ...EMPTY, ...post, tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "" });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    const response = await fetch(form._id ? `/api/admin/blog/${form._id}` : "/api/admin/blog", { method: form._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean), _id: undefined }) });
    const data = await response.json(); setSaving(false);
    if (!response.ok) { setError(data.error || "Unable to save post"); return; }
    setForm(EMPTY); await load();
  };
  const remove = async (id: string) => { if (!confirm("Delete this blog post?")) return; await fetch(`/api/admin/blog/${id}`, { method: "DELETE" }); if (form._id === id) setForm(EMPTY); await load(); };

  return <div className="grid gap-6 xl:grid-cols-[1.08fr_.92fr]">
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">SEO content</p><h1 className="mt-2 text-2xl font-bold">{form._id ? "Edit Blog Post" : "Create Blog Post"}</h1><p className="mt-1 text-sm text-gray-500">Use ## before a line to create an article heading.</p></div>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Title *<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3" /></label><label className="text-sm font-medium">Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Generated from title" className="mt-2 w-full rounded-lg border px-4 py-3" /></label></div>
      <label className="block text-sm font-medium">Excerpt *<textarea required minLength={20} maxLength={320} rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3" /></label>
      <label className="block text-sm font-medium">Full article content *<textarea required minLength={80} rows={14} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder={'Introduction...\n\n## Care instructions\n\nHelpful original content...'} className="mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm" /></label>
      <ImageUpload images={form.featuredImage ? [form.featuredImage] : []} label="Featured Image" multiple={false} onChange={(images) => setForm({ ...form, featuredImage: images.at(-1) || "" })} />
      <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Image alt text *<input required value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3" /></label><label className="text-sm font-medium">Author<input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3" /></label><label className="text-sm font-medium">Article category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3" /></label><label className="text-sm font-medium">Related shop category slug<input value={form.relatedCategorySlug} onChange={(e) => setForm({ ...form, relatedCategorySlug: e.target.value })} placeholder="duvet-covers" className="mt-2 w-full rounded-lg border px-4 py-3" /></label></div>
      <label className="block text-sm font-medium">Tags<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="linen care, block print bedding" className="mt-2 w-full rounded-lg border px-4 py-3" /></label>
      <div className="rounded-xl bg-gray-50 p-5"><p className="text-sm font-bold">Search appearance</p><div className="mt-4 space-y-3"><input maxLength={70} value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="SEO title" className="w-full rounded-lg border bg-white px-4 py-3" /><textarea maxLength={180} rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Meta description" className="w-full rounded-lg border bg-white px-4 py-3" /><input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="Social image URL (optional)" className="w-full rounded-lg border bg-white px-4 py-3" /></div></div>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 accent-brand-600" /> Publish this article</label>
      <div className="flex gap-3"><button type="button" onClick={() => setForm(EMPTY)} className="rounded-lg border px-5 py-3 text-sm">Clear</button><button disabled={saving || !form.featuredImage} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{form._id ? <Check size={16} /> : <Plus size={16} />}{saving ? "Saving..." : form._id ? "Update Post" : "Create Post"}</button></div>
    </form>
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="font-semibold">All Posts</h2><div className="mt-5 space-y-3">{posts.map((post) => <article key={post._id} className="rounded-xl border border-gray-100 p-4"><div className="flex items-start gap-3"><span className="rounded-lg bg-brand-50 p-2 text-brand-700"><FileText size={18} /></span><div className="min-w-0 flex-1"><h3 className="font-semibold text-gray-900">{post.title}</h3><p className="mt-1 truncate text-xs text-gray-500">/blog/{post.slug}</p><span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${post.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{post.isPublished ? "Published" : "Draft"}</span></div><button onClick={() => edit(post)} className="rounded-lg p-2 hover:bg-gray-100"><Pencil size={15} /></button><button onClick={() => remove(post._id!)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></div></article>)}{!posts.length ? <p className="py-10 text-center text-sm text-gray-500">No database posts yet.</p> : null}</div></div>
  </div>;
}
