/* @refresh reload */
import { Router } from "@solidjs/router";
import routes from "~solid-pages";
import { Suspense } from "solid-js";
import { render } from "solid-js/web";
import "uno.css";

render(
  () => {
    return (
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>
        {routes}
      </Router>
    );
  },
  document.getElementById("root") as HTMLElement,
);
