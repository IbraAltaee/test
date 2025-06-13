import MyDocument from "@/components/generatePDF";
import { Email } from "@/types/email";
import {
  generateFlightGeography,
  generateKmlFromPolygons,
} from "@/utils/kmlPolygonGenerator";
import { pdf } from "@react-pdf/renderer";


const sendEmailNotification = async ({ to, subject, body, files }: Email) => {
  try {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    if (files && files.length > 0) {
      files.forEach((file: File) => {
        formData.append("file", file, file.name);
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/send-notification`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendEmailToClient = async ({ to, subject, files }: any) => {
  try {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    if (files && files.length > 0) {
      files.forEach((file: File) => {
        formData.append("file", file, file.name);
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/send`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const getTemplate = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/template`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch email template");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

const updateTemplate = async (subject: string, body: string, token:String) => {
  const formData = new FormData();
  formData.append("body", body);
  formData.append("subject", subject);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/template`,
      {
        headers: {  
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      },
    );

    if (!response.ok) {

      throw new Error("Failed to update email template");
    }

    return true;
  } catch (error) {
    console.error("Error updating email template:", error);
    return false;
  }
};

const generateKmlFile = (polygonData: any) => {
  const kmlContent = generateKmlFromPolygons(polygonData);
  const kmlBlob = new Blob([kmlContent], {
    type: "application/vnd.google-earth.kml+xml",
  });
  return new File([kmlBlob], "flight-area.kml", {
    type: "application/vnd.google-earth.kml+xml",
  });
};

const generateFGKmlFile = (
  selectedPolygon: any,
  groundRiskBuffer: number,
  contingencyVolume: number,
) => {
  const kmlContent = generateFlightGeography(
    selectedPolygon,
    groundRiskBuffer,
    contingencyVolume,
  );
  const kmlString = JSON.stringify(kmlContent);
  const kmlBlob = new Blob([kmlString], {
    type: "application/vnd.google-earth.kml+xml",
  });
  return new File([kmlBlob], "flight-area-fg.kml", {
    type: "application/vnd.google-earth.kml+xml",
  });
};

const generateKmlFile3D = (kmlContent: any) => {
  const kmlBlob = new Blob([kmlContent], {
    type: "application/vnd.google-earth.kml+xml",
  });
  return new File([kmlBlob], "flight-area-3D.kml", {
    type: "application/vnd.google-earth.kml.xml",
  });
};

const generatePDFFile = async (data: any) => {
  const blob = await pdf(<MyDocument data={data} />).toBlob();

  return new File([blob], "drone-data.pdf", { type: "application/pdf" });
};

const getSwitchState = async () => {
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/notifications-enabled`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        },
        );

        if (!response.ok) {
        throw new Error("Failed to fetch switch state");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching switch state:", error);
        throw error;
    }
}

const updateSwitchState = async (isSwitchOn: boolean, token: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/toggle-notifications`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(isSwitchOn),
            },
        );

        if (!response.ok) {
        throw new Error("Failed to update switch state");
        }

        return true;
    } catch (error) {
        console.error("Error updating switch state:", error);
        return false;
    }
}

const EmailService = {
  sendEmailNotification,
  sendEmailToClient,
  getTemplate,
  updateTemplate,
  generateKmlFile,
  generateKmlFile3D,
  generatePDFFile,
  generateFGKmlFile,
  getSwitchState,
    updateSwitchState,
};

export default EmailService;
