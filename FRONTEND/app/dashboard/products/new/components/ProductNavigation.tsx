import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Props {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  loading: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function ProductNavigation({
  currentStep,
  totalSteps,
  canProceed,
  loading,
  isLastStep,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 0}
        className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed || loading}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLastStep ? (
          <>
            {loading ? 'Creating...' : 'Create Product'}
            {!loading && <CheckIcon className="h-4 w-4" />}
          </>
        ) : (
          <>
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
