import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/** Underlined tabs whose red indicator slides to the active trigger. */
export function AnimatedTabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: string; content: ReactNode }[];
  defaultValue: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useIsoLayoutEffect(() => {
    const update = () => {
      const active = listRef.current?.querySelector<HTMLElement>('[data-state="active"]');
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [value]);

  return (
    <TabsPrimitive.Root value={value} onValueChange={setValue} className={className}>
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <TabsPrimitive.List
          ref={listRef}
          className="relative flex min-w-max gap-6 border-b border-border"
        >
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className="py-3 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-foreground"
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-px left-0 h-0.5 w-px origin-left bg-primary transition-transform duration-300 ease-entrance",
              !indicator && "opacity-0",
            )}
            style={
              indicator
                ? { transform: `translateX(${indicator.left}px) scaleX(${indicator.width})` }
                : undefined
            }
          />
        </TabsPrimitive.List>
      </div>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value} className="rise-in pt-6">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
