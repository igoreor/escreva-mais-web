import React, { useEffect } from 'react';

interface ToastProps {
  title: string;
  description: string;
  duration?: number; // tempo em ms antes de sumir, padrão 3000ms
  onClose: () => void;
}

export function Toast({ title, description, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: '20px 30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: 320,
      fontFamily: 'Arial, sans-serif',
      color: '#003399',
      zIndex: 1000,
    }}>
      <h2 style={{ margin: '0 0 10px', fontWeight: 'bold' }}>{title}</h2>
      <p style={{ margin: 0 }}>{description}</p>
    </div>
  );
}
