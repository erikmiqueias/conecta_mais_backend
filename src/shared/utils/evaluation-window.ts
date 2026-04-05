export type EvaluationStatusError = "TOO_EARLY" | "TOO_LATE" | null;

interface EvaluationWindowResult {
  isOpen: boolean;
  errorCode: EvaluationStatusError;
  message?: string;
}

export function checkEvaluationWindow(
  endDateTime: Date,
): EvaluationWindowResult {
  const now = new Date();

  const evaluationOpenTime = new Date(endDateTime.getTime() - 20 * 60000);

  const evaluationCloseTime = new Date(endDateTime.getTime() + 24 * 60 * 60000);

  if (now < evaluationOpenTime) {
    return {
      isOpen: false,
      errorCode: "TOO_EARLY",
      message:
        "The evaluation window for this event has not yet started. Please come back later.",
    };
  }

  if (now > evaluationCloseTime) {
    return {
      isOpen: false,
      errorCode: "TOO_LATE",
      message: "The evaluation window for this event has already ended.",
    };
  }

  return {
    isOpen: true,
    errorCode: null,
  };
}
