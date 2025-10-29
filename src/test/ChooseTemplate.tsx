import QRDownloadImages from "@/components/ui/QRDownloadImages";
import { usePhotoStore } from "@/store/photoStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ChooseTemplate = () => {
  const { state } = useLocation();
  const blobs = usePhotoStore((s) => s.blobs);
  const layout: string = state?.layout || "";

  useEffect(() => {
    const targetElement = document.getElementById("myDiv");
    if (!targetElement || !layout) return;

    targetElement.innerHTML = layout;

    blobs.forEach((blob, index) => {
      const objectURL = URL.createObjectURL(blob);
      const imageTag = document.getElementById(`photo-${index + 1}`);
      if (imageTag) {
        imageTag.setAttribute("href", objectURL);
      }
    });
  }, [blobs, layout]);

  if (!layout) {
    return (
      <p className="text-center mt-10 text-yellow-400">
        ⚠️ No layout selected.
      </p>
    );
  }

  // const handlePrint = async () => {
  //   const node = document.getElementById("myDiv");
  //   if (!node) return;

  //   try {
  //     const dataUrl = await toPng(node, { cacheBust: true });
  //     window.electronAPI.printImage(dataUrl); // send to Electron main process
  //   } catch (err) {
  //     console.error("Export failed", err);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-6xl bg-zinc-900 rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-yellow-500">
        <div className="flex items-center justify-center bg-black rounded-lg border-2 border-yellow-500 shadow-inner p-4">
          <div
            id="myDiv"
            className="w-full max-w-sm aspect-2/3 flex items-center justify-center"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400">
              Download Your Photos
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-black p-4 rounded-lg shadow-lg border-2 border-yellow-500">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example"
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>
            <p className="text-yellow-200 text-sm text-center">
              Scan this QR code to get your digital photos.
            </p>
          </div>

          <QRDownloadImages />

          <div className="flex justify-end mt-6">
            <button className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-black hover:bg-yellow-400 transition">
              Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseTemplate;
