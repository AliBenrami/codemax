"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/util/supabase";
import Nav from "../components/nav";

interface probinfoInterface {
  id: number;
  title: string;
}

export default function Home() {
  const [probList, setProbList] = useState<probinfoInterface[]>([]);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      let { data: problems, error } = await supabase
        .from("problems")
        .select("id,title");

      setProbList(problems ?? []);
    };
    init();
  }, []);

  const buttonUI = (buttoninfo: probinfoInterface, index: number) => {
    return (
      <button
        key={buttoninfo.id}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => {
          router.push(`problems/${buttoninfo.id}`);
        }}
      >
        {buttoninfo.title}
      </button>
    );
  };

  return (
    <>
      <Nav></Nav>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Problem List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {probList.map((content: probinfoInterface, index: number) => {
            return buttonUI(content, index);
          })}
        </div>
        {probList.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Loading problems...</p>
        )}
      </div>
    </>
  );
}
