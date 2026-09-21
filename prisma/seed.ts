import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Cash for Houses Summit database...");

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

  console.log("👤 Created Admin and Seller Users.");

  // 2. Create Available & Sold Properties for Buyer Catalog
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
        "An exquisitely designed modern home featuring open-concept living spaces, custom hardwood cabinetry, energy-efficient HVAC, and an expansive landscaped private backyard. Direct purchase through Cash for Houses Summit.",
      features: JSON.stringify([
        "Gourmet Kitchen",
        "Quartz Countertops",
        "Dual Primary Suites",
        "Covered Patio",
        "Two-Car Garage",
        "Smart Thermostat",
        "Walk-In Closets",
        "Central Air",
        "Gas Fireplace",
        "EV Charger Ready",
      ]),
      detailedSpecs: JSON.stringify({
        interior: {
          heating: "Forced Air, Heat Pump",
          cooling: "Central Air, Ceiling Fan(s)",
          appliances: "Electric Range, Dishwasher, Refrigerator, Microwave, Disposal, Washer, Dryer",
          laundry: "Main Level Laundry Room, Hookups",
          flooring: "Hardwood, Tile, Carpet",
          fireplace: "1 Fireplace (Gas Log, Living Room)",
          basement: "Partial, Finished Rec Room",
        },
        parking: {
          totalSpaces: 3,
          garageType: "Attached Garage (2 Spaces), Carport",
          features: "Oversized, EV Charger Ready",
        },
        construction: {
          style: "Contemporary Colonial",
          materials: "Brick, HardiePlank Siding",
          roof: "Architectural Composition Shingle",
          stories: "2 Stories",
        },
        utilities: {
          gas: "Natural Gas Available",
          electric: "City Electric (Xcel)",
          water: "Public City Water",
          sewer: "Public Sewer",
          greenEnergy: "Energy Star Double-Pane Windows, Smart Thermostat",
        },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
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
        "Panoramic Mountain Views",
        "Radiant Floor Heating",
        "Custom Fireplace",
        "Chef's Pantry",
        "EV Charger Ready",
        "Fenced Yard",
        "Covered Patio",
      ]),
      detailedSpecs: JSON.stringify({
        interior: {
          heating: "Radiant Floor Heating, Forced Air",
          cooling: "Central Air",
          appliances: "Gas Range, Stainless Steel Refrigerator, Dishwasher, Microwave",
          flooring: "Polished Concrete, Engineered Oak",
          fireplace: "Stone Hearth Gas Fireplace",
        },
        parking: {
          totalSpaces: 2,
          garageType: "2-Car Attached Garage",
        },
        construction: {
          style: "Craftsman Modern",
          materials: "Cedar Wood Siding, Natural Stone",
          roof: "Metal Standing Seam",
        },
        utilities: {
          water: "City Water",
          sewer: "Public Sewer",
          greenEnergy: "Solar Panel Prepared Roof",
        },
      }),
      status: "AVAILABLE",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
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
      features: JSON.stringify([
        "Hardwood Flooring",
        "Fenced Backyard",
        "Updated Roof (2023)",
        "Formal Dining Room",
      ]),
      detailedSpecs: JSON.stringify({
        interior: {
          heating: "Forced Air",
          cooling: "Central Air",
          appliances: "Range, Refrigerator, Dishwasher",
        },
        parking: {
          totalSpaces: 2,
          garageType: "Detached Garage",
        },
        construction: {
          style: "Tudor Revival",
          materials: "Full Brick Exterior",
        },
      }),
      status: "AVAILABLE",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
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
      description:
        "Inherited property needing cosmetic updates, new roof section, and kitchen modernization. Looking for a straightforward cash sale with flexible closing.",
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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  const conv1 = await prisma.conversation.create({
    data: {
      sellerId: sellerUser1.id,
      submissionId: submission1.id,
      label: "NEGOTIATING",
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: adminUser.id,
        content: "Hello Marcus, we have issued an updated offer of $195,000 net to you.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
    ],
  });

  // 4. Create Buyer Inquiries
  const sampleProperty = await prisma.property.findFirst({
    where: { slug: "modern-colonial-fairview-heights" },
  });

  await prisma.buyerInquiry.createMany({
    data: [
      {
        propertyId: sampleProperty?.id,
        name: "David Miller",
        email: "dmiller@example.com",
        phone: "(555) 345-6789",
        message:
          "Hi, I would like to schedule a walk-through for 1428 Elmwood Terrace this coming Saturday. Is pre-approval required?",
        status: "NEW",
      },
    ],
  });

  console.log("✅ Cash for Houses Summit database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
