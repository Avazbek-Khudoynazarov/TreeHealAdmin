import styles from './Hero.module.css'
import Button from '../Button/Button'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Welcome to TreeHeal
        </h1>
        <p className={styles.description}>
          Building modern web applications with Next.js and CSS Modules
        </p>
        <div className={styles.buttonGroup}>
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </section>
  )
}
