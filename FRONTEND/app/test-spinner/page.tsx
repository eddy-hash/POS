'use client';

import { useState } from 'react';

export default function SpinnerDemoPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      setMessage('✅ Done! The spinner stopped.');
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Loading Spinner Demo</h1>
        <p className="text-slate-500 text-sm mb-8">
          Click the button to trigger a fake request and watch the spinner.
        </p>

        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            'Start Request'
          )}
        </button>

        {message && (
          <div className="mt-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
