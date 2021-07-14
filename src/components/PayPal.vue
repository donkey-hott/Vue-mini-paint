<template>
  <!--
    Use 'v-show' so that the button is hidden immediately
    after committing a purchase (using 'v-if' will cause an error with PayPal) 
  -->
  <div id="paypal-button" v-show="!isUserPremium"></div>
</template>

<script>
/*
Eslint goes disabled because it doesn't recognize
PayPal API that is defined as a script in the index.html file 
*/

/* eslint-disable */
import { onMounted, computed } from "vue";
import { ActionTypes } from "@/store/modules/payments/actions/action-types";
import { useStore } from "@/store";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const store = useStore();
    const toast = useToast();
    const isUserPremium = computed(() => store.getters.isUserPremium);

    async function paypalCreateOrder(data, actions) {
      const premiumPrice = await store.dispatch(ActionTypes.GET_PREMIUM_PRICE);

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: premiumPrice,
            },
          },
        ],
      });
    }

    async function paypalOnApprove(data, actions) {
      await actions.order.capture();

      try {
        await store.dispatch(ActionTypes.SUBSCRIBE_TO_PREMIUM);
        toast.success("Thank you for the purchase!");
      } catch (error) {
        toast.error("Something went wrong. Please, try later");
        console.error(error);
      }
    }

    async function initPaypal() {
      /* check whether a user has premium; if so, not render the button */
      await store.dispatch(ActionTypes.GET_USER_SUBSCRIPTION_PLAN);

      if (isUserPremium.value) return;

      paypal
        .Buttons({
          createOrder: async (data, actions) =>
            await paypalCreateOrder(data, actions),
          onApprove: async (data, actions) =>
            await paypalOnApprove(data, actions),
          style: {
            size: "pay",
            layout: "horizontal",
            tagline: false,
          },
        })
        .render("#paypal-button");
    }

    onMounted(async () => await initPaypal());

    return { isUserPremium };
  },
};
</script>

<style lang="scss">
section {
  margin-top: 1em;
}
</style>
