import { Link } from 'react-router-dom';
import { Group } from '@mantine/core';
import { ColorSchemeToggler } from '@/components/color-scheme-toggler';
import { Logo } from '@/components/logo';
import { StickyHeader } from '@/components/sticky-header';
import { LangToggler } from '@/components/lang-toggler';
import { CurrentUser } from './current-user';
import { SidebarButton } from './sidebar-button';
import classes from './header.module.css';

export function Header() {
  return (
    <StickyHeader className={classes.root}>
      <div className={classes.rightContent}>
        <SidebarButton />
        <Link to="/" className={classes.logo}>
          <Logo />
        </Link>
      </div>

      <Group>
        <ColorSchemeToggler />
        <LangToggler />
        <CurrentUser />
      </Group>
    </StickyHeader>
  );
}
