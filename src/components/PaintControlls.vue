<template>
  <aside class="controls">
    <!-- <input type="text" id="title" v-model="pictureTitle" /> -->
    <ul class="buttons">
      <li class="item">
        <base-button
          class="item__button"
          :class="{ 'item__button--active': currentInstrument === 'pencil' }"
          title="Pencil"
          @click="
            setDrawFunction('PencilStrategy');
            currentInstrument = 'pencil';
          "
        >
          <img
            alt="Pencil"
            src="https://img.icons8.com/windows/50/ffffff/pencil.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Eraser"
          class="item__button"
          :class="{ 'item__button--active': currentInstrument === 'eraser' }"
          @click="
            setDrawFunction('EraseStrategy');
            currentInstrument = 'eraser';
          "
        >
          <img
            alt="Eraser"
            src="https://img.icons8.com/windows/50/ffffff/eraser.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Line"
          class="item__button"
          :class="{ 'item__button--active': currentInstrument === 'line' }"
          @click="
            setDrawFunction('LineStrategy');
            currentInstrument = 'line';
          "
        >
          <img
            alt="Line"
            src="https://img.icons8.com/windows/50/ffffff/line.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Rectangle"
          class="item__button"
          :class="{ 'item__button--active': currentInstrument === 'rect' }"
          @click="
            setDrawFunction('RectStrategy');
            currentInstrument = 'rect';
          "
        >
          <img
            alt="Rectangle"
            src="https://img.icons8.com/windows/50/ffffff/rectangle-stroked.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Circle"
          class="item__button"
          :class="{
            'item__button--active': currentInstrument === 'circle',
          }"
          @click="
            setDrawFunction('CircleStrategy');
            currentInstrument = 'circle';
          "
        >
          <img
            alt="Circle"
            src="https://img.icons8.com/windows/50/ffffff/circled--v1.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Square"
          class="item__button"
          :class="{
            'item__button--active': currentInstrument === 'square',
          }"
          @click="
            setDrawFunction('PolygonStrategy', {
              sides: 4,
              angle: Math.PI / 4,
            });
            currentInstrument = 'square';
          "
        >
          <img
            alt="Square"
            src="https://img.icons8.com/windows/50/ffffff/rounded-square.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="Isosceles triangle"
          class="item__button"
          :class="{
            'item__button--active': currentInstrument === 'isoscelesTriangle',
          }"
          @click="
            setDrawFunction('PolygonStrategy', {
              sides: 3,
              angle: Math.PI / 2,
            });
            currentInstrument = 'isoscelesTriangle';
          "
        >
          <img
            alt="Isosceles triangle"
            src="https://img.icons8.com/windows/50/ffffff/triangle-stroked.png"
          />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="More shapes"
          class="item__button"
          @click="togglePolygonsBlock"
        >
          ...
        </base-button>
        <div class="polygons" v-show="arePolygonsShown">
          <base-button
            title="Right-angled triangle"
            class="item__button"
            :class="{
              'item__button--active':
                currentInstrument === 'rightAngledTriangle',
            }"
            @click="
              setDrawFunction('RATriangleStrategy');
              currentInstrument = 'rightAngledTriangle';
            "
          >
            <img
              alt="Right-angled triangle"
              src="https://img.icons8.com/windows/50/ffffff/trigonometry.png"
            />
          </base-button>
          <base-button
            title="Pentagon"
            class="item__button"
            :class="{
              'item__button--active': currentInstrument === 'pentagon',
            }"
            @click="
              setDrawFunction('PolygonStrategy', {
                sides: 5,
                angle: Math.PI / 2,
              });
              currentInstrument === 'pentagon';
            "
          >
            <img
              alt="Pentagon"
              src="https://img.icons8.com/windows/50/ffffff/pentagon.png"
            />
          </base-button>
          <base-button
            title="Hexagon"
            class="item__button"
            :class="{
              'item__button--active': currentInstrument === 'hexagon',
            }"
            @click="
              setDrawFunction('PolygonStrategy', {
                sides: 6,
                angle: Math.PI / 3,
              });
              currentInstrument = 'hexagon';
            "
          >
            <img
              alt="Hexagon"
              src="https://img.icons8.com/windows/50/ffffff/hexagon.png"
            />
          </base-button>
          <base-button
            title="Octagon"
            class="item__button"
            :class="{
              'item__button--active': currentInstrument === 'octagon',
            }"
            @click="
              setDrawFunction('PolygonStrategy', {
                sides: 8,
                angle: Math.PI / 8,
              });
              currentInstrument = 'octagon';
            "
          >
            <img
              title="Octagon"
              src="https://img.icons8.com/windows/50/ffffff/octagon.png"
            />
          </base-button>
        </div>
      </li>
      <li class="item">
        <base-button class="item__button" @click="emitClearCanvasEvent"
          >Clear</base-button
        >
      </li>
      <li class="item">
        <base-button title="Save" class="item__button" @click="savePicture">
          <img
            alt="Save"
            src="https://img.icons8.com/windows/50/ffffff/save--v1.png"
          />
        </base-button>
      </li>
      <li class="item">
        <label for="lineWidth">Line width:</label>
        <input
          v-model.number="styleOptions.lineWidth"
          min="1"
          max="20"
          type="number"
          id="lineWidth"
        />
        <span>px.</span>
      </li>
      <li class="item">
        <label for="strokeColor">Color:</label>
        <input
          v-model="styleOptions.strokeColor"
          type="color"
          id="strokeColor"
        />
      </li>
      <li class="item">
        <label for="fill">Fill: </label>
        <input v-model="styleOptions.isShapeFilled" type="checkbox" id="fill" />
      </li>
      <li class="item">
        <label for="fillColor">Color:</label>
        <input
          :disabled="!styleOptions.isShapeFilled"
          v-model="styleOptions.fillColor"
          type="color"
          id="fillColor"
        />
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { PolygonConfiguration, DrawFunctionType } from "./paint-types";

export default defineComponent({
  emits: [
    "changeDrawFunction",
    "clearCanvas",
    "setStyleOptions",
    "savePicture",
  ],

  setup(_, { emit }) {
    const styleOptions = reactive({
      lineWidth: 1,
      strokeColor: "#000000",
      fillColor: "#000000",
      isShapeFilled: false,
    });
    const arePolygonsShown = ref<boolean>(false);
    const currentInstrument = ref<string>("");

    function togglePolygonsBlock() {
      arePolygonsShown.value = !arePolygonsShown.value;
    }

    function setDrawFunction(
      funcName: string,
      polygonParameters?: PolygonConfiguration
    ) {
      const drawFunction: DrawFunctionType = {
        funcName,
        polygonParameters,
      };
      emit("changeDrawFunction", drawFunction);
      arePolygonsShown.value = false;
    }

    function emitClearCanvasEvent() {
      emit("clearCanvas");
    }

    function savePicture() {
      emit("savePicture");
    }

    watch(styleOptions, (_, oldVal) => {
      emit("setStyleOptions", oldVal);
    });

    return {
      styleOptions,
      arePolygonsShown,
      currentInstrument,
      togglePolygonsBlock,
      setDrawFunction,
      emitClearCanvasEvent,
      savePicture,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.buttons {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5em;
  list-style: none;

  .item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__button {
      width: 50px;
      height: 50px;
      padding: 0;
      background: $light-background;

      &--active {
        background: $emphasizing;
      }
    }

    & input[type="number"] {
      border-bottom: 2px solid $emphasizing;
    }

    & > .polygons {
      position: absolute;
      top: 100%;
      z-index: 10;
      width: max-content;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      & > button {
        background: $light-background;
      }
    }
  }
}
</style>
