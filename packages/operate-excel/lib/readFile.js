import glob from "glob";
import _ from "lodash";

export async function getFiles(type, prefix = "./input") {
  const data = await new Promise((resolve) => {
    glob(
      `**/*.tif`,
      {
        cwd: `${prefix}/${type}/`,
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
    const f_reg = /CSF_\w{2}_F([\s\d]{2}.\d+)/;
    const value_reg = /[_LCH]{2}([\s\d]+.[\s\d]+_[\s\d]+.[\s\d]+)/g;
    const id = fileName.match(f_reg)[1];
    const [min, max] = value_reg.exec(fileName)[1].split("_");
    return {
      name: watcherName,
      dir,
      id,
      min,
      max,
    };
  });
}

export async function getJson(type) {
  const data = await getFiles(type);
  const info = getKeyWord(data);
  const groupData = _.groupBy(info, "dir");
  const watcherNameArray = Object.keys(_.groupBy(info, "name"));
  return {
    groupData,
    watcherNameArray,
  };
}
