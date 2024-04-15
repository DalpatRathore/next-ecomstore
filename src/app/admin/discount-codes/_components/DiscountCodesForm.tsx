"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/product";
import { useFormState, useFormStatus } from "react-dom";
import { DiscountCodeType, Product } from "@prisma/client";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDiscountCode } from "../../_actions/discountCodes";
import { Checkbox } from "@/components/ui/checkbox";

const DiscountCodeForm = ({
  products,
}: {
  products: { name: string; id: string }[];
}) => {
  const [error, action] = useFormState(addDiscountCode, {});

  const [allProducts, setAllProducts] = useState(true);

  return (
    <form action={action} className="space-y-5 w-full mb-10">
      <div className="w-full space-y-2">
        <Label htmlFor="name">Code</Label>
        <Input type="text" id="code" name="code" required></Input>
        {error.code && <div className="text-destructive">{error.code}</div>}
      </div>

      <div className="space-y-2 flex items-baseline gap-8">
        <div className="w-full space-y-2">
          <Label htmlFor="name">Discount Type</Label>
          <RadioGroup
            id="discountType"
            name="discountType"
            defaultValue={DiscountCodeType.PERCENTAGE}
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.PERCENTAGE}
              ></RadioGroupItem>
              <Label htmlFor="percentage">Percentage</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.FIXED}
              ></RadioGroupItem>
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="w-full space-y-2 flex-grow">
          <Label htmlFor="name">Discount Amount</Label>
          <Input
            type="text"
            id="discountAmount"
            name="discountAmount"
            required
          ></Input>
          {error.discountAmount && (
            <div className="text-destructive">{error.discountAmount}</div>
          )}
        </div>
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="name">Limit</Label>
        <Input type="text" id="limit" name="limit"></Input>
        <div className="text-muted-foreground">
          Leave blank for infinite uses
        </div>
        {error.limit && <div className="text-destructive">{error.limit}</div>}
      </div>
      <div className="w-full space-y-2">
        <Label htmlFor="name">Expiration</Label>
        <Input
          type="datetime-local"
          id="expiresAt"
          name="expiresAt"
          min={new Date().toJSON().split(":").slice(0, -1).join(":")}
        ></Input>
        <div className="text-muted-foreground">
          Leave blank for no expiration
        </div>
        {error.expiresAt && (
          <div className="text-destructive">{error.expiresAt}</div>
        )}
      </div>
      <div className="w-full space-y-2">
        <Label>All Products</Label>
        {error.allProducts && (
          <div className="text-destructive">{error.allProducts}</div>
        )}
        s
        {error.productIds && (
          <div className="text-destructive">{error.productIds}</div>
        )}
        <div className="flex gap-2 items-center">
          <Checkbox
            id="allProducts"
            name="allProducts"
            checked={allProducts}
            onCheckedChange={e => setAllProducts(e === true)}
          ></Checkbox>
          <Label htmlFor="allProducts">All Products</Label>
        </div>
        {products.map(product => (
          <div className="flex gap-2 items-center" key={product.id}>
            <Checkbox
              id={product.id}
              name="productIds"
              value={product.id}
              disabled={allProducts}
            ></Checkbox>
            <Label htmlFor={product.id}>{product.name}</Label>
          </div>
        ))}
        <div className="text-muted-foreground">
          Leave blank for no expiration
        </div>
      </div>

      <SubmitButton></SubmitButton>
    </form>
  );
};
export default DiscountCodeForm;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
