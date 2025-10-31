import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePhotoStore } from "@/store/photoStore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import SilentProcessor from "./SilentProcess";

interface UploadImageProps {
  photoBlobs: Blob[];
  onComplete?: (finalUrls: string[]) => void;
  autoStartUpload?: boolean;
}

const UploadImage = ({
  photoBlobs,
  // onComplete,
  autoStartUpload = false,
}: UploadImageProps) => {
  const [stage, setStage] = useState<"upload" | "silent_process" | "done">(
    "upload"
  );
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [originalUrls, setOriginalUrls] = useState<string[]>([]);
  const [finalUrls, setFinalUrls] = useState<string[]>([]);

  const hasStartedUpload = useRef(false);

  console.log("UploadImage photoblobs", photoBlobs);

  const { setBlobs } = usePhotoStore();

  const navigate = useNavigate();

  const totalProgress =
    uploadProgress.length > 0
      ? uploadProgress.reduce((a, b) => a + b, 0) / uploadProgress.length
      : 0;

  /** ─────────── Auto Upload & Process ─────────── **/
  useEffect(() => {
    if (!autoStartUpload || hasStartedUpload.current || !photoBlobs.length)
      return;

    hasStartedUpload.current = true;
    (async () => {
      try {
        console.log("[v0] Starting upload of original photos...");
        setStage("upload");
        const uploadResults = [];
        setUploadProgress(new Array(photoBlobs.length).fill(0));

        for (let i = 0; i < photoBlobs.length; i++) {
          const blob = photoBlobs[i];
          try {
            const url = await uploadToCloudinary(blob);
            uploadResults.push(url);
            setUploadProgress((prev) => {
              const updated = [...prev];
              updated[i] = 100;
              return updated;
            });
          } catch (uploadError) {
            console.error(`[v0] Failed to upload image ${i + 1}:`, uploadError);
            throw uploadError;
          }
        }

        setOriginalUrls(uploadResults);
        console.log("[v0] All images uploaded successfully:", uploadResults);

        setStage("silent_process");
      } catch (err) {
        console.error("[v0] Upload failed:", err);
        alert(
          `Upload failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setStage("done");
      }
    })();
  }, [autoStartUpload, photoBlobs]);

  /** ─────────── Stage Descriptions ─────────── **/
  const stageText = {
    upload: "Uploading Photos...",
    silent_process: "Processing...",
    done: "All Photos Ready!",
  }[stage];

  const isLoading = stage === "upload";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-black">
      {isLoading && (
        <div
          className="flex flex-col items-center justify-center gap-8 text-yellow-400 animate-fadeIn"
          style={{
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 border-10 border-yellow-800 rounded-full" />

            <svg
              width="192"
              height="192"
              viewBox="0 0 120 120"
              className="absolute inset-0 -rotate-90"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#3f3f46"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#facc15"
                strokeWidth="8"
                fill="none"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * totalProgress) / 100}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.4s ease-in-out",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-3xl font-bold">
              {Math.round(totalProgress)}%
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">{stageText}</h2>

          <p className="text-yellow-300 text-sm">
            {uploadProgress.filter((p) => p === 100).length} /{" "}
            {photoBlobs.length} uploaded
          </p>
        </div>
      )}

      {stage === "silent_process" && (
        <SilentProcessor
          uploadedUrls={originalUrls}
          onProcessingComplete={(finalUrls) => {
            setFinalUrls(finalUrls);
            setStage("done");
          }}
        />
      )}

      {stage === "done" && (
        <div className="flex flex-col items-center justify-center gap-6 ...">
          <h2 className="text-3xl font-bold text-white">All Photos Ready!</h2>
          <p className="text-white/80 text-sm">
            Your photos have been processed and are ready to use.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {finalUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`final-${i}`}
                className="w-32 h-32 object-cover rounded-lg shadow-lg border-4 border-white"
              />
            ))}
          </div>

          <Button
            onClick={() => {
              setBlobs(photoBlobs);
              navigate("/template-picker");
            }}
            className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Choose templates now
          </Button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default UploadImage;
