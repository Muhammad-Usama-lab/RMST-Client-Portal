export const formatNumberWithCommas = (number) => {
  if (number === null || number === undefined) {
    return 0;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
