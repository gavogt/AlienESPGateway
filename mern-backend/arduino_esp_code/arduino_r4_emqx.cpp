#include <WiFiS3.h>
#include <ArduinoMqttClient.h>

// ---------- Wi-Fi ----------
const char WIFI_SSID[]     = "YourWiFiSSID";
const char WIFI_PASSWORD[] = "YourWiFiPassword";

// ---------- EMQX / MQTT ----------
const char MQTT_HOST[] = "192.168.1.100";   // EMQX IP/hostname
const int  MQTT_PORT   = 1883;              // 1883 (TCP), 8883 for TLS (WiFiSSLClient)
const char MQTT_USER[] = "change";           // if enabled auth in EMQX
const char MQTT_PASS[] = "changeme";

const char SCOUT_ID[]  = "xc-scout-01";     // used for topics + clientId

// topics
String TOPIC_TELE;
String TOPIC_CMD;

// ---------- Globals ----------
WiFiClient   net;
MqttClient   mqtt(net);

unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL_MS = 5000;

// ---------- Sensor stubs (replace with real) ----------
float readNeuro()  { return analogRead(A0) * 3.3 / 1023.0; }
float readPlasma() { return analogRead(A1) * 3.3 / 1023.0; }
float readBio()    { return analogRead(A2) * 3.3 / 1023.0; }

// ---------- MQTT msg callback ----------
void onMqttMessage(int messageSize) {
  // Which topic?
  String topic = mqtt.messageTopic();

  // Read payload
  String payload;
  while (mqtt.available()) {
    payload += (char)mqtt.read();
  }

  Serial.print("📥 CMD on "); Serial.print(topic);
  Serial.print(" → ");       Serial.println(payload);

  // TODO: parse JSON and act on commands
  // e.g., if payload == {"name":"RebootScout"} then reboot, etc.
}

// ---------- Connect helpers ----------
void connectWiFi() {
  Serial.print("🔌 Wi-Fi → "); Serial.println(WIFI_SSID);
  while (WiFi.begin(WIFI_SSID, WIFI_PASSWORD) != WL_CONNECTED) {
    delay(500); Serial.print('.');
  }
  Serial.print("\n   IP: "); Serial.println(WiFi.localIP());
}

void connectMQTT() {
  mqtt.setId(SCOUT_ID);
  if (strlen(MQTT_USER)) {
    mqtt.setUsernamePassword(MQTT_USER, MQTT_PASS);
  }

  Serial.print("🔗 MQTT → "); Serial.print(MQTT_HOST); Serial.print(':'); Serial.println(MQTT_PORT);

  while (!mqtt.connect(MQTT_HOST, MQTT_PORT)) {
    Serial.print("  retry, err="); Serial.println(mqtt.connectError());
    delay(1000);
  }

  // subscribe to command topic
  if (mqtt.subscribe(TOPIC_CMD)) {
    Serial.print("✅ Subscribed: "); Serial.println(TOPIC_CMD);
  } else {
    Serial.println("❌ Subscribe failed");
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  while (!Serial);

  // build topics once
  TOPIC_TELE = String("esp_gateway/") + SCOUT_ID + "/telemetry";
  TOPIC_CMD  = String("esp_gateway/") + SCOUT_ID + "/cmd";

  // attach message handler
  mqtt.onMessage(onMqttMessage);

  connectWiFi();
  connectMQTT();

  // optional: retained boot message so you can see the topic in EMQX
  mqtt.beginMessage(TOPIC_TELE, /*qos*/0, /*retain*/true);
  mqtt.print("{\"boot\":\"ok\"}");
  mqtt.endMessage();
  Serial.println("🚀 Boot message sent (retained)");
}

// ---------- Loop ----------
void loop() {
  // keep MQTT alive
  if (!mqtt.connected()) {
    connectMQTT();
  }
  mqtt.poll(); // process incoming packets/callbacks

  // periodic telemetry publish
  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;

    float neuro  = readNeuro();
    float plasma = readPlasma();
    float bio    = readBio();

    String payload = String("{\"scoutId\":\"") + SCOUT_ID + "\","
                      "\"timestamp\":" + String(now/1000) + ","
                      "\"modules\":["
                        "{\"type\":\"NEURO\",\"value\":"  + String(neuro,3)  + "},"
                        "{\"type\":\"PLASMA\",\"value\":" + String(plasma,3) + "},"
                        "{\"type\":\"BIO\",\"value\":"    + String(bio,3)    + "}"
                      "]}"
                    ;

    mqtt.beginMessage(TOPIC_TELE);   // QoS 0, not retained
    mqtt.print(payload);
    mqtt.endMessage();

    Serial.print("📡 PUB → "); Serial.print(TOPIC_TELE);
    Serial.print(" : ");       Serial.println(payload);
  }
}