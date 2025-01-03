import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BlogDetail from "@/components/blog/BlogDetail";

interface BlogDetailPageProps {
  params: {
    blogId: Promise<{ id: string }>;
  };
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { blogId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // ブログ詳細取得
  const { data: blogData } = await supabase
    .from("blogs")
    .select(
      `
      *,
      profiles (
        name,
        avatar_url,
        introduce
      )
    `
    )
    .eq("id", blogId)
    .single();

  if (!blogData) {
    return <div className="text-center">ブログが存在しません</div>;
  }

  // ログインユーザーがブログ作成者かどうか
  const isMyBlog = user?.id === blogData.user_id;

  return (
    <Suspense fallback={<Loading />}>
      <BlogDetail blog={blogData} isMyBlog={isMyBlog} />
    </Suspense>
  );
};

export default BlogDetailPage;
