import { Plus } from "lucide-react";
import { Link } from "@/shared/components/ui/link";

export function CreatePostButton() {
  return (
    <Link
      variant={"default"}
      size={"icon-lg"}
      href="/posts/create"
      aria-label="Create Post"
      tooltip="Create Post"
      className="fixed right-10 bottom-10 z-50"
    >
      <Plus />
    </Link>
  );
}
