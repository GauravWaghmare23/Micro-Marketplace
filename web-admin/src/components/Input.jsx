export function Input({ label, error, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-dark-300 mb-1">{label}</label>}
      <input
        {...props}
        className={`w-full px-3 py-2 bg-dark-700 border rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-dark-600'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
