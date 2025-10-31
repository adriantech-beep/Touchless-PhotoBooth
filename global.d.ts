export {};

declare global {
  interface Window {
    electronAPI?: {
      printFinalImage: (dataUrl: string) => void;
    };
  }
}
