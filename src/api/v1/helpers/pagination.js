export const sortPagination = (sort) => {
  const sortParams = sort?.split(',');
  return sortParams?.join(' ');
};
