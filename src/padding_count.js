const guessHeight = 200;
const heightCache = {};
const windowHeight = window.innerHeight;
const viewportHeight = windowHeight * 3;
let scrollTop = 0;
let running = false;
// each y
data.forEach((el, idx, arr) => {
  let height = heightCache[el.id];
  if (!height) {
    height = guessHeight;
  }

  el.height = height;
  if ((idx = 0)) {
    el.y = 0;
  } else {
    let prev = arr[idx - 1];
    el.y = prev.y + prev.height;
  }
});

// mounted
heightCache[id] = { height } = refs.dom.getClientBoundingRect();

// loop
function updateProjection() {
  running = true;
  let index = bst.le(data, { y: scrollTop - windowHeight });
  let projection = [];
  let padding = 0;
  let allknow = true;

  padding = data[index].y;

  let projectionHeight = 0;

  while (true) {
    let el = data[index];
    if (heightCache[el.id]) {
      data[index].height = heightCache[el.id];
    } else {
      allknow = false;
    }
    projectionHeight += data[index].height;
    projection.push(el);

    index++;

    if (projectionHeight > viewportHeight) {
      break;
    }
  }

  updateState(padding, projection);

  return allknow;
}

function updateProjectionRec() {
  let allknow = updateProjection();
  if (!allknow) {
    requestAnimationFrame(updateProjectionRec);
  } else {
    running = false;
  }
}

const handleScroll = function(e) {
  scrollTop = e.target.scrollTop;

  if (running === false) {
    updateProjectionRec();
  }
};

dom.addEventListener('scroll', handleScroll);
