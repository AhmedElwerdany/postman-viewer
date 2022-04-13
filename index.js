#!/usr/bin/env node

import fs from "fs";
import path from "path";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const args = yargs(hideBin(process.argv))
  .command(
    "postman-viewer  <path>",
    "watch your collection in a `Mr. Robot` way",
    () => {},
    (argv) => {
      console.info(argv);
    }
  )
  .demandCommand(1)
  .parse();

const path_to_collection = args._[0];
  
const log = console.log;
  
const collection = JSON.parse(
  fs.readFileSync(path.resolve(path.join(path_to_collection)), {
    encoding: "utf-8",
  })
);

const {
  info: { name: collection_name },
  item: collection_folder,
} = collection;

log(chalk.bgBlue(collection_name));

print(collection_folder, 2);

function print(list_of_items, space_count) {
  list_of_items.forEach((item) => {
    const item_type = item.request ? "file" : "folder";
    const color = item_type === "file" ? "yellowBright" : "greenBright";

    let info = chalk[color](item.name)

    if(item.request?.url?.path) {
        const url = item.request.url.path.join('/')
        info += ' ' + chalk.blueBright(url)
    }

    log(` `.repeat(space_count) + info);

    // item is either an item or item-group.
    // item is a http request.
    // item-group is a folder of item and another item-groups
    // item.request is a must in http request (line 42)
    // item.item is a must in item-group (line 54)

    if (item.item) {
      print(item.item, space_count + 2);
    }
  });
}
