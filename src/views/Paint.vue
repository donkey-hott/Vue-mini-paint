<template>
  <section class="workspace">
    <input
      type="text"
      placeholder="Enter title..."
      class="workspace__title"
      v-model="pictureTitle"
    />
    <paint-controlls
      class="workspace__controlls"
      @changeDrawFunction="setDrawFunction"
      @clearCanvas="clearCanvas"
      @setStyleOptions="setStyleOptions"
      @savePicture="savePicture"
    ></paint-controlls>
    <canvas
      width="600"
      height="500"
      class="workspace__canvas"
      id="canvas"
      ref="canvas"
      @mousedown="drawStart($event)"
      @mousemove="draw($event)"
      @mouseup="drawEnd($event)"
    ></canvas>
    <div class="workspace__coordinates">
      <span>x: {{ currentCursorPosition?.x }}</span>
      <span>y: {{ currentCursorPosition?.y }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";

/* store */
import { useStore } from "../store";
import { ActionTypes } from "@/store/actions/action-types";

/* components */
import PaintControlls from "../components/PaintControlls.vue";

/* types */
import {
  Coordinates,
  StyleOptions,
  PolygonConfiguration,
  DrawFunctionType,
  DrawFunctionsInterface,
} from "./paint-types";

/* utilities */
import { createDbRecord } from "../utils/createDbRecord";
import {
  calcRectangleSize,
  getRadiusBySize,
  isShape,
} from "../utils/paintHelpers";
/* Third-party libs */
import { useToast } from "vue-toastification";

export default defineComponent({
  components: {
    PaintControlls,
  },

  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let context: CanvasRenderingContext2D | null | undefined;

    const isDrawing = ref(false);
    let drawFunction = reactive<DrawFunctionType>({ funcName: "brush" });
    let styleOptions: StyleOptions = {
      lineWidth: 1,
      strokeColor: "#000000",
      fillColor: "#000000",
      isShapeFilled: false,
    };
    const pictureTitle = ref<string>("Untitled");
    const canvasState = ref<ImageData | null>(null);

    const currentCursorPosition = ref<Coordinates | null | undefined>(null);
    let initialCursorPosition: Coordinates | null | undefined = null;

    const store = useStore();
    const toast = useToast();

    function getCursorPosition(e: MouseEvent): Coordinates | undefined {
      if (!canvas.value) return;

      const x = e.pageX - canvas.value.offsetLeft;
      const y = e.pageY - canvas.value.offsetTop;
      return { x, y };
    }

    /* Saves a snapshot of canvas
      in order to correctly display
      shapes when drawing */
    function saveCanvasState() {
      let canvasWidth = canvas.value?.width;
      let canvasHeight = canvas.value?.height;
      if (!canvasWidth || !canvasHeight || !context) return;

      canvasState.value = context.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    /* Brings canvas back to the state
    that was before the "draw" function
    was fired */
    function restoreCanvasState() {
      if (!canvasState.value || !context) return;

      context.putImageData(canvasState.value, 0, 0);
    }

    // ==== PAINT CONTROLLS HANDLERS ====

    function setDrawFunction(drawFunctionObj: DrawFunctionType) {
      drawFunction = drawFunctionObj;
    }

    function clearCanvas() {
      if (!context || !canvas.value) return;

      context.clearRect(0, 0, canvas.value.width, canvas.value.height);
    }

    function setStyleOptions(styleObj: StyleOptions) {
      styleOptions = styleObj;
    }

    async function savePicture() {
      const imgURL = canvas.value?.toDataURL();
      const dbRecord = createDbRecord(imgURL, pictureTitle.value);

      try {
        await store.dispatch(ActionTypes.SAVE_PICTURE, dbRecord);
        toast.success("Picture has been saved!");
      } catch (error) {
        toast.error(`Cannot save picture:`, error.message);
      }
    }

    // ==== DRAWING ====

    function drawStart(e: MouseEvent) {
      isDrawing.value = true;
      initialCursorPosition = getCursorPosition(e);
      if (!context) return;

      context.strokeStyle = styleOptions.strokeColor;
      context.fillStyle = styleOptions.fillColor;
      context.lineWidth = styleOptions.lineWidth;
      context.lineCap = "round";

      saveCanvasState();
    }

    function draw(e: MouseEvent) {
      currentCursorPosition.value = getCursorPosition(e);
      if (isDrawing.value) {
        /* Brush functions are based on multiple
        repetitions of small fragments, so we
        don't have to restore canvas's state
        every time in this case. */
        if (isShape(drawFunction.funcName)) {
          restoreCanvasState();
        }

        /* Parameters for polygons are passed
        to all draw functions for convenience.
        Draw function is selected dynamically 
        from the object below. */
        return drawFunctions[
          drawFunction.funcName as keyof typeof drawFunctions
        ](
          currentCursorPosition.value as Coordinates,
          drawFunction.polygonParameters as PolygonConfiguration
        );
      }
    }

    function drawEnd() {
      isDrawing.value = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawFunctions: DrawFunctionsInterface = {
      brush(position: Coordinates | null) {
        if (!context || !initialCursorPosition || !position) return;
        context.beginPath();

        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);
        initialCursorPosition = position;

        context.stroke();
        context.closePath();
      },

      erase(position: Coordinates | null) {
        if (!context) return;
        /* Save context's state so that chosen
        stroke color is not overwritten by white. */
        context.save();

        context.strokeStyle = "#ffffff";
        this.brush(position);

        context.restore();
      },

      drawLine(position: Coordinates | null) {
        if (!context || !initialCursorPosition || !position) return;
        context.beginPath();

        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);

        context.stroke();
        context.closePath();
      },

      drawRect(position: Coordinates | null) {
        if (!context || !position || !initialCursorPosition) return;

        const { width, height } = calcRectangleSize(
          position,
          initialCursorPosition
        );

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
        if (!context || !position || !initialCursorPosition) return;

        const { width, height } = calcRectangleSize(
          position,
          initialCursorPosition
        );
        const radius = getRadiusBySize(width, height);

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
      /* RA stands for "right-angled" */
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
        if (!context || !position || !initialCursorPosition) return;

        const { width, height } = calcRectangleSize(
          position,
          initialCursorPosition
        );
        let { sides, angle } = polygonConfiguration;
        const radius = getRadiusBySize(width, height);
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
    };

/*  Look up the size the canvas is being displayed
    If it's resolution does not match change it */
    function resizeCanvasToDisplaySize() {
      if (!canvas.value) return;
      const width = canvas.value.clientWidth;
      const height = canvas.value.clientHeight;

      if (canvas.value.width !== width || canvas.value.height !== height) {
        canvas.value.width = width;
        canvas.value.height = height;
      }
    }

    onMounted(() => {
      context = canvas.value?.getContext("2d") || null || undefined;
      window.addEventListener("resize", resizeCanvasToDisplaySize);
      resizeCanvasToDisplaySize();
    });
    return {
      setDrawFunction,
      clearCanvas,
      setStyleOptions,
      savePicture,
      drawStart,
      draw,
      drawEnd,
      pictureTitle,
      currentCursorPosition,
      canvas,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/colors.scss";

.workspace {
  display: grid;
  grid-template-areas:
    "title ."
    "controlls canvas"
    "controlls coordinates";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 30% auto;
  justify-items: center;
  background: inherit;

  &__title {
    grid-area: title;
    border-bottom: 2px solid $emphasizing;
    margin-bottom: 0.5em;
  }

  &__controlls {
    grid-area: controlls;

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

  &__canvas {
    background: #fff !important;
    border: 1px solid #000;
    grid-area: canvas;
    width: 500px;
    height: 400px;
  }

  &__coordinates {
    grid-area: coordinates;
    & span:first-child {
      margin-right: 0.3em;
    }
  }
}

@media (min-width: 1024px) {
  .workspace__canvas {
    width: 600px;
    height: 500px;
  }
}
</style>
