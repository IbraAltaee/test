"use client";

import { useState, useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";

export const useRecaptcha = () => {
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showRecaptcha, setShowRecaptcha] = useState(true);
  
  const { notifications } = useTranslations();

  const handleRecaptchaVerify = useCallback((tokenParam: string | null) => {
    if (tokenParam) {
      setRecaptchaToken(tokenParam);
      setIsRecaptchaVerified(true);
      setShowRecaptcha(false);
      toast.success(notifications("recaptchaVerificationCompleted"));
    } else {
      setRecaptchaToken(null);
      setIsRecaptchaVerified(false);
      setShowRecaptcha(true);
    }
  }, [notifications]);

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
    toast.warn(notifications("recaptchaExpiredVerifyAgain"));
  }, [notifications]);

  const handleRecaptchaError = useCallback(() => {
    setRecaptchaToken(null);
    setIsRecaptchaVerified(false);
    setShowRecaptcha(true);
    toast.error(notifications("recaptchaFailedOrExpired"));
  }, [notifications]);

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