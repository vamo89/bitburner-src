import React from "react";
import Box from "@mui/material/Box";
import { RunningScript } from "../../Script/RunningScript";
import { ANSIITypography } from "../React/ANSIITypography";
import { makeStyles } from "tss-react/mui";
import { useRerender } from "../React/hooks";
import { Settings } from "../../Settings/Settings";
import { WindowHeader } from "./WindowHeader";
import { workerScripts } from "../../Netscript/WorkerScripts";
import { startWorkerScript } from "../../NetscriptWorker";
import { killWorkerScriptByPid } from "../../Netscript/killWorkerScript";
import { GetServer } from "../../Server/AllServers";
import { findRunningScriptByPid } from "../../Script/ScriptHelpers";
import { PinnedWindowsManager } from "./PinnedWindowsManager";
import { LogBoxEvents } from "../React/LogBoxManager";

const useStyles = makeStyles()(() => ({
  logs: {
    overflowY: "scroll",
    overflowX: "hidden",
    scrollbarWidth: "auto",
    flexDirection: "column-reverse",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
}));

interface LogContentWrapperProps {
  script: RunningScript;
  fontSize?: number;
  onClose: () => void;
}

function lineColor(s: string): "error" | "success" | "warn" | "info" | "primary" {
  if (s.match(/(^\[[^\]]+\] )?ERROR/) || s.match(/(^\[[^\]]+\] )?FAIL/)) {
    return "error";
  }
  if (s.match(/(^\[[^\]]+\] )?SUCCESS/)) {
    return "success";
  }
  if (s.match(/(^\[[^\]]+\] )?WARN/)) {
    return "warn";
  }
  if (s.match(/(^\[[^\]]+\] )?INFO/)) {
    return "info";
  }
  return "primary";
}

export function LogContentWrapper({ script, fontSize, onClose }: LogContentWrapperProps): React.ReactElement {
  const { classes } = useStyles();
  useRerender(Settings.TailRenderInterval); // Re-render at the same interval as the floating window

  const textAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "a") {
      const textArea = e.currentTarget as HTMLDivElement;
      if (!textArea) return;
      const r = new Range();
      r.setStartBefore(textArea);
      r.setEndAfter(textArea);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(r);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleKill = () => {
    killWorkerScriptByPid(script.pid);
  };

  const handleRun = () => {
    const server = GetServer(script.server);
    if (server === null) return;
    const runningScript = findRunningScriptByPid(script.pid);
    if (runningScript == null) {
      startWorkerScript(script, server);
    }
  };

  const handleTogglePin = () => {
    PinnedWindowsManager.unpinWindow(script.pid.toString());
    // Recreate the floating window when unpinning
    LogBoxEvents.emit(script);
  };

  return (
    <Box>
      <WindowHeader
        title={script.filename}
        isRunning={workerScripts.has(script.pid)}
        isPinned={true}
        onRun={handleRun}
        onKill={handleKill}
        onTogglePin={handleTogglePin}
        onClose={onClose}
        variant="pinned"
      />
      <Box
        className={classes.logs}
        style={{
          maxHeight: "300px",
          fontSize: fontSize ? `${fontSize}px` : undefined,
        }}
        tabIndex={-1}
        onKeyDown={textAreaKeyDown}
      >
        {script.logs.map((line, i) => {
          if (typeof line === "string") {
            return <ANSIITypography key={i} text={line} color={lineColor(line)} />;
          }
          return <div key={i}>{line}</div>;
        })}
      </Box>
    </Box>
  );
}
