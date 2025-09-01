import { useProfile } from "@/supabase";
import { Card } from "@/shadcn/ui/card";
import { useToast } from "@/shadcn/ui/use-toast";
import { useState, useEffect } from "react";

const huntBadges = [
  {
    name: "The Start of an Era",
    icon: "/q.png",
  },
  {
    name: "New Farm",
    icon: "/mario.png",
  },
  {
    name: "Spinnin",
    icon: "/bug.png",
  },
  {
    name: "Old Farm",
    icon: "/mario2.png",
  },
  {
    name: "Birb",
    icon: "/bird.png",
  },
  {
    name: "Cats!",
    icon: "/cat.png",
  },
];

export default function HuntPage() {
  const profile = useProfile();
  const userBadges = profile?.userProfile?.badges || [];
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState("");

  const handleBadgeClick = (
    badge: (typeof huntBadges)[0],
    isUnlocked: boolean
  ) => {
    if (isUnlocked) {
      toast({
        title: "Congratz :3",
        description: `You've unlocked ${badge.name}!`,
      });
    }
  };

  useEffect(() => {
    const targetDate = new Date("2025-09-08T00:00:00Z").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Event has ended!");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Rhythia Badge Hunt 2025
        </h1>
        <p className="text-xl text-neutral-400">
          Discover and unlock exclusive badges
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {huntBadges.map((badge) => {
          const isUnlocked = userBadges.includes(badge.name);

          return (
            <Card
              key={badge.name}
              onClick={() => handleBadgeClick(badge, isUnlocked)}
              className={`
                relative h-64 bg-neutral-900 border-neutral-800 
                hover:border-neutral-600 transition-all cursor-pointer
                ${!isUnlocked ? "opacity-40" : "opacity-100"}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="mb-4">
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                {isUnlocked && (
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {badge.name}
                  </h3>
                )}
                <p className="text-sm text-neutral-400">
                  {isUnlocked ? "✓ Unlocked" : "Locked"}
                </p>
              </div>
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-600 rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-2xl font-bold text-white mb-2">
          Next Badge Drop: {timeLeft}
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          Hint: Each badge is tied to a specific beatmap
        </p>
      </div>
    </div>
  );
}
