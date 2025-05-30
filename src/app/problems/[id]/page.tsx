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
  <div className="p-8 text-gray-100 bg-gray-800 border-b border-gray-700">
    <h1 className="text-3xl font-bold mb-4 text-white">{content.title}</h1>
    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
      {content.description}
    </p>
  </div>
);

const Question: FC<ProductPageProps> = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);


  const [content, setContent] = useState<PromptContent>({
    title: "temp",
    description: "Write a function.",
  });

  // Function to run the code
  const runCode = async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setOutput("");
    try {
      const code = editorRef.current.getValue();
      console.log("Sending code to API:", code);
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code,
          language: "python", // You can make this dynamic later
          input: "", // Add input field if needed
        }),
      });

      const result = await response.json();

      if (result.error) {
        setOutput(`Error: ${result.error}`);
        return;
      }

      // Format the output
      let outputText = "";
      if (result.compile_output)
        outputText += `Compilation Output:\n${result.compile_output}\n\n`;
      if (result.stdout) outputText += `Program Output:\n${result.stdout}\n`;
      if (result.stderr) outputText += `Error Output:\n${result.stderr}\n`;
      if (result.message) outputText += `Message:\n${result.message}\n`;

      setOutput(outputText || "No output");
    } catch (error) {
      setOutput("Failed to execute code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

    <div className="h-screen w-full flex flex-col bg-[#1e1e1e]">
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Problem Description and Output Side */}
        <div className="h-full w-1/2 bg-gray-900 flex flex-col">
          {/* Make the problem prompt scrollable */}
          <div className="overflow-y-auto max-h-[50%]">
            <ProblemPrompt content={content} />
          </div>

          {/* Output Section */}
          <div className="flex-1 p-6 bg-gray-900 overflow-auto">
            <div className="mb-2 text-sm font-medium text-gray-400">Output</div>
            <div className="font-mono whitespace-pre-wrap bg-[#1e1e1e] text-gray-200 p-5 rounded-lg shadow-lg border border-gray-800 min-h-[200px] overflow-auto">
              {isLoading ? (
                <div className="text-gray-300 flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running code...
                </div>
              ) : (
                <span className={output ? "text-gray-100" : "text-gray-500"}>
                  {output || "Code output will appear here"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editor Side */}
        <div className="h-full w-1/2 flex flex-col bg-[#1e1e1e]">
          <div className="p-4 bg-[#252526] border-b border-gray-800 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-400">
              Python Editor
            </div>
            <button
              onClick={runCode}
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-white font-medium transition-all duration-200 ${
                isLoading
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running...
                </span>
              ) : (
                "Run Code"
              )}
            </button>
          </div>

          <Editor
            height="calc(100% - 64px)"
            width="100%"
            defaultLanguage="python"
            defaultValue={`# Write your Python code here\n`}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              theme: "vs-dark",
              padding: { top: 20 },
              lineNumbers: "on",
              renderLineHighlight: "all",
              suggest: {
                showKeywords: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Question;
