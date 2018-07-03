export const binarySearch = (arr, target) => {
  let low = 0;
  let high = arr.length - 1;
  let mid;

  while (low <= high) {
    mid = (low + high) >> 1;

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return -1;
};
