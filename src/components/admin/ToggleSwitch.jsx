import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  label, 
  disabled = false,
  size = 'md', // 'sm', 'md', 'lg'
  color = 'purple' // 'purple', 'green', 'blue', 'red'
}) => {
  const sizes = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const colors = {
    purple: {
      enabled: 'bg-purple-600',
      disabled: 'bg-gray-700'
    },
    green: {
      enabled: 'bg-green-600',
      disabled: 'bg-gray-700'
    },
    blue: {
      enabled: 'bg-blue-600',
      disabled: 'bg-gray-700'
    },
    red: {
      enabled: 'bg-red-600',
      disabled: 'bg-gray-700'
    }
  };

  const sizeConfig = sizes[size];
  const colorConfig = colors[color];

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-${color}-500
        ${sizeConfig.track}
        ${enabled ? colorConfig.enabled : colorConfig.disabled}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={label}
      aria-checked={enabled}
      role="switch"
    >
      <motion.span
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        className={`
          ${sizeConfig.thumb}
          inline-block rounded-full bg-white shadow-lg transform transition-transform
          ${enabled ? sizeConfig.translate : 'translate-x-0.5'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
