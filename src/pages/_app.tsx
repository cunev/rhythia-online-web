import { Toaster } from "@/shadcn/ui/toaster";
import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import type { LoadingBarRef } from "react-top-loading-bar";
import LoadingBar from "react-top-loading-bar";
import { Navbar } from "./_components/Navbar";
import { AdminControls } from "./_components/AdminControls";
import { Analytics } from "@vercel/analytics/react";

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
  return (
    <div className="h-[100vh] text-white -z-10">
      <Analytics />
      <AdminControls />
      <ScrollRestoration />
      <NavigationLoadingBar />
      <Navbar />

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
        <div className="w-48 my-3 bg-neutral-700 h-[1px]"></div>
        <div className="text-xs">
          Developed and maintained by Sound Space Contributors and published by{" "}
          <a
            href="https://www.capo.games/"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Capo Games
          </a>
        </div>
        <div className="text-xs mb-6">Rhythia Online 2024.</div>
      </div>
      <Toaster />
    </div>
  );
}
