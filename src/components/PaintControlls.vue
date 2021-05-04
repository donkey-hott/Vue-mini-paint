<template>
  <aside class="controls">
    <ul class="buttons">
      <li
        v-for="(mainInstrument, idx) in mainInstruments"
        :key="idx"
        class="item"
      >
        <base-button
          class="item__button"
          :class="{
            'item__button--active': mainInstrument.title === currentInstrument,
          }"
          :title="mainInstrument.title"
          @click="
            setDrawFunction(
              mainInstrument.funcName,
              mainInstrument.polygonParams
            ),
              (currentInstrument = mainInstrument.title)
          "
        >
          <img :alt="mainInstrument.title" :src="mainInstrument.iconLink" />
        </base-button>
      </li>
      <li class="item">
        <base-button
          title="More shapes"
          class="item__button"
          @click="toggleAdditionalShapesBlock"
        >
          ...
        </base-button>
        <div class="polygons" v-show="arePolygonsShown">
          <base-button
            v-for="(additInstrument, idx) in additionalInstruments"
            :key="idx"
            :title="additInstrument.title"
            class="item__button"
            :class="{
              'item__button--active':
                currentInstrument === additInstrument.title,
            }"
            @click="
              setDrawFunction(
                additInstrument.funcName,
                additInstrument.polygonParams
              );
              currentInstrument = additInstrument.title;
            "
          >
            <img :alt="additInstrument.title" :src="additInstrument.iconLink" />
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
    const mainInstruments = [
      {
        title: "Pencil",
        funcName: "PencilStrategy",
        iconLink: "https://img.icons8.com/windows/50/ffffff/pencil.png",
      },
      {
        title: "Eraser",
        funcName: "EraseStrategy",
        iconLink: "https://img.icons8.com/windows/50/ffffff/eraser.png",
      },
      {
        title: "Line",
        funcName: "LineStrategy",
        iconLink: "https://img.icons8.com/windows/50/ffffff/line.png",
      },
      {
        title: "Rectangle",
        funcName: "RectStrategy",
        iconLink:
          "https://img.icons8.com/windows/50/ffffff/rectangle-stroked.png",
      },
      {
        title: "Circle",
        funcName: "CircleStrategy",
        iconLink: "https://img.icons8.com/windows/50/ffffff/circled--v1.png",
      },
      {
        title: "Square",
        funcName: "PolygonStrategy",
        polygonParams: {
          sides: 4,
          angle: Math.PI / 4,
        },
        iconLink: "https://img.icons8.com/windows/50/ffffff/rounded-square.png",
      },
      {
        title: "Isosceles triangle",
        funcName: "PolygonStrategy",
        polygonParams: {
          sides: 3,
          angle: Math.PI / 2,
        },
        iconLink:
          "https://img.icons8.com/windows/50/ffffff/triangle-stroked.png",
      },
    ];

    const additionalInstruments = [
      {
        title: "Right-angled triangle",
        funcName: "RATriangleStrategy",
        iconLink: "https://img.icons8.com/windows/50/ffffff/trigonometry.png",
      },
      {
        title: "Pentagon",
        funcName: "PolygonStrategy",
        polygonParams: {
          sides: 5,
          angle: Math.PI / 2,
        },
        iconLink: "https://img.icons8.com/windows/50/ffffff/pentagon.png",
      },
      {
        title: "Hexagon",
        funcName: "PolygonStrategy",
        polygonParams: {
          sides: 6,
          angle: Math.PI / 3,
        },
        iconLink: "https://img.icons8.com/windows/50/ffffff/hexagon.png",
      },
      {
        title: "Octagon",
        funcName: "PolygonStrategy",
        polygonParams: {
          sides: 8,
          angle: Math.PI / 8,
        },
        iconLink: "https://img.icons8.com/windows/50/ffffff/octagon.png",
      },
    ];

    function toggleAdditionalShapesBlock() {
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
      mainInstruments,
      additionalInstruments,
      toggleAdditionalShapesBlock,
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
