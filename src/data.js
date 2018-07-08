const uuid = require("uuid/v4");
const content = function() {
  let n = Math.floor(100 * Math.random());
  let str = "";
  let i = 0;
  while (i < n) {
    str += "呵呵呵呵";
    i++;
  }

  return str;
};

let data = [];

for (let i = 0; i < 5000; i++) {
  data.push({
    id: uuid(),
    content: content()
  });
}

export default data;
