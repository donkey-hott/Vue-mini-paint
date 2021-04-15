<template>
  <section class="card">
    <slot name="title"></slot>
    <div class="card__grid">
      <slot name="inputs"></slot>
      <slot name="submit-btn"></slot>
    </div>
    <p>
      <slot name="change-action"></slot>
    </p>
  </section>
</template>

<style lang="scss" scoped>
.card {
  width: 85%;
  border-radius: 15px;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1em;
  }
}
</style>