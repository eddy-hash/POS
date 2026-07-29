import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

export async function seedProducts(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  // Create categories
  const categories = [
    { name: 'Writing Instruments', description: 'Pens, pencils, markers and more' },
    { name: 'Paper & Notebooks', description: 'Notebooks, paper, sticky notes' },
    { name: 'Office Supplies', description: 'Staplers, scissors, glue' },
    { name: 'Art & Craft', description: 'Paints, brushes, craft materials' },
    { name: 'Organization', description: 'Folders, binders, organizers' },
    { name: 'Tech Accessories', description: 'USB drives, phone cases' },
    { name: 'Eco-Friendly', description: 'Recycled and sustainable products' },
    { name: 'Gift & Wrapping', description: 'Cards, wrapping paper, gifts' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const existing = await categoryRepo.findOne({ where: { name: cat.name } });
    if (!existing) {
      const newCat = categoryRepo.create(cat);
      const saved = await categoryRepo.save(newCat);
      createdCategories.push(saved);
    } else {
      createdCategories.push(existing);
    }
  }

  // Products data
  const products = [
    // Writing Instruments
    { name: 'Ballpoint Pen - Black', description: 'Smooth writing ballpoint pen', price: 500, costPrice: 300, quantity: 200, sku: 'PEN001', category: 'Writing Instruments' },
    { name: 'Ballpoint Pen - Blue', description: 'Smooth writing ballpoint pen', price: 500, costPrice: 300, quantity: 200, sku: 'PEN002', category: 'Writing Instruments' },
    { name: 'Gel Pen Set - 12 Colors', description: 'Vibrant gel pen set', price: 5000, costPrice: 3500, quantity: 50, sku: 'PEN003', category: 'Writing Instruments' },
    { name: 'Mechanical Pencil 0.5mm', description: 'Refillable mechanical pencil', price: 1500, costPrice: 800, quantity: 100, sku: 'PEN004', category: 'Writing Instruments' },
    { name: 'Fountain Pen Set', description: 'Premium fountain pen set', price: 15000, costPrice: 10000, quantity: 20, sku: 'PEN005', category: 'Writing Instruments' },
    { name: 'Highlighter Set - 4 Colors', description: 'Bright neon highlighters', price: 3000, costPrice: 1800, quantity: 80, sku: 'PEN006', category: 'Writing Instruments' },
    { name: 'Permanent Marker - Black', description: 'Long-lasting permanent marker', price: 1000, costPrice: 600, quantity: 150, sku: 'PEN007', category: 'Writing Instruments' },
    { name: 'Whiteboard Marker Set', description: 'Dry erase markers', price: 4000, costPrice: 2500, quantity: 60, sku: 'PEN008', category: 'Writing Instruments' },
    { name: 'Colored Pencils Set - 24 Colors', description: 'Artist quality colored pencils', price: 8000, costPrice: 5000, quantity: 40, sku: 'PEN009', category: 'Writing Instruments' },
    { name: 'Brush Pen Set', description: 'Calligraphy brush pens', price: 6000, costPrice: 3800, quantity: 30, sku: 'PEN010', category: 'Writing Instruments' },

    // Paper & Notebooks
    { name: 'A4 Notebook - 200 Pages', description: 'Ruled A4 notebook', price: 2500, costPrice: 1500, quantity: 120, sku: 'PAP001', category: 'Paper & Notebooks' },
    { name: 'A5 Notebook - 150 Pages', description: 'Pocket size notebook', price: 1500, costPrice: 800, quantity: 150, sku: 'PAP002', category: 'Paper & Notebooks' },
    { name: 'Premium Hardbound Journal', description: 'Leather bound journal', price: 12000, costPrice: 8000, quantity: 25, sku: 'PAP003', category: 'Paper & Notebooks' },
    { name: 'Sticky Notes - 3x3', description: 'Colorful sticky notes', price: 1000, costPrice: 500, quantity: 200, sku: 'PAP004', category: 'Paper & Notebooks' },
    { name: 'A4 Copy Paper - 500 Sheets', description: 'Standard printer paper', price: 5000, costPrice: 3000, quantity: 80, sku: 'PAP005', category: 'Paper & Notebooks' },
    { name: 'Sketchbook - A4', description: 'Drawing sketchbook', price: 3000, costPrice: 1800, quantity: 50, sku: 'PAP006', category: 'Paper & Notebooks' },
    { name: 'Post-it Notes Pack', description: 'Multi-size sticky notes', price: 2000, costPrice: 1200, quantity: 100, sku: 'PAP007', category: 'Paper & Notebooks' },

    // Office Supplies
    { name: 'Stapler - Heavy Duty', description: 'Standard stapler', price: 3000, costPrice: 1800, quantity: 60, sku: 'OFF001', category: 'Office Supplies' },
    { name: 'Stapler Pins - Box of 1000', description: 'Stapler refills', price: 1000, costPrice: 500, quantity: 200, sku: 'OFF002', category: 'Office Supplies' },
    { name: 'Scissors - 8"', description: 'Stainless steel scissors', price: 2500, costPrice: 1500, quantity: 80, sku: 'OFF003', category: 'Office Supplies' },
    { name: 'Glue Stick - 20g', description: 'Washable glue stick', price: 800, costPrice: 400, quantity: 150, sku: 'OFF004', category: 'Office Supplies' },
    { name: 'Desk Organizer', description: 'Multi-compartment organizer', price: 5000, costPrice: 3000, quantity: 30, sku: 'OFF005', category: 'Office Supplies' },
    { name: 'Paper Trimmer A4', description: 'Portable paper cutter', price: 8000, costPrice: 5000, quantity: 20, sku: 'OFF006', category: 'Office Supplies' },

    // Art & Craft
    { name: 'Watercolor Paint Set', description: '12 color watercolor set', price: 6000, costPrice: 3800, quantity: 25, sku: 'ART001', category: 'Art & Craft' },
    { name: 'Acrylic Paint Set', description: 'Premium acrylic paints', price: 8000, costPrice: 5000, quantity: 20, sku: 'ART002', category: 'Art & Craft' },
    { name: 'Paintbrush Set', description: 'Assorted paintbrushes', price: 4000, costPrice: 2500, quantity: 30, sku: 'ART003', category: 'Art & Craft' },
    { name: 'Washi Tape Set', description: 'Decorative Japanese tape', price: 1500, costPrice: 800, quantity: 100, sku: 'ART004', category: 'Art & Craft' },
    { name: 'Origami Paper Pack', description: 'Colorful origami paper', price: 2000, costPrice: 1000, quantity: 50, sku: 'ART005', category: 'Art & Craft' },

    // Organization
    { name: 'A4 File Folder - 10pk', description: 'Document folders', price: 2000, costPrice: 1200, quantity: 100, sku: 'ORG001', category: 'Organization' },
    { name: 'Hanging File Folders - 25pk', description: 'Vertical file organizers', price: 5000, costPrice: 3000, quantity: 40, sku: 'ORG002', category: 'Organization' },
    { name: '3-Ring Binder A4', description: 'Standard binder', price: 3500, costPrice: 2000, quantity: 60, sku: 'ORG003', category: 'Organization' },
    { name: 'Paper Clip Box', description: 'Assorted paper clips', price: 800, costPrice: 400, quantity: 200, sku: 'ORG004', category: 'Organization' },
    { name: 'Binder Clips - Assorted', description: 'Clips for documents', price: 1000, costPrice: 500, quantity: 150, sku: 'ORG005', category: 'Organization' },

    // Tech Accessories
    { name: 'USB Flash Drive 32GB', description: 'High speed USB drive', price: 10000, costPrice: 6500, quantity: 30, sku: 'TEC001', category: 'Tech Accessories' },
    { name: 'USB Flash Drive 64GB', description: 'Large capacity USB', price: 15000, costPrice: 10000, quantity: 20, sku: 'TEC002', category: 'Tech Accessories' },
    { name: 'Phone Case - Universal', description: 'Silicone phone case', price: 3000, costPrice: 1800, quantity: 80, sku: 'TEC003', category: 'Tech Accessories' },
    { name: 'Screen Protector Kit', description: 'Universal screen protector', price: 2000, costPrice: 1000, quantity: 100, sku: 'TEC004', category: 'Tech Accessories' },
    { name: 'Wireless Mouse', description: 'Compact wireless mouse', price: 8000, costPrice: 5000, quantity: 25, sku: 'TEC005', category: 'Tech Accessories' },
  ];

  // Insert products
 
  // Insert products
for (const productData of products) {
  const category = createdCategories.find(c => c.name === productData.category);
  if (category) {
    const existing = await productRepo.findOne({ where: { sku: productData.sku } });
    if (!existing) {
      // ✅ Destructure to remove the 'category' string from the data
      const { category: _, ...productDataWithoutCategory } = productData;
      
      const product = productRepo.create({
        ...productDataWithoutCategory,
        categoryId: category.id,
      });
      await productRepo.save(product);
    }
  }
}

  console.log('✅ Products seeded successfully!');
}
