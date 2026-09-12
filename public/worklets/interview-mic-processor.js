class InterviewMicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.muted = false;
    this.port.onmessage = (event) => {
      if (event.data?.type === "mute") {
        this.muted = Boolean(event.data.muted);
      }
    };
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) {
      return true;
    }

    let peak = 0;
    for (let index = 0; index < channel.length; index += 1) {
      peak = Math.max(peak, Math.abs(channel[index]));
    }

    this.port.postMessage({ type: "level", level: this.muted ? 0 : peak });

    if (!this.muted) {
      this.port.postMessage({ type: "pcm", pcm: new Float32Array(channel) });
    }

    return true;
  }
}

registerProcessor("interview-mic-processor", InterviewMicProcessor);
