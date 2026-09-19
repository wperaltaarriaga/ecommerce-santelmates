import styles from './Skeletons.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.line} style={{ width: '40%' }} />
      <div className={styles.line} style={{ width: '80%' }} />
      <div className={styles.line} style={{ width: '60%' }} />
      <div className={styles.button} />
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className={styles.detail}>
      <div className={styles.imageLarge} />
      <div className={styles.info}>
        <div className={styles.line} style={{ width: '30%' }} />
        <div className={styles.line} style={{ width: '70%', height: '28px' }} />
        <div className={styles.line} style={{ width: '20%' }} />
        <div className={styles.line} style={{ width: '90%' }} />
        <div className={styles.line} style={{ width: '80%' }} />
        <div className={styles.buttonWide} />
      </div>
    </div>
  )
}