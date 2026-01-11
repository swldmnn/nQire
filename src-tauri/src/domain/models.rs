pub struct HttpRequestSet {
    pub id: Option<u32>,
    pub label: String,
    pub requests: Vec<HttpRequest>,
}

pub struct HttpRequest {
    pub id: Option<u32>,
    pub label: String,
    pub method: String,
    pub url: String,
    pub headers: Vec<HttpHeader>,
    pub body: String,
}

pub struct HttpHeader {
    pub key: String,
    pub value: String,
}

pub struct Environment {
    pub id: Option<u32>,
    pub label: String,
    pub values: Vec<EnvironmentValue>,
}

pub struct EnvironmentValue {
    pub key: String,
    pub value: String,
}
