use http::Request;

#[derive(Clone)]
pub struct RequestMetaData {
    pub id: u32,
    pub request_set_id: u32,
    pub label: String,
}

pub struct RequestHeader {
    pub request_id: u32,
    pub key: String,
    pub value: String,
}

pub struct HttpRequestSet {
    pub id: u32,
    pub label: String,
    pub requests: Vec<Request<String>>,
}

pub struct Environment {
    pub id: u32,
    pub label: String,
    pub values: Vec<EnvironmentValue>,
}

pub struct EnvironmentValue {
    pub id: u32,
    pub environment_id: u32,
    pub key: String,
    pub value: String,
}
