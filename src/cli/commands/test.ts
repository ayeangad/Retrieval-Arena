import { sql } from "../../db/client";

const rows = await sql`
  SELECT strategy, COUNT(*) AS count
  FROM chunks
  GROUP BY strategy
`;

console.log(rows);
