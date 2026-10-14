import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="flex items-center justify-center size-20 rounded-2xl bg-primary/10 mb-8">
        <BrainCircuit className="size-10 text-primary" />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or perhaps you just mistyped the URL.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full gap-2">
          <Home className="size-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
