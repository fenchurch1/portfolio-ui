import React, { useRef, useState } from 'react';
import {
  IconCloudUpload,
  IconDownload,
  IconX,
} from '@Assets/icons';
import {
  Button,
  Group,
  Text,
  useMantineTheme,
  Stack,
  Box,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';

const DropZoneButton = ({ ExtractFile }) => {
  const theme = useMantineTheme();
  const openRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileDrop = (files) => {
    if (files.length > 0) {
      ExtractFile(files[0]);
      setSelectedFile(files[0]);
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={handleFileDrop}
        className={classes.dropzone}
        radius="md"
        accept={[
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]}
        maxSize={10 * 1024 ** 2}
        h={250}
        w="100%" 
      >
        <Stack justify="center" align="center" h="100%" w="100%">
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Only .csv, .xls, .xlsx under 10MB</Dropzone.Reject>
            <Dropzone.Idle>Upload Excel or CSV file</Dropzone.Idle>
          </Text>

          <Button  size="md" radius="xl" onClick={() => openRef.current?.()}>
            Select files
          </Button>

          {selectedFile && (
            <Text mt="sm" fz="sm" c="dimmed">
              📄 Selected: <strong>{selectedFile.name}</strong>
            </Text>
          )}
        </Stack>
      </Dropzone>
    </Box>
  );
};

export default DropZoneButton;
