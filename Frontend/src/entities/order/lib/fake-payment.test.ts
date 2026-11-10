import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createDemoOrderId,
  scheduleFakePaymentComplete,
} from './fake-payment'

describe('fake payment', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates order ids with HAN prefix', () => {
    expect(createDemoOrderId()).toMatch(/^HAN-/)
  })

  it('completes after delay unless canceled', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    const cancel = scheduleFakePaymentComplete(onComplete, 1000)
    vi.advanceTimersByTime(999)
    expect(onComplete).not.toHaveBeenCalled()
    cancel()
    vi.advanceTimersByTime(10)
    expect(onComplete).not.toHaveBeenCalled()
  })
})
