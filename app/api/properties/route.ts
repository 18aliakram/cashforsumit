import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const beds = searchParams.get("beds");
    const baths = searchParams.get("baths");
    const propertyType = searchParams.get("type");
    const status = searchParams.get("status") || "AVAILABLE"; // default to AVAILABLE
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};

    // By default, if status is specified or "all", apply filter
    if (status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } },
        { zip: { contains: search } },
        { address: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (beds) {
      where.bedrooms = { gte: parseInt(beds) };
    }

    if (baths) {
      where.bathrooms = { gte: parseFloat(baths) };
    }

    if (propertyType && propertyType !== "ALL") {
      where.propertyType = propertyType;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };

    const properties = await db.property.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy,
    });

    return NextResponse.json({ properties });
  } catch (error: any) {
    console.error("[Properties GET Error]", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
