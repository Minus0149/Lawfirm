"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/types/category";

interface HeaderProps {
  categories: Category[];
}

export async function ConditionalHeader({ categories }: HeaderProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    return null;
  }

  return <Header categories={categories} />;
}
