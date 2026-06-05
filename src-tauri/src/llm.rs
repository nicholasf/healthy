use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub struct LlmClient {
    pub url: String,
    pub token: String,
    pub model: String,
}

#[derive(Serialize)]
pub struct ChatRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    pub stream: bool,
}

#[derive(Serialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Deserialize)]
pub struct ChatResponse {
    pub choices: Vec<Choice>,
}

#[derive(Deserialize)]
pub struct Choice {
    pub message: Message,
}

#[derive(Deserialize)]
pub struct Message {
    pub content: String,
}

pub async fn complete(client: &LlmClient, system: &str, user: &str) -> Result<String, String> {
    let request = ChatRequest {
        model: client.model.clone(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: system.to_string(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: user.to_string(),
            },
        ],
        stream: false,
    };

    let client_http = reqwest::Client::new();
    let response = client_http
        .post(format!("{}/v1/chat/completions", client.url))
        .header("Authorization", format!("Bearer {}", client.token))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    let response_data: ChatResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(response_data.choices[0].message.content.clone())
}