<template>
  <label tabindex="0" for="file-input">
    <span class="truncate">{{ caption }}</span>
    <input
      @input="handleInput($event.target)"
      type="file"
      id="file-input"
      :multiple="multiple"
      :accept="accept"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  emits: ["files-loaded"],
  props: {
    multiple: {
      type: Boolean,
      default: false,
      required: false,
    },
    accept: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const caption = ref("Choose files");

    function handleInput(inputElement: HTMLInputElement) {
      const files = inputElement.files;
      if (!files) return;

      updateCaption(files);
      emit("files-loaded", files);
    }

    function updateCaption(files: FileList) {
      if (files.length > 1) {
        caption.value = `${files.length} files selected`;
        return;
      }
      caption.value = `${files[0].name}`;
    }

    return {
      caption,
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
//   hide input[type="file"]
//  and leave only clickable label
#file-input {
  opacity: 0;
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  z-index: -1;
  overflow: hidden;
}

label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3em;
  color: var(--text);
  cursor: pointer;

  i {
    margin-right: 0.2em;
  }

  &:focus {
    outline: auto;
  }

  span {
    user-select: none;
  }
}
</style>
