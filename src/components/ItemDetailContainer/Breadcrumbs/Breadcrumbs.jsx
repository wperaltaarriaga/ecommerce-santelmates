import { Link } from 'react-router-dom'
import { slugify } from '../../../utils/slugify'
import styles from './Breadcrumbs.module.css'

function Breadcrumbs({ category, name }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="breadcrumb">
      <Link to="/productos" className={styles.link}>Catálogo</Link>
      <span className={styles.separator}>/</span>
      <Link to={`/category/${slugify(category)}`} className={styles.link}>
        {category}
      </Link>
      <span className={styles.separator}>/</span>
      <span className={styles.current}>{name}</span>
    </nav>
  )
}

export default Breadcrumbs