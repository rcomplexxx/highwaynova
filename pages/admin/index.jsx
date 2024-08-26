import dynamic from "next/dynamic";

// Load the About component dynamically

const AdminDynamic = dynamic(() => import("../../components/Admin/Admin.jsx"));

export default function AdminPage() {
  return <AdminDynamic />;
}
