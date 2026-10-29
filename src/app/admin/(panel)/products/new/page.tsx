import { ProductForm } from "@/components/admin/product-form";
import { adminCategories } from "@/lib/admin/data";

export default async function NewProduct() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-semibold">New product</h1>
      <ProductForm categories={await adminCategories()} />
    </>
  );
}
