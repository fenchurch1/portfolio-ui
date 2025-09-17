import React from 'react'
import { Card, Group, Text, useMantineTheme, Box } from "@mantine/core";
const CardComponent = ({ label, value, onClick,style,bgColor,Color }) => {
    const theme = useMantineTheme();
    return (
        <Card
            withBorder
            radius="lg"
            p="lg"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
            bg={bgColor}
            sx={{
                cursor: onClick ? "pointer" : "default",
                transition: "transform 120ms ease, box-shadow 120ms ease",
                "&:hover": { transform: onClick ? "translateY(-2px)" : "none" },
                "&:focus-visible": {
                    outline: `2px solid ${theme.colors.blue[5]}`,
                    outlineOffset: 2,
                },
            }}
            style={style}
        >
            <Group position="apart" mb="xs" align={"center"} justify={"center"}>
                <Text size="sm" c={Color} fw={500} tt="uppercase" letterSpacing={0.5}>
                    {label}
                </Text>
            </Group>
            <Box ta={"center"}>
                <Text
                    fw={800}
                    style={{
                        fontSize: 36,
                        lineHeight: 1.1,
                        letterSpacing: -0.5,
                    }}
                    c={Color}
                >
                    {value}
                </Text>
            </Box>
        </Card>
    );
}
export default CardComponent

