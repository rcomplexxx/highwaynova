import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

export default function PrivacyPolicy() {
  return (
    <PolicyCard>
    <NextSeo {...unimportantPageSeo('/privacy-policy')}/>
      <h1>Privacy Policy</h1>

<h2>Section 1: Consent</h2>
<p>
  <strong>Q: What do we do with your information?</strong><br/><br/>
  A: When you make a purchase on our website, we collect the personal information you provide, such as your name, address, and email. We also automatically receive your computer’s IP address when you browse our site to enhance your experience and gather information about your browser and operating system. With your permission, we may send you emails about our products and updates.
</p>

<p>
  <strong>Q: How do you get my consent?</strong><br/><br/>
  A: Your consent is implied when you provide personal information for a transaction, verify your credit card, place an order, arrange for a delivery, or return a purchase. If we need your information for secondary reasons like marketing, we will ask for your explicit consent.
</p>

<p>
  <strong>Q: How do I withdraw my consent?</strong><br/><br/>
  A: If you change your mind, you can withdraw your consent at any time by contacting us at [your email address].
</p>

<p>
  <strong>Q: Define any situation where we may disclose your information</strong><br/><br/>
  A: We may disclose your information if required by law or if you violate our Terms of Service.
</p>

<h2>Section 2: Hosting and Platform</h2>
<p>
  Our website is hosted independently, and we use a custom e-commerce platform. Your data is stored securely on our servers.
</p>

<h2>Section 3: Payment</h2>
<p>
  Your purchase transaction data is stored only as long as necessary to complete the transaction. We utilize the PayPal API for secure payment processing, and all transactions adhere to PCI-DSS standards to ensure the secure handling of credit card information.
  For more information about PayPal's privacy policy and how they handle your data, please refer to <a href="https://www.paypal.com/us/legalhub/privacy-full">PayPal's Privacy Policy</a>.
</p>

<h2>Section 4: Third-Party Services</h2>
<p>
  We use third-party service providers for various functions. These providers only collect, use, and disclose information necessary for the services they provide. Please review their privacy policies for details. For example, we use Google Analytics to help us understand how our customers use the site. You can read more about thir Privacy Policy here: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>. You can also opt-out of Google Analytics on here: <a href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</a>.
</p>

<h2>Section 5: Security</h2>
<p>
  We take reasonable precautions to protect your information from loss, misuse, access, disclosure, alteration, or destruction. Your credit card information is encrypted using secure socket layer technology (SSL), and we follow PCI-DSS requirements.
</p>

<h2>Section 6: Cookies</h2>
<p>
  We use minimal cookies to enhance your shopping experience. These cookies may include Google Analytics, which helps us gather insights into how users interact with our website, understand user preferences, and improve our services. For more information about how Google Analytics handles your data, please refer to their <a href="https://policies.google.com/privacy">Privacy Policy</a>.
</p>
<p>
  In addition to cookies, our website may utilize local storage to retain information about previously abandoned shopping carts. This enables us to assist you in completing your purchase seamlessly.
</p>
<p>
  You have the option to manage your cookie preferences through your browser settings. It's important to note that restricting cookies may impact certain functionalities on the site. We encourage you to review and adjust your settings to ensure the best possible experience while using our website.
</p>

<h2>Section 7: Age of Consent</h2>
<p>
  By using our site, you confirm that you are of legal age in your state or province, or you have given consent for any minor dependents to use our site.
</p>

<h2>Section 8: Changes to this Privacy Policy</h2>
<p>
  We reserve the right to modify this privacy policy. Any changes will be effective immediately upon posting. If our business undergoes a change, your information may be transferred to new owners.
</p>

<h2>Questions and Contact Information</h2>
<p>
  If you have any questions or would like to access, correct, amend, or delete your personal information, please contact our Privacy Compliance Officer at [your email address].
  For further assistance, visit our <a href="/contact">Contact Page</a>.
</p>

<p>
  Follow us on Instagram, Twitter, and Facebook for updates and offers.
</p>
    </PolicyCard>
  );
}
