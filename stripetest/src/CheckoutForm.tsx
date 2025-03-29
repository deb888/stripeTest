import React, { useState } from "react";
import { useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #6200ee;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3700b3;
  }
`;

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout-success",
      },
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <Container>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <ExpressCheckoutElement onConfirm={(_dt)=>{
console.log('====================================');
console.log(_dt);
console.log('====================================');
        }}/>
        <Button type="submit">Pay</Button>
      </form>
    </Container>
  );
};

export default CheckoutForm;
