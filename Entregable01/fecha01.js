import { writeFileSync, readFileSync } from "fs";
console.clear()
writeFileSync("fecha.txt", new Date().toString());
let fecha = readFileSync("fecha.txt", "utf-8");
console.log(fecha);



