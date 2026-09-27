import fs from "node:fs";
import path from "node:path";

const schemaPath = path.join(process.cwd(), "scripts", "retool-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
console.log(JSON.stringify(schema, null, 2));

const url = process.env.RETOOL_API_URL;
const key = process.env.RETOOL_API_KEY;

if (url && key) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ action: "initialize_database", schema })
  });
  console.log("Retool response:", response.status, await response.text());
} else {
  console.log("RETOOL_API_URL/RETOOL_API_KEY not configured; schema printed only.");
}
