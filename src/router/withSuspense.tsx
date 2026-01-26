// src/utils/withSuspense.ts
import React, { ComponentType, Suspense } from "react";
import Spinner from "@/components/Common/Spinner";

export const withSuspense = (Component: ComponentType<any>): React.ReactElement => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);