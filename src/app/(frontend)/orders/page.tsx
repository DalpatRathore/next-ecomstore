"use client";

import emailOrderHistory from "@/actions/email-order";
import PageHeader from "@/app/admin/_components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";

const OrdersPage = () => {
  const [data, action] = useFormState(emailOrderHistory, {});
  return (
    <>
      <div className="flex justify-between items-center gap-4 border-b-2 mb-10 max-w-5xl mx-auto">
        <PageHeader>My Orders</PageHeader>
      </div>
      <form
        action={action}
        className="max-w-3xl mx-auto p-5 md:p-8 border rounded-lg"
      >
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Enter your email and we will email you your order history and
              download links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" required name="email" id="email"></Input>
            </div>
            {data.error && <div className="text-destructive">{data.error}</div>}
          </CardContent>
          <CardFooter>
            {data.message ? (
              <p className="text-emerald-500 italic">{data.message}</p>
            ) : (
              <SubmitButton></SubmitButton>
            )}
          </CardFooter>
        </Card>
      </form>
    </>
  );
};
export default OrdersPage;

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size={"lg"} disabled={pending}>
      {pending ? "Sending..." : "Send"}
    </Button>
  );
};
