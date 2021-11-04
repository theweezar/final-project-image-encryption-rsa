export const convertKbToMb = size => {
  return (parseInt(size, 10) / 1024 / 1024);
};

export const isImageFile = fileName => {
  return /(.png|.jpg|.jpeg)/g.test(fileName);
};
