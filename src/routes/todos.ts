/**
 * REST endpoint for /todos
 */

import sanitizeHtml from "sanitize-html";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { RequestHandler } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const router = express.Router();
const prisma = new PrismaClient();

// REMOVE TODO ITEMS BEGIN
const prepop = [
  {
    id: "feedfacefeedfacefeedface",
    title:
      '<a href="http://adaptable.io/docs/starters/express-prisma-mongo-starter#idea-2-deploy-a-code-update">Deploy a code update</a> by removing the banner message',
    done: false,
  },
  {
    id: "beeffeedbeeffeedbeeffeed",
    title:
      '<a href="https://adaptable.io/docs/starters/express-prisma-mongo-starter#idea-3-start-building-your-app-by-adding-more-api-services">Customize this app</a> by adding an API service to delete To Do items',
    done: false,
  },
];

prepop.map((item) =>
  prisma.todoItem
    .create({ data: item })
    .then(() => console.log(`Added pre-populated item with id ${item.id}`))
    .catch((error) => {
      if (
        !(
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        )
      ) {
        console.error(
          `Error creating prepopulated item ${item.id}: ${error.message}`
        );
      } // else prepopulated entries are already present
    })
);
// REMOVE TODO ITEMS END
// @ts-ignore
function asyncMiddleware(
  callback: (req: any, res: any, next: any) => Promise<void>
): RequestHandler<{ id: string }, any, any, ParsedQs, Record<string, any>> {
  return (req, res, next) =>
    Promise.resolve(callback(req, res, next)).catch(next);
}

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { title: titleIn, done } = req.body;
    const title = sanitizeHtml(titleIn, {
      allowedTags: ["a"],
      allowedAttributes: {
        a: ["href"],
      },
    });

    const result = await prisma.todoItem.create({
      data: {
        title,
        done,
      },
    });
    res.json(result);
  })
);

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const todos = await prisma.todoItem.findMany();
    res.json(todos);
  })
);

router.patch(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const updated = await prisma.todoItem.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  })
);
