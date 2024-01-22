use lambda_http::{run, service_fn, Body, Error, Request, Response};
use std::fmt::{self, Display, Formatter};
use tracing::info;
use serde::{Deserialize, Serialize};

// Highscore data structure
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Highscore {
    name: String,
    score: u32,
}

impl Display for Highscore {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "Name: {}, Score: {}", self.name, self.score)
    }
}

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    info!("Event body: {:?}", event.body());
    // Turn json body into a Highscore struct
    let highscore: Highscore = serde_json::from_slice(event.body().as_ref())?;
    info!("Highscore: {:?}", highscore);

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(Body::from("hello world"))
        .map_err(Box::new)?;
    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    info!("Starting lambda");

    run(service_fn(function_handler)).await
}
