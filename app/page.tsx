'use client'
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-950 h-full p-10">
      <div className="bg-slate-800 h-full rounded-xl p-2">
        <Input onChange={(e)=>console.log(e.target.files)} type="file" placeholder="Upload" />
      </div>
    </div>
  );
}
