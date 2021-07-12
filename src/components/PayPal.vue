<template>
  <div id="paypal-button"></div>
</template>

<script>
/* eslint-disable */
import { onMounted } from "vue-demi";
export default {
  setup() {
    onMounted(() => {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "0.01",
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            console.log("transaction completed:", details);
          },
        })
        .render("#paypal-button");
    });
  },
};
</script>

<style></style>
