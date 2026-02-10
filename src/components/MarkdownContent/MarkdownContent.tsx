import styles from './MarkdownContent.module.css'

interface Props {
  html: string
}

/**
 * HTML文字列をレンダリングする
 * バックエンドでサニタイズ済みのHTMLを受け取る
 */
export const MarkdownContent = ({ html }: Props) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} className={styles.module} />
}
