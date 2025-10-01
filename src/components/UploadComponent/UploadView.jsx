import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  Stack,
  Center,
  Flex,
  Checkbox,
  Stepper,
  Card,
  Text,
  Badge,
  Divider,
} from "@mantine/core";
import { portfolioStore } from "../../stores/PortfolioStore";
import PortfolioGrid from "@utils/Table/PortfolioGrid";
import DropZoneButton from "@components/UploadComponent/DropZoneButton";
import { apiClient } from "@API/apiservises";
import APIEndpoints from "@API/profile/APIEndpoints";
import CopyPaste from "@components/UploadComponent/CopyPaste";
import { toast } from "react-toastify";

const UploadView = () => {
  const [active, setActive] = useState(0); // step index
  const [portfolioName, setPortfolioName] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState({ fileId: "", Exceldata: [] });
  const [columnDefs, setColumnDefs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [headerChecked, setHeaderChecked] = useState(false);
  const [sharedWithTeam, setSharedWithTeam] = useState(false);
  const [pastedData, setPastedData] = useState([]);

  // Generate columnDefs dynamically
  useEffect(() => {
    const allKeys = new Set();
    data.Exceldata.forEach((obj) => {
      Object.keys(obj).forEach((key) => allKeys.add(key));
    });

    let defs = Array.from(allKeys).map((key) => ({
      headerName: key,
      field: key,
      flex: 1,
    }));
    setColumnDefs(defs);
  }, [data.Exceldata]);

  const handleUpload = async () => {
    if (checked && pastedData.length === 0) {
      toast.error("Please paste data before uploading.");
      return;
    }

    let processedData = data.Exceldata;

    if (checked && pastedData.length > 0) {
      const poolRegex = /^[A-Za-z]{2} [A-Za-z0-9]{6}$/;
      const cusipRegex = /^[A-Za-z0-9]{9}$/;

      processedData = pastedData.map((item) => {
        const obj = {};
        item.forEach((subItem) => {
          if (cusipRegex.test(subItem)) obj.cusip = subItem;
          else if (poolRegex.test(subItem)) obj.pool_number = subItem;
          else obj.orig_face = subItem;
        });
        return obj;
      });
    }

    portfolioStore.addPortfolio({
      fileName: checked ? "" : file?.name,
      portfolioName,
      comment,
      data: { ...data, Exceldata: processedData },
      sharedWithTeam,
    });

    setActive(3);
  };

  const extractFile = async (file) => {
    const formData = new FormData();
    formData.append("filename", file);
    formData.append("user_id", 1);
    try {
      const response = await apiClient.post(
        APIEndpoints.uploadFile,
        "",
        formData,
        true
      );
      setFile(file);
      setData({ file_id: response?.file_id, Exceldata: response.data });
      setActive(1); // move to step 2 after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap"
        mb="md"
        style={{ fontSize: "14px", color: "#adb5bd" }}
      >
        <Badge color="teal" variant="light" radius="sm">
          1. Upload cusip/pool (face amount optional)
        </Badge>
        <Divider orientation="vertical" mx="sm" />
        <Badge color="blue" variant="light" radius="sm">
          2. Copy & paste columns (optional)
        </Badge>
        <Divider orientation="vertical" mx="sm" />
        <Badge color="grape" variant="light" radius="sm">
          3. Preview before next step
        </Badge>
      </Flex>
      <Flex gap="lg" align="flex-start">
        {/* Left: Stepper only */}
        <Stepper
          active={active}
          onStepClick={setActive}
          orientation="vertical"
          allowNextStepsSelect={false}
          style={{ minWidth: 200}}
        >
          <Stepper.Step label="Upload Data" description="Upload or paste data" />
          <Stepper.Step label="Review Data" description="Validate uploaded data" />
          <Stepper.Step label="Finalize" description="Add details & upload" />
          <Stepper.Completed>Done</Stepper.Completed>
        </Stepper>

        {/* Right: Step Content inside Card */}
        <Card shadow="md" mih={230} radius="lg"  style={{ flex: 1 }}>
          {active === 0 && (
            <>
              <Center>
                {checked ? (
                  <CopyPaste
                    setPastedData={setPastedData}
                    headerIncluded={headerChecked}
                  />
                ) : (
                  <DropZoneButton ExtractFile={extractFile} height={150} />
                )}
              </Center>

              <Flex gap="20px" align="center"  justify='space-between'>
                <Flex gap="20px" align="center">
                  <Checkbox
                    label="Paste Data"
                    checked={checked}
                    onChange={(e) => setChecked(e.currentTarget.checked)}
                  />
                  <Checkbox
                    label="Including Header"
                    checked={headerChecked}
                    onChange={(e) => setHeaderChecked(e.currentTarget.checked)}
                  />
                </Flex>
                <Button
                  mt="lg"
                  onClick={() => setActive(1)}
                  disabled={!checked && !file}
                  style={{ float: "right" }}
                >
                  Next
                </Button>
              </Flex>


            </>
          )}

          {active === 1 && (
            <>
              {data.Exceldata.length > 0 || pastedData.length > 0 ? (
                <>
                  <PortfolioGrid
                    rowData={checked ? pastedData : data.Exceldata}
                    columnDefs={columnDefs}
                  />
                  <Flex gap="10px" mt="md">
                    <Button onClick={() => setActive(0)}>Re-upload</Button>
                    <Button onClick={() => setActive(2)} style={{ float: "right" }}>
                      Next
                    </Button>
                  </Flex>
                </>
              ) : (
                <Center>No data found. Please re-upload or paste data.</Center>
              )}
            </>
          )}

          {active === 2 && (
            <>
              <Flex gap="20px" align="center">
                <TextInput
                  label="Portfolio Name"
                  placeholder="Portfolio Name"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  required
                />
                <TextInput
                  label="Comments"
                  placeholder="Comments"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </Flex>

              <Checkbox
                mt="md"
                label="Shared With Team"
                checked={sharedWithTeam}
                onChange={(e) => setSharedWithTeam(e.currentTarget.checked)}
              />

              <Button
                mt="lg"
                onClick={handleUpload}
                disabled={!portfolioName || (!file && pastedData.length === 0)}
                style={{ float: "right" }}
              >
                Create portfolio
              </Button>
            </>
          )}

          {active === 3 && (
            <Center>
              <Text fw={500} color="green">
                🎉 Portfolio process completed!
              </Text>
            </Center>
          )}
        </Card>
      </Flex>
    </>

  );
};

export default UploadView;
