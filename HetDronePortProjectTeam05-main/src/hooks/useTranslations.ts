import { useLanguage } from "@/providers/LanguageProvider";

export const useTranslations = () => {
  const { t } = useLanguage();
  
  return {
    t,
    header: (key: string, params?: Record<string, any>) => t(`header.${key}`, params),
    form: (key: string, params?: Record<string, any>) => t(`form.${key}`, params),
    dashboard: (key: string, params?: Record<string, any>) => t(`dashboard.${key}`, params),
    zone: (key: string, params?: Record<string, any>) => t(`zone.${key}`, params),
    map: (key: string, params?: Record<string, any>) => t(`map.${key}`, params),
    results: (key: string, params?: Record<string, any>) => t(`results.${key}`, params),
    auth: (key: string, params?: Record<string, any>) => t(`auth.${key}`, params),
    footer: (key: string, params?: Record<string, any>) => t(`footer.${key}`, params),
    common: (key: string, params?: Record<string, any>) => t(`common.${key}`, params),
    validation: (key: string, params?: Record<string, any>) => t(`validation.${key}`, params),
    notifications: (key: string, params?: Record<string, any>) => t(`notifications.${key}`, params),
    confirmations: (key: string, params?: Record<string, any>) => t(`confirmations.${key}`, params),
    tooltips: (key: string, params?: Record<string, any>) => t(`tooltips.${key}`, params),
    droneManagement: (key: string, params?: Record<string, any>) => t(`droneManagement.${key}`, params),
    intro: (key: string, params?: Record<string, any>) => t(`intro.${key}`, params),
    emailConfig: (key: string, params?: Record<string, any>) => t(`emailConfig.${key}`, params),
  };
};

export const useValidationTranslations = () => {
  const { validation, notifications } = useTranslations();
  
  return {
    getValidationMessage: (key: string, params?: Record<string, any>) => validation(key, params),
    getNotificationMessage: (key: string, params?: Record<string, any>) => notifications(key, params),
  };
};