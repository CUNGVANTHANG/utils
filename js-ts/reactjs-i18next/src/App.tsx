import { Trans, useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t } = useTranslation();
  return (
    <div>
      {t("welcomeMessage")}
      <br />
      {t("welcomeMessage_other", { count: 5 })}
      <br />
      <Trans
        i18nKey="welcomeMessage_html"
        values={{ name: "John" }}
        components={{ 1: <b />, 2: <a href="#" /> }}
      />
    </div>
  );
}

export default App;
