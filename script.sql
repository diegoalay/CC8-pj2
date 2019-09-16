CREATE TABLE Events(
    event_id SERIAL,
    description text,    
);

CREATE TABLE Configurations(
    configuration_id SERIAL,
    event_id INTEGER,
    activation_date TIMESTAMP,
    desactivation_date TIMESTAMP,
    activation_humidity DECIMAL,
    desactivation_humidity DECIMAL,
    event_time DECIMAL,
);

CREATE TABLE Logs( 
	log_id SERIAL,
    event_id INTEGER,
    configuration_id INTEGER,
	description text,
    FOREIGN KEY(event_id) REFERENCES Events(Events),
    FOREIGN KEY(configuration_id) REFERENCES Configurations(configuration_id),
	PRIMARY KEY(log_id)
);