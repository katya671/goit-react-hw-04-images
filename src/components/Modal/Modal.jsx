import React, { useEffect } from 'react';
import css from './Modal.module.css';

const Modal = ({ largeImageURL, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal}>
        <img src={largeImageURL} alt={alt} />
      </div>
    </div>
  );
};

export default Modal;
