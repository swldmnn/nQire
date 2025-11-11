CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    label TEXT,
    method TEXT,
    url TEXT,
    body TEXT
);

CREATE TABLE headers (
    id INTEGER PRIMARY KEY,
    request_id INTEGER,
    key TEXT,
    value TEXT,
    FOREIGN KEY (request_id) REFERENCES requests(id)
);

INSERT INTO requests (label, method, url, body)
SELECT 'JsonPlaceholder', 'POST', 'https://jsonplaceholder.typicode.com/posts', '{"foo":"bar"}'
UNION ALL
SELECT 'ChuckNorrisJoke', 'GET', 'https://api.chucknorris.io/jokes/random', ''
WHERE NOT EXISTS (SELECT 1 FROM requests);