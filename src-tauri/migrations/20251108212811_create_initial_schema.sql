CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    label TEXT,
    method TEXT,
    url TEXT,
    body TEXT,
);

CREATE TABLE headers (
    id INTEGER PRIMARY KEY,
    request_id INTEGER FOREIGN KEY REFERENCES requests(id)
    key TEXT,
    value TEXT,
);