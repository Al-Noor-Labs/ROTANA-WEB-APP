import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding staff and analytics data...");

  // 1. Create staff members
  const salesman = await prisma.user.upsert({
    where: { email: "salesman@rotana.com" },
    update: {},
    create: {
      name: "John Sales",
      email: "salesman@rotana.com",
      passwordHash: "dummy",
      role: "SALESMAN"
    }
  });

  const driver = await prisma.user.upsert({
    where: { email: "driver@rotana.com" },
    update: {},
    create: {
      name: "Dave Driver",
      email: "driver@rotana.com",
      passwordHash: "dummy",
      role: "DELIVERY_DRIVER"
    }
  });

  await prisma.user.upsert({
    where: { email: "accountant@rotana.com" },
    update: {},
    create: {
      name: "Alice Accountant",
      email: "accountant@rotana.com",
      passwordHash: "dummy",
      role: "ACCOUNTANT"
    }
  });

  // 2. Create products and variants if they don't exist
  const category = await prisma.category.upsert({
    where: { name: "Fruits" },
    update: {},
    create: { name: "Fruits", slug: "fruits" }
  });

  const product = await prisma.product.upsert({
    where: { barcode: "12345678" },
    update: {},
    create: {
      name: "Apple",
      categoryId: category.id,
      brand: "Fresh",
      barcode: "12345678",
      variants: {
        create: {
          sku: "APPLE-1KG",
          name: "1kg Pack",
          unitValue: 1.0,
          unitLabel: "kg",
          costPrice: 50,
          sellingPrice: 80
        }
      }
    },
    include: { variants: true }
  });

  const variant = product.variants[0];

  // 3. Create a location
  const warehouse = await prisma.location.upsert({
    where: { code: "WH-001" },
    update: {},
    create: {
      name: "Main Warehouse",
      type: "WAREHOUSE",
      code: "WH-001"
    }
  });

  // 4. Create dummy orders and assignments for analytics
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      orderType: "B2C_STORE",
      status: "DELIVERED",
      paymentStatus: "PAID",
      totalAmount: 500,
      subtotal: 500,
      assignedToId: salesman.id,
      sourceLocationId: warehouse.id,
      items: {
        create: {
          variantId: variant.id,
          quantity: 10,
          unitPrice: 50,
          lineTotal: 500
        }
      },
      delivery: {
        create: {
          driverId: driver.id,
          status: "DELIVERED",
          deliveredAt: new Date()
        }
      }
    }
  });

  // 5. Create sales commissions
  await prisma.salesCommission.create({
    data: {
      userId: salesman.id,
      orderId: order.id,
      amount: 25,
      rate: 5
    }
  });

  // 6. Create payslips
  await prisma.payslip.create({
    data: {
      userId: salesman.id,
      month: 3,
      year: 2026,
      basicSalary: 20000,
      allowances: 1000,
      commissions: 25,
      netPay: 21025,
      paidAt: new Date()
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
