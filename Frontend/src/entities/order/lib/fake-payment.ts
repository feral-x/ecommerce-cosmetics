export const FAKE_PAYMENT_COMPLETE_MS = 2_800

export function createDemoOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-7)
  return `HAN-${stamp}`
}

/** Запускает таймер «банка»; возвращает отмену (canceled). */
export function scheduleFakePaymentComplete(
  onComplete: () => void,
  delayMs = FAKE_PAYMENT_COMPLETE_MS,
) {
  const timerId = window.setTimeout(onComplete, delayMs)
  return () => window.clearTimeout(timerId)
}
