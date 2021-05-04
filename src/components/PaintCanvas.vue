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
    >
      Sorry, but your browser doesn't support canvas.
    </canvas>
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
import PaintControlls from "./PaintControlls.vue";

/* types */
import {
  Coordinates,
  StyleOptions,
  PolygonConfiguration,
  DrawFunctionType,
  Strategy,
} from "./paint-types";

/* utilities */
import { createDbRecord } from "../utils/createDbRecord";
import {
  calcRectangleSize,
  getRadiusBySize,
  isShape,
  getRelativeCursorPosition,
} from "../utils/paintHelpers";

/* Third-party libs */
import { useToast } from "vue-toastification";

export default defineComponent({
  components: {
    PaintControlls,
  },

  setup() {
    /* packages and libs */
    const store = useStore();
    const toast = useToast();

    /* related to canvas */
    const canvas = ref<HTMLCanvasElement | null>(null);
    let context: CanvasRenderingContext2D | null | undefined;
    let styleOptions: StyleOptions = {
      lineWidth: 1,
      strokeColor: "#000000",
      fillColor: "#000000",
      isShapeFilled: false,
    };
    const canvasState = ref<ImageData | null>(null);

    /* related to drawing */
    const isDrawing = ref(false);
    let drawFunction = reactive<DrawFunctionType>({
      funcName: "BrushStrategy",
    });
    let strategyContext: StrategyContext;
    let chosenStrategy: Strategy;

    /* mouse position */
    const currentCursorPosition = ref<Coordinates | null>(null);
    let initialCursorPosition: Coordinates | null | undefined = null;

    const pictureTitle = ref<string>("Untitled");

    /*  DRAWING */

    function drawStart(e: MouseEvent) {
      isDrawing.value = true;
      if (!context || !canvas.value) return;

      initialCursorPosition = getRelativeCursorPosition(
        e,
        canvas.value.offsetLeft,
        canvas.value.offsetTop
      );

      chosenStrategy = new strategies[
        (drawFunction.funcName as unknown) as keyof typeof strategies
      ]();
      strategyContext.setStrategy(chosenStrategy);

      context.strokeStyle = styleOptions.strokeColor;
      context.fillStyle = styleOptions.fillColor;
      context.lineWidth = styleOptions.lineWidth;
      context.lineCap = "round";

      saveCanvasState();
    }

    function draw(e: MouseEvent) {
      if (!canvas.value) return;

      currentCursorPosition.value = getRelativeCursorPosition(
        e,
        canvas.value.offsetLeft,
        canvas.value.offsetTop
      );
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
        strategyContext.executeStrategy();
      }
    }

    function drawEnd() {
      isDrawing.value = false;
    }

    /* STRATEGIES */

    class StrategyContext {
      private strategy: Strategy | undefined;

      constructor(strategy?: Strategy) {
        if (strategy) {
          this.strategy = strategy;
        }
      }

      public setStrategy(strategy: Strategy): StrategyContext {
        this.strategy = strategy;
        return this;
      }

      public executeStrategy() {
        this.strategy?.execute(
          currentCursorPosition.value,
          drawFunction.polygonParameters
        );
      }
    }

    class BrushStrategy implements Strategy {
      public execute(position: Coordinates | null) {
        if (!context || !initialCursorPosition || !position) return;

        context.beginPath();

        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);
        initialCursorPosition = position;

        context.stroke();
        context.closePath();
      }
    }

    class EraseStrategy implements Strategy {
      public execute() {
        if (!context) return;

        context.strokeStyle = "#ffffff";
        strategyContext.setStrategy(new BrushStrategy()).executeStrategy();
      }
    }

    class LineStrategy implements Strategy {
      public execute(position: Coordinates | null) {
        if (!context || !initialCursorPosition || !position) return;
        context.beginPath();

        context.moveTo(initialCursorPosition.x, initialCursorPosition.y);
        context.lineTo(position.x, position.y);

        context.stroke();
        context.closePath();
      }
    }

    class RectStrategy implements Strategy {
      public execute(position: Coordinates) {
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
      }
    }

    class CircleStrategy implements Strategy {
      public execute(position: Coordinates) {
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
      }
    }

    class RATriangleStrategy implements Strategy {
      public execute(position: Coordinates) {
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
      }
    }

    class PolygonStrategy implements Strategy {
      public execute(
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
      }
    }

    /* "strategies" object is needed for
      the possibility to dynamically
      access any strategy */

    const strategies = {
      BrushStrategy,
      EraseStrategy,
      LineStrategy,
      RectStrategy,
      CircleStrategy,
      RATriangleStrategy,
      PolygonStrategy,
    };

    /* Saves a snapshot of canvas
      in order to correctly display
      shapes when drawing */
    function saveCanvasState() {
      const canvasWidth = canvas.value?.width;
      const canvasHeight = canvas.value?.height;
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
      strategyContext = new StrategyContext();

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
    cursor: crosshair;
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
