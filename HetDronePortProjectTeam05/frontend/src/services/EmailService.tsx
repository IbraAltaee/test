import MyDocument from "@/components/generatePDF";
import { Email } from "@/types/email";
import { generateFlightGeography, generateKmlFromPolygons } from "@/utils/kmlPolygonGenerator";
import { pdf } from "@react-pdf/renderer";

const sendEmail = async ({ to, subject, body, files }: Email) => {
  try {
    const formData = new FormData();
    formData.append("to", to); // Changed "email" to "to" to match backend @RequestParam
    formData.append("subject", subject);
    formData.append("body", body);
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append("file", file, file.name);
      });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email/send`, {
      method: "POST",
      body: formData, // Don't set headers — browser sets multipart/form-data automatically
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
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
  const kmlContent = generateFlightGeography(selectedPolygon, groundRiskBuffer, contingencyVolume);
  const kmlString = typeof kmlContent === "string" ? kmlContent : JSON.stringify(kmlContent);
  const kmlBlob = new Blob([kmlString], {
    type: "application/vnd.google-earth.kml+xml",
  });
  return new File([kmlBlob], "flight-area-fg.kml", {
    type: "application/vnd.google-earth.kml+xml",
  });
}

const generateKmlFile3D = (kmlContent: any) => {
  const kmlBlob = new Blob([kmlContent], {
    type: "application/vnd.google-earth.kml+xml",
  });
  return new File([kmlBlob], "flight-area-3D.kml", {
    type: "application/vnd.google-earth.kml.xml",
  });
};

const generatePDFFile = async (data: any) => {
  const blob = await pdf(<MyDocument data={data}/>).toBlob(); 

  return new File([blob], "drone-data.pdf", {type: "application/pdf"});
}

const EmailService = {
  sendEmail,
  generateKmlFile,
  generateKmlFile3D,
  generatePDFFile,
  generateFGKmlFile,
};

export default EmailService;
