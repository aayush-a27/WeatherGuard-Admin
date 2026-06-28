/**
 * Loading spinner with optional text.
 */
export default function Loader({ text = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-[3px] border-gray-200 dark:border-gray-700`}
        />
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-[3px] border-transparent border-t-brand-500 animate-spin absolute top-0 left-0`}
        />
      </div>
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
