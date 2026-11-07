"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import Cal, { getCalApi } from "@calcom/embed-react";
import { config } from "@/lib/config";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function CalEmbed() {
  const { resolvedTheme } = useTheme();
  const settings = useSiteSettings();

  useEffect(() => {
    (async () => {
      try {
        const cal = await getCalApi();
        cal("ui", {
          theme: resolvedTheme === "dark" ? "dark" : "light",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch (err) {
        console.error("Cal.com init error", err);
      }
    })();
  }, [resolvedTheme]);

  return (
    <div className="w-full h-full min-h-[480px]">
      <Cal
        calLink={settings.calLink || config.calLink}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "480px",
          overflow: "scroll",
        }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}

