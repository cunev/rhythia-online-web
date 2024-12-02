import { Toaster } from "@/shadcn/ui/toaster";
import { useEffect, useRef } from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import type { LoadingBarRef } from "react-top-loading-bar";
import LoadingBar from "react-top-loading-bar";
import { Navbar } from "./_components/Navbar";
import { getProfile } from "rhythia-api";
import { getJwt, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import Snowfall from "react-snowfall";

export const Loader = async () => {
  const profile = await getProfile({
    session: await getJwt(),
  });

  useProfile.setState({ userProfile: profile.user });
  return {
    getProfile: profile,
  };
};

export function NavigationLoadingBar() {
  const navigation = useNavigation();
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      ref.current?.continuousStart();
    }

    if (navigation.state === "idle") {
      ref.current?.complete();
    }
  }, [navigation.state]);

  return (
    <LoadingBar
      ref={ref}
      color="#d640b0"
      shadow={false}
      height={2}
      transitionTime={100}
      waitingTime={300}
    />
  );
}

export default function HomeLayout() {
  const data = useLoaderData() as LoaderData<typeof Loader>;

  return (
    <div className="h-[100vh] text-white -z-10">
      <NavigationLoadingBar />
      <Navbar user={data.getProfile.user} />
      <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-36">
        <Snowfall
          snowflakeCount={115}
          speed={[0.5, 1]}
          wind={[-0.5, 0.5]}
          radius={[0.5, 3]}
          style={{ zIndex: -1, opacity: 0.3 }}
        />

        <Outlet />
      </div>
      <div className="w-full flex-col text-neutral-500 flex items-center justify-center">
        <a
          className="text-xs underline cursor-pointer text-blue-500"
          href="/copyright"
        >
          DMCA / Copyright
        </a>
        <div className="text-xs">Made with love.</div>
        <div className="text-xs mb-6">Rhythia Online 2024.</div>
      </div>
      <Toaster />
    </div>
  );
}
