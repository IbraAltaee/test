"use client";

import React from "react";
import { FaArrowUp, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import { useTranslations } from "@/hooks/useTranslations";

const Footer: React.FC = () => {
  const { footer, common } = useTranslations();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={common("goToTop")}
        >
          <FaArrowUp size={20} />
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GiDeliveryDrone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  DronePort
                </h3>
                <p className="text-sm text-slate-300">{footer("operationsAssistant")}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-md">
              {footer("advancedDroneOperations")}
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-700"
                aria-label="Email contact"
              >
                <FaEnvelope size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-700"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">{footer("features")}</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{footer("flightGeographyCalculation")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{footer("contingencyVolumeAnalysis")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{footer("groundRiskBufferAssessment")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{footer("kmlFileGeneration")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{footer("exportImportCalculations")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-slate-400">
              <p>{footer("allRightsReserved")}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors">
                {footer("privacyPolicy")}
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                {footer("termsOfService")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;