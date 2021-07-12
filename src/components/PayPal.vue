<template>
  <div id="paypal-button"></div>
</template>

<script>
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

    onMounted(async () => {
      await store.dispatch(ActionTypes.GET_USER_SUBSCRIPTION_PLAN);
      if (isUserPremium.value) return;

      const premiumPrice = await store.dispatch(ActionTypes.GET_PREMIUM_PRICE);

      paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: premiumPrice,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            await actions.order.capture();

            try {
              await store.dispatch(ActionTypes.SUBSCRIBE_TO_PREMIUM);
              toast.success("Thank you for the purchase!");
            } catch (error) {
              toast.error("Something went wrong. Please, try later");
              console.error(error);
            }
          },
        })
        .render("#paypal-button");
    });

    return { isUserPremium };
  },
};
</script>

<style></style>
