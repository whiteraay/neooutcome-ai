export interface ReviewTaskInput {
  patientId: string
  priority: string
  note: string
  riskScore: number
}

export interface ReviewTask extends ReviewTaskInput {
  ticketId: string
  createdAt: string
}

/**
 * Stub for the hypothetical backend task queue. In production this would POST to
 * a review-queue service; here it simulates network latency and returns a ticket.
 */
export async function enqueueReviewTask(
  input: ReviewTaskInput,
): Promise<ReviewTask> {
  await new Promise((resolve) => setTimeout(resolve, 650))
  const ticketId = Math.random().toString(36).slice(2, 7).toUpperCase()
  return { ...input, ticketId, createdAt: new Date().toISOString() }
}
