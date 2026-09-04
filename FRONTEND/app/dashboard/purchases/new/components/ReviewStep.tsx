import { PurchaseSummary } from './PurchaseSummary';

interface ReviewStepProps {
  totalAmount: number;
  itemCount: number;
  onConfirm: () => void;
  submitting: boolean;
}

export function ReviewStep({
  totalAmount,
  itemCount,
  onConfirm,
  submitting,
}: ReviewStepProps) {
  return (
    <PurchaseSummary
      totalAmount={totalAmount}
      itemCount={itemCount}
      onConfirm={onConfirm}
      submitting={submitting}
    />
  );
}
