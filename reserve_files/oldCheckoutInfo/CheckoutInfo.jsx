import { useState } from "react";
import styles from "./checkoutinfo.module.css";
import InputField from "./Input/InputField";
import CountryInput from "./Input/CountryInput/CountryInput";

export default function CheckoutInfo({ setUnlockPaypal, unlockPaypal }) {
  const [errors, setErrors] = useState({});
  const [billingAddressType, setBillingAddressType] = useState("sameAddress");
  const [shippingType, setShippingType] = useState("free");

  const handleBlur = (event) => {
    const { id, value } = event.target;
    let errorMessage = null;

    if (!value) {
      errorMessage = `${id.replace(/^\w/, (c) =>
        c.toUpperCase(),
      )} is a required field.`;
    } else if (id === "email" && !/\S+@\S+\.\S+/.test(value)) {
      errorMessage = "Please enter a valid email address.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: errorMessage,
    }));
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    const errorLength = Object.keys(errors).length;
    const inputNumber = billingAddressType === "sameAddress" ? 9 : 15;

    if (
      (errorLength === inputNumber - 1 && !errors.hasOwnProperty(id)) ||
      errorLength === inputNumber
    ) {
      const setErrorMessage = (message) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: message,
        }));
        setUnlockPaypal(false);
      };

      if (!value) {
        setErrorMessage(`${id} is a required field.`);
      } else if (id === "email" && !/\S+@\S+\.\S+/.test(value)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: null,
        }));
        setUnlockPaypal(
          Object.entries(errors).every(
            ([key, value]) => value === null || key === id,
          ),
        );
      }

      return;
    }

    if (!errors[id]) return;

    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: null }));
    }
  };

  const handleFocus = (event) => {
    const { id } = event.target;
    const inputNumber = billingAddressType === "sameAddress" ? 9 : 15;
    if (!errors[id] && !Object.keys(errors).length == inputNumber - 1) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: null }));
    }
  };

  const handleBillingAddressTypeChange = (event) => {
    const { id } = event.target;
    if (id === billingAddressType) return;
    if (id === "sameAddress") {
      const {
        billingAddress,
        billingCountry,
        billingState,
        billingCity,
        billingZipcode,
        billingPhone,
        ...newErrors
      } = errors;
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 9) {
        setUnlockPaypal(
          Object.values(newErrors).every((value) => value === null),
        );
      }
    } else setUnlockPaypal(false);
    setBillingAddressType(id);
  };

  return (
    <div className={styles.checkout_left}>
      <div className={styles.checkout_section}>
        <h2>Contact Information</h2>
        <form>
          <InputField
            id="email"
            placeHolder="Email *"
            type="email"
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleFocus={handleFocus}
            error={errors.email}
          >
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </InputField>

          <h2>Shipping information</h2>
          {!unlockPaypal && (
            <p className={styles.requiredNote}>
              Fields marked with * are required.
            </p>
          )}

          <div className={styles.input_row}>
            <InputField
              id="firstName"
              placeHolder="First name *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.firstName}
            />
            <InputField
              id="lastName"
              placeHolder="Last name *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.lastName}
            />
          </div>
          <div className={styles.input_row}>
            <InputField
              id="address"
              placeHolder="Address *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.address}
            />

            <InputField
              id="apt"
              placeHolder="Apt, suite, etc. (optional)"
              type="text"
            />
          </div>
          <div className={styles.input_row}>
            <CountryInput
              id="country"
              setErrors={setErrors}
              errors={errors}
              setUnlockPaypal={setUnlockPaypal}
              inputNumber={billingAddressType === "sameAddress" ? 9 : 15}
            />
            <InputField
              id="zipcode"
              placeHolder="Zipcode *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.zipcode}
            />
            <InputField
              id="state"
              placeHolder="State *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.state}
            />
          </div>
          <div className={styles.input_row}>
            <InputField
              id="city"
              placeHolder="City *"
              type="text"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.city}
            />
            <InputField
              id="phone"
              placeHolder="Phone *"
              type="tel"
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleFocus={handleFocus}
              error={errors.phone}
            />
          </div>
        </form>
      </div>

      <div
        className={
          styles.checkout_section + " " + styles.billing_information_div
        }
      >
        <h2 className={styles.billingTitle}>Billing Address</h2>
        <div className={styles.billing_options}>
          <div className={styles.billing_option}>
            <input
              type="radio"
              id="sameAddress"
              name="billingAddressType"
              checked={billingAddressType === "sameAddress"}
              onChange={handleBillingAddressTypeChange}
            />
            <label htmlFor="sameAddress">Same as shipping address</label>
          </div>
          <div className={styles.billing_option}>
            <input
              type="radio"
              id="differentAddress"
              name="billingAddressType"
              checked={billingAddressType === "differentAddress"}
              onChange={handleBillingAddressTypeChange}
            />
            <label htmlFor="differentAddress">
              Use a different billing address
            </label>
          </div>
        </div>
        {billingAddressType === "differentAddress" && (
          <form>
            <div className={styles.input_row}>
              <InputField
                id="billingAddress"
                placeHolder="Address *"
                type="text"
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleFocus={handleFocus}
                error={errors.billingAddress}
              />

              <InputField
                id="billingApt"
                placeHolder="Apt, suite, etc. (optional)"
                type="text"
              />
            </div>
            <div className={styles.input_row}>
              <CountryInput
                id="billingCountry"
                setErrors={setErrors}
                errors={errors}
                setUnlockPaypal={setUnlockPaypal}
                inputNumber={15}
              />
              <InputField
                id="billingZipcode"
                placeHolder="Zipcode *"
                type="text"
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleFocus={handleFocus}
                error={errors.billingZipcode}
              />
              <InputField
                id="billingState"
                placeHolder="State *"
                type="text"
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleFocus={handleFocus}
                error={errors.billingState}
              />
            </div>
            <div className={styles.input_row}>
              <InputField
                id="billingCity"
                placeHolder="City *"
                type="text"
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleFocus={handleFocus}
                error={errors.billingCity}
              />
              <InputField
                id="billingPhone"
                placeHolder="Phone *"
                type="tel"
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleFocus={handleFocus}
                error={errors.billingPhone}
              />
            </div>
          </form>
        )}
      </div>

      <div className={styles.checkout_section}>
        <h2>Shipping Method</h2>
        <div className={styles.shipping_method}>
          <input
            type="radio"
            id="freeShipping"
            name="shippingMethod"
            checked={shippingType === "free"}
            onClick={() => {
              setShippingType("free");
            }}
          />
          <label htmlFor="freeShipping">
            FREE Shipping (Tracked & Insured)
          </label>
          <span>Free</span>
        </div>
        <div className={styles.shipping_method}>
          <input
            type="radio"
            id="expressShipping"
            name="shippingMethod"
            checked={shippingType === "express"}
            onClick={() => {
              setShippingType("express");
            }}
          />
          <label htmlFor="expressShipping">Express Shipping (2-3 days)</label>
          <p>$9.99</p>
        </div>
      </div>
    </div>
  );
}
