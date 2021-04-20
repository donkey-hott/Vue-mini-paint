<template>
  <section class="desktop">
    <paint-controlls
      @changeDrawFunction="setDrawFunction"
      @clearCanvas="clearCanvas"
      @setStyleOptions="setStyleOptions"
      @savePicture="savePicture"
    ></paint-controlls>
    <canvas
      width="600"
      height="500"
      class="desktop__canvas"
      id="canvas"
      ref="canvas"
      @mousedown="drawStart($event)"
      @mousemove="draw($event)"
      @mouseup="drawEnd($event)"
    ></canvas>
    <div class="coordinates">
      <span>x: {{ currentCursorPosition?.x }}</span>
      <span>y: {{ currentCursorPosition?.y }}</span>
    </div>
  </section>
</template>

<script lang="ts">
// types

type Coordinates = {
  x: number;
  y: number;
};

type StyleOptions = {
  lineWidth: number;
  strokeColor: string;
  fillColor: string;
  isShapeFilled: boolean;
};

export type PolygonConfiguration = {
  sides: number;
  angle: number;
};

export type DrawFunctionType = {
  funcName: string;
  polygonParameters?: PolygonConfiguration;
};

import { defineComponent, ref, reactive, onMounted } from "vue";
import { useStore } from "../store";
import PaintControlls from "../components/PaintControlls.vue";
import { ActionTypes } from "@/store/actions/action-types";

export default defineComponent({
  components: {
    PaintControlls,
  },
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let context: CanvasRenderingContext2D | null | undefined;

    const isDrawing = ref(false);
    let drawFunction = reactive<DrawFunctionType>({ funcName: "drawLine" });
    let styleOptions: StyleOptions = {
      lineWidth: 1,
      strokeColor: "#000000",
      fillColor: "#000000",
      isShapeFilled: false,
    };
    const canvasState = ref<ImageData | null>(null);

    const currentCursorPosition = ref<Coordinates | null>(null);
    let initialCursorPosition: Coordinates | null = null;

    const store = useStore();

    function getCursorPosition(e: MouseEvent): Coordinates | null {
      const x = canvas?.value?.offsetLeft
        ? e.pageX - canvas.value.offsetLeft
        : 0;
      const y = canvas?.value?.offsetTop ? e.pageY - canvas.value.offsetTop : 0;
      return { x, y } || null;
    }

    function saveCanvasState() {
      let canvasWidth = canvas.value?.width;
      let canvasHeight = canvas.value?.height;
      canvasState.value =
        context?.getImageData(0, 0, canvasWidth || 0, canvasHeight || 0) ||
        null;
    }

    function restoreCanvasState() {
      if (!canvasState.value || !context) return;
      context.putImageData(canvasState.value, 0, 0);
    }

    // ==== PAINT CONTROLLS HANDLERS ====

    function setDrawFunction(drawFunctionObj: DrawFunctionType) {
      drawFunction = drawFunctionObj;
    }

    function clearCanvas() {
      context?.clearRect(
        0,
        0,
        canvas.value?.width || 0,
        canvas.value?.height || 0
      );
    }

    function setStyleOptions(styleObj: StyleOptions) {
      styleOptions = styleObj;
    }

    function savePicture() {
      const dataURL = canvas.value?.toDataURL();
      store.dispatch(ActionTypes.SAVE_PICTURE, dataURL);
    }

    // ==== DRAWING ====

    function drawStart(e: MouseEvent) {
      // console.log(context);
      isDrawing.value = true;
      initialCursorPosition = getCursorPosition(e);
      if (!context) return;

      context.strokeStyle = styleOptions.strokeColor;
      context.fillStyle = styleOptions.fillColor;
      context.lineWidth = styleOptions.lineWidth;

      saveCanvasState();
    }

    function draw(e: MouseEvent) {
      currentCursorPosition.value = getCursorPosition(e);
      if (isDrawing.value) {
        restoreCanvasState();
        // if polygonal shape was chosen
        if (drawFunction.polygonParameters) {
          drawFunctions[drawFunction.funcName](
            currentCursorPosition.value,
            drawFunction.polygonParameters
          );
        } else {
          drawFunctions[drawFunction.funcName](currentCursorPosition.value);
        }
      }
    }

    function drawEnd() {
      isDrawing.value = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawFunctions: { [funcName: string]: any } = {
      drawLine(position: Coordinates | null) {
        if (!context || !initialCursorPosition || !position) return;
        context.beginPath();

        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);

        context.stroke();
        context.closePath();
      },

      drawRect(position: Coordinates | null) {
        const { width, height } = this.calcSize(position);
        if (!context || !initialCursorPosition) return;
        context.beginPath();
        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.rect(
          initialCursorPosition.x,
          initialCursorPosition.y,
          width,
          height
        );
        if (styleOptions.isShapeFilled) {
          context.fill();
        }
        context.stroke();
        context.closePath();
      },

      drawCircle(position: Coordinates) {
        if (!context || !initialCursorPosition) return;

        const { width, height } = this.calcSize(position);
        const radius = this.getRadiusBySize(width, height);

        context.beginPath();
        context.arc(
          initialCursorPosition.x,
          initialCursorPosition.y,
          radius,
          0,
          2 * Math.PI,
          true
        );
        if (styleOptions.isShapeFilled) {
          context.fill();
        }
        context.stroke();
        context.closePath();
      },
      // RA stands for "right-angled"
      drawRATriangle(position: Coordinates) {
        if (!context || !initialCursorPosition) return;

        context.beginPath();
        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);

        context.lineTo(initialCursorPosition.x, position.y);
        context.lineTo(initialCursorPosition.x, initialCursorPosition.y);

        if (styleOptions.isShapeFilled) {
          context.fill();
        }
        context.stroke();
        context.closePath();
      },

      // ==== POLYGONS ====

      drawPolygon(
        position: Coordinates,
        polygonConfiguration: PolygonConfiguration
      ) {
        if (!context || !initialCursorPosition) return;
        const { width, height } = this.calcSize(position);
        let { sides, angle } = polygonConfiguration;
        const radius = this.getRadiusBySize(width, height);
        const coordinatesArray = [];

        for (let i = 0; i <= sides; i += 1) {
          const coordinatesRecord = {
            x: initialCursorPosition.x + radius * Math.cos(angle),
            y: initialCursorPosition.y - radius * Math.sin(angle),
          };
          coordinatesArray.push(coordinatesRecord);
          angle += (2 * Math.PI) / sides;
        }

        context.beginPath();
        context.moveTo(coordinatesArray[0].x, coordinatesArray[0].y);
        for (let i = 1; i <= sides; i += 1) {
          context.lineTo(coordinatesArray[i].x, coordinatesArray[i].y);
        }
        if (styleOptions.isShapeFilled) {
          context.fill();
        }
        context.stroke();
        context.closePath();
      },

      calcSize(position: Coordinates) {
        if (!initialCursorPosition) return;

        const width = position.x - initialCursorPosition.x;
        const height = position.y - initialCursorPosition.y;
        return { width, height };
      },

      // According to the Pythagorean theorem
      getRadiusBySize(width: number, height: number) {
        return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      },
    };

    onMounted(() => {
      context = canvas.value?.getContext("2d") || null || undefined;
    });
    return {
      setDrawFunction,
      clearCanvas,
      setStyleOptions,
      savePicture,
      drawStart,
      draw,
      drawEnd,
      currentCursorPosition,
      canvas,
    };
  },
});
</script>

<style lang="scss" scoped>
.desktop {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__canvas {
    // width: 600px;
    // height: 500px;
    border: 1px solid #000;
  }

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
}
</style>
