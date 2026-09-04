'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileForm } from './components/ProfileForm';
import { ProfileActions } from './components/ProfileActions';
import { useProfile } from './hooks/useProfile';
import SuccessModal from '@/components/SuccessModal';

export default function ProfilePage() {
  const router = useRouter();
  const {
    loading,
    saving,
    profile,
    setProfile,
    error,
    modalOpen,
    updateProfile,
    closeModal,
    retryFetch,
  } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await updateProfile(profile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <span className="text-4xl block mb-3">⚠️</span>
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={retryFetch}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-3xl mx-auto px-4 sm:px-0 py-4 sm:py-6"
      >
        <ProfileHeader />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <ProfileAvatar
            name={profile?.name || ''}
            email={profile?.email || ''}
            isActive={profile?.isActive || false}
          />
          {profile && <ProfileForm profile={profile} setProfile={setProfile} />}
          <ProfileActions saving={saving} />
        </motion.form>
      </motion.div>

      <SuccessModal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Profile Updated"
        message="Your profile has been updated successfully."
        buttonText="Return to Settings"
        onButtonClick={closeModal}
      />
    </>
  );
}
