import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

function RefundPolicy() {
  return (
    <PolicyCard>
      <NextSeo {...unimportantPageSeo('/refund-policy')}/>
   
      <h1>Refund policy</h1>
     
      <h2>Can a replacement request be made on gamebuff.com?</h2>
<p>We offer you a 30-Day refund for only the following cases:</p>
<ol>
    <li>Your item arrived damaged</li>
    <li>You have received the wrong product</li>
</ol>
<p>If 15 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.</p>
<p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. If the item is damaged, we request you to send us photos, required as proof of purchase.</p>

<hr/>

<h2>You have sent a proof of purchase error. What now?</h2>
<p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
<p>Exceptions apply for accidental orders, where we are not held being responsible and do not offer a refund.</p>

<hr/>

<h2>What if there Late or Missing refunds?</h2>
<p>If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company; it may take some time before your refund is officially posted. Next, contact your bank. There is often some processing time before a refund is posted. If you’ve done all of this and you still have not received your refund yet, please contact us at {process.env.NEXT_PUBLIC_SALES_EMAIL_ADDRESS}</p>

<hr/>

<h2>Are refunds available on Sale Items?</h2>
<p>Yes, all items are eligible for refunds.</p>

<hr/>

<h2>If I get a wrong product, can I get it replaced?</h2>
<p>We strive to ensure 100% customer satisfaction by providing them exactly what they need. However, if you receive a wrong product, you can certainly raise a request for replacement. The refund will be made only after thoroughly investigating the reason for which you want to receive it. You can email us at {process.env.NEXT_PUBLIC_SALES_EMAIL_ADDRESS} for further assistance on the refund.</p>




    </PolicyCard>
  );
}

export default RefundPolicy;
