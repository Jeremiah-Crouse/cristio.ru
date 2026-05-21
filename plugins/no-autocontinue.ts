export default {
  id: "no-autocontinue",
  server: async () => ({
    "experimental.compaction.autocontinue": async (_input, output) => {
      output.enabled = false
    },
  }),
}
