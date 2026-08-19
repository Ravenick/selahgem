import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "./panel";

export const Route = createFileRoute("/selahstudio")({
  head: () => ({
    meta: [
      { title: "SELAH Studio | Operator Panel" },
      {
        name: "description",
        content: "SELAH Studio web operator panel — Search Scripture, preview on stage canvas, and project to church screens.",
      },
      { property: "og:title", content: "SELAH Studio | Operator Panel" },
      { property: "og:description", content: "Search, preview, and display Bible verses on church projector screens." },
    ],
  }),
  component: Panel,
});
