import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BlogItem from "@/components/blog/BlogItem";

// メインページ
const MainPage = async () => {
  const supabase = await createClient();

  // ブログ一覧取得
  const { data: blogsData, error } = await supabase
    .from("blogs")
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (!blogsData || error) {
    return <div className="text-center">ブログが投稿されていません</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="grid grid-cols-3 gap-5">
        {blogsData.map((blog) => {
          return <BlogItem key={blog.id} blog={blog} />;
        })}
      </div>
    </Suspense>
  );
};

export default MainPage;
