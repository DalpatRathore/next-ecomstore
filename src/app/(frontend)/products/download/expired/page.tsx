import { Button } from "@/components/ui/button";
import Link from "next/link";

const ExpiredLinkPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5  h-40 lg:h-96">
      <h1 className="text-4xl mb-4 text-muted-foreground italic">
        Download link expired
      </h1>
      <Button asChild size={"lg"} variant={"outline"}>
        <Link href={"/orders"}>Get New Link</Link>
      </Button>
    </div>
  );
};
export default ExpiredLinkPage;
