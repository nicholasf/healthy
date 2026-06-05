use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub id: i64,
    pub date: String,
    pub time: String,
    pub weight_kg: Option<f64>,
    pub bp_systolic: Option<i64>,
    pub bp_diastolic: Option<i64>,
    pub energy_level: Option<i64>,
    pub notes: Option<String>,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Setting {
    pub key: String,
    pub value: String,
}