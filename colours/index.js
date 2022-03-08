class ColourGame {
  #_colourInterval;
  #_currentColour = "";
  #_currentColourText = "";

  constructor(context) {
    this.fragment = document.createElement("div");
    this.fragment.className = "fragment";

    this.text = document.createElement("span");
    this.text.className = "text";

    this.score = document.createElement("span");
    this.score.className = "score";

    this.actions = document.createElement("div");
    this.actions.className = "actions";

    this.progress = document.createElement("progress");
    this.progress.max = 100;
    this.progress.value = 0;

    const onAction = (e) => {
      let number = this.keyCodes.indexOf(e.keyCode);

      if (number === -1) return;

      if (this.isCorrect(number)) {
        this.setScore(+this.score.innerText + 10);
        this.ding("sine", 1.5);
        return this.render();
      }

      this.setScore(+this.score.innerText - 10);
      this.ding("sawtooth", 0.08);
      this.render();
    };

    const choose = document.createDocumentFragment();
    this.colours.forEach((x, i) => {
      let num = i + 1;
      let picker = document.createElement("button");

      picker.style.backgroundColor = x;
      picker.innerText = num;

      picker.addEventListener("click", () =>
        onAction({ keyCode: this.keyCodes[num] })
      );

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
      this.progress.value = +this.progress.value + 1;
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
      (x) => x != this.#_currentColour && x != this.#_currentColourText
    );
    return colours[Math.floor(Math.random() * colours.length)];
  }

  setScore(num) {
    this.score.innerText = num;
  }

  render() {
    clearInterval(this.#_colourInterval);

    let color = this.randomColour;

    this.fragment.style.backgroundColor = color;
    this.#_currentColour = color;

    let text = this.randomColour;

    this.text.innerText = text;
    this.#_currentColourText = text;
    this.fragment.style.color = this.randomColour;

    this.progress.value = 0;

    this.#_colourInterval = setInterval(() => {
      this.setScore(+this.score.innerText - 10);
      this.render();
    }, 4000);
  }

  isCorrect(num) {
    return this.colours[num - 1] == this.#_currentColourText;
  }

  ding(type, speed) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    oscillator.type = type;

    oscillator.start(0);

    gain.connect(context.destination);
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + speed
    );
  }
}