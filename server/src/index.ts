require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

const main = async () => {
  // database connection
  await createConnection();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/resolvers/*.ts"],
      validate: false,
    }),
  });

  app.use(apolloServer.getMiddleware());

  const PORT = process.env.SERVER_PORT;

  app.listen(PORT, () => {
    console.log(`🚀 Server is on: ${PORT}`);
  });
};

main().catch((err) => console.log(err));
