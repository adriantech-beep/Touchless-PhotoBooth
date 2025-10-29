import { create } from "zustand";

interface PhotoStore {
  blobs: Blob[];
  setBlobs: (blobs: Blob[]) => void;
  clearBlobs: () => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
  blobs: [],
  setBlobs: (blobs) => set({ blobs }),
  clearBlobs: () => set({ blobs: [] }),
}));
