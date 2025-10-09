import { NextRequest, NextResponse } from "next/server";

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

// ✅ Next.js 15+ compatible: must await `context.params`
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    return handleProxy(req, path);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    return handleProxy(req, path);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    return handleProxy(req, path);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    return handleProxy(req, path);
}
