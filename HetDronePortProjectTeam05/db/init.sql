-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS zones (
    name VARCHAR(255) PRIMARY KEY,
    max_height INT
);

CREATE TABLE IF NOT EXISTS zone_points (
    zone_name VARCHAR(255) NOT NULL,
    point_order INT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (zone_name, point_order),
    FOREIGN KEY (zone_name) REFERENCES zones(name) ON DELETE CASCADE
);

-- Clear existing data (optional - remove if you don't want to delete existing data)
DELETE FROM zone_points;
DELETE FROM zones;

-- Insert zone EBR64
INSERT INTO zones (name, max_height) VALUES ('EBR64', 2000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR64', 0, 50.81, 5.156944),
    ('EBR64', 1, 50.817222, 5.1975),
    ('EBR64', 2, 50.809722, 5.227222),
    ('EBR64', 3, 50.7825, 5.265278),
    ('EBR64', 4, 50.731944, 5.2625),
    ('EBR64', 5, 50.785833, 5.105556);

-- Insert zone EBR63
INSERT INTO zones (name, max_height) VALUES ('EBR63', 650*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR63', 0, 50.776389, 5.155556),
    ('EBR63', 1, 50.775556, 5.165833),
    ('EBR63', 2, 50.7725, 5.173889),
    ('EBR63', 3, 50.766111, 5.165556),
    ('EBR63', 4, 50.771389, 5.148611);

-- Insert zone EBR62
INSERT INTO zones (name, max_height) VALUES ('EBR62', 2000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR62', 0, 50.795833, 5.203889),
    ('EBR62', 1, 50.789444, 5.187778),
    ('EBR62', 2, 50.795278, 5.186944),
    ('EBR62', 3, 50.8, 5.190278),
    ('EBR62', 4, 50.800833, 5.198333);

-- Insert zone EBR61South
INSERT INTO zones (name, max_height) VALUES ('EBR61South', 1000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR61South', 0, 50.793056, 5.193056),
    ('EBR61South', 1, 50.795278, 5.187222),
    ('EBR61South', 2, 50.792222, 5.186944),
    ('EBR61South', 3, 50.791944, 5.1925);

-- Insert zone EBR61North
INSERT INTO zones (name, max_height) VALUES ('EBR61North', 1000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR61North', 0, 50.797778, 5.189167),
    ('EBR61North', 1, 50.794167, 5.193333),
    ('EBR61North', 2, 50.793056, 5.193056),
    ('EBR61North', 3, 50.795278, 5.187222);

-- Insert zone EBR66
INSERT INTO zones (name, max_height) VALUES ('EBR66', 550*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR66', 0, 50.795833, 5.203889),
    ('EBR66', 1, 50.800556, 5.188611),
    ('EBR66', 2, 50.804444, 5.201944),
    ('EBR66', 3, 50.797778, 5.209167);

-- Insert zone EBR72
INSERT INTO zones (name, max_height) VALUES ('EBR72', 2000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR72', 0, 50.81, 5.156944),
    ('EBR72', 1, 50.817222, 5.1975),
    ('EBR72', 2, 50.809722, 5.227222),
    ('EBR72', 3, 50.806111, 5.232222),
    ('EBR72', 4, 50.772778, 5.143889),
    ('EBR72', 5, 50.785833, 5.105556);

-- Insert zone EBR73
INSERT INTO zones (name, max_height) VALUES ('EBR73', 2000*0.3048);
INSERT INTO zone_points (zone_name, point_order, lat, lng) VALUES
    ('EBR73', 0, 50.806111, 5.232222),
    ('EBR73', 1, 50.7825, 5.265278),
    ('EBR73', 2, 50.731944, 5.2625),
    ('EBR73', 3, 50.772778, 5.143889);
	