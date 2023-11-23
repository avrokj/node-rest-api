import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get("/", (request, response) => {
  /* callback */
  response.status(200).send("Welcome"); /* Saadan sõnumi */
});

app.get("/books", async (request, response) => {
  // cosnt sql = "select * from books"; /* ei ole turvaline viis */
  // books.getAll();
  try {
    const books =
      await prisma.books.findMany(); /* ootame ära andmebaasi päringu, et kust tabelist ja mida ta teeb */
    response.status(200).json(books); /* 200, kui kõik on hästi */
  } catch (error) {
    console.log(error);
    response.status(400).send({
      message: "Midagi läks valesti. Proovi uuesti.",
    });
  }
});

app.get("/books/:id", async (request, response) => {
  try {
    // const id = request.params.id; /* id tuleb siis eelmisest reast */
    const { id } = request.params;
    const book = await prisma.books.findUnique({
      where: {
        id: Number(id), // tuleb teha stringiks
      },
    });
    if (!book) {
      throw new Error("Raamatut ei leitud.");
    }
    response.status(200).json(book);
  } catch (error) {
    console.log(error);
    response.status(400).send({
      message: error.message,
    });
  }
});

app.get("/authors", async (request, response) => {
  try {
    const authors = await prisma.authors.findMany();
    response.status(200).json(authors);
  } catch (error) {
    console.log(error);
    response.status(400).send({
      message: "Midagi läks valesti",
    });
  }
});

app.get("/authors/:id", async (request, response) => {
  try {
    // const id = request.params.id; /* id tuleb siis eelmisest reast */
    const { id } = request.params;
    const author = await prisma.authors.findUnique({
      where: {
        id: Number(id), // tuleb teha stringiks
      },
    });
    if (!author) {
      throw new Error("Autorit ei leitud.");
    }
    response.status(200).json(author);
  } catch (error) {
    console.log(error);
    response.status(400).send({
      message: error.message,
    });
  }
});

app.delete("/books/:id", async (request, response) => {
  const { id } = request.params;

  try {
    //const testing =
    await prisma.books.delete({
      where: {
        id: Number(id),
      },
    });

    //console.log(testing);
    response.status(200).send({
      message: "Book deleted",
    });
  } catch (error) {
    response.status(401).json({
      message: "Something went wrong. Try again.",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
