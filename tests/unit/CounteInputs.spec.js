import CounterInput from "../../src/components/CounterInput.vue";
import { shallowMount } from "@vue/test-utils";

describe("Counter Input Component", () => {
  it("emits input event when input value changes", () => {
    const wrapper = shallowMount(CounterInput);
    const NEW_VALUE = "34;";

    wrapper.find("input").setValue(NEW_VALUE);

    expect(
      wrapper.emitted()[CounterInput.model?.event ?? "input"]
    ).toStrictEqual([[NEW_VALUE]]);
  });
});
