import { useAtom } from 'jotai'
import { settingAtom } from '../../states/setting'
import { AnchorLink } from '../../components/Link/Link'
import { InputText } from '../../components/InputText/InputText'
import { Textarea } from '../../components/Textarea/Textarea'
import { Label } from '../../components/Label/Label'
import { Heading } from '../../components/Heading/Heading'

export function Setting() {
  const [setting, setSetting] = useAtom(settingAtom)

  return (
    <div>
      <AnchorLink to="/">一覧へ</AnchorLink>
      <Heading level={1}>各種設定</Heading>
      <Label>
        <span>氏名</span>
        <InputText
          value={setting.name}
          onChange={(value) =>
            setSetting({
              ...setting,
              name: value
            })
          }
        />
      </Label>
      <Label>
        <span>メールアドレス</span>
        <InputText
          type="email"
          value={setting.email}
          onChange={(value) =>
            setSetting({
              ...setting,
              email: value
            })
          }
        />
      </Label>
      <Label>
        <span>OS</span>
        <InputText
          value={setting.os}
          onChange={(value) =>
            setSetting({
              ...setting,
              os: value
            })
          }
        />
      </Label>
      <Label>
        <span>ブラウザ</span>
        <InputText
          value={setting.browser}
          onChange={(value) =>
            setSetting({
              ...setting,
              browser: value
            })
          }
        />
      </Label>
      <Label>
        <span>支援技術</span>
        <InputText
          value={setting.at}
          onChange={(value) =>
            setSetting({
              ...setting,
              at: value
            })
          }
        />
      </Label>
      <Label>
        <span>支援技術に対する追加の設定</span>
        <Textarea
          value={setting.atSetting}
          onChange={(value) =>
            setSetting({
              ...setting,
              atSetting: value
            })
          }
        />
      </Label>
    </div>
  )
}
