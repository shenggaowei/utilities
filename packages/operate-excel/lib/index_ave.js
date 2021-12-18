import _ from "lodash";
import { Command } from "commander";
import XLSX from "xlsx";
import fs from "fs";
import chalk from "chalk";
import { getJson } from "./readFile.js";

const program = new Command();
program.version("0.0.3");

program
  .option("-t, --type <type>", "add a generate type", "L")
  .option("-d, --dele <dele>", "delete output dir", "0");
program.parse();

const { type, dele } = program.opts();

async function generateExcel(colorType) {
  const data = await getJson(colorType);
  const { groupData, watcherNameArray } = data;
  const sheetNames = Object.keys(groupData);

  const sheetArray = sheetNames.map((ele, index) => {
    const currentSheet = groupData[ele];
    const groupById = _.groupBy(currentSheet, "id");
    const combineByName = Object.entries(groupById).map(([id, value]) => {
      const groupByName = _.groupBy(value, "name");
      return Object.entries(groupByName).map(([name, data]) => {
        if (data.length === 1) {
          return {
            ...data[0],
            ave_min: data[0].min,
            ave_max: data[0].max,
          };
        } else {
          const { min_total, max_total } = data.reduce(
            (pre, next) => {
              pre.min_total = pre.min_total + +next.min;
              pre.max_total = pre.max_total + +next.max;
              return {
                min_total: pre.min_total,
                max_total: pre.max_total,
              };
            },
            { min_total: 0, max_total: 0 }
          );
          return {
            ...data[0],
            ave_max: (max_total / data.length).toFixed(2),
            ave_min: (min_total / data.length).toFixed(2),
          };
        }
      });
    });
    return combineByName;
  });

  // 给 sheet 添加表头
  function getCommonHead() {
    const watcherNameColumn = watcherNameArray.map((ele) => [ele, ele]).flat();
    const watcherCycleColumn = watcherNameArray
      .map((ele) => ["min", "max"])
      .flat();
    const firstHead = ["", ...watcherNameColumn];
    const secondHead = ["周期（F）", ...watcherCycleColumn];
    return [firstHead, secondHead];
  }

  const sheetRows = sheetArray.map((sheet) => {
    const row = sheet.map((row) => {
      const info = row.find((ele) => !!ele);
      const renderRow = watcherNameArray.reduce((pre, next, index) => {
        const current = row.find((ele) => ele?.name === next);
        if (current?.name == next) {
          pre.push(current.ave_min, current.ave_max);
        } else {
          pre.push("", "");
        }
        return pre;
      }, []);
      renderRow.unshift(info.id);
      return renderRow;
    });
    const sheetHead = getCommonHead();
    row.unshift(...sheetHead);
    return row;
  });

  const Sheets = sheetNames.reduce((pre, next, index) => {
    pre[next] = XLSX.utils.aoa_to_sheet(sheetRows[index]);
    return pre;
  }, {});

  if (dele == 1) {
    fs.rmSync("./output", { force: true, recursive: true });
    fs.mkdirSync("./output");
    console.log(chalk.green("output文件夹清理完成"));
  }

  XLSX.writeFile(
    {
      SheetNames: sheetNames,
      Sheets,
    },
    `./output/${colorType}_AVE.xlsx`
  );
  console.log(chalk.green(`output/${colorType}_AVE.xlsx已经生成`));
}

generateExcel(type);
