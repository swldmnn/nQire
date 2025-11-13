CREATE TABLE request_sets (
    id INTEGER PRIMARY KEY,
    label TEXT
);

CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    request_set_id INTEGER,
    label TEXT,
    method TEXT,
    url TEXT,
    body TEXT,
    FOREIGN KEY (request_set_id) REFERENCES request_sets(id)
);

CREATE TABLE request_headers (
    id INTEGER PRIMARY KEY,
    request_id INTEGER,
    key TEXT,
    value TEXT,
    FOREIGN KEY (request_id) REFERENCES requests(id)
);

INSERT INTO request_sets (id, label)
SELECT 1, 'Mock APIs'
UNION ALL SELECT 2, 'Other APIs'
WHERE NOT EXISTS (SELECT 1 FROM request_sets);

INSERT INTO requests (id, request_set_id, label, method, url, body)
SELECT 1, 1, 'JsonPlaceholder', 'POST', 'https://jsonplaceholder.typicode.com/posts', '{"foo":"bar"}' 
UNION ALL SELECT 2, 1, 'Rest API', 'POST', 'https://api.restful-api.dev/objects', '{"name": "Apple MacBook Pro 16","data": {"year": 2019,"price": 1849.99,"CPU model": "Intel Core i9","Hard disk size": "1 TB"}}'
UNION ALL SELECT 3, 2, 'ChuckNorrisJoke', 'GET', 'https://api.chucknorris.io/jokes/random', ''
UNION ALL SELECT 4, 2, 'IP API', 'GET', 'https://ipapi.co/json', ''
UNION ALL SELECT 5, 2, 'PokeAPI', 'GET', 'https://pokeapi.co/api/v2/pokemon/ditto', ''
UNION ALL SELECT 6, 2, 'Countries', 'GET', 'https://restcountries.com/v3.1/all?fields=name,flags', ''
WHERE NOT EXISTS (SELECT 1 FROM requests);

INSERT INTO request_headers (id, request_id, key, value)
SELECT 1, 1, 'Content-Type', 'application/json' 
UNION ALL SELECT 2, 2, 'Content-Type', 'application/json'
WHERE NOT EXISTS (SELECT 1 FROM request_headers);