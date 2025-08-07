import React from "react";
import Box from "@mui/material/Box";
import { CharacterOverview } from "../React/CharacterOverview";
import { WindowHeader } from "./WindowHeader";
import { PinnedWindowsManager } from "./PinnedWindowsManager";

interface OverviewContentWrapperProps {
  onClose: () => void;
}

export function OverviewContentWrapper({ onClose }: OverviewContentWrapperProps): React.ReactElement {
  const handleTogglePin = () => {
    PinnedWindowsManager.unpinWindow("-1"); // Special PID for overview
  };

  return (
    <Box sx={{ width: "100%" }}>
      <WindowHeader
        title="Overview"
        isRunning={false}
        isPinned={true}
        onTogglePin={handleTogglePin}
        onClose={onClose}
        variant="pinned"
      />
      <Box sx={{ p: 1, maxHeight: "400px", overflow: "auto", width: "100%" }}>
        <Box
          sx={{
            "& .MuiTable-root": {
              margin: "0 !important",
              width: "100% !important",
              tableLayout: "fixed !important",
            },
            "& .MuiTableBody-root": {
              width: "100% !important",
            },
            "& .MuiTableRow-root": {
              width: "100% !important",
            },
            "& .MuiTableCell-root": {
              width: "auto !important",
              padding: "4px 8px !important",
            },
            "& .MuiLinearProgress-root": {
              height: "8px !important",
              width: "100% !important",
            },
            "& .MuiLinearProgress-bar1Determinate": {
              width: "100% !important",
            },
          }}
        >
          <CharacterOverview
            parentOpen={true}
            save={() => {
              // Save functionality would go here
            }}
            killScripts={() => {
              // Kill scripts functionality would go here
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
