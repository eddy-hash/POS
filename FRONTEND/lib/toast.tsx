import toast from 'react-hot-toast';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type ToastContentProps = {
  message: React.ReactNode;      // ← now accepts JSX, not just string
  subMessage?: React.ReactNode;  // ← also accepts JSX
  type?: 'success' | 'error' | 'info' | 'welcome';
};

// ------------------------------------------------------------------
// Toast Content Component
// ------------------------------------------------------------------
const ToastContent = ({
  message,
  subMessage,
  type = 'success'
}: ToastContentProps) => {
  // ─── Icons ───────────────────────────────────────────
  const getIcon = () => {
    switch (type) {
      case 'success':
      case 'welcome':
        return (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // ─── Background colors ──────────────────────────────
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-600 dark:bg-emerald-700';
      case 'welcome': return 'bg-blue-600 dark:bg-blue-700';
      case 'error':   return 'bg-red-600 dark:bg-red-700';
      case 'info':    return 'bg-slate-600 dark:bg-slate-700';
      default:        return 'bg-blue-600 dark:bg-blue-700';
    }
  };

  // ─── Render ──────────────────────────────────────────
  return (
    <div
      className={`
        flex items-center gap-2 sm:gap-4
        ${getBgColor()}
        rounded-2xl shadow-2xl
        px-3 py-2 sm:px-5 sm:py-4
        max-w-[90%] sm:max-w-sm md:max-w-md
        w-auto
        text-white
        transition-all duration-200
        hover:shadow-xl
        cursor-pointer
        mx-auto
      `}
      onClick={() => toast.dismiss()}
    >
      {getIcon()}
      <div className="flex-1 min-w-0 text-center">
        <p className="text-sm sm:text-base font-semibold leading-tight">{message}</p>
        {subMessage && (
          <p className="text-xs sm:text-sm text-white/80 mt-0.5 leading-tight">{subMessage}</p>
        )}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Public Toast Functions
// ------------------------------------------------------------------
export const showSuccessToast = (message: React.ReactNode, subMessage?: React.ReactNode): void => {
  toast.dismiss();
  toast.custom(
    () => <ToastContent message={message} subMessage={subMessage} type="success" />,
    { duration: 3500, position: 'bottom-center' }
  );
};

export const showWelcomeToast = (message: React.ReactNode, subMessage?: React.ReactNode): void => {
  toast.dismiss();
  toast.custom(
    () => <ToastContent message={message} subMessage={subMessage} type="welcome" />,
    { duration: 3500, position: 'bottom-center' }
  );
};

export const showInfoToast = (message: React.ReactNode, subMessage?: React.ReactNode): void => {
  toast.dismiss();
  toast.custom(
    () => <ToastContent message={message} subMessage={subMessage} type="info" />,
    { duration: 3000, position: 'bottom-center' }
  );
};

export const showErrorToast = (message: React.ReactNode, subMessage?: React.ReactNode): void => {
  toast.dismiss();
  toast.custom(
    () => <ToastContent message={message} subMessage={subMessage} type="error" />,
    { duration: 4500, position: 'bottom-center' }
  );
};

// ------------------------------------------------------------------
// Helper for "Welcome back, [username]!"
// ------------------------------------------------------------------
export const showWelcomeBackToast = (username: string): void => {
  showWelcomeToast(
    <>
      Welcome back, <span className="font-bold underline decoration-white/30">{username}</span>!
    </>,
    "We're so glad to see you!"
  );
};