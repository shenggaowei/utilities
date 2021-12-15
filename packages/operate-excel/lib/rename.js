import { getFiles } from "./readFile.js";
import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program.option("-t, --type <type>", "add a replace type", "H");
program.parse();

const { type } = program.opts();

async function replaceName(colorType) {
  const pathArray = await getFiles(colorType, "./input");
  pathArray.forEach((pathName) => {
    const [watcherName, dir, fileName] = pathName.split("/");
    const reg = /([\s\d]+).([\s\d]+)_([\s\d]+).([\s\d]+)/g;
    const newFileName = fileName.replace(reg, function (str, p1, p2, p3, p4) {
      const newP1 = p1.padStart(p3.length, "0");
      return `${newP1}.${p2}_${p3}.${p4}`;
    });
    const newPath = `./input/${colorType}/${watcherName}/${dir}/${newFileName}`;
    fs.renameSync(`./input/${colorType}/${pathName}`, newPath);
  });
  console.log(chalk.green("文件更名成功"));
}

replaceName(type);
