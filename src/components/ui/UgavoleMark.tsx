type Props = {
  size?: number;
  className?: string;
  title?: string;
};

export default function UgavoleMark({ size = 40, className = "", title = "Ugavole" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <path
        d="M23.5 21.5C19.8 16.2 18.3 7.1 21.7 5.3C25.4 3.4 28 12.8 27.1 19.2M42.3 22.3C45.7 17.5 50.4 12.3 53 14.7C55.6 17.2 49.8 24.2 45.5 26.5"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.2 25.2C22.2 19.6 26.7 17.2 32.4 17.2C40.9 17.2 46.7 22.2 47.9 30.6C49.2 40 44.9 50.1 38.4 54.4C34.4 57.1 29.5 56.9 25.6 54.1C19.4 49.7 15.5 39.6 16.8 30.8C17.1 28.7 17.9 26.9 19.2 25.2Z"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25.8" cy="31.5" r="2.4" fill="currentColor" />
      <path d="M37.8 31.8H42" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M23.2 42.5C23.2 38 26.7 35.8 32.2 35.8C37.8 35.8 41.3 38 41.3 42.5V45.2C41.3 50.4 37.8 53 32.2 53C26.7 53 23.2 50.4 23.2 45.2V42.5Z" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="28.3" cy="44" r="1.4" fill="currentColor" />
      <circle cx="36.3" cy="44" r="1.4" fill="currentColor" />
    </svg>
  );
}
