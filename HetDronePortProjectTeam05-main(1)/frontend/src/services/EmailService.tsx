import MyDocument from "@/components/generatePDF";
import {
  generateFlightGeography,
  generateKmlFromPolygons,
} from "@/utils/kmlPolygonGenerator";
import { pdf } from "@react-pdf/renderer";

import { ApiClient } from "@/utils/apiClient";

const sendEmailToClient = async (emailData: any) => {
  return ApiClient.post("/email/send", emailData);
};

const sendEmailNotification = async (emailData: any) => {
  return ApiClient.post("/email/send", emailData);
};

const getTemplate = async () => {
  return ApiClient.get("/email/admin/template");
};

const updateTemplate = async (subject: string, body: string) => {
  return ApiClient.put("/email/admin/template", { subject, body });
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

const EmailService = {
  sendEmailNotification,
  sendEmailToClient,
  getTemplate,
  updateTemplate,
  generateKmlFile,
  generateKmlFile3D,
  generatePDFFile,
  generateFGKmlFile,
};

export default EmailService;
