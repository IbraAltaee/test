CREATE TABLE IF NOT EXISTS zones (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    max_height INT
);

CREATE TABLE IF NOT EXISTS zone_points (
    zone_id BIGINT NOT NULL,
    point_order INT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (zone_id, point_order),
    FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);

-- Zone EBR64
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR64', 2000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.81, 5.156944),
    (1, 50.817222, 5.1975),
    (2, 50.809722, 5.227222),
    (3, 50.7825, 5.265278),
    (4, 50.731944, 5.2625),
    (5, 50.785833, 5.105556)
) AS p(point_order, lat, lng);

-- Zone EBR63
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR63', 650*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.776389, 5.155556),
    (1, 50.775556, 5.165833),
    (2, 50.7725, 5.173889),
    (3, 50.766111, 5.165556),
    (4, 50.771389, 5.148611)
) AS p(point_order, lat, lng);

-- Zone EBR62
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR62', 2000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.795833, 5.203889),
    (1, 50.789444, 5.187778),
    (2, 50.795278, 5.186944),
    (3, 50.8, 5.190278),
    (4, 50.800833, 5.198333)
) AS p(point_order, lat, lng);

-- Zone EBR61South
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR61South', 1000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.793056, 5.193056),
    (1, 50.795278, 5.187222),
    (2, 50.792222, 5.186944),
    (3, 50.791944, 5.1925)
) AS p(point_order, lat, lng);

-- Zone EBR61North
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR61North', 1000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.797778, 5.189167),
    (1, 50.794167, 5.193333),
    (2, 50.793056, 5.193056),
    (3, 50.795278, 5.187222)
) AS p(point_order, lat, lng);

-- Zone EBR66
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR66', 550*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.795833, 5.203889),
    (1, 50.800556, 5.188611),
    (2, 50.804444, 5.201944),
    (3, 50.797778, 5.209167)
) AS p(point_order, lat, lng);

-- Zone EBR72
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR72', 2000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.81, 5.156944),
    (1, 50.817222, 5.1975),
    (2, 50.809722, 5.227222),
    (3, 50.806111, 5.232222),
    (4, 50.772778, 5.143889),
    (5, 50.785833, 5.105556)
) AS p(point_order, lat, lng);

-- Insert zone EBR73
WITH z AS (
    INSERT INTO zones (name, max_height)
    VALUES ('EBR73', 2000*0.3048)
    RETURNING id
)
INSERT INTO zone_points (zone_id, point_order, lat, lng)
SELECT z.id, p.point_order, p.lat, p.lng
FROM z, (VALUES
    (0, 50.806111, 5.232222),
    (1, 50.7825, 5.265278),
    (2, 50.731944, 5.2625),
    (3, 50.772778, 5.143889)
) AS p(point_order, lat, lng);

-- Insert email configuration
CREATE TABLE IF NOT EXISTS email_templates (
    name VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
	subject VARCHAR(255) NOT NULL
);

INSERT INTO email_templates (name, body, subject) VALUES (
    'default',
    'Beste,

Hartelijk dank voor je aanvraag om gebruik te maken van het luchtruim boven DronePort.

In de bijlage vind je de KML-bestanden die je kunt gebruiken om de flight geography in te geven via het SkeyDrone-platform. Deze bestanden bevatten de nodige geografische zones waarin het droneverkeer gepland kan worden.

Gelieve deze bestanden correct te uploaden bij het aanmaken van je operationele aanvraag in SkeyDrone. Indien je tijdens dit proces vragen hebt of ondersteuning nodig hebt, aarzel dan niet om ons te contacteren.

Met vriendelijke groet,
DronePort',
    'Flight Geography – KML-bestanden voor aanvraag Droneport'
);

-- UAV table
CREATE TABLE IF NOT EXISTS uav (
  id SERIAL PRIMARY KEY,
  type SMALLINT NOT NULL,
  max_operational_speed DOUBLE PRECISION NOT NULL,
  max_characteristic_dimension DOUBLE PRECISION NOT NULL,
  altitude_measurement_error_type VARCHAR(50) NOT NULL,
  altitude_measurement_error INT NOT NULL,
  gps_inaccuracy INT NOT NULL,
  position_holding_error INT NOT NULL,
  map_error INT NOT NULL,
  response_time DOUBLE PRECISION NOT NULL
);

-- Ground Risk Buffer
CREATE TABLE IF NOT EXISTS ground_risk_buffer (
  id SERIAL PRIMARY KEY,
  termination SMALLINT NOT NULL,
  time_to_open_parachute DOUBLE PRECISION,
  max_permissible_wind_speed DOUBLE PRECISION,
  rate_of_descent DOUBLE PRECISION,
  glide_ratio DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_lateral_dimension DOUBLE PRECISION
);

-- Lateral Contingency Volume
CREATE TABLE IF NOT EXISTS lateral_contingency_volume (
  id SERIAL PRIMARY KEY,
  contingency_manoeuvre SMALLINT NOT NULL,
  roll_angle INT NOT NULL,
  time_to_open_parachute DOUBLE PRECISION,
  pitch_angle INT NOT NULL,
  lateral_extension DOUBLE PRECISION
);

-- Vertical Contingency Volume
CREATE TABLE IF NOT EXISTS vertical_contingency_volume (
  id SERIAL PRIMARY KEY,
  contingency_manoeuvre SMALLINT NOT NULL,
  response_height DOUBLE PRECISION,
  time_to_open_parachute DOUBLE PRECISION,
  height_contingency_manoeuvre DOUBLE PRECISION,
  min_vertical_dimension DOUBLE PRECISION
);

-- Drones
CREATE TABLE IF NOT EXISTS drones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  uav_id INT NOT NULL REFERENCES uav(id),
  lateral_contingency_volume_id INT NOT NULL REFERENCES lateral_contingency_volume(id),
  vertical_contingency_volume_id INT NOT NULL REFERENCES vertical_contingency_volume(id),
  ground_risk_buffer_id INT NOT NULL REFERENCES ground_risk_buffer(id)
);



-- Seed UAVs
WITH uav_data AS (
  INSERT INTO uav (
    type, max_operational_speed, max_characteristic_dimension,
    altitude_measurement_error_type, altitude_measurement_error,
    gps_inaccuracy, position_holding_error, map_error, response_time
  ) VALUES
    (2, 20.0, 1.2, 'barometric', 1, 3, 3, 1, 1.0),
    (0, 50.0, 2.0, 'GPS-based', 4, 3, 3, 1, 1.0)
  RETURNING id
), 

-- Seed Ground Risk Buffers
grb_data AS (
  INSERT INTO ground_risk_buffer (
    termination, time_to_open_parachute, max_permissible_wind_speed,
    rate_of_descent, glide_ratio, min_lateral_dimension
  ) VALUES
    (2, 3.5, 10.0, 5.0, 0.0, 8.0),  -- PARACHUTE
    (1, 0.0, 0.0, 0.0, 4.5, 10.0)   -- OFF_GLIDING
  RETURNING id
), 

-- Seed Lateral Contingency Volumes
lcv_data AS (
  INSERT INTO lateral_contingency_volume (
    contingency_manoeuvre, roll_angle, time_to_open_parachute,
    pitch_angle, lateral_extension
  ) VALUES
    (0, 30, 0.0, 40, 5.0),  -- STOPPING
    (2, 45, 0.0, 45, 6.0)   -- TURN_180
  RETURNING id
), 

-- Seed Vertical Contingency Volumes
vcv_data AS (
  INSERT INTO vertical_contingency_volume (
    contingency_manoeuvre, response_height, time_to_open_parachute,
    height_contingency_manoeuvre, min_vertical_dimension
  ) VALUES
    (1, 20.0, 4.0, 15.0, 10.0),  -- PARACHUTE_TERMINATION
    (3, 25.0, 0.0, 18.0, 12.0)   -- ENERGY_CONVERSION
  RETURNING id
)

-- Finally, seed the Drones
INSERT INTO drones (
  name, uav_id, lateral_contingency_volume_id,
  vertical_contingency_volume_id, ground_risk_buffer_id
)
VALUES
  (
    'Drone Alpha',
    (SELECT id FROM uav_data OFFSET 0 LIMIT 1),
    (SELECT id FROM lcv_data OFFSET 0 LIMIT 1),
    (SELECT id FROM vcv_data OFFSET 0 LIMIT 1),
    (SELECT id FROM grb_data OFFSET 0 LIMIT 1)
  ),
  (
    'Drone Beta',
    (SELECT id FROM uav_data OFFSET 1 LIMIT 1),
    (SELECT id FROM lcv_data OFFSET 1 LIMIT 1),
    (SELECT id FROM vcv_data OFFSET 1 LIMIT 1),
    (SELECT id FROM grb_data OFFSET 1 LIMIT 1)
  );

