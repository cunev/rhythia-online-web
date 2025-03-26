import { Toaster } from "@/shadcn/ui/toaster";
import { useEffect, useRef } from "react";
import {
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import type { LoadingBarRef } from "react-top-loading-bar";
import LoadingBar from "react-top-loading-bar";
import { Navbar } from "./_components/Navbar";
import { getProfile, getVerified } from "rhythia-api";
import { getJwt, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { AdminControls } from "./_components/AdminControls";

export const Loader = async () => {
  const jwt = await getJwt();
  const profile = await getProfile({
    session: jwt,
  });

  useProfile.setState({ userProfile: profile.user });

  if (profile.user?.verified && profile.user.verificationDeadline === 0) {
    getVerified({ session: jwt });
  }
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
      <AdminControls />
      <ScrollRestoration />
      <NavigationLoadingBar />
      <Navbar user={data.getProfile.user} />

      <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-36">
        <Outlet />
      </div>
      <div className="w-full flex-col text-neutral-500 flex items-center justify-center">
        <a
          className="text-xs underline cursor-pointer text-blue-500"
          href="/copyright"
        >
          DMCA / Copyright
        </a>
        <a
          className="text-xs underline cursor-pointer text-blue-500"
          href="/rules"
        >
          Bans and Restrictions
        </a>
        <a
          className="text-xs underline cursor-pointer text-blue-500"
          href="/privacy"
        >
          Privacy and Refund Policy
        </a>
        <a
          className="text-xs underline cursor-pointer text-blue-500"
          href="/terms"
        >
          Terms of service
        </a>
        <div className="text-xs">Made with love.</div>
        <div className="text-xs mb-6">Rhythia Online 2024.</div>
      </div>
      <Toaster />
    </div>
  );
}
