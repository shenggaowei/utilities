import _ from "lodash";
import { Command } from "commander";
import XLSX from "xlsx";
import fs from "fs";
import { getJson } from "./readFile.js";

const program = new Command();
program.version("0.0.3");

program.option("-t, --type <type>", "add a generate type", "L");
program.parse();

const { type } = program.opts();

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
          return data[0];
        } else {
          let totalMin = "",
            totalMax = "";
          data.forEach((item) => {
            totalMin = totalMin + item.min + " | ";
            totalMax = totalMax + item.max + " | ";
          });
          return {
            ...data[0],
            min: totalMin,
            max: totalMax,
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
      const info = row[0];
      const renderRow = watcherNameArray.reduce((pre, next, index) => {
        const current = row.find((ele) => ele.name === next);
        if (current?.name == next) {
          pre.push(current.min, current.max);
        } else {
          pre.push("暂无", "暂无");
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

  const hasOutput = await new Promise((resolve, reject) => {
    fs.stat("./output", (err, stats) => {
      resolve(!err);
    });
  });

  if (!hasOutput) {
    fs.mkdirSync("./output");
  }

  XLSX.writeFile(
    {
      SheetNames: sheetNames,
      Sheets,
    },
    `./output/${colorType}.xlsx`
  );
}

generateExcel(type);
