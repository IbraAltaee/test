import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface InfoIconProps {
  text: string;
}

export const InfoIconComponent: React.FC<{ text: string }> = React.memo(({ text }) => {
  return (
    <div className="">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="cursor-pointer inline-flex items-center">
          <FaInfoCircle />
        </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg z-50 max-w-xs"
              side="right"
            >
              {text}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
    </div>
  );
});
