"use client";
import supabase from "../util/supabase";

export default function Authentication() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/Dashboard`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181c23]">
      <div
        className="relative flex flex-col items-center justify-center w-full max-w-xs bg-[#35363a] rounded-2xl shadow-lg p-8"
        style={{ minHeight: 380 }}
      >
        {/* Decorative corners */}
        <div
          className="absolute top-0 left-0 w-8 h-8 bg-[#e5e5e5] rounded-tr-lg"
          style={{ borderTopLeftRadius: 16 }}
        />
        <div className="absolute top-0 left-8 w-4 h-4 bg-[#e5e5e5]" />
        <div
          className="absolute bottom-0 right-0 w-8 h-8 bg-[#e5e5e5] rounded-tl-lg"
          style={{ borderBottomRightRadius: 16 }}
        />
        <div className="absolute bottom-0 right-8 w-4 h-4 bg-[#e5e5e5]" />

        {/* Logo with Home Navigation */}
        <button
          onClick={() => (window.location.href = "/")}
          className="transition-all duration-300 hover:scale-105"
        >
          <img src={"/logo.svg"} alt="CodeMax Logo" />
        </button>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#23272f] rounded-lg shadow hover:bg-gray-100 transition font-medium border border-gray-200"
        >
          <img src={"/google.svg"}></img>
          Google Login
        </button>
      </div>
    </div>
  );
}
