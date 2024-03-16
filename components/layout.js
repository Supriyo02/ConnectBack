import { useSession } from "@supabase/auth-helpers-react";
import Card from "./card";
import NavigationCard from "./navigationcard";

export default function Layout({ children, hideNavigation }) {
  const session = useSession();
  return (
    <div className="mt-4 max-w-5xl mx-auto gap-6 md:p-4 md:flex md:mb-0 mb-6">
      {!hideNavigation &&(
        <div className="z-30 md:w-1/4 fixed md:static w-full bottom-0 -mb-5">
        <Card noPadding={'True'}>
          <NavigationCard userId={session?.user?.id}/>
        </Card>
      </div>
      )
      }
      <div className={hideNavigation ? "w-full grow" : " mx-4 md:mx-0 md:w-3/4 grow"}>
        {children}
        <div className=" justify-center flex pt-2">
        <p className=" text-xs text-gray-400">Developed by Supriyo with 💙</p>
        </div>
        </div>
    </div>
  );
}
