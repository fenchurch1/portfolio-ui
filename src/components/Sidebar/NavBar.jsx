import React, { use, useEffect, useState } from "react";
import {
  NavLink,
  Box,
  Stack,
  Checkbox,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import {
  IconUpload,
  IconEdit,
  IconTrash,
  IconListDetails,
  AllList,
  SharedWith
} from "@Assets/icons";
import { observer } from "mobx-react-lite";
import { portfolioStore } from "../../stores/PortfolioStore";
import classes from "./NavBar.module.css";
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = observer(({ onSelect, activeTab }) => {
  console.log("activeTab", activeTab);
  
  const [listOpened, setListOpened] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    portfolioStore.fetchPortfolios();
  }, []);
  const deletePortfolio = async (portfolioId) => {
    try {
      await portfolioStore.removePortfolio(portfolioId);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };
  const handleNavClick = (portfolioName, modulename,portfolioId) => {
    if (modulename === "upload") {
      onSelect("upload");
      navigate("/upload");
    }else  if (modulename === "portfolioList") {
      onSelect(portfolioName);
      navigate(`/portfolio/${portfolioId}`);
    } else {
      onSelect(portfolioName);
      navigate(`/${portfolioName}`);
    }
  }
  return (
    <Box p="sm" w={250} className={classes.sidebar}>
      <Stack spacing="xs">
        {/* Upload link */}
        <NavLink
          label="Upload"
          leftSection={<IconUpload size={18} />}
          onClick={() => handleNavClick(null, "upload")}
          className={activeTab === "upload" ? classes.activeLink : classes.link}
        />

        {/* Portfolio details */}
        <NavLink
          label="Portfolios"
          leftSection={<AllList size={18} />}
          onClick={() => handleNavClick("AllPortfolios", "Portfolio Details")}
          className={
            activeTab=='AllPortfolios' ? classes.activeLink : classes.link
          }
          childrenOffset={12}
          defaultOpened={listOpened}
        ></NavLink>

        {/* <NavLink
          label="Portfolio Holdings"
          leftSection={<AllList size={18} />}
          onClick={() => handleNavClick("Portfolios_Holdings", "Portfolio Details")}
          className={
            activeTab=='Portfolios_Holdings' ? classes.activeLink : classes.link
          }
          childrenOffset={12}
          defaultOpened={listOpened}
        ></NavLink> */}

        {/* List with scroll */}
        <NavLink
          label="List"
          leftSection={<IconListDetails size={18} />}
          onClick={() => setListOpened((prev) => !prev)}
          className={
            activeTab?.startsWith("list") ? classes.activeLink : classes.link
          }
          childrenOffset={12}
          defaultOpened={listOpened}
        >
          <ScrollArea h={550} type="auto" className={classes.scrollArea}>
            {portfolioStore.portfolios.map((item) => (
              <NavLink
                key={item.PortfolioId}
                label={
                  <div className={classes.portfolioRow}>
                    <Checkbox
                      size="xs"
                      checked={item.isSelected || false}
                      onClick={(e) => e.stopPropagation()} // prevent NavLink click
                      onChange={(e) =>
                        portfolioStore.toggleSelection(
                          item.PortfolioId,
                          e.currentTarget.checked
                        )
                      }
                    />
                    <span >{item.portfolioName}</span>
                    <div className={classes.actions}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePortfolio(item.PortfolioId);
                        }}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </div>
                  </div>
                }
                onClick={() => handleNavClick(item.portfolioName, "portfolioList",item.PortfolioId)}
                className={
                  activeTab === item.portfolioName
                    ? classes.activeLink
                    : classes.link
                }
              />
            ))}

          </ScrollArea>
        </NavLink>
      </Stack>
    </Box>
  );
});

export default NavBar;
