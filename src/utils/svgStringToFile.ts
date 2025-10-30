export const svgStringToFile = (
  svgString: BlobPart,
  filename = "image.svg"
) => {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return new File([blob], filename, { type: "image/svg+xml" });
};
