export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">✅ Tailwind is Working!</h1>
        <p className="text-gray-600 mt-2">Your styles are now applied correctly.</p>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          Test Button
        </button>
      </div>
    </div>
  );
}
