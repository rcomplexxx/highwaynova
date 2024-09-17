import  { useContext, useEffect, useMemo, useRef, useState } from "react";
import GooglePayButton from "@google-pay/button-react";
import styles from "./googlepay.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import swapCountryCode from "@/utils/utils-client/countryList";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import { ErrorIcon } from "@/public/images/svgs/svgImages";

const GooglePay = () => {
  //paymentRequest.paymentMethodData.tokenizationData.token
  const [googlePayError, setGooglePayError] = useState();


  const { total, organizeUserData} = useContext(CheckoutContext);


  const totalRef = useRef(total);
const organizeUserDataRef = useRef(organizeUserData)


  useEffect(()=>{

   
    totalRef.current = total;
    organizeUserDataRef.current=organizeUserData;
    

    

  },[organizeUserData])



  const router = useRouter();

 

  const handleGpayOrder = async (paymentData) => {
    try {
    
      
      
const paymentToken = JSON.parse(paymentData.paymentMethodData.tokenizationData.token).id;



// Extract first and last name
const [firstName = "", lastName = ""] = paymentData.shippingAddress.name.split(" ");

// Build requestData

const requestDataTemplate = {...organizeUserDataRef.current("GPAY", paymentToken)};

const requestData = {
  ...requestDataTemplate, 
  
  order: {
    ...requestDataTemplate.order,  
    email: paymentData.email,
  firstName: firstName,
  lastName: lastName,
  address: paymentData.shippingAddress.address1,
  apt: undefined,
  country: swapCountryCode(paymentData.shippingAddress.countryCode),
  zipcode: paymentData.shippingAddress.postalCode,
  state: paymentData.shippingAddress.administrativeArea,
  city: paymentData.shippingAddress.locality,
  phone: paymentData.shippingAddress.phoneNumber
 
  
}
};



      

      console.log("mydata", requestData);
      return await fetch("/api/make-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          items: JSON.stringify(requestData.items),
        }),
      })
        .then((response) => response.json())
        .then((validation) => {
          if (validation.success) {
            console.log("Validation true", validation.message);

            
            router.push("/thank-you");

            return { transactionState: "SUCCESS" };
          } else {
            console.log(validation.error);

            if (validation.error === "amount_incorrect")
              return {
                transactionState: "ERROR",
                error: {
                  reason: "OFFER_INVALID",
                  message: "Amount of products is not correct on server side.",
                  intent: "OFFER",
                },
              };

            else
              return {
                transactionState: "ERROR",
                error: {
                  reason: "OTHER_ERROR",
                  message: validation.error,
                  intent: "PAYMENT_AUTHORIZATION",
                },
              };
          }
        })
        .catch((error) => {
          // Handle errors that occur during the fetch or processing of the response
          console.error("Error creating order:", error);
          throw error; // Rethrow the error for the calling code to handle
        });
    } catch (err) {
      console.log(err);
      return { success: false, error: {message: "Payment was not approved."} };
    }
  };

  return (
    <>
    <div className={styles.gpayWrapper}>
    <GooglePayButton
      environment={process.env.GPAYENVIRENMENT}
      className={classNames(styles.gpayButton)}
      buttonType="plain"
      buttonSizeMode="fill"
      buttonColor="black"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["AMEX", "DISCOVER", "MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:version": "2023-10-16",
                "stripe:publishableKey":
                  "pk_test_51OR1EhAom3KfH7oBf5QRKboVHPrFIrZ3nwmtwS30uSDtrHbpgwsFzf19Np73RjxFiAqUy0tjPi5BIYdDmSPDExya00m4ZFZoI1",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "BCR2DN4TZLVYPEIX",
          merchantName: "Demo Merchant",
        },
        transactionInfo: {
          totalPriceStatus: "ESTIMATED",
          totalPriceLabel: "Total",
          totalPrice: `${total}`,
          currencyCode: "USD",
          countryCode: "US",
        },

        emailRequired: true,
        shippingAddressRequired: true,
        shippingAddressParameters: {
          phoneNumberRequired: true,
        },
        callbackIntents: ["PAYMENT_AUTHORIZATION", "SHIPPING_ADDRESS"],
      }}
      existingPaymentMethodRequired={false}
      onLoadPaymentData={(paymentRequest) => {
        console.log("load payment data", paymentRequest);
        //  handleGpayOrder(paymentRequest.paymentMethodData.tokenizationData.token)
      }}
      onPaymentAuthorized={handleGpayOrder}
      onPaymentDataChanged={(paymentData) => {
        console.log("Data changed", paymentData);
      }}
      onCancel={(reason)=>{
        setGooglePayError('Payment is canceled.');
      }}

      onClick={()=>{
        setGooglePayError();
      }}
      onError={(reason) => {
        console.log(reason);
        setGooglePayError(reason.message)
      }}
    />
    </div>
   {googlePayError && <p className={styles.googlePayError}><ErrorIcon/>{googlePayError}</p>}
    </>
  );
};

export default GooglePay;

