"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDot, Dices, Filter, CheckCircle2, Circle, ArrowRight, Code, User, MessageCircle, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Profile and Stats */}
          <div className="col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg">
                  <User className="w-full h-full p-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">Martin_Master2</h2>
                  <p className="text-gray-400 text-sm">Martin_Master2</p>
                  <p className="text-gray-400 text-sm mt-1">Rank ~5,000,000</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/Profile')}
                className="mt-4 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Community Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Views</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Solution</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Discuss</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Reputation</span>
                  </div>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Languages</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Java</span>
                  <span>1 problem solved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Progress and Problems */}
          <div className="col-span-9 space-y-6">
            {/* Progress Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Circular Progress */}
                <div className="relative">
                  <div className="w-48 h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="10"
                      />
                      {/* Progress circle - only show a tiny bit since 1/3565 is very small */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset="282"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="45"
                        textAnchor="middle"
                        className="text-3xl font-bold"
                        fill="white"
                      >
                        1
                      </text>
                      <text
                        x="50"
                        y="65"
                        textAnchor="middle"
                        className="text-sm"
                        fill="#9CA3AF"
                      >
                        /3565
                      </text>
                    </svg>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-green-400">Solved</div>
                    <div className="text-gray-400 text-sm">0 Attempting</div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-green-400">Easy</span>
                      <span>1/878</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-[0.1%] bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-yellow-400">Medium</span>
                      <span>0/1849</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-0 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-red-400">Hard</span>
                      <span>0/838</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div className="h-full w-0 bg-red-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem List */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent AC</h2>
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-white">List</button>
                    <button className="text-gray-400 hover:text-white">Solutions</button>
                    <button className="text-gray-400 hover:text-white">Discuss</button>
                  </div>
                </div>
              </div>
              
              {/* Problem Items */}
              <div className="divide-y divide-gray-700">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : problems.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No problems found
                  </div>
                ) : (
                  problems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => router.push(`/problems/${problem.id}`)}
                      className="p-6 hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          problem.solved ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span className="flex-1">{problem.title}</span>
                        <span className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
