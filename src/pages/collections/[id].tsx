import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import {
  addCollectionMap,
  createCollection,
  deleteCollection,
  deleteCollectionMap,
  editCollection,
  getCollection,
  getCollections,
} from "rhythia-api";
import { getJwt } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";
import { Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { LoaderData } from "@/types";
import { IoMdMusicalNote } from "react-icons/io";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { FaEdit } from "react-icons/fa";
import { MdAdd, MdDelete, MdDownload } from "react-icons/md";
import { BeatmapCard } from "../maps/_components/BeatmapCard";

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  return {
    getCollection: await getCollection({
      session: jwt,
      collection: Number(params.id || 0),
    }),
    collectionId: Number(params.id || 0),
  };
};

export default function Collections() {
  const navigate = useNavigate();
  const { getCollection, collectionId } = useLoaderData() as LoaderData<
    typeof Loader
  >;

  if (getCollection.error) {
    return <Navigate to={"/collections"}></Navigate>;
  }
  const form = useForm({
    defaultValues: {
      beatmap: 0,
    },
  });
  const formEdit = useForm({
    defaultValues: {
      title: getCollection.collection.title,
      description: getCollection.collection.description,
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold">
            {getCollection.collection.title}
          </div>
          {getCollection.collection.description && (
            <div className="max-w-72 opacity-75 text-xs">
              {getCollection.collection.description}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <div className="opacity-50 bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2  border-neutral-800">
            <MdDownload />
            Download all
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <MdAdd />
                Add map
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add map to collection</DialogTitle>
              </DialogHeader>
              <hr />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(async (form) => {
                    const res = await addCollectionMap({
                      session: await getJwt(),
                      collection: collectionId,
                      beatmapPage: Number(form.beatmap),
                    });
                    if (res.error) {
                      toast({
                        title: "Oops",
                        description: res.error,
                        variant: "destructive",
                      });
                    } else {
                      navigate("/collections/" + collectionId);
                    }
                  })}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="beatmap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Map ID</FormLabel>
                        <FormControl>
                          <Input placeholder="0123" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use the beatmap id or link to add the beatmap to
                          collection
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogClose>
                    <Button type="submit">Add to collection</Button>
                  </DialogClose>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <FaEdit />
                Edit collection
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit collection</DialogTitle>
                <DialogDescription>
                  You will be able to add any map to this collection and it will
                  be publicly visible.
                </DialogDescription>
              </DialogHeader>
              <hr />
              <Form {...formEdit}>
                <form
                  onSubmit={formEdit.handleSubmit(async (form) => {
                    const res = await editCollection({
                      session: await getJwt(),
                      title: form.title,
                      collection: collectionId,
                      description: form.description,
                    });

                    navigate("/collections/" + collectionId);

                    if (res.error) {
                      toast({
                        title: "Oops",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })}
                  className="space-y-8"
                >
                  <FormField
                    control={formEdit.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My amazing collection"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formEdit.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="A really brief description"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Edit collection</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <MdDelete />
                Remove collection
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <hr />
              <DialogClose>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    await deleteCollection({
                      session: await getJwt(),
                      collection: collectionId,
                    });
                    navigate("/collections");
                  }}
                >
                  Yes, permanently remove
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <hr className="my-4" />

      <div className="w-full grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {getCollection.collection.beatmaps.map((beatmap) => (
          <BeatmapCard
            onRemove={async () => {
              await deleteCollectionMap({
                beatmapPage: beatmap.id,
                collection: collectionId,
                session: await getJwt(),
              });
              navigate("/collections/" + collectionId);
            }}
            key={beatmap.id}
            starRating={beatmap.starRating || 0}
            id={beatmap.id}
            title={beatmap.title || ""}
            difficulty={beatmap.difficulty || 0}
            image={beatmap.image || ""}
            status={beatmap.status || ""}
            owner={beatmap.owner || 0}
            ownerUsername={beatmap.ownerUsername || ""}
            playcount={beatmap.playcount || 0}
            url={beatmap.beatmapFile || ""}
            length={beatmap.length || 0}
          />
        ))}
      </div>
    </div>
  );
}
