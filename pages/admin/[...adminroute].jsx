import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

// Load the About component dynamically

const AdminDynamic = dynamic(() => import("@/components/Admin/Admin.jsx"));

export default function AdminPage() {
  return <>
  <NextSeo {...unimportantPageSeo('/admin')}/>
  <AdminDynamic />
  </>;
}
