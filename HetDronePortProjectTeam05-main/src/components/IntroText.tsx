"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

const HomeInfo = () => {
  const { intro } = useTranslations();
  
  return (
    <div className="px-4 py-6 max-w-3xl mx-auto text-slate-600 text-sm">
      <p>
        {intro("welcomeMessage")}
      </p>
    </div>
  );
};

export default HomeInfo;