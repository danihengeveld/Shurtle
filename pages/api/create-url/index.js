import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      const url = body["url"];
      const slug = body["slug"];

      if (
        !url ||
        typeof url !== "string" ||
        !slug ||
        typeof slug !== "string"
      ) {
        res.status(400).send({ message: "Please enter a url and a slug" });
        return;
      }

      const existing = await prisma.shortUrl.findUnique({
        where: {
          slug: slug,
        },
      });

      if (existing) {
        res.status(409).send({
          message: `Slug '${slug}' is already in use!`,
          current: existing,
        });
        return;
      }

      const result = await prisma.shortUrl.create({
        data: {
          url: url,
          slug: slug,
        },
      });

      res.status(201).json(result);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).send({ message: `Method ${method} Not Allowed` });
  }
}
