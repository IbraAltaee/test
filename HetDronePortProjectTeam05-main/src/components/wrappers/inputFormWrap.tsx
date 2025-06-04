"use client";

import dynamic from "next/dynamic";

const InputForm = dynamic(() => import("../InputForm"), {
  ssr: false,
});

type Props = {
  onCalculateResponse: (result: any) => void;
  onHeightChange: (height: number) => void;
  maxHeightError?: string;
};

export default function InputFormWrap({
  onCalculateResponse,
  onHeightChange,
  maxHeightError,
}: Props) {
  return (
    <div className="space-y-6">
      <InputForm
        onCalculate={onCalculateResponse}
        onHeightChange={onHeightChange}
        maxHeightError={maxHeightError}
      />
    </div>
  );
}
