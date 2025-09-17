import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Avatar,
  ActionIcon,
  Button,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
  Group,
  Menu,
  UnstyledButton,
  Title,
  Indicator,
  Paper,
  Stack,
  ScrollArea,
} from '@mantine/core';
import { IconSun, IconMoon, IconCheck, IconX } from '@Assets/icons';
import { IconLogout, IconUser, IconNotification } from '@Assets/icons';
import { useNavigate } from 'react-router-dom';
import { loginStore } from '../../stores/loginStore';
import { observer } from 'mobx-react-lite';
import { apiClient } from '@API/apiservises';
import APIEndpoints from '@API/profile/APIEndpoints';

const HeaderBar = observer(() => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const LoginData = loginStore.user;
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Sanket shared a new portfolio with you', read: false },
    { id: 2, message: 'New shared portfolio available', read: false },
    { id: 3, message: 'Team member added to portfolio', read: false },
  ]);

  useEffect(() => {
    const UserId = localStorage.getItem("UserId");
    const GetAllNotification = async () => {
      const response = await apiClient.get(APIEndpoints.getAllNotification.replace('{userId}', userId))
      console.log("response", response);

    }
    GetAllNotification();
  }, [])
  // ✅ Handlers
  const markAsRead = async(id) => {
    const UserId = localStorage.getItem("UserId");
    const UpdateNotificationBody={
      UserId:UserId,
      Notification_id:id,
      Status:false
    }
    const readResponse=await apiClient.put(APIEndpoints.updateNotification,'',UpdateNotificationBody)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    console.log('Marked as read:', id);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    console.log('Removed notification:', id);
  };

  const clearAll = () => {
    setNotifications([]);
    console.log('Cleared all notifications');
  };

  const toggleTheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const user = {
    name: 'Makarand Kshirsagar',
    email: 'makarand@example.com',
    avatar: '',
  };

  const logout = () => {
    loginStore.logout();
    localStorage.removeItem('Login');
    localStorage.removeItem('UserId');
    window.location.assign('/');
  };

  return (
    <Flex
      direction="column"
      style={{
        backgroundColor: computedColorScheme === 'dark' ? '#1f1f1f' : '#1971c2',
        color: 'white',
      }}
      px="md"
      py={4}
    >
      <Flex justify="space-between" align="center" wrap="nowrap">
        {/* Left Side */}
        <Group>
          <Title order={3}>Portfolio Management</Title>
        </Group>

        {/* Right Side: Theme Toggle + Notifications + Avatar */}
        <Group spacing="md" ml="md" wrap="nowrap">
          {/* Theme Toggle */}
          <ActionIcon
            variant="light"
            color="yellow"
            size="lg"
            radius="xl"
            onClick={toggleTheme}
            title="Toggle color scheme"
          >
            {computedColorScheme === 'dark' ? (
              <IconSun style={{ width: rem(18), height: rem(18) }} />
            ) : (
              <IconMoon style={{ width: rem(18), height: rem(18) }} />
            )}
          </ActionIcon>

          {/* Notification Icon with Badge & Panel */}
          <Menu shadow="lg" width={300} position="bottom-end">
            <Menu.Target>
              <Indicator
                label={notifications.length}
                size={16}
                color="red"
                offset={4}
                disabled={notifications.length === 0}
              >
                <ActionIcon
                  variant="light"
                  color="white"
                  radius="xl"
                  size="lg"
                  title="Notifications"
                >
                  <IconNotification style={{ width: rem(18), height: rem(18) }} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>

            <Menu.Dropdown>
              {/* Header with Clear All */}
              <Flex justify="space-between" align="center" px="xs" pb="xs">
                <Text fw={600} size="sm">
                  Notifications
                </Text>
                {notifications.length > 0 && (
                  <Button variant="subtle" size="xs" onClick={clearAll}>
                    Clear all
                  </Button>
                )}
              </Flex>

              <ScrollArea h={220}>
                <Stack spacing="xs" p="xs">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Paper
                        key={notif.id}
                        shadow="xs"
                        radius="md"
                        p="xs"
                        withBorder
                        style={{
                          // background: notif.read ? '#e9ecef' : '#f8f9fa',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: '0.2s',
                        }}
                      >
                        <Text size="sm" style={{ flex: 1, marginRight: '8px' }}>
                          {notif.message}
                        </Text>
                        <Group spacing={4}>
                          <ActionIcon
                            size="sm"
                            color="green"
                            variant="subtle"
                            onClick={() => markAsRead(notif.id)}
                            title="Mark as read"
                          >
                            <IconCheck size={14} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            color="red"
                            variant="subtle"
                            onClick={() => removeNotification(notif.id)}
                            title="Dismiss"
                          >
                            <IconX size={14} />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    ))
                  ) : (
                    <Text size="sm" align="center" c="dimmed">
                      No notifications
                    </Text>
                  )}
                </Stack>
              </ScrollArea>
            </Menu.Dropdown>
          </Menu>

          {/* Avatar Dropdown */}
          <Menu shadow="md" width={220} trigger="click">
            <Menu.Target>
              <UnstyledButton>
                <Avatar radius="xl" color="white" size="md" src={user.avatar}>
                  MK
                </Avatar>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <Group>
                  <Avatar src={user.avatar} radius="xl">
                    MK
                  </Avatar>
                  <div>
                    <Text size="sm" fw={500}>
                      {LoginData?.username}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {LoginData?.role}
                    </Text>
                  </div>
                </Group>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item leftSection={<IconUser size={16} />}>Profile</Menu.Item>

              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </Flex>
  );
});

export default HeaderBar;
