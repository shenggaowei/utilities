import fs from "fs";
import glob from "glob";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program.option("-d, --dir <dir>", "the read dir", "./input");
program.parse();

const { dir } = program.opts();

async function getFiles() {
  const data = await new Promise((resolve) => {
    glob(
      `**/*.tif`,
      {
        cwd: `${dir}`,
      },
      function (er, files) {
        resolve(files);
      }
    );
  });
  return data;
}

async function replaceName() {
  const pathArray = await getFiles();
  pathArray.forEach((pathName) => {
    const ret = pathName.split("/");
    const rest = ret.slice(0, ret.length - 1);
    const fileName = ret.slice().pop();
    const reg = /([\s\d]+).([\s\d]+)_([\s\d]+).([\s\d]+)/g;
    const newFileName = fileName.replace(reg, function (str, p1, p2, p3, p4) {
      const newP1 = p1.padStart(p3.length, "0");
      return `${newP1}.${p2}_${p3}.${p4}`;
    });
    const currentPaths = rest.join("/");
    const newPath = `./input/${currentPaths}/${newFileName}`;
    fs.renameSync(`./input/${pathName}`, newPath);
  });
  console.log(chalk.green("文件更名成功"));
}

replaceName(type);
