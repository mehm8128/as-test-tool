import { useAtom } from 'jotai'
import { settingAtom } from '../../states/setting'
import { AnchorLink } from '../../components/AnchorLink/AnchorLink'
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
      <Label labelText="氏名">
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
      <Label labelText="メールアドレス">
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
      <Label labelText="OS">
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
      <Label labelText="ブラウザ">
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
      <Label labelText="支援技術">
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
      <Label labelText="支援技術に対する追加の設定">
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
