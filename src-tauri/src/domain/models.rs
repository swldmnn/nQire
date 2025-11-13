use http::Request;

#[derive(Clone)]
pub struct RequestMetaData {
    pub id: u16,
    pub label: String,
}

pub struct HttpRequestSet {
    pub id: u16,
    pub label: String,
    pub requests: Vec<Request<String>>,
}