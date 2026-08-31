import { useState, useEffect } from 'react';
import { showWarningToast, showInfoToast } from '@/lib/toast';

export function generateRandomPassword(): string {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '@$!%*?&';
  const all = uppercase + lowercase + numbers + specials;

  let password =
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    specials[Math.floor(Math.random() * specials.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export function checkPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password || password.length === 0) {
    return { score: 0, label: 'Enter a password', color: 'bg-gray-300' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

export function usePasswordGenerator(initialPassword = '') {
  const [password, setPassword] = useState(initialPassword);
  const [strength, setStrength] = useState({ score: 0, label: 'Enter a password', color: 'bg-gray-300' });
  const [weakAlertShown, setWeakAlertShown] = useState(false);

  useEffect(() => {
    const s = checkPasswordStrength(password);
    setStrength(s);
    if (password.length > 0 && s.label === 'Weak') {
      if (!weakAlertShown) {
        showWarningToast('Password is weak. Please use at least 8 characters with uppercase, lowercase, number, and special character.');
        setWeakAlertShown(true);
      }
    } else {
      setWeakAlertShown(false);
      if (password.length > 0 && s.label === 'Strong') {
        showInfoToast('Strong password!');
      }
    }
  }, [password]);

  const generatePassword = () => {
    const newPassword = generateRandomPassword();
    setPassword(newPassword);
    return newPassword;
  };

  return { password, setPassword, strength, generatePassword };
}
