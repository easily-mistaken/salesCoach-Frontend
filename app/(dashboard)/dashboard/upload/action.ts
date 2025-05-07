"use server"

import { createClient } from "@/utils/supabase/server";

export const generatePresignedUrls = async (fileNames: string[], fileType: string, userId: string) => {
  const supabase = await createClient();
  const signedUrls = await Promise.all(fileNames.map(async (fileName) => {
    const timestamp = Date.now(); // Get the current timestamp
    const userFolder = `${userId}/`; // Create a folder for the user with a timestamp
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUploadUrl(userFolder + timestamp.toString() + fileName);

    if (error) {
      console.log(`Error generating presigned URL for ${fileName}: ${error.message}`, error);
    }

    return data?.signedUrl;
  }));

  return signedUrls;
};
