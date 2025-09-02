/**
 * Reusable loading spinner component
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @param {string} color - Tailwind color class (e.g., 'blue-600')
 * @param {string} message - Optional loading message
 */
export default function LoadingSpinner({ size = 'md', color = 'blue-600', message = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-${color} ${sizeClasses[size]} mx-auto mb-4`}
        role="status"
        aria-label="Loading"
      ></div>
      {message && (
        <p className="text-lg font-medium text-gray-600" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
