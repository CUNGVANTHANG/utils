## Setup

Tham khảo tại https://react.i18next.com/guides/quick-start

```
yarn add react-i18next i18next
```

## Code

### 1. Quickstart

Chúng ta cần config trong file `i18n.ts`

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      welcomeMessage: "Welcome to React and react-i18next",
      welcomeMessage_other: "You have {{count}} messages",
    },
  },
  fr: {
    translation: {
      welcomeMessage: "Bienvenue à React et react-i18next",
      welcomeMessage_other: "Vous avez {{count}} messages",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // use en if detected lng is not available
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
```

Trong đó `welcomeMessage` gọi là key, còn `"Welcome to React and react-i18next"` là value (hoặc gọi tắt là chuỗi)

Để có thể thay đổi ngôn ngữ ta thay lỗi `lng`. Ví dụ từ tiếng Anh sang tiếng Pháp, đơn giản ta chỉ cần thay đổi `en` thành `fr`

Xong đó cần phải khai báo trong `main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./utils/i18n.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Để có thể sử dụng chúng ta cần `useTranslation()`

```tsx
import { useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t } = useTranslation();
  return <div>{t("welcomeMessage")}</div>;
}

export default App;
```

### 2. Gán thêm dữ liệu cho chuỗi

Giả sử tôi muốn tiếng Anh là `You have {{count}} messages` và tiếng Pháp là `Vous avez {{count}} messages`. Và tôi muốn `count` có thể thay đổi được

Ta làm như sau

```tsx
import { useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t } = useTranslation();
  return <div> {t("welcomeMessage_other", { count: 5 })}</div>;
}

export default App;
```

Như vậy trên màn hình của ta lúc này là `You have 5 messages`

### 4. Chuỗi có định dạng

Trong trường hợp tôi muốn là: Welcome, **user**

Ta không thể truyền **trực tiếp HTML vào JSON file** (vì React sẽ không hiểu). Do đó, i18next **dùng đánh số các thành phần (components) trong chuỗi dịch để thay thế React components trong code**.

#### Cách 1: Sử dụng `Trans` từ `react-i18next`

Ta sử dụng `<1></1>`, `<2></2>`, `<3></3>` khi muốn thay thế nhiều thành phần React khác nhau trong chuỗi dịch.

_Ví dụ:_

Ta muốn dịch câu:

```html
Welcome, <b>John</b>. Please <a href="#">click here</a> to continue.
```

Bạn cần hai thành phần `<b>` và `<a>`, do đó ta dùng `<1></1>` cho `<b>` và `<2></2>` cho `<a>`.

```ts
const resources = {
  en: {
    translation: {
      welcomeMessage_html:
        "Welcome, <1>{{name}}</1>. Please <2>click here</2> to continue.",
    },
  },
  fr: {
    translation: {
      welcomeMessage_html:
        "Bienvenue, <1>{{name}}</1>. Veuillez <2>cliquer ici</2> pour continuer.",
    },
  },
};
```

Tiếp đến ta cần sử dụng component `<Trans />`

```tsx
import { Trans, useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t } = useTranslation();
  return (
    <div>
      <Trans
        i18nKey="welcomeMessage_html"
        values={{ name: "John" }}
        components={{ 1: <b />, 2: <a href="#" /> }}
      />
    </div>
  );
}

export default App;
```

_Kết quả:_

Welcome, **John**. [Please click here to continue]().

#### Cách 1: Sử dụng `dangerouslySetInnerHTML` (không khuyến khích sử dụng)

Ta cần cấu hình lại trong file config i18n

```ts
i18n.init({
  resources,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // Cho phép HTML trong chuỗi dịch
  },
});
```

Ta thêm value tiếng Anh và tiếng Pháp vào key

```tsx
const resources = {
  en: {
    translation: {
      welcomeMessage: "Welcome, <b>{{user}}</b>!",
    },
  },
  fr: {
    translation: {
      welcomeMessage: "Bienvenue, <b>{{user}}</b>!",
    },
  },
};
```

```tsx
import { useTranslation } from "react-i18next";

export default function WelcomeMessage({ user }) {
  const { t } = useTranslation();

  return (
    <h1 dangerouslySetInnerHTML={{ __html: t("welcomeMessage", { user }) }} />
  );
}
```
