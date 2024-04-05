"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldClose, Trash2 } from "lucide-react";
import { deleteOrder } from "../_actions/order";

export const DeleteDropdownItem = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="w-4 h-4 mr-2"></Trash2>
      Delete
    </DropdownMenuItem>
  );
};
