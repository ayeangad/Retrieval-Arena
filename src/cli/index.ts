
import { defineCommand, runMain } from "citty";

import compare from "./commands/compare";
import benchmark from "./commands/benchmark";

const main = defineCommand({
  meta: {
    name: "retrieval-arena",
    version: "0.1.0",
    description: "Benchmark and compare retrieval pipelines.",
  },

  subCommands: {
    benchmark,
    compare,
  },
});

runMain(main);
