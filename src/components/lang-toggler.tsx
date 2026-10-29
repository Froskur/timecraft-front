import {
  PiMoonDuotone as DarkIcon,
  PiSunDimDuotone as LightIcon,
  PiDesktop as SystemIcon,
  PiGlobe
} from 'react-icons/pi';
import {
  ActionIcon,
  ActionIconProps,
  ElementProps,
  MantineColorScheme,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { match } from '@/utilities/match';
import { useTranslation } from "react-i18next";

type LangTogglerProps = Omit<ActionIconProps, 'children' | 'c' | 'onClick' | 'size'> &
  ElementProps<'button', keyof ActionIconProps>;

export function LangToggler(props: LangTogglerProps) {
  //const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { i18n } = useTranslation();

  const { label, icon: Icon } = match(
    [i18n.language === 'en', { label: 'EN', icon: PiGlobe }],
    [i18n.language === 'ru', { label: 'RU', icon: PiGlobe }],
    //[colorScheme === 'light', { label: 'Light', icon: LightIcon }],
    //[true, { label: 'Dark', icon: DarkIcon }]
  );


  const handleLangChange = () => {
    //Пока так просто
    i18n.changeLanguage(i18n.language === 'en'?"ru":"en");

/*
    const nextLangScheme = match<MantineColorScheme>(
      [colorScheme === 'auto', 'dark'],
      [colorScheme === 'dark', 'light'],
      [colorScheme === 'light', 'auto'],
      [true, 'dark']
    );

    setColorScheme(nextColorScheme);
*/

  };

  return (
    <Tooltip label={label}>
      <ActionIcon variant="transparent" c="inherit" onClick={handleLangChange} {...props}>
        <Icon size="100%" />
      </ActionIcon>
    </Tooltip>
  );
}
