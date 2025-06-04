import { useAuth } from "@/providers/AuthProvider";
import EmailService from "@/services/EmailService";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";

const EmailConfig: React.FC = () => {
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    loadEmailTemplate();
  }, []);

  const loadEmailTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await EmailService.getTemplate();
      setEmailSubject(
        response.subject ? response.subject.replace(/\\n/g, "\n") : "",
      );
      setEmailBody(response.body ? response.body.replace(/\\n/g, "\n") : "");
      setHasChanges(false);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load email template";
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
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (!emailSubject.trim()) {
      setError("Email subject cannot be empty");
      return;
    }

    if (!emailBody.trim()) {
      setError("Email body cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = EmailService.updateTemplate(emailSubject, emailBody);

      if (!response) {
        throw new Error("Failed to save email template");
      }

      setHasChanges(false);
      toast.success("Email template saved successfully!");
    } catch (err: any) {
      const errorMsg = err.message || "Failed to save email template";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    loadEmailTemplate();
  };

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
            Email Configuration
          </h2>
          <p className="text-gray-600 text-sm">
            Configure the default email subject and body template that will be
            used when users send emails.
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
              Email Subject Template
            </label>
            <input
              id="email-subject"
              type="text"
              value={emailSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the default email subject here..."
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              This template will be used as the default email subject when users
              send emails through the system.
            </p>
          </div>

          <div>
            <label
              htmlFor="email-body"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Body Template
            </label>
            <textarea
              id="email-body"
              rows={12}
              value={emailBody}
              onChange={(e) => handleBodyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Enter the default email body template here..."
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              This template will be used as the default email body when users
              send emails through the system.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={loading || !hasChanges}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading || !hasChanges
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

              {hasChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              )}
            </div>

            {hasChanges && (
              <p className="text-sm text-orange-600">
                You have unsaved changes
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfig;
