'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Code, User, Info, Shield, Settings, LogOut, Trash2, Eye, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import supabase from '@/app/util/supabase';

interface UserProfile {
  username: string;
  email: string;
  birthday: string;
  gender: string;
  location: string;
  bio: string;
}

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    birthday: '',
    gender: 'Prefer not to say',
    location: '',
    bio: ''
  });
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No active session, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('Fetching profile for user:', session.user.id);

        // Get user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, showing username prompt');
            // Profile doesn't exist, show username prompt
            setProfile(prev => ({ 
              ...prev, 
              email: session.user.email || '',
              username: '',
              birthday: '',
              gender: 'Prefer not to say',
              location: '',
              bio: ''
            }));
            setShowUsernamePrompt(true);
          } else {
            throw profileError;
          }
        } else if (profileData) {
          console.log('Profile found:', profileData);
          setProfile({
            username: profileData.username || '',
            email: session.user.email || '',
            birthday: profileData.birthday || '',
            gender: profileData.gender || 'Prefer not to say',
            location: profileData.location || '',
            bio: profileData.bio || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Add your account deletion logic here
        // const { error } = await supabase.auth.api.deleteUser(user.id)
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication error. Please try logging in again.');
      }

      // Validate data before saving
      if (!profile.username || profile.username.length < 3 || profile.username.length > 30) {
        throw new Error('Username must be between 3 and 30 characters');
      }

      if (profile.bio && profile.bio.length > 500) {
        throw new Error('Bio must be less than 500 characters');
      }

      // Prepare profile data
      const profileData = {
        id: session.user.id,
        username: profile.username.trim(),
        birthday: profile.birthday || null,
        gender: profile.gender || null,
        location: profile.location || null,
        bio: profile.bio || null,
        updated_at: new Date().toISOString()
      };

      // Try to get existing profile first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      let result;
      if (!existingProfile) {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert([profileData])
          .select('*')
          .single();
      } else {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', session.user.id)
          .select('*')
          .single();
      }

      if (result.error) {
        console.error('Save error:', result.error);
        if (result.error.code === '23505') {
          throw new Error('This username is already taken');
        }
        throw new Error('Failed to save profile changes');
      }

      console.log('Profile saved successfully:', result.data);
      setSaveSuccess(true);
      
      if (showUsernamePrompt) {
        setShowUsernamePrompt(false);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showUsernamePrompt) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">
            Welcome to CodeMax!
          </h2>
          <p className="text-gray-400 mb-6">
            Please choose a username to complete your profile setup.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Choose a username"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={!profile.username}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradients */}
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Profile and Stats */}
          <div className="col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profile.username}</h2>
                    <p className="text-gray-400 text-sm">{profile.username}</p>
                    <p className="text-gray-400 text-sm mt-1">Rank ~5,000,000</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('account')}
                  className="w-full py-2 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-500 rounded-lg transition-colors text-sm font-medium border border-green-500/20"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Views</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Solution</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">Discuss</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">Reputation</span>
                  </div>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Languages</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Java</span>
                  <span className="text-sm">1 problem solved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Progress and Problems */}
          <div className="col-span-9 space-y-6">
            {/* Stats Overview */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Progress Circle */}
                <div className="relative flex items-center justify-center">
                  <div className="w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1a1a1a"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="10"
                        strokeDasharray="282.7"
                        strokeDashoffset="280"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                      <span className="text-gray-400 text-sm">/3565</span>
                      <span className="text-green-400 text-sm mt-2">Solved</span>
                      <span className="text-gray-400 text-xs">0 Attempting</span>
                    </div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-green-400">Easy</span>
                      <span>1/878</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[0.11%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-yellow-400">Medium</span>
                      <span>0/1849</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-red-400">Hard</span>
                      <span>0/838</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Calendar */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">2</span>
                  <span className="text-gray-400">submissions in the past year</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Total active days: 1</span>
                  <span>Max streak: 1</span>
                  <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1">
                    <option>Current</option>
                  </select>
                </div>
              </div>
              
              {/* Calendar Grid - Placeholder */}
              <div className="grid grid-cols-12 gap-1">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="space-y-1">
                    {Array(7).fill(0).map((_, j) => (
                      <div key={j} className="w-full aspect-square bg-gray-800/50 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-6">
                  <button className="text-white font-medium">Recent AC</button>
                  <button className="text-gray-400 hover:text-white transition-colors">List</button>
                  <button className="text-gray-400 hover:text-white transition-colors">Solutions</button>
                  <button className="text-gray-400 hover:text-white transition-colors">Discuss</button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Two Sum</span>
                  <span>5 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}