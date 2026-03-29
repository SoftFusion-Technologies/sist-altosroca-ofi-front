import React, { useEffect, useState } from 'react';
// import Watermark from 'react-watermark-component';

const ProtectedRoutine = ({ studentName, children }) => {
  const [isObscured, setIsObscured] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key.toLowerCase() === 'p') ||
        (e.metaKey && e.key.toLowerCase() === 'p')
      ) {
        e.preventDefault();
        setIsObscured(true);
        setTimeout(() => setIsObscured(false), 4000);
      }
    };

    const preventActions = (e) => e.preventDefault();

    window.addEventListener('keydown', handleKey);
    document.addEventListener('contextmenu', preventActions);
    document.addEventListener('copy', preventActions);
    document.addEventListener('cut', preventActions);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('contextmenu', preventActions);
      document.removeEventListener('copy', preventActions);
      document.removeEventListener('cut', preventActions);
    };
  }, []);

  return (
    <div className="relative select-none">
      {/* Overlay disuasorio */}
      {isObscured && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-80 text-white flex items-center justify-center text-xl">
          ⚠️ Protección activa
        </div>
      )}

      {/* Marca de agua */}
      <Watermark
        text={`${studentName} - ${new Date().toLocaleString()}`}
        textColor="#000"
        textOpacity={0.1}
        fontSize={16}
        gapX={120}
        gapY={120}
      >
        <div className="relative z-10">{children}</div>
      </Watermark>
    </div>
  );
};

export default ProtectedRoutine;
