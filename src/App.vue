<template>
  <div id="app">
    <counter-input v-model="cnt"
      >Current value of cnt2 is {{ cnt2 }}
      <!-- <template #remark> STILL BETA</template> -->
      <template #remark>
        <slot name="warning"></slot>
      </template>
    </counter-input>
    <hr />
    {{ cnt }} / {{ cnt2 }}
    <button @click="cnt += 1">+</button>
    <button @click="cnt -= 1">-</button>
    <button data-test-id="reset" v-if="cnt < 0" @click="cnt = 0">
      Back to zero
    </button>
    <hr />
    <button @click="cnt2 += 1">inc2</button>
    <button @click="cnt2 -= 1">dec2</button>
  </div>
</template>

<script>
import CounterInput from "./components/CounterInput.vue";

export default {
  name: "App",
  components: {
    CounterInput,
  },
  props: {
    initialValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      cnt: 0,
      cnt2: 0,
    };
  },
  watch: {
    initialValue: {
      immediate: true,
      handler(newValue) {
        this.cnt = newValue;
      },
    },
    cnt() {
      this.$nextTick(() => {
        this.cnt2 = 0;
      });
    },
  },
  methods: {
    hendleKeyPress(e) {
      console.log(e);
      if (e.key === "-") {
        this.cnt -= 1;
      }
      if (e.key === "+") {
        this.cnt += 1;
      }
    },
  },
  mounted() {
    document.addEventListener("keyup", this.hendleKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.hendleKeyPress);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
