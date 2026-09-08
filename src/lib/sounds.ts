"use client"

type SoundPlayer = (ctx: AudioContext, destination: AudioNode, startAt: number) => void

const softMeow: SoundPlayer = (ctx, destination, startAt) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, startAt)
  master.gain.exponentialRampToValueAtTime(0.16, startAt + 0.02)
  master.gain.setValueAtTime(0.16, startAt + 0.18)
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.62)
  master.connect(destination)

  const vibrato = ctx.createOscillator()
  vibrato.frequency.value = 5.5
  const vibratoDepth = ctx.createGain()
  vibratoDepth.gain.value = 14
  vibrato.connect(vibratoDepth)

  const playVoice = (type: OscillatorType, freq: number, gain: number) => {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, startAt)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.65, startAt + 0.13)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.82, startAt + 0.58)
    vibratoDepth.connect(osc.frequency)

    const oscGain = ctx.createGain()
    oscGain.gain.value = gain
    osc.connect(oscGain)
    oscGain.connect(master)

    osc.start(startAt)
    osc.stop(startAt + 0.62)
  }

  vibrato.start(startAt)
  vibrato.stop(startAt + 0.62)

  playVoice("sine", 560, 1)
  playVoice("triangle", 1120, 0.35)
}

const highMeow: SoundPlayer = (ctx, destination, startAt) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, startAt)
  master.gain.exponentialRampToValueAtTime(0.13, startAt + 0.015)
  master.gain.setValueAtTime(0.13, startAt + 0.14)
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.48)
  master.connect(destination)

  const playVoice = (type: OscillatorType, freq: number, gain: number) => {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, startAt)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.9, startAt + 0.1)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startAt + 0.44)
    const oscGain = ctx.createGain()
    oscGain.gain.value = gain
    osc.connect(oscGain)
    oscGain.connect(master)
    osc.start(startAt)
    osc.stop(startAt + 0.48)
  }

  playVoice("sine", 720, 1)
  playVoice("sine", 2160, 0.18)
}

const purr: SoundPlayer = (ctx, destination, startAt) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, startAt)
  master.gain.exponentialRampToValueAtTime(0.05, startAt + 0.05)
  master.gain.setValueAtTime(0.05, startAt + 0.85)
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.05)
  master.connect(destination)

  const pulse = ctx.createOscillator()
  pulse.type = "triangle"
  pulse.frequency.value = 26
  const pulseGain = ctx.createGain()
  pulseGain.gain.value = 0.7
  pulse.connect(pulseGain)
  pulseGain.connect(master)
  pulse.start(startAt)
  pulse.stop(startAt + 1.05)
}

const lampClick: SoundPlayer = (ctx, destination, startAt) => {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, startAt)
  master.gain.exponentialRampToValueAtTime(0.6, startAt + 0.004)
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.045)
  master.connect(destination)

  const bufferSize = Math.floor(ctx.sampleRate * 0.045)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    const t = 1 - i / bufferSize
    data[i] = (Math.random() * 2 - 1) * t * t
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 2600
  filter.Q.value = 1.4
  noise.connect(filter)
  filter.connect(master)
  noise.start(startAt)
}

const lampHum = (
  ctx: AudioContext,
  destination: AudioNode,
  startAt: number,
  from: number,
  to: number
) => {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.07, startAt + 0.06)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.38)
  gain.connect(destination)

  const osc = ctx.createOscillator()
  osc.type = "sine"
  osc.frequency.setValueAtTime(from, startAt)
  osc.frequency.exponentialRampToValueAtTime(to, startAt + 0.3)
  osc.connect(gain)
  osc.start(startAt)
  osc.stop(startAt + 0.38)
}

const lampOn: SoundPlayer = (ctx, destination, startAt) => {
  lampClick(ctx, destination, startAt)
  lampHum(ctx, destination, startAt + 0.03, 100, 140)
}

const lampOff: SoundPlayer = (ctx, destination, startAt) => {
  lampClick(ctx, destination, startAt)
  lampHum(ctx, destination, startAt + 0.03, 140, 70)
}

export const CAT_SOUNDS = {
  meow: softMeow,
  meowHigh: highMeow,
  purr,
} as const

export const SOUNDS = {
  ...CAT_SOUNDS,
  lampOn,
  lampOff,
} as const

export type SoundName = keyof typeof SOUNDS
export type CatSoundName = keyof typeof CAT_SOUNDS

let sharedContext: AudioContext | null = null

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return null
  sharedContext ??= new AudioContextCtor()
  return sharedContext
}

export const playSound = (name: SoundName) => {
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === "suspended") void ctx.resume()
  SOUNDS[name](ctx, ctx.destination, ctx.currentTime)
}

export const playRandomCuteSound = () => {
  const names = Object.keys(CAT_SOUNDS) as CatSoundName[]
  playSound(names[Math.floor(Math.random() * names.length)])
}