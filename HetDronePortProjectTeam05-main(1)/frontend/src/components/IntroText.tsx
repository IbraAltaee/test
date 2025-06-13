"use client";

import { useTranslations } from "@/hooks/useTranslations";

const HomeInfo = () => {
  const { intro } = useTranslations();

  return (
    <div className="px-4 py-6 mx-4 text-slate-600 text-sm flex items-center flex-col">
      <div>
        <h1>{intro("explanationTitle")}</h1>
        <p>
          {intro("explanationMessage1")}
        </p>
        <p>{intro("explanationMessage2")}</p>
        <h1>{intro("whyTitle")}</h1>
        <p>{intro("whyMessage1")}</p>
        <p>{intro("whyMessage2")}</p>
      </div>
    </div>
  );
};

export default HomeInfo;