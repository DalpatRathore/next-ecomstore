"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/product";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  return (
    <form action={action} className="space-y-5 w-full mb-10">
      <div className="flex gap-10 w-full">
        <div className="w-full space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product?.name || ""}
          ></Input>
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>

        <div className="w-full space-y-2">
          <Label htmlFor="priceInCents">Price In Cents</Label>
          <Input
            type="number"
            id="priceInCents"
            name="priceInCents"
            required
            value={priceInCents}
            onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
          ></Input>
          <div className="text-muted-foreground">
            {formatCurrency((priceInCents || 0) / 100)}
          </div>
          {error.priceInCents && (
            <div className="text-destructive">{error.priceInCents}</div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
          placeholder="Type your product description here."
          className="h-40"
        ></Textarea>
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product === null}
        ></Input>
        {product !== null && (
          <div className="text-muted-foreground">{product?.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={product === null}
        ></Input>
        {product !== null && product?.imagePath && (
          <Image
            src={product.imagePath}
            height={200}
            width={200}
            alt="Product Image"
            className="rounded-md mx-auto"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton></SubmitButton>
    </form>
  );
};
export default ProductForm;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
