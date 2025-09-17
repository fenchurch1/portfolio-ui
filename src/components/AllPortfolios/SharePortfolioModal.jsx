import React, { useEffect, useState } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  MultiSelect,
  Button,
  Loader,
} from '@mantine/core';
import { apiClient } from '../../API/apiservises';
import APIEndpoints from '../../API/profile/APIEndpoints';

const SharePortfolioModal = ({ opened, onClose, portfolioName, onSave }) => {
  const UserId = localStorage.getItem('UserId');
  const [eligibleOptions, setEligibleOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!opened) return;
      setLoading(true);
      try {
        const response = await apiClient.get(
          APIEndpoints.fetchTeamMates.replace('{userId}', UserId)
        );
        const data = response.members || [];

        // Convert API data -> Mantine MultiSelect format
        const mapped = data.map((user) => ({
          value: String(user.user_id),
          label: user.username,
        }));

        setEligibleOptions(mapped);
      } catch (error) {
        console.error('Error fetching teammates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [opened, UserId]);

  const handleSave = () => {
    // Return selected IDs to parent if provided
    if (onSave) {
      onSave(selected);
    }
    onClose?.();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Share: ${portfolioName}`}
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Select teammates to share this portfolio with. Only users in the same
          team as the owner can be selected.
        </Text>

        {loading ? (
          <Loader size="sm" />
        ) : (
          <MultiSelect
            label="Share with"
            placeholder={
              eligibleOptions.length ? 'Search teammates' : 'No eligible teammates'
            }
            searchable
            data={eligibleOptions}
            value={selected}
            onChange={setSelected}
            nothingFoundMessage="No matches"
            clearable
            withinPortal
          />
        )}

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selected.length}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default SharePortfolioModal;
