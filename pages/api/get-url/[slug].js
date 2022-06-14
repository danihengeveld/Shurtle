import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=2629800, stale-while-revalidate");

    const slug = req.query["slug"];
    if (!slug || typeof slug !== "string") {
        res.setHeader("Cache-Control", "s-maxage=31557600, stale-while-revalidate");
        res.status(400).send({ message: "Please enter a slug" });

        return;
    }

    const data = await prisma.shortUrl.findFirst({
        where: {
            slug: {
                equals: slug
            }
        }
    });

    if (!data) {
        res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
        res.status(404).send({ message: "Slug not found" });

        return;
    }

    await prisma.shortUrl.update({
        where: {
            id: data.id,
        },
        data: {
            hits: data.hits + 1,
        }
    });

    return res.json(data);
}