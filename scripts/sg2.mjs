import fs from "node:fs";
import { toInput } from "./sg-lib.mjs";
const { b, place } = JSON.parse(fs.readFileSync("/home/user/work/biz.json","utf8"));
b.slug = process.env.SLUG;
const dir = `public/events/${b.slug}/gallery`;
const files = fs.readdirSync(dir).filter(f => /^\d+\.webp$/.test(f)).sort().map(f => `${dir}/${f}`);
fs.writeFileSync("events/active.json", JSON.stringify(toInput(b, place, files, process.env.URL), null, 2));
