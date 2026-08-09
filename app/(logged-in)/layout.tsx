import UpgradeRequired from "@/components/common/upgrade-required";
import { hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const user = await currentUser();

    if(!user){
        redirect("/sign-in");
    }

    const hasActiveSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress);

    console.error("EMAIL:", user.emailAddresses[0].emailAddress);
    console.error("HAS SUB:", hasActiveSubscription);


    if(!hasActiveSubscription){
     return <UpgradeRequired/>
    }
  return <>{children}</>;
}
