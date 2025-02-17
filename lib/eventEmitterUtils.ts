
export function safelyIncreaseMaxListeners(emitter: any, count: number = 15) {
  if (typeof emitter.setMaxListeners === 'function') {
    const currentMax = emitter.getMaxListeners ? emitter.getMaxListeners() : 10
    if (currentMax <= 10) {
      emitter.setMaxListeners(count)
    }
  }
}

