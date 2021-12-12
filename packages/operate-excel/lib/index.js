const _ = require("lodash");
const read = require("./readFile");
const XLSX = require("xlsx");

read.getJson().then((data) => {
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
          let totalLmin = "",
            totalLmax = "";
          data.forEach((item) => {
            totalLmin = totalLmin + item.Lmin + " | ";
            totalLmax = totalLmax + item.Lmax + " | ";
          });
          return {
            ...data[0],
            Lmin: totalLmin,
            Lmax: totalLmax,
          };
        }
      });
    });
    return combineByName;
  });

  const sheetRows = sheetArray.map((sheet) => {
    const row = sheet.map((row) => {
      const info = row[0];
      const renderRow = watcherNameArray.reduce((pre, next, index) => {
        const current = row.find((ele) => ele.name === next);
        if (current?.name == next) {
          pre.push(current.Lmin, current.Lmax);
        } else {
          pre.push("暂无", "暂无");
        }
        return pre;
      }, []);
      renderRow.unshift(info.id);
      return renderRow;
    });
    return row;
  });

  const Sheets = sheetNames.reduce((pre, next, index) => {
    pre[next] = XLSX.utils.aoa_to_sheet(sheetRows[index]);
    return pre;
  }, {});

  XLSX.writeFile(
    {
      SheetNames: sheetNames,
      Sheets,
    },
    "happy.xlsx"
  );
});
