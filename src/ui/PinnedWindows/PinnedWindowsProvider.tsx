import React, { useState, useEffect } from "react";
import { PinnedWindowsManager } from "./PinnedWindowsManager";
import { RightPanel, PinnedWindow as RightPanelWindow } from "../RightPanel/RightPanel";
import { LogContentWrapper } from "./LogContentWrapper";
import { OverviewContentWrapper } from "./OverviewContentWrapper";
import { LogBoxEvents } from "../React/LogBoxManager";

export function PinnedWindowsProvider(): React.ReactElement {
  const [pinnedWindows, setPinnedWindows] = useState<RightPanelWindow[]>([]);

  useEffect(() => {
    const updateWindows = () => {
      const windows = PinnedWindowsManager.getPinnedWindows();
      const rightPanelWindows: RightPanelWindow[] = windows.map((window) => ({
        id: window.id,
        title: window.script.filename,
        content:
          window.script.pid === -1 ? (
            <OverviewContentWrapper
              onClose={() => {
                PinnedWindowsManager.unpinWindow(window.id);
              }}
            />
          ) : (
            <LogContentWrapper
              script={window.script}
              onClose={() => {
                PinnedWindowsManager.unpinWindow(window.id);
              }}
            />
          ),
        onClose: () => {
          PinnedWindowsManager.unpinWindow(window.id);
        },
        onUnpin: () => {
          PinnedWindowsManager.unpinWindow(window.id);
          // Only recreate floating window for actual scripts, not overview
          if (window.script.pid !== -1) {
            LogBoxEvents.emit(window.script);
          }
        },
      }));
      setPinnedWindows(rightPanelWindows);
    };

    // Initial load
    updateWindows();

    // Subscribe to changes
    const unsubscribe = PinnedWindowsManager.subscribe(updateWindows);

    return unsubscribe;
  }, []);

  return <RightPanel pinnedWindows={pinnedWindows} />;
}
