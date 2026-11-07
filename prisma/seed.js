const prisma = require('../lib/prisma');

async function main() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Buku', price: 15000 },
        { name: 'Pulpen', price: 5000 },
      ],
    });
    console.log('Data awal berhasil ditambahkan ke PostgreSQL (Buku, Pulpen).');
  } else {
    console.log('Database sudah berisi data produk.');
  }
}

main()
  .catch((e) => {
    console.error('Gagal melakukan seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
