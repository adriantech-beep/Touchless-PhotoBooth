import { toPng } from "html-to-image";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { layoutC_example } from "@/svgTemplatesString/layoutC_example";
import { layoutC_Christmas2 } from "@/svgTemplatesString/layoutC_Christmas2";
import { layoutC_Christmas4 } from "@/svgTemplatesString/layoutC_Christmas4";
import { layoutC_Halloween1 } from "@/svgTemplatesString/layoutC_Halloween1";
import { layoutC_Halloween2 } from "@/svgTemplatesString/layoutC_Halloween2";
import TemplateCard from "./TemplateCard";
import { usePhotoStore } from "@/store/photoStore";

const layouts: Record<string, Record<string, string>> = {
  Classic: {
    LayoutC_example: layoutC_example,
    LayoutC_Christmas2: layoutC_Christmas2,
  },
  Seasonal: {
    LayoutC_Christmas4: layoutC_Christmas4,
    LayoutC_Halloween1: layoutC_Halloween1,
    LayoutC_Halloween2: layoutC_Halloween2,
  },
};

export default function TemplatePicker() {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof layouts>("Classic");
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const navigate = useNavigate();

  const { state } = useLocation();
  const blobs = usePhotoStore((s) => s.blobs);
  const layout: string = state?.layout || "";

  useEffect(() => {
    const svg = selectedLayout
      ? layouts[selectedCategory][selectedLayout]
      : layout;

    if (!svg) return;

    const targetElement = document.getElementById("myDiv");
    if (!targetElement) return;

    targetElement.innerHTML = svg;

    blobs.forEach((blob, index) => {
      const objectURL = URL.createObjectURL(blob);
      const imageTag = targetElement.querySelector(`#photo-${index + 1}`);
      if (imageTag) {
        imageTag.setAttribute("href", objectURL);
      }
    });
  }, [selectedLayout, selectedCategory, layout, blobs]);

  // 🔑 Print handler right here
  const handleNextAndPrint = async () => {
    const node = document.getElementById("myDiv");
    if (!node || !selectedLayout) return;

    try {
      // Example: 4x6 at 300 DPI = 1200x1800
      const dataUrl = await toPng(node, {
        cacheBust: true,
        width: 1200,
        height: 1800,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // Send to Electron to print
      window.electronAPI.printImage(dataUrl, { width: 1200, height: 1800 });

      // Then navigate to next route
      navigate("/choosing-template", {
        state: { layout: layouts[selectedCategory][selectedLayout!] },
      });
    } catch (err) {
      console.error("Print failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Pick Your Template
          </h1>
        </div>

        {/* Template List + Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories + options */}
          <div className="col-span-1">
            <div className="flex flex-col gap-3 mb-4">
              {Object.keys(layouts).map((cat) => (
                <button
                  key={cat}
                  className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat as keyof typeof layouts);
                    setSelectedLayout(null);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 space-y-3">
              {Object.entries(layouts[selectedCategory]).map(([key, svg]) => (
                <TemplateCard
                  key={key}
                  name={key}
                  svgString={svg}
                  selected={selectedLayout === key}
                  onClick={() => setSelectedLayout(key)}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="col-span-2 flex items-center justify-center rounded-lg border">
            {selectedLayout ? (
              <div className="flex items-center justify-center shadow-inner p-4">
                <div
                  id="myDiv"
                  className="w-full max-w-sm aspect-2/3 flex items-center justify-center"
                />
              </div>
            ) : (
              <p className="text-gray-500">Select a template to preview</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            disabled={!selectedLayout}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedLayout
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleNextAndPrint}
          >
            Next → (Auto Print)
          </button>
        </div>
      </div>
    </div>
  );
}
