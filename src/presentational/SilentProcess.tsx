import { useEffect } from "react";

interface SilentProcessorProps {
  uploadedUrls: string[];
  onProcessingComplete: (finalUrls: string[]) => void;
}

/**
 * SilentProcessor handles background processing of uploaded images.
 * This component processes images silently without showing UI to the user.
 * After processing, it returns the final URLs to the parent component.
 */
const SilentProcessor = ({
  uploadedUrls,
  onProcessingComplete,
}: SilentProcessorProps) => {
  useEffect(() => {
    const processImages = async () => {
      try {
        console.log("Silent processing started for URLs:", uploadedUrls);

        // This could include:
        // - Image analysis
        // - Metadata extraction
        // - Background removal (if needed)
        // - Any other processing that doesn't require user interaction

        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("[v0] Silent processing complete");

        onProcessingComplete(uploadedUrls);
      } catch (error) {
        console.error("[v0] Silent processing failed:", error);
        onProcessingComplete(uploadedUrls);
      }
    };

    processImages();
  }, [uploadedUrls, onProcessingComplete]);

  return null;
};

export default SilentProcessor;
