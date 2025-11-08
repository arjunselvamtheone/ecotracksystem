-- ecotrack_schema.sql
DROP DATABASE IF EXISTS EcoTrackSystem;
CREATE DATABASE EcoTrackSystem;
USE EcoTrackSystem;

-- USERS for auth
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','researcher','ranger','auditor') DEFAULT 'researcher',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Habitats (
    habitat_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    area_sq_km DECIMAL(10,2) CHECK (area_sq_km > 0),
    ecosystem_type ENUM('Forest', 'Grassland', 'Wetland', 'Desert', 'Marine') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Species (
    species_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    threat_level ENUM('Low', 'Moderate', 'High', 'Critical') NOT NULL,
    population INT CHECK (population >= 0),
    trend ENUM('Increasing', 'Stable', 'Declining') NOT NULL,
    habitat_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habitat_id) REFERENCES Habitats(habitat_id) ON DELETE SET NULL
);

CREATE TABLE Animals (
    animal_id INT PRIMARY KEY AUTO_INCREMENT,
    species_id INT NOT NULL,
    habitat_id INT NOT NULL,
    name VARCHAR(50),
    sex ENUM('M','F'),
    date_of_birth DATE,
    health_status ENUM('Excellent','Good','Fair','Poor') NOT NULL DEFAULT 'Good',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE,
    FOREIGN KEY (habitat_id) REFERENCES Habitats(habitat_id) ON DELETE CASCADE
);

CREATE TABLE Tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT UNIQUE NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(50),
    battery_status ENUM('Full','Medium','Low','Critical') NOT NULL DEFAULT 'Full',
    activation_date DATE NOT NULL,
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES Animals(animal_id) ON DELETE CASCADE
);

CREATE TABLE SensorReadings (
    reading_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_id INT NOT NULL,
    latitude DECIMAL(10,8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11,8) CHECK (longitude BETWEEN -180 AND 180),
    gps_timestamp TIMESTAMP NOT NULL,
    heart_rate INT CHECK (heart_rate > 0),
    temperature DECIMAL(5,2),
    signal_strength INT CHECK (signal_strength BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE Programs (
    program_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    habitat_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('Active','Completed','Suspended') NOT NULL DEFAULT 'Active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habitat_id) REFERENCES Habitats(habitat_id) ON DELETE CASCADE
);

CREATE TABLE Funding (
    funding_id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    amount DECIMAL(15,2) CHECK (amount > 0),
    allocation_date DATE NOT NULL,
    donor VARCHAR(100) NOT NULL,
    utilized_amount DECIMAL(15,2) DEFAULT 0 CHECK (utilized_amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES Programs(program_id) ON DELETE CASCADE,
    CHECK (utilized_amount <= amount)
);

CREATE TABLE Incidents (
    incident_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    habitat_id INT NOT NULL,
    type ENUM('Poaching','Rescue','Natural Death','Accident','Illness') NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(200),
    description TEXT,
    severity ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES Animals(animal_id) ON DELETE CASCADE,
    FOREIGN KEY (habitat_id) REFERENCES Habitats(habitat_id) ON DELETE CASCADE
);

CREATE TABLE MortalityRecords (
    mortality_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT UNIQUE NOT NULL,
    species_id INT NOT NULL,
    cause_of_death VARCHAR(100) NOT NULL,
    confirmed_by INT NOT NULL,
    confirmation_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES Incidents(incident_id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE,
    FOREIGN KEY (confirmed_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_species_id ON Animals(species_id);
CREATE INDEX idx_habitat_id ON Animals(habitat_id);
CREATE INDEX idx_gps_timestamp ON SensorReadings(gps_timestamp);
CREATE INDEX idx_tag_id ON SensorReadings(tag_id);
CREATE INDEX idx_incident_date ON Incidents(date);
CREATE INDEX idx_incident_type ON Incidents(type);

-- Sample data
INSERT INTO Habitats (name, location, area_sq_km, ecosystem_type) VALUES
('Serengeti National Park', 'Tanzania', 14763.00, 'Grassland'),
('Amazon Rainforest Reserve', 'Brazil', 55000.00, 'Forest'),
('Sundarbans Mangrove', 'Bangladesh/India', 10000.00, 'Wetland'),
('Sahara Conservation Area', 'North Africa', 120000.00, 'Desert');

INSERT INTO Species (name, threat_level, population, trend, habitat_id) VALUES
('African Elephant', 'Critical', 415000, 'Declining', 1),
('Bengal Tiger', 'High', 2500, 'Stable', 3),
('Jaguar', 'Moderate', 173000, 'Declining', 2),
('Addax Antelope', 'Critical', 100, 'Declining', 4);

INSERT INTO Animals (species_id, habitat_id, name, sex, date_of_birth, health_status) VALUES
(1,1,'Jumbo','M','2015-03-15','Excellent'),
(1,1,'Ellie','F','2018-07-22','Good'),
(2,3,'Rajah','M','2016-11-05','Fair'),
(3,2,'Shadow','F','2019-02-18','Good');

INSERT INTO Users (first_name,last_name,email,password_hash,role,created_at)
VALUES ('Demo','User','demo@ecotrack.org','REPLACE_WITH_BCRYPT_HASH','admin',NOW());

-- Note: replace user password hash above with a real bcrypt hash using the node script below or create via signup route.
