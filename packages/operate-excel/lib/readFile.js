const glob = require("glob");
const _ = require("lodash");

async function getFiles() {
  const data = await new Promise((resolve) => {
    glob(
      `**/*.tif`,
      {
        cwd: `./data/`,
      },
      function (er, files) {
        resolve(files);
      }
    );
  });
  return data;
}

function getKeyWord(data) {
  return data.map((pathName) => {
    const [watcherName, dir, fileName] = pathName.split("/");
    const reg = /(\d{1,2})\.00_L(\d{2}\.\d{2})_(\d{2}\.\d{2})/;
    const match = fileName.match(reg);
    return {
      name: watcherName,
      dir,
      id: match[1],
      Lmin: match[2],
      Lmax: match[3],
    };
  });
}

async function getJson() {
  return getFiles().then((data) => {
    const info = getKeyWord(data);
    const groupData = _.groupBy(info, "dir");
    const watcherNameArray = Object.keys(_.groupBy(info, "name"));
    return {
      groupData,
      watcherNameArray,
    };
  });
}

module.exports.getJson = getJson;
