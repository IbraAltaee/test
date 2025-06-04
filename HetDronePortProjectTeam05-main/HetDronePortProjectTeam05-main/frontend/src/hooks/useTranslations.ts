import { useLanguage } from "@/providers/LanguageProvider";

export const useTranslations = () => {
  return useLanguage();
};

export const useValidationTranslations = () => {
  const { t } = useLanguage();
  
  return {
    getValidationMessage: (key: string, params?: Record<string, any>) => t(`validation.${key}`, params),
    getNotificationMessage: (key: string, params?: Record<string, any>) => t(`notifications.${key}`, params),
  };
};