import { supabase } from '@/lib/utils/supabase';

/**
 * Uploads an image file to Supabase Storage and returns the public URL
 * @param file - The image file to upload
 * @param path - Optional custom path in storage (defaults to 'products/')
 * @returns Promise<string> - The public URL of the uploaded image
 */
export async function uploadImageToFirebase(file: File, path = 'products/'): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    // Compose storage path inside the bucket
    const filePath = `${path}${fileName}`;

    // Upload to the default bucket (use 'images' or existing bucket name)
    const bucket = 'images';

    // Process image: resize, compress, and add watermark
    const processedBlob = await processImageWithWatermark(file, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.8,
      watermarkText: 'Placement Demo',
    });

    // Determine extension and upload path (force .jpg)
    const uploadFilePath = filePath.replace(/\.[^.]+$/, '') + '.jpg';

    const uploadRes = await supabase.storage.from(bucket).upload(uploadFilePath, processedBlob, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/jpeg',
    });

    if (uploadRes.error) {
      console.error('Supabase upload error:', uploadRes.error);
      throw new Error(`Failed to upload image: ${uploadRes.error.message}`);
    }

    // Log upload response for debugging
    console.debug('Supabase upload response:', uploadRes.data);

    // Get public URL
    const publicRes = supabase.storage.from(bucket).getPublicUrl(uploadFilePath);
    console.debug('Supabase getPublicUrl response:', publicRes);

    const publicUrl = publicRes?.data?.publicUrl;
    if (!publicUrl) {
      throw new Error('Failed to obtain uploaded image URL.');
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error instanceof Error ? error : new Error('Failed to upload image. Please try again.');
  }
}

async function processImageWithWatermark(
  file: File,
  opts: { maxWidth: number; maxHeight: number; quality: number; watermarkText: string }
): Promise<Blob> {
  const img = await loadImage(file);

  const { width, height } = img;
  const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height, 1);
  const targetWidth = Math.round(width * ratio);
  const targetHeight = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create canvas context');

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const fontSize = Math.max(12, Math.round(Math.min(targetWidth, targetHeight) * 0.06));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = Math.max(1, Math.round(fontSize * 0.12));

  const textX = targetWidth / 2;
  const textY = targetHeight / 2;
  ctx.strokeText(opts.watermarkText, textX, textY);
  ctx.fillText(opts.watermarkText, textX, textY);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      'image/jpeg',
      opts.quality
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
}