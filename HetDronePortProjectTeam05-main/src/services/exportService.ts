import { DroneOperationFormState } from "@/types/droneOperationFormState";

const exportDroneFormConfig = (
  formState: DroneOperationFormState,
  filename: string = "drone_form_config.json",
): void => {
  const blob = new Blob([JSON.stringify(formState, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportService = {
  exportDroneFormConfig,
};

export default exportService;
