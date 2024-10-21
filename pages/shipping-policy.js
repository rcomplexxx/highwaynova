import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

function ShippingPolicy() {
  return (
    <PolicyCard>
      <NextSeo {...unimportantPageSeo('/shipping-policy')}/>
     
      <h1>Shipping policy</h1>
      
    </PolicyCard>
  );
}

export default ShippingPolicy;
