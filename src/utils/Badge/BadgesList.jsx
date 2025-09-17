import React from "react";
import { Badge, Group } from "@mantine/core";

const getContrastColor = (bgColor) => {
  if (!bgColor) return "inherit";

  const hex = bgColor.replace("#", "");
  if (hex.length !== 6) return "inherit"; // avoid crashes on invalid color

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff"; // dark text on light bg, white text on dark bg
};

const BadgesList = ({ data }) => {
  return (
    <Group spacing="sm">
      {data.map((item, index) => {
        const bg = item.BackgroundColor || "#F5F5F5"; // default light gray
        const textColor = item.TextColor || getContrastColor(bg);

        return (
          <Badge
            key={index}
            radius="md"
            variant="filled" // ✅ use filled for solid background
            style={{
              backgroundColor: bg,
              color: textColor,
              fontWeight: 600,
              padding: "8px 12px",
              fontSize: "0.85rem",
            }}
          >
            {item.label}: {item.value}
          </Badge>
        );
      })}
    </Group>
  );
};

export default BadgesList;
