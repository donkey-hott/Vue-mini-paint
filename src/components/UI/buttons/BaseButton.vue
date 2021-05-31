<template>
  <button>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  border: none;
  padding: 0.5em;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  border-radius: 7px;
  transition: background 0.2s;
}
</style>
