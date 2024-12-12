import {ProductList} from "@/components/product/product-list";
import {MainLayout} from "@/components/layout/main-layout";
import {getUserProfile} from "@/app/action/get-user";

export default async function page() {
  const user = await getUserProfile();

  return (
      <MainLayout user={user}>
        <ProductList/>
      </MainLayout>

  );
}
