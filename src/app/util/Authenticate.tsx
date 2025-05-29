import supabase from "./supabase";

export default function Authentication() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Sign in with Google</h2>
      <button
        onClick={handleGoogleSignIn}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
