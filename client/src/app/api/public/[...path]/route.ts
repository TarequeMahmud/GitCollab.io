import { NextRequest, NextResponse } from "next/server";

// Define the structure of `context.params` safely
type RouteContext =
    | { params: { path: string[] } }
    | { params: Promise<{ path: string[] }> };

// helper: unwrap params safely for both Next 14 and 15
async function getParams(context: RouteContext): Promise<{ path: string[] }> {
    if (context.params instanceof Promise) {
        return await context.params;
    }
    return context.params;
}

async function handleProxy(req: NextRequest, path: string[]) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const targetUrl = `${backendUrl}/${path.join("/")}${req.nextUrl.search}/`;

    const headers: HeadersInit = {};
    req.headers.forEach((value, key) => {
        if (!["host", "connection"].includes(key.toLowerCase())) {
            headers[key] = value;
        }
    });

    const body =
        ["POST", "PUT", "PATCH"].includes(req.method) ? await req.text() : undefined;

    try {
        const res = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            credentials: "include",
        });

        const text = await res.text();

        return new NextResponse(text, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("content-type") || "application/json",
            },
        });
    } catch (err) {
        console.error("Proxy error:", err);
        return NextResponse.json({ error: "Proxy request failed" }, { status: 500 });
    }
}

// ✅ Fully typed for Next.js 14–15
export async function GET(req: NextRequest, context: RouteContext) {
    const { path } = await getParams(context);
    return handleProxy(req, path);
}

export async function POST(req: NextRequest, context: RouteContext) {
    const { path } = await getParams(context);
    return handleProxy(req, path);
}

export async function PUT(req: NextRequest, context: RouteContext) {
    const { path } = await getParams(context);
    return handleProxy(req, path);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
    const { path } = await getParams(context);
    return handleProxy(req, path);
}
