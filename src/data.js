const uuid = require("uuid/v4");
const content = function() {
  let n = Math.floor(100 * Math.random()) + 1;
  let str = "";
  let i = 0;
  while (i < n) {
    str += "呵呵呵呵";
    i++;
  }

  return str;
};

let data = [];

for (let i = 0; i < 100; i++) {
  data.push({
    id: uuid(),
    num: i,
    content: content()
  });
}

export default data;
