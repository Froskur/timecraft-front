import { PiSignOut } from 'react-icons/pi';
import { Avatar, AvatarProps, ElementProps, Menu } from '@mantine/core';
import { useAuth, useGetAccountInfo, useLogout } from '@/hooks';

type CurrentUserProps = Omit<AvatarProps, 'src' | 'alt'> & ElementProps<'div', keyof AvatarProps>;

export function CurrentUser(props: CurrentUserProps) {
  const { mutate: logout } = useLogout();
  const { setIsAuthenticated } = useAuth();
  const { data: user } = useGetAccountInfo();

  const handleLogout = () => {
    sessionStorage.removeItem('timecraft_shell_preview');
    logout(
      { variables: null },
      {
        onSuccess: () => setIsAuthenticated(false),
        onError: () => setIsAuthenticated(false),
      }
    );
  };

  return (
    <Menu>
      <Menu.Target>
        <Avatar
          src={user?.avatarUrl ?? undefined}
          alt={user?.displayName ?? user?.name ?? 'Current user'}
          {...props}
          style={{ cursor: 'pointer', ...props.style }}
        >
          TC
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<PiSignOut size="1rem" />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
