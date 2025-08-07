import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";

import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Settings } from "../../Settings/Settings";

const useStyles = makeStyles()((theme: Theme) => ({
  titleButton: {
    borderWidth: "0 0 0 1px",
    borderColor: Settings.theme.welllight,
    borderStyle: "solid",
    borderRadius: "0",
    height: "100%",
  },
  windowHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.palette.action.hover,
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 33,
  },
}));

interface WindowHeaderProps {
  title: string;
  isRunning: boolean;
  minimized?: boolean;
  isPinned: boolean;
  onRun?: () => void;
  onKill?: () => void;
  onMinimize?: () => void;
  onTogglePin: () => void;
  onClose: () => void;
  draggable?: boolean;
  variant?: "floating" | "pinned";
}

export function WindowHeader({
  title,
  isRunning,
  minimized = false,
  isPinned,
  onRun,
  onKill,
  onMinimize,
  onTogglePin,
  onClose,
  draggable = false,
  variant = "floating",
}: WindowHeaderProps): React.ReactElement {
  const { classes } = useStyles();

  const headerComponent = (
    <Box className={variant === "pinned" ? classes.windowHeader : undefined}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", minWidth: "fit-content", height: "33px" }}>
        {/* Run/Stop button - only show if handlers are provided */}
        {(onRun || onKill) && (
          <>
            {!isRunning && onRun ? (
              <IconButton title="Re-run script" className={classes.titleButton} onClick={onRun} onTouchEnd={onRun}>
                <PlayCircleIcon />
              </IconButton>
            ) : (
              onKill && (
                <IconButton title="Stop script" className={classes.titleButton} onClick={onKill} onTouchEnd={onKill}>
                  <StopCircleIcon color="error" />
                </IconButton>
              )
            )}
          </>
        )}

        {/* Minimize button - only show if handler is provided and it's floating */}
        {onMinimize && variant === "floating" && (
          <IconButton
            title={minimized ? "Expand" : "Collapse"}
            className={classes.titleButton}
            onClick={onMinimize}
            onTouchEnd={onMinimize}
          >
            {minimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        )}

        {/* Pin/Unpin button */}
        <IconButton
          title={isPinned ? "Unpin window" : "Pin window"}
          className={classes.titleButton}
          onClick={onTogglePin}
          onTouchEnd={onTogglePin}
        >
          {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>

        {/* Close button */}
        <IconButton title="Close window" className={classes.titleButton} onClick={onClose} onTouchEnd={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );

  // For floating windows, wrap in Paper with drag class
  if (variant === "floating" && draggable) {
    return (
      <Paper className="drag" sx={{ cursor: "move" }}>
        {headerComponent}
      </Paper>
    );
  }

  return headerComponent;
}
