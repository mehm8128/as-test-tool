import { useAtom } from 'jotai'
import { settingAtom } from '../../states/setting'
import { Link } from '@tanstack/react-router'

export function Setting() {
  const [setting, setSetting] = useAtom(settingAtom)

  return (
    <div>
      <Link to="/">一覧へ</Link>
      <h1>各種設定</h1>
      <label>
        <span>氏名</span>
        <input
          type="text"
          value={setting.name}
          onChange={(e) =>
            setSetting({
              ...setting,
              name: e.target.value
            })
          }
        />
      </label>
      <label>
        <span>メールアドレス</span>
        <input
          type="email"
          value={setting.email}
          onChange={(e) =>
            setSetting({
              ...setting,
              email: e.target.value
            })
          }
        />
      </label>
      <label>
        <span>OS</span>
        <input
          type="text"
          value={setting.os}
          onChange={(e) =>
            setSetting({
              ...setting,
              os: e.target.value
            })
          }
        />
      </label>
      <label>
        <span>ブラウザ</span>
        <input
          type="text"
          value={setting.browser}
          onChange={(e) =>
            setSetting({
              ...setting,
              browser: e.target.value
            })
          }
        />
      </label>
      <label>
        <span>支援技術</span>
        <input
          type="text"
          value={setting.at}
          onChange={(e) =>
            setSetting({
              ...setting,
              at: e.target.value
            })
          }
        />
      </label>
      <label>
        <span>支援技術に対する追加の設定</span>
        <input
          type="text"
          value={setting.atSetting}
          onChange={(e) =>
            setSetting({
              ...setting,
              atSetting: e.target.value
            })
          }
        />
      </label>
    </div>
  )
}
