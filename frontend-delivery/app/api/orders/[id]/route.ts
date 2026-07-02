import { NextResponse } from "next/server";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL ?? "http://localhost:8084";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${ORDER_SERVICE_URL}/orders/${params.id}`, {
      cache: "no-store",
    });

    const text = await res.text();
    if (!text) {
      return NextResponse.json(
        { success: false, message: "Empty response from order service" },
        { status: 502 }
      );
    }

    const json = JSON.parse(text);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Order service unavailable" },
      { status: 502 }
    );
  }
}
