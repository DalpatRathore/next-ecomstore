"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/product";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldClose, Trash2 } from "lucide-react";

export const ActiveToggleDropdownItem = ({
  id,
  inStock,
}: {
  id: string;
  inStock: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !inStock);
          router.refresh();
        });
      }}
    >
      {!inStock ? (
        <ShieldCheck className="w-4 h-4 mr-2"></ShieldCheck>
      ) : (
        <ShieldClose className="w-4 h-4 mr-2"></ShieldClose>
      )}
      {inStock ? "Deactive" : "Activate"}
    </DropdownMenuItem>
  );
};
export const DeleteDropdownItem = ({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="w-4 h-4 mr-2"></Trash2>
      Delete
    </DropdownMenuItem>
  );
};
