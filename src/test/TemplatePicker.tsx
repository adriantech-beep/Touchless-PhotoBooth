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
import { uploadSvgToCloudinary } from "@/utils/uploadSvgToCloudinary";
import { dataUrlToFile } from "@/utils/dataUrlToFile";
import { blobToBase64 } from "@/utils/blobToBase64";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET_SVG,
} from "@/config/env";

import { ipcRenderer } from "electron";

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

  const { state } = useLocation();
  const blobs = usePhotoStore((s) => s.blobs);
  const layout: string = state?.layout || "";

  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const svg = selectedLayout
        ? layouts[selectedCategory][selectedLayout]
        : layout;

      if (!svg) return;

      const targetElement = document.getElementById("myDiv");
      if (!targetElement) return;

      let svgString = svg;
      const base64Images = await Promise.all(blobs.map(blobToBase64));

      base64Images.forEach((base64, index) => {
        svgString = svgString.replace(
          new RegExp(`(<image[^>]*id="photo-${index + 1}"[^>]*)/>`, "i"),
          `$1 xlink:href="${base64}" />`
        );
      });

      targetElement.innerHTML = svgString;
    };
    run();
  }, [selectedLayout, selectedCategory, layout, blobs]);

  // const handleUploadAsPng = async () => {
  //   if (!selectedLayout) return;
  //   const targetElement = document.getElementById("myDiv");
  //   if (!targetElement) return;

  //   try {
  //     const dataUrl = await toPng(targetElement, { cacheBust: true });
  //     const pngFile = dataUrlToFile(dataUrl, "final.png");

  //     const result = await uploadSvgToCloudinary(
  //       pngFile,
  //       import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  //       import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_SVG
  //     );

  //     navigate("/choosing-template", {
  //       state: {
  //         layout: layouts[selectedCategory][selectedLayout!],
  //       },
  //     });

  //     console.log("✅ PNG uploaded:", result.secure_url);
  //   } catch (err) {
  //     console.error("❌ PNG upload failed:", err);
  //   }
  // };

  const handleUploadAsPng = async () => {
    if (!selectedLayout) return;
    const targetElement = document.getElementById("myDiv");
    if (!targetElement) return;

    try {
      // Step 1: Convert to PNG
      const dataUrl = await toPng(targetElement, { cacheBust: true });

      // Step 2: Upload to Cloudinary
      const pngFile = dataUrlToFile(dataUrl, "final.png");
      const result = await uploadSvgToCloudinary(
        pngFile,
        CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_UPLOAD_PRESET_SVG
      );

      console.log("✅ PNG uploaded:", result.secure_url);

      ipcRenderer.send("print-final-image", dataUrl);
      // Step 3: Silently print through Electron
      // if (window.electronAPI?.printFinalImage) {
      //   window.electronAPI.printFinalImage(dataUrl);
      //   console.log("🖨️ Sent to Electron print handler (silent)");
      // } else {
      //   console.warn("⚠️ Electron API not available (web mode)");
      // }

      // Step 4: Proceed to next page
      navigate("/choosing-template", {
        state: {
          layout: layouts[selectedCategory][selectedLayout!],
        },
      });
    } catch (err) {
      console.error("❌ PNG upload or print failed:", err);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="flex justify-end mt-4">
          <button
            disabled={!selectedLayout}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedLayout
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleUploadAsPng}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
