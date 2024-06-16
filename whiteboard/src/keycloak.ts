import Keycloak from "keycloak-js";

export const keycloakConfig = {
  url: "http://localhost:8080/",
  realm: "whiteboard_realm",
  clientId: "whiteboard_client_id",
};
// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
