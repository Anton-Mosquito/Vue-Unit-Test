<template>
  <div>
    <p>Enter new value :</p>
    <input
      type="text"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <hr />
    By the way,
    <slot></slot>
    <hr />
    <slot name="warning"></slot>
  </div>
</template>

<script>
export default {
  name: "CounterInput",
  props: {
    value: {
      type: Number,
      required: true,
    },
    // otherValue: {
    //   type: Number,
    //   required: false,
    // },
  },
  // model: {
  //   prop: "value",
  //   event: "change",
  // },
};
</script>
