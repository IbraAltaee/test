"use client";

import React from "react";
import { FaArrowUp, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/hooks/useTranslations";

const Footer: React.FC = () => {
  const { footer, common } = useTranslations();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const developers = [
    { name: "Rune Daman", linkedin: "https://www.linkedin.com/in/rune-daman/" },
    { name: "Ibra Altaee", linkedin: "https://www.linkedin.com/in/ibrahim-altaee/" },
    { name: "Stijn Alexander", linkedin: "https://www.linkedin.com/in/stijn-alexander/" },
    { name: "Tom Lambregts", linkedin: "https://www.linkedin.com/in/tom-lambregts/" },
  ];

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative" role="contentinfo">
      {/* Scroll to top button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 hover:cursor-pointer"
          aria-label={common("goToTop")}
        >
          <FaArrowUp size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <img
              src="/Droneport_Logo.png"
              alt="Drone Logo"
              loading="lazy"
              className="h-10 w-auto cursor-pointer mb-4"
            />
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              {footer("advancedDroneOperations")}
            </p>
          </div>

          {/* Contact info */}
          <div className="ml-auto">
            <h4 className="text-lg font-semibold mb-4 text-slate-300">{footer("contact")}</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center space-x-2">
                <FaEnvelope />
                <a
                  href="mailto:info@droneport.eu"
                  className="hover:text-blue-400 transition-colors"
                >
                  info@droneport.eu
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaLinkedin />
                <a
                  href="https://linkedin.com/company/droneport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Developer list */}
          <div className="mx-auto">  
            <h4 className="text-lg font-semibold mb-4 text-slate-300">
              {footer("developers")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {developers.map((dev) => (
                <li key={dev.name} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                    aria-label={`LinkedIn profile of ${dev.name}`}
                  >
                    {dev.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & links */}
        <div className="border-t border-slate-700 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-slate-400">
              <p>{footer("allRightsReserved")}</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a
                href="https://droneport.eu/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                {footer("privacyPolicy")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
