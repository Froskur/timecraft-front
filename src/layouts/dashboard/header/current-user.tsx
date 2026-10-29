import { PiSignOut } from 'react-icons/pi';
import { Avatar, AvatarProps, ElementProps, Menu, Text } from '@mantine/core';
import { useAuth, useGetCurrentUser, useLogout } from '@/hooks';

type CurrentUserProps = Omit<AvatarProps, 'src' | 'alt'> & ElementProps<'div', keyof AvatarProps>;

export function CurrentUser(props: CurrentUserProps) {
  const { mutate: logout } = useLogout();
  const { setIsAuthenticated } = useAuth();
  const { data: user } = useGetCurrentUser();

  const handleLogout = () => {
    logout(
      { variables: null },
      {
        onSuccess: () => setIsAuthenticated(false),
        onError: () => setIsAuthenticated(false),
      }
    );
  };

  const label = user?.displayName || user?.email || 'TC';
  const initials = label
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Menu>
      <Menu.Target>
        <Avatar alt={label} {...props} style={{ cursor: 'pointer', ...props.style }}>
          {initials || 'TC'}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        {(user?.displayName || user?.email) && (
          <Menu.Label>
            <Text size="sm" fw={500}>
              {user.displayName || user.email}
            </Text>
            {user.displayName && user.email && (
              <Text size="xs" c="dimmed">
                {user.email}
              </Text>
            )}
          </Menu.Label>
        )}
        <Menu.Item leftSection={<PiSignOut size="1rem" />} onClick={handleLogout}>
          Выйти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
