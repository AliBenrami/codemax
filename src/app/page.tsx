import Link from "next/link";

export default function Home() {
  const routes = [
    {
      title: "Problems",
      description: "Browse and solve coding problems",
      href: "/problems",
      icon: "💻",
    },
    {
      title: "Login",
      description: "Sign in to your account",
      href: "/Login",
      icon: "🔑",
    },
  ];

  return (
    <main className="min-h-screen bg-[#181c23] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeMax</h1>
          <p className="text-xl text-gray-400">
            Your journey to coding excellence starts here
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="block p-6 bg-[#35363a] rounded-xl hover:bg-[#41424a] transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl">{route.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{route.title}</h2>
                  <p className="text-gray-400">{route.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
