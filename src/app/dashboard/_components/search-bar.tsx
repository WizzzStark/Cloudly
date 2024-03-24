import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import {Input} from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
    query: z.string().min(0).max(100),
  })


export function SearchBar({query, setQuery}: {query: string, setQuery: Dispatch<SetStateAction<string>>}) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query);
    }

    return (
        <div className="w-full mb-8">
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-4">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                        <FormItem className="w-full searchBarText">
                            <FormControl>
                            <Input placeholder="Search for a file name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        disabled={form.formState.isSubmitting} 
                        className="flex gap-1 px-6"
                    >
                        {form.formState.isSubmitting &&
                        <Loader2 className="w-6 h-6 animate-spin" />
                        }
                        <SearchIcon /> Search
                    </Button>
                </form>
            </Form>
        </div>
    );
}