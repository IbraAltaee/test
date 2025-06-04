"use client";

import { useState, useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

export const useRecaptcha = () => {
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showRecaptcha, setShowRecaptcha] = useState(true);

  const handleRecaptchaVerify = useCallback((tokenParam: string | null) => {
    if (tokenParam) {
      setRecaptchaToken(tokenParam);
      setIsRecaptchaVerified(true);
      setShowRecaptcha(false);
      toast.success("reCAPTCHA verification completed!");
    } else {
      setRecaptchaToken(null);
      setIsRecaptchaVerified(false);
      setShowRecaptcha(true);
    }
  }, []);

  const resetRecaptcha = useCallback(() => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
    setShowRecaptcha(true);
  }, []);

  const handleRecaptchaExpired = useCallback(() => {
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
    setShowRecaptcha(true);
    toast.warn("reCAPTCHA verification expired. Please verify again.");
  }, []);

  const handleRecaptchaError = useCallback(() => {
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
    setShowRecaptcha(true);
    toast.error("reCAPTCHA error. Please try again.");
  }, []);

  return {
    isRecaptchaVerified,
    recaptchaToken,
    recaptchaRef,
    showRecaptcha,
    setShowRecaptcha,
    handleRecaptchaVerify,
    resetRecaptcha,
    handleRecaptchaExpired,
    handleRecaptchaError,
  };
};
