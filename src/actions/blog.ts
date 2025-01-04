"use server";

import { BlogSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";

interface newBlogProps extends z.infer<typeof BlogSchema> {
  base64Image: string | undefined;
  userId: string;
}

// ブログ投稿
export const newBlog = async (values: newBlogProps) => {
  try {
    const supabase = await createClient();

    let image_url = "";

    if (values.base64Image) {
      const matches = values.base64Image.match(/^data:(.+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return { error: "無効な画像データです" };
      }

      const contentType = matches[1]; // 例: "image/png"
      const base64Data = matches[2];

      // 拡張子を取得
      const fileExt = contentType.split("/")[1]; // 例: "png"

      // ファイル名を生成
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from("blogs")
        .upload(`${values.userId}/${fileName}`, decode(base64Data), {
          contentType,
        });

      if (storageError) {
        return { error: storageError.message };
      }

      // 画像のURLを取得
      const { data: urlData } = await supabase.storage
        .from("blogs")
        .getPublicUrl(`${values.userId}/${fileName}`);

      image_url = urlData.publicUrl;
    }

    // ブログ新規作成
    const { error: insertError } = await supabase.from("blogs").insert({
      title: values.title,
      content: values.content,
      image_url,
      user_id: values.userId,
    });

    // エラーチェック
    if (insertError) {
      return { error: insertError.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};