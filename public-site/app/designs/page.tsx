import OrderDesignsPage from "@/components/order-design/order-design";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDesignsPage />
    </Suspense>
  );
};

export default page;
