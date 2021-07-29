import App from "@/App.vue";
import CounterInput from "../../src/components/CounterInput.vue";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";

const CounterInputStub = {
  template: '<div><slot></slot><slot name="warning"></slot></div>',
  props: CounterInput.props,
  model: CounterInput.model,
  // ? Vue 3
  // ? emits: CounterInput.emits,
  $_vueTestUtils_original: CounterInput,
};
/**
 *  ! node --inspect-brk node_modules/.bin/jest - use with debugger
 */

describe("Counter", () => {
  let wrapper;

  const findButtonByText = (text) =>
    wrapper.findAll("button").wrappers.find((w) => w.text() === text);

  // find... --> wrapper | undefined
  // Empty wrapper.exist() --> false
  // expect(findButtonByText("foo").exist());

  const createComponent = (props) => {
    wrapper = shallowMount(App, {
      //   attachTo: document.body, // attachToDocument Тип: boolean Компонент будет прикрепляться к DOM при рендеринге, если установлено в true. Если компонент прикреплен к DOM, вы должны вызвать wrapper.destroy() в конце вашего теста для того, чтобы удалить отрисованные элементы из документа и удалить экземпляр компонента.
      // attachToDocument: true // * for old test version
      propsData: props, //* props
      stubs: {
        // CounterInput: true // эта опция включена, когда mount и мы хотим что бы не рендерился CounterInput
        // CounterInput: false // эта опция отключена, когда shallowMount и мы хотим что бы не рендерился  настоящий CounterInput
        CounterInput: CounterInputStub,
      },
      slots: {
        warning: "BETA",
      },
    });
  };

  //   afterEach(() => {
  //     wrapper.destroy();
  //     //wrapper = null;
  //   });

  it("shows 0 when initialized", () => {
    // ? Arrange
    createComponent();

    // ? Asserts
    expect(wrapper.text()).toContain("0");
  });

  it.each`
    buttonText | change                 | expectedResult
    ${"+"}     | ${"increments by one"} | ${"1"}
    ${"-"}     | ${"decrements by one"} | ${"-1"}
  `(
    "$change when $buttonText button clicked",
    async ({ buttonText, expectedResult }) => {
      createComponent();

      // ! await findPlusButton().trigger("click");    // the same as await nextTick();
      // ! await wrapper.vm.$nextTick();               // the same as await nextTick();
      await findButtonByText(buttonText).trigger("click");
      await nextTick();

      expect(wrapper.text()).toContain(expectedResult);
    }
  );

  const BACK_TO_0_TEXT = "Back to zero";
  it("show reset button when counter below zero", async () => {
    // Arrange
    createComponent();
    await findButtonByText("-").trigger("click");
    expect(wrapper.text()).toContain("-1");

    //console.log(wrapper.html());
    //debugger;

    expect(findButtonByText(BACK_TO_0_TEXT).exists()).toBe(true);
  });

  it("does not show reset button when counter is not below zero", async () => {
    createComponent();

    // negative checking
    expect(findButtonByText(BACK_TO_0_TEXT)).toBe(undefined);
  });

  it("increases bu one whe plus key is pressed", async () => {
    createComponent();

    const event = new KeyboardEvent("keyup", {
      key: "+",
    });

    document.dispatchEvent(event);

    await nextTick();

    expect(wrapper.text()).toContain("1");
  });

  it("remove attached event listener when destroyed", async () => {
    // const originalAddEventListener = document.addEventListener;
    // document.addEventListener = jest
    //   .fn()
    //   .mockImplementation((...args) =>
    //     originalAddEventListener.call(document, ...args)
    //   );
    // ! .prototype. //

    jest.spyOn(document, "addEventListener");
    jest.spyOn(document, "removeEventListener");
    createComponent();

    const [, keyUpListener] = document.addEventListener.mock.calls.find(
      ([key]) => key === "keyup"
    );

    expect(document.removeEventListener).not.toHaveBeenCalledWith(
      "keyup",
      keyUpListener
    );

    wrapper.destroy();

    expect(document.removeEventListener).toHaveBeenCalledWith(
      "keyup",
      keyUpListener
    );
  });

  /**
   * @param analog upper two tests
   */
  //   it.each`
  //     button | press               | expectedResult
  //     ${"+"} | ${"press butt +"}   | ${"1"}
  //     ${"-"} | ${"press button -"} | ${"-1"}
  //   `(
  //     "press $button expect expectedResult",
  //     async ({ button, expectedResult }) => {
  //       createComponent();

  //       const event = new KeyboardEvent("keyup", {
  //         key: button,
  //       });

  //       document.dispatchEvent(event);

  //       await nextTick();

  //       expect(wrapper.text()).toContain(expectedResult);
  //     }
  //   );

  // ! Test for props
  it("correctly initializes when initial value is passed", () => {
    const INITIAL_VALUE = 5;

    createComponent({ initialValue: INITIAL_VALUE });

    expect(wrapper.text()).toContain(INITIAL_VALUE);
  });

  it("correctly resets when initial value is changed", async () => {
    const INITIAL_VALUE = 5;
    const NEW_INITIAL_VALUE = 10;

    createComponent({ initialValue: INITIAL_VALUE });
    await findButtonByText("-").trigger("click");

    await wrapper.setProps({ initialValue: NEW_INITIAL_VALUE });

    expect(wrapper.text()).toContain(NEW_INITIAL_VALUE);
  });

  // ! Test watch ctn2
  it("correctly resets both counters when initialValue is changed", async () => {
    const INITIAL_VALUE = 5;
    const NEW_INITIAL_VALUE = 10;

    createComponent({ initialValue: INITIAL_VALUE });
    await findButtonByText("-").trigger("click");
    await findButtonByText("dec2").trigger("click");
    expect(wrapper.text()).toContain(`${INITIAL_VALUE - 1} / -1`);

    await wrapper.setProps({ initialValue: NEW_INITIAL_VALUE });
    await nextTick();

    expect(wrapper.text()).toContain(`${NEW_INITIAL_VALUE} / 0`);
  });

  // ! Test props for children
  it("passes current value to CounterInput", () => {
    const INITIAL_VALUE = 30;
    createComponent({ initialValue: INITIAL_VALUE });

    expect(wrapper.findComponent(CounterInput).props().value).toBe(
      INITIAL_VALUE
    );
  });

  it("updates current value to CounterInput provides new one", async () => {
    const INITIAL_VALUE = 30;
    const NEW_INITIAL_VALUE = 40;
    createComponent({ initialValue: INITIAL_VALUE });

    wrapper
      .findComponent(CounterInput)
      .vm.$emit(CounterInput.model?.event ?? "input", NEW_INITIAL_VALUE);
    await nextTick();

    expect(wrapper.text()).toContain(`${NEW_INITIAL_VALUE} / 0`);
  });

  // ! Test slots
  it("passes second value to CounterInput", async () => {
    createComponent();
    await findButtonByText("inc2").trigger("click");

    expect(wrapper.findComponent(CounterInput).text()).toContain("1");
  });

  it("passes BETA to CounterInput warning slot", async () => {
    createComponent();

    expect(wrapper.findComponent(CounterInput).text()).toContain("BETA");
  });
});
