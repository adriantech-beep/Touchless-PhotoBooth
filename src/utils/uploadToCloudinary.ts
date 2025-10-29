// utils/uploadToCloudinary.ts
export async function uploadToCloudinary(blob: Blob): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default";

  if (!cloudName) {
    console.error("❌ Missing VITE_CLOUDINARY_CLOUD_NAME in .env");
    return URL.createObjectURL(blob); // fallback so you can continue flow
  }

  try {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Cloudinary error details:", errorData);
      // fallback to blob so app continues
      return URL.createObjectURL(blob);
    }

    const data = await response.json();
    console.log("✅ Uploaded to Cloudinary:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return URL.createObjectURL(blob); // fallback so you can still navigate
  }
}
