const db = require('../src/config/db');

// Datos reales por categoría
const products = {
  platos: [
    { name: 'Ceviche de pescado', description: 'El más clásico, hecho con corvina o pescado blanco.', price: 28, image: '/images/products/ceviche.svg' },
    { name: 'Ceviche mixto', description: 'Incluye pescado, camarones, pulpo, calamar y mejillones.', price: 32, image: '/images/products/ceviche.svg' },
    { name: 'Ceviche de camarones', description: 'Preparado solo con camarones frescos.', price: 30, image: '/images/products/ceviche.svg' },
    { name: 'Ceviche de pulpo', description: 'Versión gourmet con pulpo tierno.', price: 35, image: '/images/products/ceviche.svg' },
    { name: 'Tiradito', description: 'Similar al ceviche, pero con corte más fino y salsas inspiradas en la cocina nikkei.', price: 30, image: '/images/products/ceviche.svg' },
    { name: 'Jalea mixta', description: 'Mariscos fritos servidos con salsa criolla y yuca.', price: 26, image: '/images/products/plato.svg' },
    { name: 'Chicharrón de pescado', description: 'Empanizado y frito, acompañado de camote y ensalada.', price: 24, image: '/images/products/plato.svg' },
    { name: 'Sudado de pescado', description: 'Guiso de pescado con tomate, ají y hierbas.', price: 25, image: '/images/products/plato.svg' },
    { name: 'Parihuela', description: 'Sopa espesa de mariscos con toque picante.', price: 28, image: '/images/products/plato.svg' },
    { name: 'Causa de mariscos', description: 'Capas de papa amarilla rellenas con mariscos.', price: 22, image: '/images/products/plato.svg' },
    { name: 'Ceviche de conchas negras', description: 'Especialidad de Tumbes, con mariscos locales.', price: 30, image: '/images/products/ceviche.svg' },
    { name: 'Ceviche de camarones de río', description: 'Típico de Arequipa.', price: 28, image: '/images/products/ceviche.svg' },
    { name: 'Ceviche de tollo', description: 'Hecho con tiburón, común en la costa norte.', price: 29, image: '/images/products/plato.svg' },
    { name: 'Chinguirito', description: 'Marinado de carne seca de raya, acompañado con yuca y camote.', price: 26, image: '/images/products/plato.svg' },
    { name: 'Arroz con mariscos', description: 'Similar al arroz chaufa, pero con más mariscos.', price: 27, image: '/images/products/plato.svg' },
    { name: 'Risotto de camarones', description: 'Fusión italiana-peruana.', price: 31, image: '/images/products/plato.svg' },
    { name: 'Causa de langostino', description: 'Versión gourmet de la causa, con langostinos.', price: 33, image: '/images/products/plato.svg' },
    { name: 'Leche de tigre', description: 'Servida como aperitivo o shot energizante.', price: 8, image: '/images/products/bebida.svg' }
  ],
  bebidas: [
    { name: 'Pisco Sour', description: 'Coctel nacional peruano, hecho con pisco, limón, clara de huevo, azúcar y amargo de angostura.', price: 15, image: '/images/products/bebida.svg' },
    { name: 'Chicha morada', description: 'Bebida refrescante de maíz morado cocido con piña, canela y clavo.', price: 6, image: '/images/products/bebida.svg' },
    { name: 'Inka Cola', description: 'Gaseosa amarilla de sabor dulce y herbal, única en Perú.', price: 4, image: '/images/products/bebida.svg' },
    { name: 'Agua de coco', description: 'Natural y refrescante, ideal con mariscos.', price: 5, image: '/images/products/bebida.svg' },
    { name: 'Lúcuma batida', description: 'Licuado cremoso de lúcuma, leche y azúcar.', price: 7, image: '/images/products/bebida.svg' },
    { name: 'Chilcano de pisco', description: 'Cóctel suave de pisco, limón y ginger ale.', price: 14, image: '/images/products/bebida.svg' },
    { name: 'Cerveza fría', description: 'Cervezas locales como Cusqueña o Pilsen bien heladas.', price: 8, image: '/images/products/bebida.svg' },
    { name: 'Jugo de maracuyá', description: 'Jugo natural de maracuyá, ácido y refrescante.', price: 6, image: '/images/products/bebida.svg' },
    { name: 'Mate de coca', description: 'Infusión digestiva, ideal después de una comida fuerte.', price: 4, image: '/images/products/bebida.svg' },
    { name: 'Chuchuhuasi', description: 'Licor de hierbas con corteza de chuchuhuasi, tradicional y fuerte.', price: 12, image: '/images/products/bebida.svg' }
  ],
  entradas: [
    { name: 'Ceviche de pescado', description: 'Pescado fresco curtido en limón, con cebolla morada, ají limo y cilantro. Acompañado de camote y maíz tostado.', price: 18, image: '/images/products/entrada.svg' },
    { name: 'Leche de tigre', description: 'Shot de jugo cítrico del ceviche, con trocitos de pescado, ají y cebolla. Revitalizante y picante.', price: 8, image: '/images/products/bebida.svg' },
    { name: 'Choritos a la chalaca', description: 'Mejillones frescos con maíz, cebolla roja, cilantro y limón. Fresco y vibrante.', price: 14, image: '/images/products/entrada.svg' },
    { name: 'Causa de mariscos', description: 'Puré de papa amarilla relleno con camarones o pulpa de cangrejo, palta y salsa criolla.', price: 16, image: '/images/products/entrada.svg' },
    { name: 'Papa a la huancaína', description: 'Papas en salsa cremosa de queso y ají amarillo, con lechuga y huevo duro.', price: 12, image: '/images/products/entrada.svg' },
    { name: 'Tiradito', description: 'Pescado cortado fino, marinado con ají y limón. Versión elegante del ceviche.', price: 18, image: '/images/products/entrada.svg' },
    { name: 'Pulpo al olivo', description: 'Láminas de pulpo aliñadas con aceite de oliva y limón, sobre salsa de aceituna negra.', price: 16, image: '/images/products/entrada.svg' },
    { name: 'Tamales peruanos', description: 'Masa de maíz con pollo o pescado, envuelta en hoja de plátano y al vapor.', price: 10, image: '/images/products/entrada.svg' },
    { name: 'Tequeños de queso', description: 'Palitos crujientes rellenos de queso, acompañados con salsa de guacamole.', price: 9, image: '/images/products/entrada.svg' },
    { name: 'Conchitas a la parmesana', description: 'Conchitas de abanico gratinadas con queso parmesano.', price: 15, image: '/images/products/entrada.svg' }
  ],
  postres: [
    { name: 'Mazamorra morada', description: 'Pudín espeso de maíz morado, especias y frutas, servido con leche evaporada o helado.', price: 8, image: '/images/products/postre.svg' },
    { name: 'Arroz con leche', description: 'Arroz cocido en leche con canela, azúcar y ralladura de limón.', price: 7, image: '/images/products/postre.svg' },
    { name: 'Picarones', description: 'Rosquillas fritas de zapallo y harina, bañadas en miel de chancaca.', price: 9, image: '/images/products/postre.svg' },
    { name: 'Manjar blanco', description: 'Crema espesa de leche y azúcar, similar al dulce de leche, con toque de vainilla.', price: 8, image: '/images/products/postre.svg' },
    { name: 'Suspiro a la limeña', description: 'Crema de manjar con merengue de clara y pisco.', price: 10, image: '/images/products/postre.svg' },
    { name: 'Tres leches', description: 'Bizcocho empapado en leche evaporada, condensada y crema.', price: 9, image: '/images/products/postre.svg' },
    { name: 'Mousse de maracuyá', description: 'Postre ligero y ácido hecho con fruta de maracuyá.', price: 9, image: '/images/products/postre.svg' },
    { name: 'Helado de lúcuma', description: 'Helado cremoso con sabor dulce y terroso de lúcuma.', price: 6, image: '/images/products/postre.svg' },
    { name: 'Torta de queso con frutas tropicales', description: 'Base de queso con cubierta de maracuyá o piña.', price: 11, image: '/images/products/postre.svg' },
    { name: 'Compota de papaya con miel y nueces', description: 'Papaya cocida en miel, fría o tibia.', price: 8, image: '/images/products/postre.svg' }
  ]
};

async function seed() {
  try {
    console.log('Iniciando limpieza y seeding de productos...');
    
    // Eliminar todos los productos excepto el primero (ceviche original)
    const [existing] = await db.query('SELECT COUNT(*) as count FROM products');
    const count = existing[0].count;
    console.log(`Productos existentes: ${count}`);
    
    if (count > 1) {
      await db.run('DELETE FROM products WHERE id > 1');
      console.log('Productos eliminados (excepto el primero)');
    }
    
    let totalInserted = 0;
    
    // Insertar por categoría
    for (const [category, items] of Object.entries(products)) {
      console.log(`\n>>> Insertando ${items.length} productos en categoría "${category}":`);
      
      for (const item of items) {
        try {
          const res = await db.run(
            'INSERT INTO products (name, description, price, category, image, is_available) VALUES (?, ?, ?, ?, ?, ?)',
            [item.name, item.description, item.price, category, item.image, 1]
          );
          console.log(`  ✓ ${item.name} (ID: ${res.insertId})`);
          totalInserted++;
        } catch (err) {
          console.error(`  ✗ Error insertando ${item.name}:`, err.message);
        }
      }
    }
    
    console.log(`\n✅ Total de productos insertados: ${totalInserted}`);
    
    // Verificar
    const [final] = await db.query('SELECT COUNT(*) as count FROM products');
    console.log(`Total en BD: ${final[0].count} productos`);
    
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    try { db.close(); } catch (e) { /* ignore */ }
  }
}

seed();
