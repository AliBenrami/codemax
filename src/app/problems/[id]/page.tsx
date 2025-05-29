"use client";
import React, { useEffect, useRef, useState, use } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FC } from "react";
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
    <div className="h-screen w-screen flex flex-row">
      <div className="h-screen w-1/2 bg-white border-r border-gray-200">
        <ProblemPrompt content={content} />
      </div>

      <Editor
        height="100vh"
        width="50%"
        defaultLanguage="python"
        defaultValue={`# Function to sum two numbers
def temp(self):
    # Add your code here`}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default Question;
