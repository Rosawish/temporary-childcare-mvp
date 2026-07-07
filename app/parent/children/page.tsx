"use client";

import { useEffect, useState } from "react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { currentParent, loadDb, saveDb, uid } from "@/lib/store";
import type { ChildProfile, MockDb } from "@/lib/types";

const blank = (parentUserId: string): ChildProfile => ({
  id: uid("child"),
  parentUserId,
  name: "",
  age: 5,
  schoolName: "",
  className: "",
  schoolLeaveTime: "16:00",
  allergies: "",
  medicalNotes: "",
  comfortNotes: "",
  emergencyContact: { name: "", phone: "", relation: "" },
  authorizedPickupPeople: []
});

export default function ChildrenPage() {
  const [db, setDb] = useState<MockDb>();
  const [form, setForm] = useState<ChildProfile>();

  useEffect(() => {
    const loaded = loadDb();
    const parent = currentParent();
    setDb(loaded);
    setForm(blank(parent?.id ?? "parent-lin"));
  }, []);

  if (!db || !form) return null;
  const parent = currentParent();
  const children = db.children.filter((child) => child.parentUserId === parent?.id);

  function persist(next: MockDb) {
    saveDb(next);
    setDb({ ...next });
  }

  function saveChild() {
    if (!db || !form || !form.name.trim()) return;
    const next = { ...db, children: db.children.some((item) => item.id === form.id) ? db.children.map((item) => (item.id === form.id ? form : item)) : [form, ...db.children] };
    persist(next);
    setForm(blank(parent?.id ?? "parent-lin"));
  }

  return (
    <AppShell>
      <PageTitle title="孩子資料管理" subtitle="讓機構在臨時情境下快速掌握過敏、接回與安撫資訊。" />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="mb-3 font-bold">{db.children.some((item) => item.id === form.id) ? "編輯孩子" : "新增孩子"}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className="label">孩子姓名</span><input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label><span className="label">年齡</span><input className="field mt-1" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></label>
            <label><span className="label">學校名稱</span><input className="field mt-1" value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} /></label>
            <label><span className="label">班級</span><input className="field mt-1" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} /></label>
            <label><span className="label">放學時間</span><input className="field mt-1" type="time" value={form.schoolLeaveTime} onChange={(e) => setForm({ ...form, schoolLeaveTime: e.target.value })} /></label>
            <label><span className="label">緊急聯絡人</span><input className="field mt-1" value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} /></label>
            <label className="sm:col-span-2"><span className="label">過敏資訊</span><textarea className="field mt-1" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} /></label>
            <label className="sm:col-span-2"><span className="label">疾病或特殊照顧需求</span><textarea className="field mt-1" value={form.medicalNotes} onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })} /></label>
            <label className="sm:col-span-2"><span className="label">安撫方式</span><textarea className="field mt-1" value={form.comfortNotes} onChange={(e) => setForm({ ...form, comfortNotes: e.target.value })} /></label>
            <label className="sm:col-span-2"><span className="label">授權接回人（逗號分隔）</span><input className="field mt-1" value={form.authorizedPickupPeople.join(", ")} onChange={(e) => setForm({ ...form, authorizedPickupPeople: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></label>
          </div>
          <button className="btn-primary mt-4" onClick={saveChild}>儲存孩子資料</button>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">已建檔孩子</h2>
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold">{child.name}，{child.age} 歲</p>
                <p className="text-sm text-slate-600">{child.schoolName} {child.className}</p>
                <p className="mt-2 text-sm text-slate-600">過敏：{child.allergies || "無"}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-secondary" onClick={() => setForm(child)}>編輯</button>
                  <button className="btn-secondary" onClick={() => persist({ ...db, children: db.children.filter((item) => item.id !== child.id) })}>刪除</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
