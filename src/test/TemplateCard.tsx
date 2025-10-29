interface TemplateCardProps {
  svgString: string;
  name: string;
  selected: boolean;
  onClick: () => void;
}

export default function TemplateCard({
  svgString,
  name,
  selected,
  onClick,
}: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative border-2 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 aspect-video flex items-center justify-center 
    ${
      selected
        ? "border-4 border-yellow-600 shadow-2xl scale-[1.05] bg-blue-100"
        : "border-gray-200 hover:border-yellow-400 bg-white hover:shadow-md hover:scale-[1.02]"
    }`}
    >
      <div
        className="w- h-full p-4 flex items-center justify-center pointer-events-none "
        dangerouslySetInnerHTML={{ __html: svgString }}
      />

      <div
        className={`absolute top-2 left-2 px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm transition-all
          ${
            selected
              ? "bg-yellow-500 text-white"
              : "bg-gray-800/80 text-gray-100"
          }`}
      >
        {name}
      </div>
      {selected && (
        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
          <div className="rounded-full bg-white p-2 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
