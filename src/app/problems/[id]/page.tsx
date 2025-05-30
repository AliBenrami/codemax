"use client";
import React, { useEffect, useRef, useState, use } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Code, User } from "lucide-react";
import supabase from "@/app/util/supabase";

interface PromptContent {
  title: string;
  description: string;
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Separate component for the prompt display
const ProblemPrompt: React.FC<{ content: PromptContent }> = ({ content }) => (
  <div className="p-6 text-black">
    <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
    <p className="text-gray-700">{content.description}</p>
  </div>
);

const Question: FC<ProductPageProps> = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  const [content, setContent] = useState<PromptContent>({
    title: "temp",
    description: "Write a function.",
  });

  useEffect(() => {
    const init = async () => {
      let { data: problems, error } = await supabase
        .from("problems")
        .select("*")
        .eq("id", id)
        .single();

      if (problems) {
        setContent({
          title: problems.title,
          description: problems.description,
        });
      }
    };
    init();
  }, [id]); // Add id to dependency array

  // Properly typed editor reference
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Properly typed onMount handler
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black">
      <header className="relative z-50 flex justify-between items-center p-6 backdrop-blur-sm bg-gray-900/30 border-b border-gray-800">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center">
            <Code className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">CodeMax</span>
        </button>

        <div className="relative">
          <button
            onClick={() => router.push("/Profile")}
            className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-500/20"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="h-full w-1/2 bg-gray-900/40 backdrop-blur-sm border-r border-gray-700">
          <ProblemPrompt content={content} />
        </div>

        <Editor
          height="100%"
          width="50%"
          defaultLanguage="python"
          defaultValue={`# Function to sum two numbers\ndef temp(self):\n    # Add your code here`}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};

export default Question;
