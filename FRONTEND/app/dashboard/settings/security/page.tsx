'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SuccessModal from '@/components/SuccessModal';
import { PasswordField } from './components/PasswordField';
import { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
import { ErrorBanner } from './components/ErrorBanner';
import { SecurityInfoCard } from './components/SecurityInfoCard';
import { usePasswordChange } from './hooks/usePasswordChange';

export default function SecurityPage() {
  const router = useRouter();
  const {
    form,
    errors,
    setErrors,
    loading,
    errorDetails,
    setErrorDetails,
    strength,
    showSuccess,
    updateField,
    validateNew,
    validateConfirm,
    submit,
    closeModal,
  } = usePasswordChange();

  return (
    <div className="dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      <SuccessModal
        isOpen={showSuccess}
        onClose={closeModal}
        title="Password Changed Successfully!"
        message="Your password has been updated. You can now use your new password to log in."
        buttonText="Continue"
        onButtonClick={closeModal}
      />

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200"
          aria-label="Back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Security</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Change your password</p>
        </div>
      </div>

      <ErrorBanner message={errorDetails} onDismiss={() => setErrorDetails('')} />
      <SecurityInfoCard />

      <form
        onSubmit={submit}
        className="bg-white dark:!bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-7 max-w-2xl"
      >
        <div className="space-y-5">
          <PasswordField
            label="Current Password"
            value={form.currentPassword}
            onChange={(v) => updateField('currentPassword', v)}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                currentPassword: form.currentPassword ? '' : 'Current password is required',
              }));
            }}
            error={errors.currentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
          />

          <div>
            <PasswordField
              label="New Password"
              value={form.newPassword}
              onChange={(v) => updateField('newPassword', v)}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, newPassword: validateNew(form.newPassword) }))
              }
              error={errors.newPassword}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <PasswordStrengthMeter score={strength} />
          </div>

          <PasswordField
            label="Confirm New Password"
            value={form.confirmPassword}
            onChange={(v) => updateField('confirmPassword', v)}
            onBlur={() =>
              setErrors((prev) => ({ ...prev, confirmPassword: validateConfirm(form.confirmPassword) }))
            }
            error={errors.confirmPassword}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-7 pt-5 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99]"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/settings')}
            className="w-full sm:px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium text-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
