import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Cash for Houses Summit database with 6 Demo Properties...");

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.buyerInquiry.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.sellerSubmission.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      firstName: "Summit",
      lastName: "Admin",
      email: "admin@cashforhousessummit.com",
      phone: "(800) 555-0199",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      firstName: "Marcus",
      lastName: "Vance",
      email: "seller@example.com",
      phone: "(555) 234-5678",
      passwordHash: passwordHash,
      role: "SELLER",
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "sarah.j@example.com",
      phone: "(555) 876-5432",
      passwordHash: passwordHash,
      role: "SELLER",
    },
  });

  // 2. Create 6 Available Properties for Buyer Catalog
  const propertiesData = [
    {
      title: "Modern Colonial Residence in Fairview Heights",
      slug: "modern-colonial-fairview-heights",
      price: 345000,
      address: "1428 Elmwood Terrace",
      city: "Austin",
      state: "TX",
      zip: "78704",
      bedrooms: 4,
      bathrooms: 3.5,
      squareFeet: 2850,
      lotSize: "0.45 Acres (19,602 sqft)",
      propertyType: "Single Family",
      yearBuilt: 2018,
      description:
        "An exquisitely designed modern home featuring open-concept living spaces, custom hardwood cabinetry, energy-efficient HVAC, and an expansive landscaped private backyard.",
      features: JSON.stringify([
        "Gourmet Kitchen",
        "Quartz Countertops",
        "Dual Primary Suites",
        "Covered Patio",
        "Two-Car Garage",
        "Smart Thermostat",
        "Walk-In Closets",
        "Central Air",
      ]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Forced Air", cooling: "Central Air", appliances: "Stainless Steel Suite Included" },
        parking: { totalSpaces: 3, garageType: "2-Car Attached Garage" },
        construction: { style: "Contemporary Colonial", materials: "Brick, HardiePlank", stories: "2 Stories" },
        utilities: { water: "City Water, Public Sewer, Natural Gas" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Contemporary Craftsman with Mountain Views",
      slug: "craftsman-mountain-views",
      price: 489000,
      address: "882 Timberline Ridge",
      city: "Denver",
      state: "CO",
      zip: "80202",
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 2320,
      lotSize: "0.38 Acres",
      propertyType: "Single Family",
      yearBuilt: 2021,
      description:
        "Stunning contemporary Craftsman featuring cedar accents, oversized black-framed windows, radiant heated floors, and unobstructed views of the Front Range mountains.",
      features: JSON.stringify([
        "Mountain Views",
        "Radiant Floor Heating",
        "Custom Fireplace",
        "EV Charger Ready",
        "Fenced Yard",
      ]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Radiant Floor Heating", cooling: "Central Air" },
        parking: { totalSpaces: 2, garageType: "2-Car Attached Garage" },
        construction: { style: "Craftsman Modern", materials: "Cedar Wood Siding, Natural Stone", stories: "2 Stories" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Refined Brick Tudor in Historic District",
      slug: "refined-brick-tudor",
      price: 298000,
      address: "415 Oakmont Lane",
      city: "Charlotte",
      state: "NC",
      zip: "28203",
      bedrooms: 3,
      bathrooms: 2.0,
      squareFeet: 1940,
      lotSize: "0.28 Acres",
      propertyType: "Single Family",
      yearBuilt: 1995,
      description:
        "Classic brick architecture with contemporary interior upgrades. Features refinished oak floors, new architectural roof shingles, and updated master bath amenities.",
      features: JSON.stringify(["Hardwood Flooring", "Fenced Backyard", "Updated Roof (2023)"]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Forced Air", cooling: "Central Air" },
        parking: { totalSpaces: 2, garageType: "Detached Garage" },
        construction: { style: "Tudor Revival", materials: "Full Brick Exterior", stories: "2 Stories" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Luxury Waterfront Villa & Private Dock",
      slug: "luxury-waterfront-villa",
      price: 625000,
      address: "104 Ocean View Boulevard",
      city: "Miami",
      state: "FL",
      zip: "33139",
      bedrooms: 5,
      bathrooms: 4.0,
      squareFeet: 3400,
      lotSize: "0.50 Acres",
      propertyType: "Single Family",
      yearBuilt: 2022,
      description:
        "Breathtaking waterfront estate with resort-style swimming pool, covered outdoor summer kitchen, private boat dock, and hurricane-rated floor-to-ceiling glass.",
      features: JSON.stringify([
        "Private Boat Dock",
        "Inground Pool",
        "Summer Kitchen",
        "Dual Primary Suites",
        "Smart Lighting System",
      ]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Central Heat Pump", cooling: "Central High-Efficiency Air" },
        parking: { totalSpaces: 3, garageType: "3-Car Attached Garage" },
        construction: { style: "Coastal Modern", materials: "Concrete Block, Glass", stories: "2 Stories" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Architectural Modern Loft in Downtown",
      slug: "architectural-modern-loft",
      price: 395000,
      address: "520 Pine Street #8B",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      bedrooms: 2,
      bathrooms: 2.0,
      squareFeet: 1650,
      lotSize: "N/A (Condo)",
      propertyType: "Condo",
      yearBuilt: 2019,
      description:
        "Sleek downtown penthouse loft with 18-foot soaring ceilings, floor-to-ceiling glass, industrial exposed steel accents, and panoramic skyline city views.",
      features: JSON.stringify([
        "High Ceilings",
        "Skyline City Views",
        "Open Floorplan",
        "Quartz Countertops",
        "Smart Thermostat",
      ]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Electric Heat Pump", cooling: "Central Air" },
        parking: { totalSpaces: 1, garageType: "Underground Reserved Space" },
        construction: { style: "Modern Industrial Loft", materials: "Steel, Glass, Concrete", stories: "1 Level" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Suburban Family Haven with Swimming Pool",
      slug: "suburban-family-haven",
      price: 412000,
      address: "245 Peachtree Ridge",
      city: "Atlanta",
      state: "GA",
      zip: "30305",
      bedrooms: 4,
      bathrooms: 3.0,
      squareFeet: 2600,
      lotSize: "0.40 Acres",
      propertyType: "Single Family",
      yearBuilt: 2017,
      description:
        "Spacious family residence in prime school district featuring an inground saltwater pool, updated chef kitchen, screened patio, and fully fenced private lawn.",
      features: JSON.stringify([
        "Inground Saltwater Pool",
        "Screened Patio",
        "Fenced Yard",
        "Gourmet Kitchen",
        "Two-Car Garage",
      ]),
      detailedSpecs: JSON.stringify({
        interior: { heating: "Forced Air", cooling: "Central Air" },
        parking: { totalSpaces: 2, garageType: "2-Car Attached Garage" },
        construction: { style: "Traditional Family", materials: "Brick, Siding", stories: "2 Stories" },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  for (const p of propertiesData) {
    const property = await prisma.property.create({
      data: {
        title: p.title,
        slug: p.slug,
        price: p.price,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        squareFeet: p.squareFeet,
        lotSize: p.lotSize,
        propertyType: p.propertyType,
        yearBuilt: p.yearBuilt,
        description: p.description,
        features: p.features,
        detailedSpecs: p.detailedSpecs,
        status: p.status,
        featured: p.featured,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            alt: `${p.title} photo ${idx + 1}`,
            sortOrder: idx,
          })),
        },
      },
    });
    console.log(`🏠 Created Property: ${property.title}`);
  }

  // 3. Create Seller Submissions & Offers
  const submission1 = await prisma.sellerSubmission.create({
    data: {
      sellerId: sellerUser1.id,
      propertyAddress: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      propertyType: "Single Family",
      bedrooms: 3,
      bathrooms: 2.0,
      squareFeet: 1750,
      lotSize: "0.25 Acres",
      yearBuilt: 1988,
      occupancy: "Vacant",
      condition: "Needs Repairs",
      description: "Inherited property needing cosmetic updates and kitchen modernization.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      ]),
      preferredContact: "Email",
      status: "NEGOTIATING",
    },
  });

  await prisma.offer.create({
    data: {
      submissionId: submission1.id,
      amount: 195000,
      status: "PENDING",
      message: "Revised Offer: $195,000 net to seller with flexible closing.",
    },
  });

  const conv1 = await prisma.conversation.create({
    data: {
      sellerId: sellerUser1.id,
      submissionId: submission1.id,
      label: "NEGOTIATING",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: adminUser.id,
      content: "Hello Marcus, we have issued an updated offer of $195,000 net to you.",
    },
  });

  // 4. Create Buyer Inquiries
  const sampleProperty = await prisma.property.findFirst({
    where: { slug: "modern-colonial-fairview-heights" },
  });

  await prisma.buyerInquiry.create({
    data: {
      propertyId: sampleProperty?.id,
      name: "David Miller",
      email: "dmiller@example.com",
      phone: "(555) 345-6789",
      message: "Hi, I would like to schedule a walk-through for 1428 Elmwood Terrace this Saturday.",
      status: "NEW",
    },
  });

  console.log("✅ Cash for Houses Summit database successfully seeded with 6 properties!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
