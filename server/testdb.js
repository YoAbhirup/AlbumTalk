import pg from "pg";
const { Client } = pg;

const client = new Client({
  user: "postgres.agypmdycjmypslvedrrd", // from your Supabase project ref
  host: "aws-1-ap-southeast-1.pooler.supabase.com", // pooler host
  database: "postgres",
  password: "Abhirup09082004", // from Supabase DB settings
  port: 6543, // correct for Transaction Pooler
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => console.log("✅ Connected to Supabase Transaction Pooler"))
  .then(() => client.query("SELECT * FROM ratings LIMIT 3"))
  .then(res => console.table(res.rows))
  .catch(err => console.error("❌ Connection error:", err))
  .finally(() => client.end());
