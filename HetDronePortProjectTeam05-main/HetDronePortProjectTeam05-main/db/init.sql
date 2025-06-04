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