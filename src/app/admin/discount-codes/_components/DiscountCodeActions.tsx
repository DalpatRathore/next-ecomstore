"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldClose, Trash2 } from "lucide-react";
import {
  deleteDiscountCode,
  toggleDiscountActive,
} from "../../_actions/discountCodes";

export const ActiveToggleDropdownItem = ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleDiscountActive(id, !isActive);
          router.refresh();
        });
      }}
    >
      {!isActive ? (
        <ShieldCheck className="w-4 h-4 mr-2"></ShieldCheck>
      ) : (
        <ShieldClose className="w-4 h-4 mr-2"></ShieldClose>
      )}
      {isActive ? "Deactive" : "Activate"}
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
          await deleteDiscountCode(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="w-4 h-4 mr-2"></Trash2>
      Delete
    </DropdownMenuItem>
  );
};
