'use client';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '../hooks/useProfile';

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function ProfileForm({ profile, setProfile }: ProfileFormProps) {
  return (
    <div className="p-6 sm:p-8 space-y-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            required
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="email"
            value={profile.email || ''}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            disabled
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Email cannot be changed
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Phone Number
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="+255 700 000 000"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Address
        </label>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <textarea
            value={profile.address || ''}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
            placeholder="Enter your address"
          />
        </div>
      </motion.div>
    </div>
  );
}
