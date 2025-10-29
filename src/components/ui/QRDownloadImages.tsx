const QRDownloadImages = () => {
  return (
    <div className="flex items-center gap-3 bg-zinc-800 border border-yellow-600 p-4 rounded-lg shadow-sm mt-6">
      <div className="bg-yellow-500 p-2 rounded-lg shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 17h2a2 2 0 002-2v-3a2 2 0 00-2-2h-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v3H5a2 2 0 00-2 2v3a2 2 0 002 2h2"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-yellow-400">Printing in Progress...</p>
        <p className="text-sm text-yellow-200">
          Please wait a moment while we print your photo.
        </p>
      </div>
    </div>
  );
};

export default QRDownloadImages;
