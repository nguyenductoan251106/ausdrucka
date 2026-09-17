import { Suspense } from "react";
import EditorClient from "./EditorClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function WritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <Suspense fallback={<EditorSkeleton />}>
        <EditorClient />
      </Suspense>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-[400px] w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
