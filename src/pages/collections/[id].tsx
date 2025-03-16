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
  deleteCollection,
  deleteCollectionMap,
  editCollection,
  getCollection,
} from "rhythia-api";
import { getJwt, useProfile } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";
import { Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { LoaderData } from "@/types";
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
import { MdDelete, MdDownload } from "react-icons/md";
import { BeatmapCard } from "../maps/_components/BeatmapCard";
import { Switch } from "@/shadcn/ui/switch";
import JSZip from "jszip";

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
  const { userProfile } = useProfile();
  const navigate = useNavigate();
  const { getCollection, collectionId } = useLoaderData() as LoaderData<
    typeof Loader
  >;

  if (getCollection.error) {
    return <Navigate to={"/collections"}></Navigate>;
  }

  const formEdit = useForm({
    defaultValues: {
      title: getCollection.collection.title,
      description: getCollection.collection.description,
      isList: getCollection.collection.isList,
    },
  });

  return (
    <div className="flex items-start flex-col">
      <Link to={"/collections"}>
        <div className="text-xs opacity-60 border-[1px] p-1 rounded-md">
          Go back to all collections
        </div>
      </Link>

      <div className="flex justify-between w-full  max-md:flex-col max-md:gap-4">
        <div className="flex flex-col justify-center">
          <Link
            to={"/player/" + getCollection.collection.owner.id}
            className="text-xs mt-3 text-neutral-400"
          >
            Created by{" "}
            <span className="font-bold hover:underline text-white">
              {getCollection.collection.owner.username}
            </span>
          </Link>
          <div className="text-2xl font-bold">
            {getCollection.collection.title}
          </div>
          {getCollection.collection.description && (
            <div className="max-w-72 opacity-75 text-xs">
              {getCollection.collection.description}
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center max-md:items-stretch max-md:flex-col">
          <div
            onClick={async () => {
              if (!userProfile?.verified) {
                toast({
                  title: "This feature is only for supporters",
                  description:
                    "You need to be a supporter to download all beatmaps in a collection.",
                  variant: "destructive",
                });
                return;
              }
              // Show loading toast
              toast({
                title: "Preparing download",
                description: "Creating zip archive of beatmaps...",
              });

              try {
                // Create new JSZip instance
                const zip = new JSZip();

                // Filter valid beatmap files
                const validBeatmaps = getCollection.collection.beatmaps.filter(
                  (beatmap) =>
                    beatmap.beatmapFile && beatmap.beatmapFile.trim() !== ""
                );

                if (validBeatmaps.length === 0) {
                  toast({
                    title: "No files to download",
                    description:
                      "This collection doesn't contain any downloadable beatmaps.",
                    variant: "destructive",
                  });
                  return;
                }

                // Create a folder in the zip with the collection name
                const collectionName = getCollection.collection.title.replace(
                  /[/\\?%*:|"<>]/g,
                  "-"
                );
                const folder = zip.folder(collectionName);

                // Track progress
                let completedFiles = 0;
                const totalFiles = validBeatmaps.length;

                // Show progress toast
                const updateProgress = () => {
                  const percentage = Math.round(
                    (completedFiles / totalFiles) * 100
                  );
                  toast({
                    title: "Creating zip archive",
                    description: `Progress: ${percentage}% (${completedFiles}/${totalFiles} files)`,
                  });
                };

                // Function to process each file
                const processFile = async (beatmap: any) => {
                  try {
                    const response = await fetch(beatmap.beatmapFile);

                    if (!response.ok) {
                      throw new Error(`Failed to fetch ${beatmap.title}`);
                    }

                    const blob = await response.blob();

                    // Create a safe filename
                    const filename = `${beatmap.title.replace(
                      /[/\\?%*:|"<>]/g,
                      "-"
                    )}.sspm`;

                    // Add file to zip
                    // @ts-ignore
                    folder.file(filename, blob);

                    completedFiles++;

                    // Update progress every 5 files or on completion
                    if (
                      completedFiles % 5 === 0 ||
                      completedFiles === totalFiles
                    ) {
                      updateProgress();
                    }
                  } catch (error) {
                    console.error(`Error processing ${beatmap.title}:`, error);
                  }
                };

                // Process files concurrently, but limit concurrency to 5 at a time
                const batchSize = 5;
                for (let i = 0; i < validBeatmaps.length; i += batchSize) {
                  const batch = validBeatmaps.slice(i, i + batchSize);
                  await Promise.all(batch.map(processFile));
                }

                // Generate the zip file
                toast({
                  title: "Finalizing",
                  description: "Creating zip file...",
                });

                const content = await zip.generateAsync(
                  {
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }, // Balance between speed and compression
                  },
                  (metadata: any) => {
                    if (metadata.percent % 10 === 0) {
                      toast({
                        title: "Finalizing",
                        description: `Creating zip file: ${Math.round(
                          metadata.percent
                        )}%`,
                      });
                    }
                  }
                );

                // Create download link
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `${collectionName}-collection.zip`;

                // Trigger download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Clean up
                URL.revokeObjectURL(downloadLink.href);

                // Success toast
                toast({
                  title: "Download complete",
                  description: `Successfully created zip archive with ${completedFiles} beatmaps.`,
                });
              } catch (error) {
                console.error("Zip creation error:", error);
                toast({
                  title: "Download failed",
                  description:
                    "There was an error creating the zip archive. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800 cursor-pointer"
          >
            <MdDownload />
            Download all
          </div>
          {userProfile &&
          userProfile.id == getCollection.collection.owner.id ? (
            <>
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
                      You will be able to add any map to this collection and it
                      will be publicly visible.
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
                          isList: form.isList,
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

                      <FormField
                        control={formEdit.control}
                        name="isList"
                        render={({ field }) => (
                          <FormItem className="w-full flex justify-between items-center">
                            <FormLabel>Is List</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogClose>
                        <Button type="submit">Edit collection</Button>
                      </DialogClose>
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
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {userProfile &&
      userProfile.id == getCollection.collection.owner.id &&
      getCollection.collection.beatmaps.length < 3 ? (
        <div className="text-sm opacity-60 border-[1px] border-yellow-500 mt-4 p-1 rounded-md w-full">
          Your collection needs to have at least 3 maps to be publicly visible
        </div>
      ) : (
        <></>
      )}
      <hr className="my-4 w-full" />

      {getCollection.collection.isList ? (
        <div className="w-full grid grid-cols-1 gap-4 max-md:grid-cols-1">
          {getCollection.collection.beatmaps.map((beatmap, i) => (
            <div className="flex gap-2 ">
              <div className="w-10 h-10 bg-neutral-900 border-[1px] rounded-full items-center justify-center flex text-xs">
                #{i + 1}
              </div>
              <BeatmapCard
                onRemove={
                  userProfile &&
                  userProfile.id == getCollection.collection.owner.id
                    ? async () => {
                        await deleteCollectionMap({
                          beatmapPage: beatmap.id,
                          collection: collectionId,
                          session: await getJwt(),
                        });
                        navigate("/collections/" + collectionId);
                      }
                    : undefined
                }
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
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {getCollection.collection.beatmaps.map((beatmap) => (
            <BeatmapCard
              onRemove={
                userProfile &&
                userProfile.id == getCollection.collection.owner.id
                  ? async () => {
                      await deleteCollectionMap({
                        beatmapPage: beatmap.id,
                        collection: collectionId,
                        session: await getJwt(),
                      });
                      navigate("/collections/" + collectionId);
                    }
                  : undefined
              }
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
      )}
    </div>
  );
}
