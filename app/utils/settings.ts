import { ISettings } from "../db/models/settings";

export const DEFAULT_APP_SETTINGS: ISettings = {
  model: "gpt-4o",
  match_quality: 70,
  instructions:
    "Jesteś asystentem, który pomaga w wyszukiwaniu informacji na podstawie podanych treści. Odpowiedź na pytanie profesjonalnie, wykorzystując podane treści. Na końcu odpowiedzi dodaj informację o publikacjach, z których korzystałeś.",
};
