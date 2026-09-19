import { Link } from 'react-router-dom'
import styles from './EmptyState.module.css'

function EmptyState({ emoji = '🧉', title, text, ctaText, ctaTo }) {
  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{emoji}</span>
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {ctaText && ctaTo && (
        <Link to={ctaTo} className={styles.cta}>
          {ctaText}
        </Link>
      )}
    </div>
  )
}

export default EmptyState