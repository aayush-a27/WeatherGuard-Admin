import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { OAUTH_GOOGLE_URL, OAUTH_GITHUB_URL } from '../../constants';

/**
 * OAuth login buttons for Google and GitHub.
 */
export default function LoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = OAUTH_GOOGLE_URL;
  };

  const handleGithubLogin = () => {
    window.location.href = OAUTH_GITHUB_URL;
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-800 hover:bg-gray-50 dark:hover:bg-surface-700 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.98] group"
      >
        <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        Continue with Google
      </button>

      {/* GitHub */}
      <button
        onClick={handleGithubLogin}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] group"
      >
        <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        Continue with GitHub
      </button>
    </div>
  );
}
