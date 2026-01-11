'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
        <p className="text-zinc-400 mb-8">
          Thank you for your purchase. Your Pro configuration is ready.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white text-black font-medium rounded-lg"
          >
            Generate Your Config
          </Link>
          <p className="text-sm text-zinc-600">
            Check your email for download instructions
          </p>
        </div>
      </div>
    </main>
  );
}
