import { useAuth } from "@/providers/AuthProvider";
import EmailService from "@/services/EmailService";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";
import { useTranslations } from "@/hooks/useTranslations";

const EmailConfig: React.FC = () => {
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { isAuthenticated } = useAuth();
  const { emailConfig, common } = useTranslations();

  useEffect(() => {
    if (isAuthenticated) {
      loadEmailTemplate();
    }
  }, [isAuthenticated]);

  const loadEmailTemplate = async () => {
    if (!isAuthenticated) {
      setError(emailConfig("authenticationRequired"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response: any = await EmailService.getTemplate();
      setEmailSubject(
        response.subject ? response.subject.replace(/\\n/g, "\n") : "",
      );
      setEmailBody(response.body ? response.body.replace(/\\n/g, "\n") : "");
      setHasChanges(false);
    } catch (err: any) {
      const errorMsg = err.message || emailConfig("failedToLoadTemplate");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (value: string) => {
    setEmailSubject(value);
    setHasChanges(true);
    setError(null);
  };

  const handleBodyChange = (value: string) => {
    setEmailBody(value);
    setHasChanges(true);
    setError(null);
  };

  const handleSaveChanges = async () => {
    if (!isAuthenticated) {
      setError(emailConfig("authenticationRequired"));
      return;
    }

    if (!emailSubject.trim()) {
      setError(emailConfig("subjectCannotBeEmpty"));
      return;
    }

    if (!emailBody.trim()) {
      setError(emailConfig("bodyCannotBeEmpty"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Updated to use ApiClient (no token needed)
      await EmailService.updateTemplate(emailSubject, emailBody);

      setHasChanges(false);
      toast.success(emailConfig("templateSavedSuccessfully"));
    } catch (err: any) {
      const errorMsg = err.message || emailConfig("failedToSaveTemplate");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    loadEmailTemplate();
  };

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {emailConfig("emailConfiguration")}
            </h2>
            <p className="text-gray-600">
              {emailConfig("authenticationRequired")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !emailBody && !emailSubject) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {emailConfig("emailConfiguration")}
          </h2>
          <p className="text-gray-600 text-sm">
            {emailConfig("configureDefaultEmailTemplate")}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="email-subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {emailConfig("emailSubjectTemplate")}
            </label>
            <input
              id="email-subject"
              type="text"
              value={emailSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={emailConfig("enterDefaultEmailSubject")}
              disabled={loading || !isAuthenticated}
            />
            <p className="mt-2 text-sm text-gray-500">
              {emailConfig("subjectTemplateDescription")}
            </p>
          </div>

          <div>
            <label
              htmlFor="email-body"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {emailConfig("emailBodyTemplate")}
            </label>
            <textarea
              id="email-body"
              rows={12}
              value={emailBody}
              onChange={(e) => handleBodyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={emailConfig("enterDefaultEmailBody")}
              disabled={loading || !isAuthenticated}
            />
            <p className="mt-2 text-sm text-gray-500">
              {emailConfig("bodyTemplateDescription")}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={loading || !hasChanges || !isAuthenticated}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading || !hasChanges || !isAuthenticated
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    {common("saving")}...
                  </>
                ) : (
                  emailConfig("saveChanges")
                )}
              </button>

              {hasChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading || !isAuthenticated}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {common("cancel")}
                </button>
              )}
            </div>

            {hasChanges && (
              <p className="text-sm text-orange-600">
                {emailConfig("unsavedChanges")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfig;