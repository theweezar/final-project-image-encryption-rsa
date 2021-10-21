export const Image = ({ src }) => {
  return (
    <div>
      <img srcSet={src} alt="" />
    </div>
  );
}
