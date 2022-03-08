class ColourGame {
  private colourInterval: any;
  private currentColour: string;
  private currentColourText: string;

  private fragment: HTMLElement;
  private text: HTMLElement;
  private score: HTMLElement;
  private actions: HTMLElement;
  private progress: HTMLElement;

  constructor(context: HTMLElement) {
    this.currentColour = "";
    this.currentColourText = "";

    this.fragment = document.createElement("div");
    this.fragment.className = "fragment";

    this.text = document.createElement("span");
    this.text.className = "text";

    this.score = document.createElement("span");
    this.score.className = "score";

    this.actions = document.createElement("div");
    this.actions.className = "actions";

    this.progress = document.createElement("progress");
    (<HTMLInputElement>this.progress).max = "100";
    (<HTMLInputElement>this.progress).value = "0";

    const onAction = (e: { keyCode: Number }) => {
      let number = this.keyCodes.indexOf(Number(e.keyCode));

      if (number === -1) return;

      if (this.isCorrect(number)) {
        this.setScore(+this.score.innerText + 10);
        this.ding("sine", 1.5);
        this.render();
      } else {
        this.setScore(+this.score.innerText - 10);
        this.ding("sawtooth", 0.08);
      }
    };

    const choose = document.createDocumentFragment();
    this.colours.forEach((x, i) => {
      let num = i + 1;
      let picker = document.createElement("button");

      picker.style.backgroundColor = x;
      picker.innerText = String(num);

      picker.addEventListener("click", () => {
        onAction({ keyCode: Number(this.keyCodes[num]) });
      });

      choose.appendChild(picker);
    });

    window.addEventListener("keyup", onAction);

    this.actions.appendChild(choose);

    this.render();

    this.fragment.appendChild(this.progress);
    this.fragment.appendChild(this.text);

    context.appendChild(this.score);
    context.appendChild(this.fragment);
    context.appendChild(this.actions);

    setInterval(() => {
      (<HTMLInputElement>this.progress).value = String(
        +(<HTMLInputElement>this.progress).value + 1
      );
    }, 40);
  }

  get keyCodes() {
    return [null, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  }

  get colours() {
    return ["red", "orange", "yellow", "green", "blue", "purple", "pink"];
  }

  get randomColour() {
    let colours = this.colours.filter(
      (x) => x != this.currentColour && x != this.currentColourText
    );
    return colours[Math.floor(Math.random() * colours.length)];
  }

  setScore(num: Number) {
    this.score.innerText = String(num);
  }

  render() {
    clearInterval(this.colourInterval);

    let color = this.randomColour;

    this.fragment.style.backgroundColor = color;
    this.currentColour = color;

    let text = this.randomColour;

    this.text.innerText = text;
    this.currentColourText = text;
    this.fragment.style.color = this.randomColour;

    (<HTMLInputElement>this.progress).value = String(0);

    this.colourInterval = setInterval(() => this.render(), 4000);
  }

  isCorrect(num: Number) {
    return this.colours[+num - 1] == this.currentColourText;
  }

  ding(type: OscillatorType, speed: Number) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    oscillator.type = type;

    oscillator.start(0);

    gain.connect(context.destination);
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + +speed
    );
  }
}