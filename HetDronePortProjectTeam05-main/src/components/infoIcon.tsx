import * as Tooltip from "@radix-ui/react-tooltip";
import { FaInfoCircle } from "react-icons/fa";

interface InfoIconProps {
  text: string;
}

export const InfoIconComponent: React.FC<InfoIconProps> = ({ text }) => {
  return (
    <div className="m-2">
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <FaInfoCircle />
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
      </Tooltip.Provider>
    </div>
  );
};
