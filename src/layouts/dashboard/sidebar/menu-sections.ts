import { ElementType } from 'react';
import {
  PiSquaresFourDuotone,
  PiStarDuotone,
  PiTreeStructureDuotone,
  PiUserCircleDuotone,
} from 'react-icons/pi';
import { paths } from '@/routes/paths';

interface MenuItem {
  header: string;
  section: {
    name: string;
    href: string;
    icon: ElementType;
    dropdownItems?: {
      name: string;
      href: string;
      badge?: string;
    }[];
  }[];
}

export const menu: MenuItem[] = [
  {
    header: 'Overview',
    section: [
      {
        name: 'Home',
        href: paths.dashboard.home,
        icon: PiStarDuotone,
      },
      {
        name: 'Account',
        href: paths.dashboard.account,
        icon: PiUserCircleDuotone,
      },
    ],
  },
  {
    header: 'Directories',
    section: [
      {
        name: 'Resources',
        href: paths.dashboard.resources,
        icon: PiSquaresFourDuotone,
      },
      {
        name: 'Dimensions',
        href: paths.dashboard.dimensions,
        icon: PiTreeStructureDuotone,
      },
    ],
  },
];
