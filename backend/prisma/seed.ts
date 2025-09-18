import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ===== Root folders =====
  const rootMedical = await prisma.folder.create({
    data: { name: "Medical", parentId: null },
  });

  const rootFinance = await prisma.folder.create({
    data: { name: "Finance", parentId: null },
  });

  const rootPersonal = await prisma.folder.create({
    data: { name: "Personal", parentId: null },
  });

  // ===== Nested folders under Medical =====
  const medRecords = await prisma.folder.create({
    data: { name: "Records", parentId: rootMedical.id },
  });

  const medLab = await prisma.folder.create({
    data: { name: "Lab Results", parentId: rootMedical.id },
  });

  const medXray = await prisma.folder.create({
    data: { name: "X-Ray", parentId: medLab.id }, // nested level 2
  });

  const medMRI = await prisma.folder.create({
    data: { name: "MRI", parentId: medLab.id }, // nested level 2
  });

  // ===== Nested folders under Finance =====
  const finInvoices = await prisma.folder.create({
    data: { name: "Invoices", parentId: rootFinance.id },
  });

  const finTaxes = await prisma.folder.create({
    data: { name: "Taxes", parentId: rootFinance.id },
  });

  const fin2023 = await prisma.folder.create({
    data: { name: "2023", parentId: finTaxes.id }, // nested
  });

  const fin2024 = await prisma.folder.create({
    data: { name: "2024", parentId: finTaxes.id }, // nested
  });

  // ===== Nested folders under Personal =====
  const persPhotos = await prisma.folder.create({
    data: { name: "Photos", parentId: rootPersonal.id },
  });

  const persTrips = await prisma.folder.create({
    data: { name: "Trips", parentId: persPhotos.id },
  });

  const persFamily = await prisma.folder.create({
    data: { name: "Family", parentId: persPhotos.id },
  });

  // ===== Insert files for demo =====
  await prisma.file.createMany({
    data: [
      { name: "Checkup_Jan.pdf", type: "pdf", folderId: medRecords.id },
      { name: "BloodTest_Apr.csv", type: "csv", folderId: medLab.id },
      { name: "Xray_Chest.png", type: "image", folderId: medXray.id },
      { name: "MRI_Brain.dcm", type: "dicom", folderId: medMRI.id },

      { name: "Invoice_Jan.pdf", type: "pdf", folderId: finInvoices.id },
      { name: "Tax_2023.pdf", type: "pdf", folderId: fin2023.id },
      { name: "Tax_2024.pdf", type: "pdf", folderId: fin2024.id },

      { name: "Trip_Bali.jpg", type: "image", folderId: persTrips.id },
      { name: "Trip_Tokyo.jpg", type: "image", folderId: persTrips.id },
      { name: "Family_Reunion.png", type: "image", folderId: persFamily.id },
    ],
  });

  console.log("✅ Seed data banyak + nested berhasil dimasukkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
