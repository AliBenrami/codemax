'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';


export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  // Navigation functions with unique routes
  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGetStarted = () => {
    router.push('/Dashboard');
  };

  const handleBrowseProblems = () => {
    router.push('/problems');
  };

  const handleStartLearning = () => {
    router.push('/Dashboard');
  };

  const handleCommunity = () => {
    router.push('/Dashboard');
  };

  const handleProgress = () => {
    router.push('/Dashboard');
  };

  const handleInteractive = () => {
    router.push('/Dashboard');
  };

  // Heroicons SVG components
  const CodeBracketIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );

  const ChartBarIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );

  const UserGroupIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const KeyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  );

  const UserPlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.674-1.334c.343.604.526 1.283.526 1.977v.072" />
    </svg>
  );

  const RocketLaunchIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );

  const CodeBracketSquareIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  );

  const features = [
    {
      title: "Interactive Problems",
      description: "Solve real-world coding challenges with instant feedback and real-time validation",
      icon: <CodeBracketIcon className="w-12 h-12" />,
      delay: 0,
      onClick: handleInteractive,
      glowColor: "hover:shadow-emerald-500/50"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics, skill assessments, and performance insights",
      icon: <ChartBarIcon className="w-12 h-12" />,
      delay: 200,
      onClick: handleProgress,
      glowColor: "hover:shadow-purple-500/50"
    },
    {
      title: "Community",
      description: "Connect with fellow developers, share solutions, and learn from coding experts",
      icon: <UserGroupIcon className="w-12 h-12" />,
      delay: 400,
      onClick: handleCommunity,
      glowColor: "hover:shadow-cyan-500/50"
    }
  ];

  const routes = [
    {
      title: "Browse Problems",
      description: "Explore our extensive collection of coding challenges across all skill levels",
      onClick: handleBrowseProblems,
      icon: <CodeBracketSquareIcon className="w-8 h-8" />,
      glowColor: "hover:shadow-red-500/50"
    },
    {
      title: "Start Learning",
      description: "Begin your coding journey with guided tutorials and structured learning paths",
      onClick: handleStartLearning,
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      glowColor: "hover:shadow-orange-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Subtle animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full mix-blend-overlay filter blur-3xl opacity-15"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            right: '10%',
            top: '60%',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 backdrop-blur-sm bg-gray-900/30 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center">
            <CodeBracketIcon className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">CodeMax</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-500/20"
          >
            <UserIcon />
            <span>Profile</span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700">
              <button 
                onClick={() => router.push('/Profile')}
                className="w-full text-left px-6 py-4 hover:bg-gray-800/50 rounded-t-2xl transition-all duration-300 flex items-center space-x-3 hover:shadow-inner"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button 
                onClick={handleLogin}
                className="w-full text-left px-6 py-4 hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-3 hover:shadow-inner"
              >
                <KeyIcon />
                <span>Login</span>
              </button>
              <button 
                onClick={handleSignUp}
                className="w-full text-left px-6 py-4 hover:bg-gray-800/50 rounded-b-2xl transition-all duration-300 flex items-center space-x-3 hover:shadow-inner"
              >
                <UserPlusIcon />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-24 px-6">
        <div 
          className="max-w-5xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome to <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">CodeMax</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 max-w-3xl mx-auto leading-relaxed">
            Master coding skills through interactive challenges and join a thriving community of developers
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-black font-semibold py-4 px-12 rounded-full text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-white/30 border-2 border-transparent hover:border-white/20"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            id="features-title"
            data-animate
            className={`text-5xl font-bold text-center mb-20 transition-all duration-1000 text-white ${
              isVisible['features-title'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            Why Choose CodeMax?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                id={`feature-${index}`}
                data-animate
                onClick={feature.onClick}
                className={`bg-gray-900/40 backdrop-blur-sm rounded-3xl p-12 border border-gray-800 hover:bg-gray-800/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-gray-600 ${feature.glowColor} group text-left w-full ${
                  isVisible[`feature-${index}`]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${feature.delay}ms`
                }}
              >
                <div className="text-gray-400 group-hover:text-white mb-8 flex justify-center transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-center text-white group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 text-center leading-relaxed transition-colors">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div 
            id="cta-section"
            data-animate
            className={`text-center transition-all duration-1000 ${
              isVisible['cta-section']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">Ready to Start Coding?</h2>
            <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">Choose your path and begin your journey to becoming a better developer</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {routes.map((route, index) => (
                <button
                  key={index}
                  onClick={route.onClick}
                  className={`block w-full p-12 bg-gray-900/40 backdrop-blur-sm rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl ${route.glowColor} group border border-gray-800 hover:border-gray-600 hover:bg-gray-800/40`}
                >
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {route.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-white transition-colors">{route.title}</h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed text-lg">
                    {route.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-16 px-6 mt-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center">
              <CodeBracketIcon className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">CodeMax</span>
          </div>
          <p className="text-gray-400 text-lg">© 2025 CodeMax. Empowering developers worldwide.</p>
        </div>
      </footer>
    </div>
  );
}