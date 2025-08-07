import React, { useState, useMemo, useCallback } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WindowIcon from "@mui/icons-material/Window";

import { Settings } from "../../Settings/Settings";
import { useCycleRerender } from "../React/hooks";

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.spacing(40), // Slightly wider than left sidebar for pinned windows
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: theme.spacing(40),
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles()((theme: Theme) => ({
  pinnedWindow: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export interface PinnedWindow {
  id: string;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onUnpin: () => void;
}

interface RightPanelProps {
  pinnedWindows: PinnedWindow[];
}

export function RightPanel({ pinnedWindows }: RightPanelProps): React.ReactElement {
  useCycleRerender();
  const { classes } = useStyles();
  const [open, setOpen] = useState(Boolean(Settings.IsRightPanelOpened) ?? true);

  const toggleDrawer = useCallback((): void => {
    setOpen((old) => {
      Settings.IsRightPanelOpened = !old;
      return !old;
    });
  }, []);

  const ChevronOpenClose = open ? ChevronRightIcon : ChevronLeftIcon;

  return (
    <Drawer open={open} anchor="right" variant="permanent">
      {useMemo(
        () => (
          <ListItem component="div" onClick={toggleDrawer}>
            {open && <ListItemText primary={<Typography>Pinned Windows ({pinnedWindows.length})</Typography>} />}
            <ListItemIcon>
              <ChevronOpenClose color="primary" />
            </ListItemIcon>
          </ListItem>
        ),
        [ChevronOpenClose, pinnedWindows.length, toggleDrawer, open],
      )}
      <Divider />

      {open && (
        <Box sx={{ p: 1, height: "100%", overflow: "auto" }}>
          {pinnedWindows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "text.secondary",
              }}
            >
              <WindowIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body2" align="center">
                No pinned windows
              </Typography>
              <Typography variant="caption" align="center" sx={{ mt: 1 }}>
                Click the pin button on any floating window to pin it here
              </Typography>
            </Box>
          ) : (
            pinnedWindows.map((window) => (
              <Box key={window.id} className={classes.pinnedWindow}>
                {window.content}
              </Box>
            ))
          )}
        </Box>
      )}
    </Drawer>
  );
}
