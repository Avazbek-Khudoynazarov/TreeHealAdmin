import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  const buttonClass = variant === 'primary' ? styles.primary : styles.secondary

  return (
    <button
      className={`${styles.button} ${buttonClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
