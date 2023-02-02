import '@unocss/reset/tailwind.css'
import "uno.css";
import { render } from "solid-js/web";

import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
