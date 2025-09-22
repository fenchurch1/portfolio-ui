import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  Stack,
  Center,
  Flex,
  Checkbox,
} from '@mantine/core';
import { portfolioStore } from '../../stores/PortfolioStore';
import PortfolioGrid from '@utils/Table/PortfolioGrid';
import DropZoneButton from '@components/UploadComponent/DropZoneButton';
import { apiClient } from '@API/apiservises';
import APIEndpoints from '@API/profile/APIEndpoints';
import CopyPaste from '@components/UploadComponent/CopyPaste';

const UploadView = () => {
  const [portfolioName, setPortfolioName] = useState('');
  const [Comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [data, setData] = useState({ fileId: '', Exceldata: [] });
  const [columnDefs, setColumnDefs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [HeaderChecked, setHeaderChecked] = useState(false);
   const [SharedWithteam, setSharedWithteam] = useState(false);
  const [PastedData, setPastedData] = useState([]);
  useEffect(() => {
    const allKeys = new Set();
    data.Exceldata.forEach(obj => {
      Object.keys(obj).forEach(key => allKeys.add(key));
    });

    // ✅ Generate columnDefs from unique keys
    let columnDefs = Array.from(allKeys).map((key) => ({
      headerName: key,
      field: key,
      flex: 1,
    }));
    setColumnDefs(columnDefs);
  }, [portfolioStore.portfolios, data.Exceldata]);

  const handleUpload = async () => {
    if (checked && PastedData.length === 0) {
      alert("Please paste data before uploading.");
      return;
    }
    if (checked && PastedData.length > 0) {
      const poolRegex = /^[A-Za-z]{2} [A-Za-z0-9]{6}$/;
      const cusipRegex = /^[A-Za-z0-9]{9}$/;

      const ModifiedData = PastedData.map((item) => {
        const Obj = {};

        item.forEach((subItem) => {
          if (cusipRegex.test(subItem)) {
            Obj.Cusip_id = subItem;
          } else if (poolRegex.test(subItem)) {
            Obj.pool_id = subItem;
          } else {
            Obj.orig_face = subItem;
          }
        });

        return Obj; // ✅ make sure to return Obj
      });

      data.Exceldata = ModifiedData;
    }

    portfolioStore.addPortfolio({
      PastedDatafileName: PastedData ? "" : file.name,
      portfolioName,
      Comment,
      data: data,
      SharedWithteam:SharedWithteam
    });
  };
  const ExtractFile = async (file) => {
    const formData = new FormData();
    formData.append('filename', file);
    formData.append('user_id', 1);
    try {
      const response = await apiClient.post(APIEndpoints.uploadFile, '', formData, true);
      // Update states
      setFile(file);
      setData({ file_id: response?.file_id, Exceldata: response.data }); // Reset data when a new file is selected
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Stack>
      <Flex gap={'20px'} align="center">
        <TextInput
          label="Portfolio Name"
          placeholder='Portfolio Name'
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          required
        />
        <TextInput
          label="Comments"
          placeholder='Comments'
          value={Comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </Flex>

      <Center>
        {
          checked ?
            <CopyPaste setPastedData={setPastedData} headerIncluded={HeaderChecked}/>
            : <DropZoneButton ExtractFile={ExtractFile} />
        }

      </Center>
      <Flex gap={'20px'} align="center">
        <Checkbox
          label="Paste Data"
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Checkbox
          label="Including Header"
          checked={HeaderChecked}
          onChange={(event) => setHeaderChecked(event.currentTarget.checked)}
        />
        <Checkbox
          label="Shared With team"
          checked={SharedWithteam}
          onChange={(event) => setSharedWithteam(event.currentTarget.checked)}
        />
      </Flex>

      <Button onClick={handleUpload} disabled={checked ? !portfolioName : !file || !portfolioName}>
        Upload
      </Button>

      {data.Exceldata.length > 0 && <PortfolioGrid rowData={data.Exceldata} columnDefs={columnDefs} />}
    </Stack>
  );
};

export default UploadView;
