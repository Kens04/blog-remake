import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from "@/app/loading"
import Email from "@/components/settings/Email"

const EmailPage = async () => {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (!user || !user.email) {
    redirect("/")
  }

  return (
    <Suspense fallback={<Loading />}>
      <Email email={user.email} />
    </Suspense>
  )
}

export default EmailPage
