"use client"

import Link from 'next/link';
import React from 'react';

function refreshPage() {
    window.location.reload();
  }

export default function ErrorPage() {
    return <div role="alert">
    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
      Error
    </div>
    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
      <p>Something not ideal might be happening. Please <button className="link-error" onClick={refreshPage}>refresh</button> the page</p>
    </div>
  </div>
}