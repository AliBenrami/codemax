"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDot, Dices, Filter, CheckCircle2, Circle, ArrowRight, Code, User } from 'lucide-react';
import supabase from "@/app/util/supabase";

interface ProblemInterface {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved?: boolean;
}

export default function Problems() {
  const [problems, setProblems] = useState<ProblemInterface[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      let query = supabase.from('problems').select('*');
      
      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty', selectedDifficulty);
      }

      const { data, error } = await query;
      if (data) {
        setProblems(data);
      }
      setLoading(false);
    };

    fetchProblems();
  }, [selectedDifficulty]);

  // Calculate stats for the progress circle
  const totalProblems = problems.length;
  const solvedEasy = problems.filter(p => p.solved && p.difficulty === 'Easy').length;
  const solvedMedium = problems.filter(p => p.solved && p.difficulty === 'Medium').length;
  const solvedHard = problems.filter(p => p.solved && p.difficulty === 'Hard').length;
  const totalSolved = solvedEasy + solvedMedium + solvedHard;

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyButtonStyles = (difficulty: string) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-between";
    const isSelected = selectedDifficulty === difficulty.toLowerCase();
    
    if (isSelected) {
      switch(difficulty) {
        case 'Easy':
          return `${baseStyles} bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20`;
        case 'Medium':
          return `${baseStyles} bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/20`;
        case 'Hard':
          return `${baseStyles} bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20`;
        default:
          return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20`;
      }
    }

    return `${baseStyles} bg-gray-800/50 backdrop-blur-sm text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background gradients - matching homepage style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          style={{ left: '5%', top: '20%' }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full mix-blend-overlay filter blur-3xl opacity-15"
          style={{ right: '5%', top: '60%' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 backdrop-blur-sm bg-gray-900/30 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center">
            <Code className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">CodeMax</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-500/20"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 pt-8">
        {/* Progress Half Circle - Centered */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 hover:bg-gray-800/40 transition-all duration-300 hover:shadow-2xl hover:border-gray-600">
            <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Your Progress
            </h3>
            <div className="relative w-[400px] h-[200px]">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Background arc */}
                <path
                  d="M20 100 A80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="20"
                />
                {/* Easy section (left) */}
                <path
                  d="M20 100 A80 80 0 0 1 73.3 100"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="20"
                  className="transition-all duration-500"
                />
                {/* Medium section (middle) */}
                <path
                  d="M73.3 100 A80 80 0 0 1 126.6 100"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="20"
                  className="transition-all duration-500"
                />
                {/* Hard section (right) */}
                <path
                  d="M126.6 100 A80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="20"
                  className="transition-all duration-500"
                />
                
                {/* Progress counters */}
                <g className="text-sm font-semibold">
                  <text x="46.65" y="80" textAnchor="middle" fill="white">{solvedEasy}</text>
                  <text x="100" y="80" textAnchor="middle" fill="white">{solvedMedium}</text>
                  <text x="153.3" y="80" textAnchor="middle" fill="white">{solvedHard}</text>
                  
                  <text x="46.65" y="95" textAnchor="middle" fill="#9CA3AF" fontSize="10">Easy</text>
                  <text x="100" y="95" textAnchor="middle" fill="#9CA3AF" fontSize="10">Medium</text>
                  <text x="153.3" y="95" textAnchor="middle" fill="#9CA3AF" fontSize="10">Hard</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-12">
          {/* Difficulty Filter Sidebar - Raised and moved left */}
          <div className="w-72 space-y-4 -ml-4">
            <button 
              onClick={() => setSelectedDifficulty('all')}
              className={`block w-full p-6 backdrop-blur-sm rounded-3xl transition-all duration-300 border border-gray-800 hover:border-gray-600 ${
                selectedDifficulty === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20' 
                  : 'bg-gray-900/40 hover:bg-gray-800/40 text-gray-300 hover:shadow-lg hover:shadow-gray-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6" />
                <span className="text-lg font-semibold">All Problems</span>
              </div>
            </button>

            <button 
              onClick={() => setSelectedDifficulty('easy')}
              className={`block w-full p-6 backdrop-blur-sm rounded-3xl transition-all duration-300 border border-gray-800 hover:border-gray-600 ${
                selectedDifficulty === 'easy'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-xl shadow-green-500/20'
                  : 'bg-gray-900/40 hover:bg-gray-800/40 text-gray-300 hover:shadow-lg hover:shadow-gray-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Circle className="w-6 h-6" />
                <span className="text-lg font-semibold">Easy</span>
              </div>
            </button>

            <button 
              onClick={() => setSelectedDifficulty('medium')}
              className={`block w-full p-6 backdrop-blur-sm rounded-3xl transition-all duration-300 border border-gray-800 hover:border-gray-600 ${
                selectedDifficulty === 'medium'
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-xl shadow-yellow-500/20'
                  : 'bg-gray-900/40 hover:bg-gray-800/40 text-gray-300 hover:shadow-lg hover:shadow-gray-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <CircleDot className="w-6 h-6" />
                <span className="text-lg font-semibold">Medium</span>
              </div>
            </button>

            <button 
              onClick={() => setSelectedDifficulty('hard')}
              className={`block w-full p-6 backdrop-blur-sm rounded-3xl transition-all duration-300 border border-gray-800 hover:border-gray-600 ${
                selectedDifficulty === 'hard'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-500/20'
                  : 'bg-gray-900/40 hover:bg-gray-800/40 text-gray-300 hover:shadow-lg hover:shadow-gray-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-lg font-semibold">Hard</span>
              </div>
            </button>

            <button 
              onClick={() => {
                const randomProblem = problems[Math.floor(Math.random() * problems.length)];
                if (randomProblem) {
                  router.push(`/problems/${randomProblem.id}`);
                }
              }}
              className="block w-full p-6 backdrop-blur-sm rounded-3xl transition-all duration-300 border border-gray-800 hover:border-gray-600 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-3">
                <Dices className="w-6 h-6" />
                <span className="text-lg font-semibold">Random</span>
              </div>
            </button>
          </div>

          {/* Problem List - Raised and moved right */}
          <div className="flex-1 bg-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-600">
            <div className="p-8 border-b border-gray-700 sticky top-0 bg-gray-900/60 backdrop-blur-md z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Problem List
              </h2>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-lg">
                  No problems found matching your criteria
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => router.push(`/problems/${problem.id}`)}
                      className="p-8 hover:bg-gray-800/40 cursor-pointer transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {problem.solved ? (
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              ✓
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700/20 group-hover:bg-gray-600/20 transition-colors" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg text-gray-300 group-hover:text-white transition-colors font-medium">
                            {problem.title}
                          </h3>
                        </div>
                        <div className={`flex-shrink-0 font-medium ${getDifficultyColor(problem.difficulty)} group-hover:scale-105 transition-transform`}>
                          {problem.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
