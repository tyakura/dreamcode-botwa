import "dotenv/config";
import app from "@/app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  DreamCode BotWA Backend`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health:     http://localhost:${PORT}/health`);
  console.log(`========================================\n`);
});