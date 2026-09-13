import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = (event) => {
    event.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className={styles.successContainer}>
        <h2 className={styles.successTitle}>¡Pago procesado con éxito!</h2>
        <p className={styles.successText}>
          Gracias por tu compra. Serás redirigido en 3 segundos...
        </p>
        <button className={styles.successButton} onClick={() => navigate('/')}>
          Volver ya mismo
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Finalizar Compra</h1>
      <form onSubmit={handlePurchase}>
        <div className={styles.field}>
          <label className={styles.label}>Nombre en la tarjeta:</label>
          <input
            type="text"
            required
            disabled={isProcessing}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={styles.submitButton}
        >
          {isProcessing && <span className={styles.spinner} />}
          {isProcessing ? 'Procesando...' : 'Pagar ahora'}
        </button>
      </form>

      <button className={styles.cancelButton} onClick={() => navigate(-1)}>
        Cancelar y volver atrás
      </button>
    </div>
  );
}