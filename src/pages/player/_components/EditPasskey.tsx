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
import md5 from "md5";
import { useState } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { setPasskey } from "rhythia-api";

export function EditPasskey() {
  const [passkey, setPasskeyState] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleChange = async () => {
    setLoading(true);

    const response = await setPasskey({
      session: await getJwt(),
      data: { passkey: md5(passkey) },
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
      <div className="text-neutral-500 font-extrabold mb-2">ADDITIONAL</div>
      <div className="flex flex-col gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="w-full" variant="secondary">
              Configure password
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Configure password</DialogTitle>
                <DialogDescription>
                  Configure a password in order to log in the online client
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 items-center gap-4 my-5">
                <Label htmlFor="username" className="text-right">
                  Password
                </Label>
                <Input
                  type="password"
                  id="username"
                  value={passkey}
                  onChange={(e) => {
                    setPasskeyState(e.target.value);
                  }}
                  className="col-span-3 "
                />
              </div>
              <div className="w-full h-[1px] my-2 bg-neutral-800"></div>

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
