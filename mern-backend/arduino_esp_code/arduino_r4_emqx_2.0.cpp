// Publishes three single-value payloads like:
// {"module_type":"NEURO","value":23.456,"time":1723320000}
#include <WiFiS3.h>
#include <ArduinoMqttClient.h>

// --- Wi-Fi ---
const char WIFI_SSID[]     = "YourWiFiSSID";
const char WIFI_PASSWORD[] = "YourWiFiPassword";

// --- EMQX / MQTT ---
const char MQTT_HOST[] = "192.168.1.100";   // EMQX IP/hostname
const int  MQTT_PORT   = 1883;              // 8883 if you switch to TLS
const char MQTT_USER[] = "scout";           // your EMQX user
const char MQTT_PASS[] = "secret";

const char SCOUT_ID[]  = "xc-scout-01";     // used in topic + clientId

// Topics
String TOPIC_TELE;   // esp_gateway/<SCOUT_ID>/telemetry
String TOPIC_CMD;    // esp_gateway/<SCOUT_ID>/cmd (optional subscribe)

WiFiClient   net;
MqttClient   mqtt(net);

unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL_MS = 5000;

// ---- Replace with your real sensors ----
float readNeuro()  { return analogRead(A0) * 3.30f / 1023.0f; }
float readPlasma() { return analogRead(A1) * 3.30f / 1023.0f; }
float readBio()    { return analogRead(A2) * 3.30f / 1023.0f; }

// Optional: receive commands
void onMqttMessage(int) {
  String topic = mqtt.messageTopic(), payload;
  while (mqtt.available()) payload += (char)mqtt.read();
  Serial.print("📥 CMD "); Serial.print(topic); Serial.print(" → "); Serial.println(payload);
}

// Helper: publish one value with expected shape
void publishOne(const char* type, float val) {
  const unsigned long secs = millis() / 1000; // seconds; backend normalizes
  String payload = String("{\"module_type\":\"") + type +
                   "\",\"value\":" + String(val, 3) +
                   ",\"time\":" + String(secs) + "}";
  mqtt.beginMessage(TOPIC_TELE);   // QoS 0, not retained
  mqtt.print(payload);
  mqtt.endMessage();
  Serial.print("📡 "); Serial.println(payload);
}

void connectWiFi() {
  Serial.print("🔌 Wi-Fi → "); Serial.println(WIFI_SSID);
  while (WiFi.begin(WIFI_SSID, WIFI_PASSWORD) != WL_CONNECTED) { delay(500); Serial.print('.'); }
  Serial.print("\n   IP: "); Serial.println(WiFi.localIP());
}

void connectMQTT() {
  mqtt.setId(SCOUT_ID);
  if (strlen(MQTT_USER)) mqtt.setUsernamePassword(MQTT_USER, MQTT_PASS);

  Serial.print("🔗 MQTT → "); Serial.print(MQTT_HOST); Serial.print(':'); Serial.println(MQTT_PORT);
  while (!mqtt.connect(MQTT_HOST, MQTT_PORT)) {
    Serial.print("  retry, err="); Serial.println(mqtt.connectError());
    delay(1000);
  }

  // Optional: subscribe to a command topic (tiny delay + .c_str() improves reliability)
  delay(200);
  bool ok = mqtt.subscribe(TOPIC_CMD.c_str());
  Serial.print("SUB → "); Serial.print(TOPIC_CMD); Serial.print(" : "); Serial.println(ok ? "OK" : "FAIL");
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {}

  TOPIC_TELE = String("esp_gateway/") + SCOUT_ID + "/telemetry";
  TOPIC_CMD  = String("esp_gateway/") + SCOUT_ID + "/cmd";

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, INPUT);

  mqtt.onMessage(onMqttMessage);

  connectWiFi();
  connectMQTT();

  // Optional retained boot marker
  mqtt.beginMessage(TOPIC_TELE, 0, true);
  mqtt.print("{\"boot\":\"ok\"}");
  mqtt.endMessage();
  Serial.println("🚀 Boot marker sent");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (!mqtt.connected())             connectMQTT();
  mqtt.poll();

  const unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;

    publishOne("NEURO",  readNeuro());
    publishOne("PLASMA", readPlasma());
    publishOne("BIO",    readBio());
  }
}