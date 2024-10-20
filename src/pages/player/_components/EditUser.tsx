import { getIntrinsicToken } from "@/pages/_components/IntrinsicGen";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt } from "@/supabase";
import { useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { editProfile, getAvatarUploadUrl, getProfile } from "rhythia-api";

export function EditProfile(data: Awaited<ReturnType<typeof getProfile>>) {
  const [userName, setUserName] = useState(data.user?.username || "");
  const [userPicture, setUserPicture] = useState(data.user?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleChange = async () => {
    setLoading(true);

    const response = await editProfile({
      session: await getJwt(),
      data: { username: userName, avatar_url: userPicture },
    });

    if (response.error) {
      toast({
        title: "Oops",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Updated!",
      description: "Profile has been updated!",
    });
    navigate(0);
    setLoading(false);
  };

  return (
    <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
      <div className="text-neutral-500 font-extrabold mb-2">MY PROFILE</div>
      <div className="flex flex-col gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="w-full" variant="secondary">
              Edit profile
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full flex flex-col items-center justify-center gap-2">
                <img
                  src={userPicture || ""}
                  className="rounded-full border-8 h-20 w-20"
                  onError={(event) => {
                    (
                      event.target as HTMLImageElement
                    ).src = `https://a.ppy.sh/u/1`;
                  }}
                />
                <div className="font-bold">{userName || <>&nbsp;</>}</div>
              </div>

              <div className="w-full h-[1px] my-2 bg-neutral-800"></div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Avatar
                  </Label>
                  <Input
                    id="name"
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp"
                    className="col-span-3 file:text-white text-transparent"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                          const intrinsicToken = await getIntrinsicToken();
                          const res = await getAvatarUploadUrl({
                            session: await getJwt(),
                            contentLength: (e.target?.result as ArrayBuffer)
                              .byteLength,
                            contentType: "image/jpeg",
                            intrinsicToken,
                          });

                          await fetch(res.url!, {
                            method: "PUT",
                            body: e.target?.result as ArrayBuffer,

                            headers: {
                              "Content-Type": "image/jpeg",
                            },
                          });

                          setUserPicture(
                            `https://static.rhythia.com/${res.objectKey}`
                          );
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    className="col-span-3 "
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={loading} type="submit" onClick={handleChange}>
                  {loading && (
                    <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* <Link href={`/beatmaps/add`}>
          <Button className="w-full" variant="secondary">
            Upload beatmap
          </Button>
        </Link> */}
      </div>
    </div>
  );
}
