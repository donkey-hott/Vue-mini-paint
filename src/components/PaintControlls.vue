<template>
  <nav class="controls">
    <ul class="controls__buttons">
      <li><button @click="setDrawFunction('drawLine')">Line</button></li>
      <li><button @click="setDrawFunction('drawRect')">Rectangle</button></li>
      <li><button @click="setDrawFunction('drawCircle')">Circle</button></li>
      <li>
        <button @click="setDrawFunction('drawRATriangle')">
          Right-angled triangle
        </button>
      </li>
      <li>
        <button
          @click="
            setDrawFunction('drawPolygon', { sides: 3, angle: Math.PI / 2 })
          "
        >
          Isoceles triangle
        </button>
      </li>
      <li>
        <button
          @click="
            setDrawFunction('drawPolygon', { sides: 4, angle: Math.PI / 4 })
          "
        >
          Square
        </button>
      </li>
      <li>
        <button
          @click="
            setDrawFunction('drawPolygon', { sides: 5, angle: Math.PI / 2 })
          "
        >
          Pentagon
        </button>
      </li>
      <li>
        <button
          @click="
            setDrawFunction('drawPolygon', { sides: 6, angle: Math.PI / 2 })
          "
        >
          Hexagon
        </button>
      </li>
      <li>
        <button
          @click="
            setDrawFunction('drawPolygon', { sides: 8, angle: Math.PI / 2 })
          "
        >
          Octagon
        </button>
      </li>
      <li><button @click="emitClearCanvasEvent">Clear canvas</button></li>
      <li><button @click="savePicture">Save picture</button></li>
      <li>
        <label for="lineWidth">Line width:</label>
        <input
          v-model.number="styleOptions.lineWidth"
          min="1"
          max="20"
          type="range"
          id="lineWidth"
        />
        <span>{{ styleOptions.lineWidth }} px.</span>
      </li>
      <li>
        <label for="strokeColor">Stroke color:</label>
        <input
          v-model="styleOptions.strokeColor"
          type="color"
          id="strokeColor"
        />
      </li>
      <li>
        <label for="fill">Fill:</label>
        <input v-model="styleOptions.isShapeFilled" type="checkbox" id="fill" />
      </li>
      <li>
        <label for="fillColor">Fill color:</label>
        <input
          :disabled="!styleOptions.isShapeFilled"
          v-model="styleOptions.fillColor"
          type="color"
          id="fillColor"
        />
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { PolygonConfiguration, DrawFunctionType } from "../views/Paint.vue";

export default defineComponent({
  emits: [
    "changeDrawFunction",
    "clearCanvas",
    "setStyleOptions",
    "savePicture",
  ],

  setup(_, { emit }) {
    const drawFunction = reactive<DrawFunctionType>({ funcName: "drawLine" });
    const styleOptions = reactive({
      lineWidth: 1,
      strokeColor: "#000000",
      fillColor: "#000000",
      isShapeFilled: false,
    });

    function setDrawFunction(
      funcName: string,
      polygonParameters?: PolygonConfiguration
    ) {
      drawFunction.funcName = funcName;
      drawFunction.polygonParameters = polygonParameters;
      emit("changeDrawFunction", drawFunction);
    }

    function emitClearCanvasEvent() {
      emit("clearCanvas");
    }

    function savePicture() {
      emit("savePicture");
    }

    watch(styleOptions, (_, newVal) => {
      emit("setStyleOptions", newVal);
    });

    return {
      styleOptions,
      setDrawFunction,
      emitClearCanvasEvent,
      savePicture,
    };
  },
});
</script>

<style lang="scss" scoped>
.controls {
  &__buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;

    > li {
      margin: 0 0.3em;
    }
  }
}
</style>
