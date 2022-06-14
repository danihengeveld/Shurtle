import { NextResponse } from "next/server";

export async function middleware(req, ev){
    if(req.nextUrl.pathname.startsWith("/api")) {
        return;
    }

    const slug = req.nextUrl.pathname.split("/").pop();

    const data = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`);
    if(data.ok){
        const json = await (data).json();

        if(json?.url){
            return NextResponse.redirect(data.url);
        }
    }
}