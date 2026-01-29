import styles from './MarkdownContent.module.css'

interface MarkdownContentProps {
  html: string
}

/**
 * HTML文字列をレンダリングする
 * バックエンドでサニタイズ済みのHTMLを受け取る
 */
export const MarkdownContent = ({ html }: MarkdownContentProps) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} className={styles.module} />
}
