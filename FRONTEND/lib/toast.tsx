import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'logout';

const Icons = {
  success: (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  logout: (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

function ToastContent({ message, subMessage, type, id }: any) {
  const icon = Icons[type as keyof typeof Icons] || Icons.info;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white min-w-[200px] max-w-md"
      style={{ backgroundColor: '#3B82F6' }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {subMessage && <p className="text-xs text-white/80 mt-0.5">{subMessage}</p>}
      </div>
      <button
        onClick={() => toast.dismiss(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Simple toast functions - all blue background
export const showSuccessToast = (message: string, subMessage?: string) => {
  toast.dismiss();
  toast.custom(
    (t) => <ToastContent message={message} subMessage={subMessage} type="success" id={t.id} />,
    { duration: 3000, position: 'bottom-center' }
  );
};

export const showErrorToast = (message: string, subMessage?: string) => {
  toast.dismiss();
  toast.custom(
    (t) => <ToastContent message={message} subMessage={subMessage} type="error" id={t.id} />,
    { duration: 3000, position: 'bottom-center' }
  );
};

export const showInfoToast = (message: string, subMessage?: string) => {
  toast.dismiss();
  toast.custom(
    (t) => <ToastContent message={message} subMessage={subMessage} type="info" id={t.id} />,
    { duration: 3000, position: 'bottom-center' }
  );
};

export const showWarningToast = (message: string, subMessage?: string) => {
  toast.dismiss();
  toast.custom(
    (t) => <ToastContent message={message} subMessage={subMessage} type="warning" id={t.id} />,
    { duration: 3000, position: 'bottom-center' }
  );
};

export const showLogoutToast = (message: string, subMessage?: string) => {
  toast.dismiss();
  toast.custom(
    (t) => <ToastContent message={message} subMessage={subMessage} type="logout" id={t.id} />,
    { duration: 1000, position: 'bottom-center' }
  );
};

// Simple welcome back
export const showWelcomeBackToast = (username: string) => {
  showSuccessToast(`Welcome back, ${username}!`, 'Good to see you');
};
