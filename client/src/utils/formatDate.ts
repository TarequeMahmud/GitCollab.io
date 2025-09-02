const formatDate = (deadline: string | Date): string => {
  const date = new Date(deadline);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default formatDate;
