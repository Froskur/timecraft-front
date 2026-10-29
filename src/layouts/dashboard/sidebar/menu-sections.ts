import { ElementType } from 'react';
import {
  PiBuildingsDuotone,
  PiMapPinDuotone,
  PiSquaresFourDuotone,
  PiStarDuotone,
  PiUserCircleDuotone,
  PiUsersThreeDuotone,
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
        name: 'Organizations',
        href: paths.dashboard.organizations,
        icon: PiBuildingsDuotone,
      },
      {
        name: 'Locations',
        href: paths.dashboard.locations,
        icon: PiMapPinDuotone,
      },
      {
        name: 'Resources',
        href: paths.dashboard.resources,
        icon: PiSquaresFourDuotone,
      },
      {
        name: 'Staff',
        href: paths.dashboard.staff,
        icon: PiUsersThreeDuotone,
      },
    ],
  },
];
