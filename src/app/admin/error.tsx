"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-center px-5  max-w-7xl mx-auto gap-5 relative ">
      <div className="p-5 md:p-10 w-full  max-w-7xl mt-5 md:mt-10 bg-white dark:bg-black">
        <div className="w-full mx-auto max-w-3xl flex flex-col items-center justify-center gap-5">
          <h2 className="w-full  scroll-m-20 text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight text-center pl-5">
            Something went wrong.
          </h2>
          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            We apologize for the inconvenience.
          </p>

          <Button variant="outline" onClick={() => location.reload()}>
            Refresh Page
          </Button>

          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            If the issue persists.
          </p>
          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            Kindly get in touch with the website administrator for further
            assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
