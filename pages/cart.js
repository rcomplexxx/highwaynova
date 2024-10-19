import Cart from "@/components/Cart/Cart.jsx";

import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import { NextSeo } from "next-seo";

export default function CartPage() {
  return (
  <><NextSeo {...unimportantPageSeo('/cart')}/>
      <Cart />
      </>
  );
}
