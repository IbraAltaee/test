export const generateEmailBody = (data: any) => {
  const stripIndent = (txt: string) =>
    txt
      .replace(/^[ \t]+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const lateralCVSection = (() => {
    const {
      contingencyManoeuvre,
      rollAngle,
      pitchAngle,
      timeToOpenParachute,
      lateralExtension,
    } = data.lateralCV;
    const { type: uavType } = data.uav;

    const lines = [
      `Lateral contingency volume (CV)`,
      `- Contingency manoeuvre: ${contingencyManoeuvre}`,
    ];

    if (contingencyManoeuvre === "PARACHUTE_TERMINATION") {
      lines.push(`- Time to Open Parachute: ${timeToOpenParachute} s`);
    } else {
      if (uavType === "FIXEDWING") {
        lines.push(`- Roll Angle: ${rollAngle}°`);
      } else {
        lines.push(`- Pitch Angle: ${pitchAngle}°`);
      }
    }

    lines.push(
      `- Minimum lateral dimension: ${parseFloat(lateralExtension).toFixed(2)} m`,
    );

    return lines.join("\n");
  })();

  const verticalCVSection = (() => {
    const {
      contingencyManoeuvre,
      responseHeight,
      timeToOpenParachute,
      heightContingencyManoeuvre,
      minVerticalDimension,
    } = data.verticalCV;
    const hasLateralParachute =
      data.lateralCV.contingencyManoeuvre === "PARACHUTE_TERMINATION";

    const lines = [
      `Vertical contingency volume (CV)`,
      `- Contingency manoeuvre: ${contingencyManoeuvre}`,
      `- Response height: ${parseFloat(responseHeight).toFixed(2)} m`,
      `- Height of Contingency Manoeuvre: ${parseFloat(heightContingencyManoeuvre).toFixed(2)} m`,
    ];

    if (
      contingencyManoeuvre === "PARACHUTE_TERMINATION" &&
      !hasLateralParachute
    ) {
      lines.push(`- Time to open parachute: ${timeToOpenParachute} s`);
    }

    lines.push(
      `- Minimum vertical dimension: ${parseFloat(minVerticalDimension).toFixed(2)} m`,
    );

    return lines.join("\n");
  })();

  const grbSection = (() => {
    const {
      termination,
      timeToOpenParachute,
      maxPermissibleWindSpeed,
      rateOfDescent,
      glideRatio,
      minLateralDimension,
    } = data.grb;
    const hasLateralParachute =
      data.lateralCV.contingencyManoeuvre === "PARACHUTE_TERMINATION";
    const hasVerticalParachute =
      data.verticalCV.contingencyManoeuvre === "PARACHUTE_TERMINATION";

    const lines = [
      `Ground risk buffer (GRB)`,
      `- Termination method: ${termination}`,
    ];

    if (
      termination === "PARACHUTE" &&
      !hasLateralParachute &&
      !hasVerticalParachute
    ) {
      lines.push(`- Time to open parachute: ${timeToOpenParachute} s`);
      lines.push(`- Maximum wind speed: ${maxPermissibleWindSpeed} m/s`);
      lines.push(`- Parachute descent rate: ${rateOfDescent} m/s`);
    }

    if (
      termination === "PARACHUTE" &&
      (hasLateralParachute || hasVerticalParachute)
    ) {
      lines.push(`- Maximum wind speed: ${maxPermissibleWindSpeed} m/s`);
      lines.push(`- Parachute descent rate: ${rateOfDescent} m/s`);
    }
    if (termination === "OFF_GLIDING") {
      lines.push(`- Glide ratio: ${glideRatio}`);
    }

    lines.push(
      `- Minimum lateral dimension: ${parseFloat(minLateralDimension).toFixed(2)} m`,
    );

    return lines.join("\n");
  })();

  const body = `
    A request has been generated using the following UAV data:

    UAV
    - UAV type: ${data.uav.type}
    - Maximum operational speed: ${data.uav.maxOperationalSpeed} m/s
    - Maximum characteristic dimension: ${data.uav.maxCharacteristicDimension} m
    - Altitude measurement error type: ${data.uav.altitudeMeasurementErrorType} m
    - Altitude measurement error: ${data.uav.altitudeMeasurementError} m
    - GPS Inaccuracy: ${data.uav.gpsInaccuracy} m
    - Position Holding Error: ${data.uav.positionHoldingError} m
    - Map Error: ${data.uav.mapError} m
    - System Response Time: ${data.uav.responseTime} s

    ${lateralCVSection}

    ${verticalCVSection}

    ${grbSection}

    Adjacent Volume
    - Lateral Dimension: ${parseFloat(data.adjacentVolume.lateralInMeter).toFixed(2)} m
    - Vertical Dimension: ${parseFloat(data.adjacentVolume.verticalInMeter).toFixed(2)} m

    Flight Geography
    - Height of Flight Geography: ${data.flightGeography.heightFlightGeo} m
    - Minimum Height: ${parseFloat(data.flightGeography.minHeight).toFixed(2)} m
    - Minimum Width: ${parseFloat(data.flightGeography.minWdith).toFixed(2)} m

    You can find the generated KML as an attachment.
    `;

  return stripIndent(body);
};
