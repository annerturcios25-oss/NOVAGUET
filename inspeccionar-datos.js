const fs = require("fs");

const productos = JSON.parse(
  fs.readFileSync("products.json", "utf8")
);

const pedidos = JSON.parse(
  fs.readFileSync("orders.json", "utf8")
);

console.log("PRODUCTOS:", productos.length);
console.log("PEDIDOS:", pedidos.length);

console.log("\nESTRUCTURA DE PRODUCTOS:");
console.log([...new Set(productos.flatMap(p => Object.keys(p)))]);

console.log("\nESTRUCTURA DE PEDIDOS:");
console.log([...new Set(pedidos.flatMap(p => Object.keys(p)))]);

console.log("\nESTADOS DE PEDIDOS:");
console.log(
  pedidos.reduce((acc, p) => {
    const estado = p.estado || "Sin estado";
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {})
);

console.log("\nPRODUCTOS CON VARIAS FOTOS:",
  productos.filter(p => Array.isArray(p.imagenes)).length
);

console.log("\nPEDIDOS CON CLIENTE VINCULADO:",
  pedidos.filter(p => p.clienteId != null).length
);
