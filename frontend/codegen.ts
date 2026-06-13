import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:8000/graphql",
  documents: ["src/lib/graphql/documents/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/graphql/generated/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
};

export default config;
