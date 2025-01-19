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
  getCollection,
  getCollections,
} from "rhythia-api";
import { getJwt } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";
import { Link, useLoaderData } from "react-router-dom";
import { LoaderData } from "@/types";
import { IoMdMusicalNote } from "react-icons/io";

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
  const { getCollection, collectionId } = useLoaderData() as LoaderData<
    typeof Loader
  >;
  const form = useForm({
    defaultValues: {
      beatmap: 0,
    },
  });

  return (
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
          }
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="beatmap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add map to collection</FormLabel>
              <FormControl>
                <Input placeholder="0123" {...field} />
              </FormControl>
              <FormDescription>
                This name will be displayed only in the collection page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add to collection</Button>
      </form>
    </Form>
  );
}
