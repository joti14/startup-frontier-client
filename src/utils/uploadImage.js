import toast from "react-hot-toast";

// IMGBB UPLOAD 
export async function uploadToImgbb(file) {
  const formData = new FormData();
  formData.append("image", file);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured");
  }

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: formData }
  );
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Upload failed");
  }
  
  const data = await res.json();
  
  if (!data.success || !data.data?.url) {
    toast.error("Invalid response from ImgBB");
  }
  
  return data.data.url;
}