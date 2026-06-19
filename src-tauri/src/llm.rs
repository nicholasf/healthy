use rig_core::{client::CompletionClient, completion::Prompt, providers::{anthropic, openai}};

pub async fn complete(
    provider: &str,
    url: &str,
    token: &str,
    model: &str,
    system: &str,
    user: &str,
) -> Result<String, String> {
    match provider {
        "anthropic" => {
            let client = anthropic::Client::new(token).map_err(|e| e.to_string())?;
            let agent = client.agent(model).preamble(system).max_tokens(1024).build();
            agent.prompt(user).await.map_err(|e| e.to_string())
        }
        _ => {
            let client = openai::CompletionsClient::builder()
                .api_key(token)
                .base_url(url)
                .build()
                .map_err(|e| e.to_string())?;
            let agent = client.agent(model).preamble(system).max_tokens(1024).build();
            agent.prompt(user).await.map_err(|e| e.to_string())
        }
    }
}
