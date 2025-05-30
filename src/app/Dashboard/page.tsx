'use client';

import React, { useState, useEffect } from 'react';
import { User, Trophy, Play, Settings, Users, Book, ChevronDown, Code, Brain, Network, ListOrdered, Filter, Swords, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/util/supabase';

// Types
interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance_rate: number;
  solved?: boolean;
}

interface UserStats {
  problems_solved: number;
  rank: number;
  total_submissions: number;
  acceptance_rate: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('problems');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<string>('all');

  // Add new state for infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const problemsPerPage = 10;

  // Update the fetchProblems function to handle difficulty filtering
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      let query = supabase
        .from('problems')
        .select('*')
        .range((page - 1) * problemsPerPage, page * problemsPerPage - 1);
      
      if (activeSubTab !== 'all') {
        query = query.eq('category', activeSubTab);
      }

      if (difficulty !== 'all') {
        query = query.eq('difficulty', difficulty.toLowerCase());
      }

      const { data, error } = await query;
      
      if (data) {
        setProblems(prev => page === 1 ? data : [...prev, ...data]);
        setHasMore(data.length === problemsPerPage);
      }
      setLoading(false);
    };

    fetchProblems();
  }, [page, activeSubTab, difficulty]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const navItems = [
    { id: 'problems', label: 'Problems', icon: <Code className="w-5 h-5" /> },
    { id: 'play', label: 'Play', icon: <Play className="w-5 h-5" /> },
    { id: 'multiplayer', label: 'Multiplayer', icon: <Network className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <ListOrdered className="w-5 h-5" /> },
  ];
  const learningTabs = [
    { id: 'all', label: 'All Problems' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleProblemClick = (problemId: number) => {
    router.push(`/problems/${problemId}`);
  };

  return (    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          style={{
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full mix-blend-overlay filter blur-3xl opacity-15"
          style={{
            right: '10%',
            top: '60%',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 flex justify-between items-center p-6 backdrop-blur-sm bg-gray-900/30 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center">
            <Code className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">CodeMax</span>
        </div>
        
        <div className="relative">
          <button
            className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-500/20"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </header>

      <div className="flex">        {/* Sidebar */}
        <aside className="w-80 bg-gray-900/40 backdrop-blur-sm min-h-screen p-8 hidden lg:block border-r border-gray-800">
          <div className="space-y-6">
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/problems/multiplayer')}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 flex items-center justify-center space-x-3"
              >
                <Swords className="w-5 h-5" />
                <span>Play</span>
              </button>

              <button 
                onClick={() => router.push('/problems')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 flex items-center justify-center space-x-3"
              >
                <UserCircle className="w-5 h-5" />
                <span>Solo</span>
              </button>

              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 flex items-center justify-center space-x-3"
              >
                <Trophy className="w-5 h-5" />
                <span>Leaderboard</span>
              </button>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Learning Path</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveSubTab('data-structures')}
                  className="w-full bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:bg-gray-700/50 border border-gray-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-cyan-500/20 transition-colors">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">Data Structures</h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300">Master fundamental structures</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveSubTab('algorithms')}
                  className="w-full bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:bg-gray-700/50 border border-gray-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-orange-400 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-500/20 transition-colors">
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-orange-400 transition-colors">Algorithms</h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300">Learn problem-solving</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}        <main className="flex-1 p-6 relative h-screen overflow-hidden">
          {activeTab === 'problems' && (
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-shrink-0 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Problem List</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <select
                        value={difficulty}
                        onChange={(e) => {
                          setDifficulty(e.target.value);
                          setPage(1);
                          setProblems([]);
                        }}
                        className="appearance-none bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-gray-300 px-6 py-3 pr-10 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff.id} value={diff.id}>{diff.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-full text-gray-300 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20">
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Problem List with Fixed Height */}              <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 hover:border-gray-700/50 transition-all duration-500 shadow-lg">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 text-gray-400 font-medium sticky top-0 bg-gray-900/60 backdrop-blur-md z-10 rounded-t-3xl">
                  <div className="col-span-1 text-sm uppercase tracking-wider">Status</div>
                  <div className="col-span-5 text-sm uppercase tracking-wider">Title</div>
                  <div className="col-span-2 text-sm uppercase tracking-wider">Difficulty</div>
                  <div className="col-span-2 text-sm uppercase tracking-wider">Category</div>
                  <div className="col-span-2 text-sm uppercase tracking-wider">Acceptance</div>
                </div>
                
                <div                  className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600"
                  onScroll={handleScroll}
                >
                  {loading && page === 1 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : problems.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No problems found matching your criteria</div>
                  ) : (
                    <div className="divide-y divide-gray-800">
                      {problems.map((problem) => (
                        <div 
                          key={problem.id} 
                          onClick={() => handleProblemClick(problem.id)}
                          className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-800/40 cursor-pointer transition-all duration-300 group hover:shadow-lg hover:shadow-gray-500/5"
                        >
                          <div className="col-span-1">
                            {problem.solved ? (
                              <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                ✓
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-700/20 group-hover:bg-gray-600/20 transition-colors" />
                            )}
                          </div>
                          <div className="col-span-5 text-gray-300 group-hover:text-white transition-colors">
                            {problem.title}
                          </div>
                          <div className={`col-span-2 ${getDifficultyColor(problem.difficulty)} group-hover:scale-105 transition-transform`}>
                            {problem.difficulty}
                          </div>
                          <div className="col-span-2 text-gray-400 group-hover:text-gray-300 transition-colors">{problem.category}</div>
                          <div className="col-span-2 text-gray-400 group-hover:text-gray-300 transition-colors">{problem.acceptance_rate}%</div>
                        </div>
                      ))}
                      {loading && page > 1 && (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'play' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
                <h3 className="text-xl font-bold mb-4">Daily Challenge</h3>
                <p className="text-gray-400 mb-4">Solve the problem of the day</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Start Challenge
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-4">Random Problem</h3>
                <p className="text-gray-400 mb-4">Get a random problem to solve</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Start Random
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                <h3 className="text-xl font-bold mb-4">Contest Mode</h3>
                <p className="text-gray-400 mb-4">Practice with time constraints</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Start Contest
                </button>
              </div>
            </div>
          )}

          {activeTab === 'multiplayer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Live Contests</h3>
                <p className="text-gray-400 mb-4">Compete in real-time coding battles</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Join Contest
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">1v1 Challenge</h3>
                <p className="text-gray-400 mb-4">Challenge a friend to a coding duel</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Create Challenge
                </button>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Global Leaderboard</h2>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full" />
                        <span className="text-white">User {index + 1}</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {1000 - index * 50} points
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}