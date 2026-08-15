import { initializeDatabase } from './src/lib/db-init';
initializeDatabase().then(() => {
  console.log("DONE");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
