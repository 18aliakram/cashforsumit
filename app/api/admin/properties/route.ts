import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      price,
      address,
      city,
      state,
      zip,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      propertyType,
      yearBuilt,
      description,
      features,
      detailedSpecs,
      status,
      featured,
      images,
    } = body;

    if (!title || !price || !address || !city || !state || !zip || !bedrooms || !bathrooms) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const property = await db.property.create({
      data: {
        title,
        slug,
        price: parseFloat(price),
        address,
        city,
        state,
        zip,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseFloat(bathrooms),
        squareFeet: parseInt(squareFeet || "0"),
        lotSize: lotSize || null,
        propertyType: propertyType || "Single Family",
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        description: description || "",
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        detailedSpecs: typeof detailedSpecs === "string" ? detailedSpecs : JSON.stringify(detailedSpecs || {}),
        status: status || "AVAILABLE",
        featured: !!featured,
        images: {
          create: (images || []).map((url: string, idx: number) => ({
            url,
            alt: `${title} image ${idx + 1}`,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    console.error("[Admin Create Property Error]", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      price,
      address,
      city,
      state,
      zip,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      propertyType,
      yearBuilt,
      description,
      features,
      detailedSpecs,
      status,
      featured,
      images,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms);
    if (bathrooms !== undefined) updateData.bathrooms = parseFloat(bathrooms);
    if (squareFeet !== undefined) updateData.squareFeet = parseInt(squareFeet);
    if (lotSize !== undefined) updateData.lotSize = lotSize;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (yearBuilt !== undefined) updateData.yearBuilt = yearBuilt ? parseInt(yearBuilt) : null;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;

    if (features !== undefined) {
      updateData.features = typeof features === "string" ? features : JSON.stringify(features);
    }

    if (detailedSpecs !== undefined) {
      updateData.detailedSpecs = typeof detailedSpecs === "string" ? detailedSpecs : JSON.stringify(detailedSpecs);
    }

    // Replace images if provided
    if (images && Array.isArray(images)) {
      await db.propertyImage.deleteMany({ where: { propertyId: id } });
      updateData.images = {
        create: images.map((url: string, idx: number) => ({
          url,
          alt: `${title || "Property"} image ${idx + 1}`,
          sortOrder: idx,
        })),
      };
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });

    return NextResponse.json({ success: true, property: updatedProperty });
  } catch (error: any) {
    console.error("[Admin Update Property Error]", error);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    await db.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin Delete Property Error]", error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
