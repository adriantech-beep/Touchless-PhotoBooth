import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ImageSelectorProps {
  photoBlobs: Blob[];
  onSelectImages: (selectedBlobs: Blob[]) => void;
}

const SelectorImage = ({ photoBlobs, onSelectImages }: ImageSelectorProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [imageMetadata, setImageMetadata] = useState<
    Array<{ size: string; type: string; index: number }>
  >([]);

  useEffect(() => {
    const metadata = photoBlobs.map((blob, index) => {
      const sizeInKB = (blob.size / 1024).toFixed(2);
      console.log(
        `[v0] Image ${index + 1} - Type: ${blob.type}, Size: ${sizeInKB} KB`
      );
      return {
        size: sizeInKB,
        type: blob.type,
        index,
      };
    });
    setImageMetadata(metadata);
  }, [photoBlobs]);

  const toggleImageSelection = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else if (prev.length < 4) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    const selectedBlobs = selectedIndices.map((i) => photoBlobs[i]);
    console.log(
      `[v0] Selected 4 images with total size: ${(
        selectedBlobs.reduce((sum, b) => sum + b.size, 0) / 1024
      ).toFixed(2)} KB`
    );
    onSelectImages(selectedBlobs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          Select 4 Images
        </h1>
        <p className="text-yellow-300">{selectedIndices.length}/4 selected</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl">
        {photoBlobs.map((blob, index) => {
          const isSelected = selectedIndices.includes(index);
          const metadata = imageMetadata.find((m) => m.index === index);

          return (
            <motion.div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => toggleImageSelection(index)}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={URL.createObjectURL(blob) || "/placeholder.svg"}
                alt={`photo-${index + 1}`}
                className={`w-full h-auto rounded-lg border-2 object-cover transition-all ${
                  isSelected
                    ? "border-yellow-400 ring-2 ring-yellow-400"
                    : "border-yellow-700 group-hover:border-yellow-400"
                }`}
              />

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
                >
                  <Check size={40} className="text-yellow-400" />
                </motion.div>
              )}

              {/* Image metadata tooltip */}
              {metadata && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-yellow-300 text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p>{metadata.type}</p>
                  <p>{metadata.size} KB</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <Button
        onClick={handleConfirm}
        disabled={selectedIndices.length !== 4}
        className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm Selection ({selectedIndices.length}/4)
      </Button>
    </div>
  );
};

export default SelectorImage;
