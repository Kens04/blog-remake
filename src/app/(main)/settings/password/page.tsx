import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import Password from "@/components/settings/Password";

const PasswordPage = async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    redirect("/");
  }

  return (
    <Suspense fallback={<Loading />}>
      <Password />
    </Suspense>
  );
};

export default PasswordPage;
