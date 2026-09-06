"use client";

import { Provider } from "react-redux";
import { store } from "@/store"; // Check karein agar aapka store file path `@/store/index` ya `@/store/store` hai

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}