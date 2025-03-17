import { Routes } from "@generouted/react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { setEnvironment } from "rhythia-api/handleApi";
setEnvironment("production");
createRoot(document.getElementById("root")!).render(<Routes />);
