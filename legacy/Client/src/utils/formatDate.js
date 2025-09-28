const formatDate = (deadline) => {
  const date = new Date(deadline);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
export default formatDate;
