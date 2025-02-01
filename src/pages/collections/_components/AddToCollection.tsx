import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt, useProfile } from "@/supabase";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { addCollectionMap, getCollections } from "rhythia-api";

export function AddToCollection({ beatmapId }: { beatmapId: number }) {
  const me = useProfile();
  const [collections, setCollections] = useState<
    Awaited<ReturnType<typeof getCollections>>["collections"]
  >([]);
  const [selectedCollection, setSelectedCollection] = useState<
    number | undefined
  >();
  const form = useForm({
    defaultValues: {},
  });
  if (!me.userProfile) {
    return <></>;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          onClick={async () => {
            const collections = await getCollections({
              itemsPerPage: 50,
              page: 1,
              session: await getJwt(),
              owner: me.userProfile!.id,
            });
            setCollections(collections.collections);
          }}
          variant="secondary"
        >
          <FaPlus className="mr-2 h-3 w-3" />
          Add to collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add map to collection</DialogTitle>
        </DialogHeader>
        <hr />

        <Form {...form}>
          <Select
            onValueChange={(colid) => {
              setSelectedCollection(Number(colid));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((col) => (
                <SelectItem value={col.id.toString()}>{col.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <form
            onSubmit={form.handleSubmit(async (form) => {
              const res = await addCollectionMap({
                session: await getJwt(),
                collection: selectedCollection || -1,
                beatmapPage: beatmapId,
              });
              if (res.error) {
                toast({
                  title: "Oops",
                  description: res.error,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Added to collection",
                  description: "Map has been added to collection.",
                });
              }
            })}
            className="space-y-8"
          >
            <DialogClose>
              <Button type="submit">Add to collection</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
