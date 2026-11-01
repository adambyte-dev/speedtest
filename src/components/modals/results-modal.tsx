"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TestResult } from "@/types/speed-test";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArrowDown, ArrowUp, History, Trash2, Zap } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: TestResult[];
  onClearHistory: () => void;
}

export function ResultsModal({
  open,
  onOpenChange,
  history,
  onClearHistory,
}: ResultsModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl max-h-[85vh] p-4 sm:p-6 overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 shrink-0">
                <History className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg">{t("results")}</DialogTitle>
                <DialogDescription className="text-xs">
                  {t("results_history_desc")}
                </DialogDescription>
              </div>
            </div>

            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearHistory}
                className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-1" />
                {t("delete_history")}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-2 space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <History className="size-8 opacity-40" />
              <p className="text-sm">{t("no_history")}</p>
              <p className="text-xs opacity-75">
                {t("no_history_sub")}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-2.5 sm:p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-[11px] sm:text-xs">{item.timestamp}</span>
                    <span
                      className={`text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-md ${
                        item.mode === "single"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200"
                      }`}
                    >
                      {item.mode === "single" ? t("single_mode") : t("multi_mode")}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs truncate max-w-[150px] sm:max-w-none">
                    {item.server} · {item.provider}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <div className="bg-background/80 p-1.5 sm:p-2 rounded-lg border border-border/40 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <ArrowDown className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[9px] text-muted-foreground font-medium uppercase truncate">
                        {t("download")}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold font-mono text-foreground truncate">
                        {item.download}{" "}
                        <span className="text-[9px] sm:text-[10px] font-normal">Mbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 p-1.5 sm:p-2 rounded-lg border border-border/40 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <ArrowUp className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[9px] text-muted-foreground font-medium uppercase truncate">
                        {t("upload")}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold font-mono text-foreground truncate">
                        {item.upload}{" "}
                        <span className="text-[9px] sm:text-[10px] font-normal">Mbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/80 p-1.5 sm:p-2 rounded-lg border border-border/40 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Zap className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[9px] text-muted-foreground font-medium uppercase truncate">
                        {t("ping")}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold font-mono text-foreground truncate">
                        {item.ping}{" "}
                        <span className="text-[9px] sm:text-[10px] font-normal">ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Bottom Ad Slot */}
        <AdSlot variant="compact" slotId="modal-results-ad" className="mt-2 shrink-0" />
      </DialogContent>
    </Dialog>
  );
}