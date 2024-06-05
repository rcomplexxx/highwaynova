import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";

import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

function ShippingPolicy() {
  return (
    <PolicyCard>
      <NextSeo {...unimportantPageSeo('/shipping-policy')}/>
     
      <h1>Shipping policy</h1>
      <h2>Do you ship globally?</h2>
      <p>Shipping is WORLDWIDE on ALL PRODUCTS!</p>

      <h2>When will i receive my order?</h2>
      <p>
        Orders are shipped out directly from any of our many domestic &amp;
        international warehouses and they will do everything they can to get you
        your order as fast as they can! Please allow 1-3 Business Days for your
        order to be shipped (with up to 6 business days at peak times). The day
        the order is placed is counted as day 0. Due to the popularity of our
        offers, the average Standard Delivery Time is 5 - 10 business days (for
        most Europe and USA/UK/Canada/Australia). Shipping day is counted as day
        0. The Christmas season is the busiest time of the year, therefore,
        delivery time frames may increase up to 20 calendar days. Other
        countries can take an estimated 1-6 weeks (varies from product to
        product) due to distance traveling and customs. Please note, that due to
        the extreme popularity of our offers, these are only estimates.
      </p>

      <h2>Why is my order being shipped in different packages?</h2>
      <p>
        If you have a multi-item order, each item may be shipped from a
        different international warehouse, depending on which one has them
        available the fastest. Alternatively, if an item is popular and on a bit
        of a backorder, we might ship your items at different times, in
        different packages, to prevent holding up your order and to get it to
        you as fast as possible!
      </p>

      <h2>What happens if my order gets stuck or lost in the mail?</h2>
      <p>
        All of our orders are sent with insured shipping and handling. If an
        order gets stuck at customs, sent back or even lost during the delivery
        process, we apologize! The postal service is out of our control.
        However, in cases like this, because the packages are insured, we will
        send you a new package with quicker shipping and full tracking, if
        possible. Please see our refund and return policy for when these might
        be applicable to shipping situations.
      </p>

      <h2>Will i be charged for customs and taxes?</h2>
      <p>
        The prices displayed on our site are tax-free. Import taxes, duties and
        related customs fees may be charged once your order arrives to its final
        destination, which are determined by your local customs office. Payment
        of these charges and taxes are your responsibility and will not be
        covered by us. We are not responsible for delays caused by the customs
        department in your country. For further details of charges, please
        contact your local customs office. Usually, there are no custom or tax
        charges, however, there are always rare exceptions.
      </p>
    </PolicyCard>
  );
}

export default ShippingPolicy;
