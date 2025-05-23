import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  syncWithBody?: boolean;
  size?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  syncWithBody = true,
  size = "85px",
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // If syncWithBody is true, also update the data-dark-mode attribute
    if (syncWithBody) {
      document.body.setAttribute(
        "data-dark-mode",
        newTheme === "dark" ? "true" : "false"
      );
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      className={styles.toggle}
      aria-pressed={theme === "dark"}
      onClick={toggle}
      title="Toggle Dark Mode  "
      style={{ "--width": size } as React.CSSProperties}
    >
      <span className={styles.toggle__content}>
        <svg
          aria-hidden="true"
          className={styles.toggle__backdrop}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 290 228"
        >
          <g className={styles.clouds}>
            <path
              fill="#D9D9D9"
              d="M335 147.5c0 27.89-22.61 50.5-50.5 50.5a50.78 50.78 0 0 1-9.29-.853c-2.478 12.606-10.595 23.188-21.615 29.011C245.699 243.749 228.03 256 207.5 256a50.433 50.433 0 0 1-16.034-2.599A41.811 41.811 0 0 1 166 262a41.798 41.798 0 0 1-22.893-6.782A42.21 42.21 0 0 1 135 256a41.82 41.82 0 0 1-19.115-4.592A41.84 41.84 0 0 1 88 262c-1.827 0-3.626-.117-5.391-.343C74.911 270.448 63.604 276 51 276c-23.196 0-42-18.804-42-42s18.804-42 42-42c1.827 0 3.626.117 5.391.343C64.089 183.552 75.396 178 88 178a41.819 41.819 0 0 1 19.115 4.592C114.532 176.002 124.298 172 135 172a41.798 41.798 0 0 1 22.893 6.782 42.066 42.066 0 0 1 7.239-.773C174.137 164.159 189.749 155 207.5 155c.601 0 1.199.01 1.794.031A41.813 41.813 0 0 1 234 147h.002c.269-27.66 22.774-50 50.498-50 27.89 0 50.5 22.61 50.5 50.5Z"
            />
          </g>
        </svg>

        <span aria-hidden="true" className={styles.pilot__container}>
          <span className={styles["pilot-bear"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="none"
              viewBox="0 0 1448 938"
            >
              <mask id="a" fill="#fff">
                <path
                  fillRule="evenodd"
                  d="M869.02 210.61c16.067-3.967 27.98-18.476 27.98-35.768C897 154.495 880.505 138 860.158 138c-14.337 0-26.761 8.19-32.85 20.146C815.313 151.674 801.586 148 787 148h-20c-14.52 0-28.19 3.641-40.146 10.059C720.749 146.15 708.351 138 694.048 138c-20.347 0-36.842 16.495-36.842 36.842 0 17.222 11.818 31.685 27.787 35.72A85.104 85.104 0 0 0 682 233v225c0 12.15 9.85 22 22 22h44c12.15 0 22-9.85 22-22v-28.69a41.072 41.072 0 0 0 14 .174V458c0 12.15 9.85 22 22 22h44c12.15 0 22-9.85 22-22v-74.797a28.992 28.992 0 0 0 6.946-5.137l44.548-44.548c11.325-11.325 11.325-29.687 0-41.012s-29.687-11.325-41.012 0L872 302.988V233a85.094 85.094 0 0 0-2.98-22.39Z"
                  clipRule="evenodd"
                />
              </mask>
              <path
                fill="#AF7128"
                fillRule="evenodd"
                d="M869.02 210.61c16.067-3.967 27.98-18.476 27.98-35.768C897 154.495 880.505 138 860.158 138c-14.337 0-26.761 8.19-32.85 20.146C815.313 151.674 801.586 148 787 148h-20c-14.52 0-28.19 3.641-40.146 10.059C720.749 146.15 708.351 138 694.048 138c-20.347 0-36.842 16.495-36.842 36.842 0 17.222 11.818 31.685 27.787 35.72A85.104 85.104 0 0 0 682 233v225c0 12.15 9.85 22 22 22h44c12.15 0 22-9.85 22-22v-28.69a41.072 41.072 0 0 0 14 .174V458c0 12.15 9.85 22 22 22h44c12.15 0 22-9.85 22-22v-74.797a28.992 28.992 0 0 0 6.946-5.137l44.548-44.548c11.325-11.325 11.325-29.687 0-41.012s-29.687-11.325-41.012 0L872 302.988V233a85.094 85.094 0 0 0-2.98-22.39Z"
                clipRule="evenodd"
              />
              <path
                fill="#000"
                d="m869.02 210.61-5.789 1.577-1.614-5.929 5.965-1.473 1.438 5.825Zm-41.712-52.464 5.347 2.723-2.789 5.476-5.407-2.918 2.849-5.281Zm-100.454-.087 2.838 5.287-5.388 2.892-2.789-5.442 5.339-2.737Zm-41.861 52.503 1.47-5.817 5.928 1.498-1.61 5.899-5.788-1.58ZM770 429.31h-6v-7.218l7.097 1.319L770 429.31Zm14 .174-.95-5.925 6.95-1.114v7.039h-6Zm88-46.281h-6v-3.613l3.194-1.69 2.806 5.303Zm6.946-5.137 4.243 4.243-4.243-4.243Zm44.548-44.548-4.243-4.242 4.243 4.242Zm0-41.012 4.243-4.242-4.243 4.242Zm-41.012 0 4.242 4.243-4.242-4.243ZM872 302.988l4.243 4.243L866 317.473v-14.485h6Zm31-128.146c0 20.116-13.859 36.98-32.541 41.593l-2.877-11.65c13.45-3.321 23.418-15.476 23.418-29.943h12ZM860.158 132C883.819 132 903 151.181 903 174.842h-12C891 157.808 877.192 144 860.158 144v-12Zm-38.197 23.424C829.034 141.535 843.478 132 860.158 132v12c-11.993 0-22.399 6.845-27.503 16.869l-10.694-5.445ZM787 142c15.605 0 30.309 3.933 43.157 10.866l-5.698 10.561C813.318 157.415 800.567 154 787 154v-12Zm-20 0h20v12h-20v-12Zm-42.984 10.773C736.823 145.897 751.465 142 767 142v12c-13.506 0-26.203 3.384-37.308 9.346l-5.676-10.573ZM694.048 132c16.64 0 31.054 9.488 38.145 23.322l-10.678 5.474C716.397 150.812 706.013 144 694.048 144v-12Zm-42.842 42.842c0-23.661 19.181-42.842 42.842-42.842v12c-17.033 0-30.842 13.808-30.842 30.842h-12Zm32.317 41.537c-18.569-4.692-32.317-21.502-32.317-41.537h12c0 14.409 9.888 26.524 23.257 29.903l-2.94 11.634ZM676 233c0-8.305 1.114-16.36 3.205-24.018l11.576 3.16A79.096 79.096 0 0 0 688 233h-12Zm0 133V233h12v133h-12Zm0 45v-45h12v45h-12Zm0 47v-47h12v47h-12Zm28 28c-15.464 0-28-12.536-28-28h12c0 8.837 7.163 16 16 16v12Zm44 0h-44v-12h44v12Zm28-28c0 15.464-12.536 28-28 28v-12c8.837 0 16-7.163 16-16h12Zm0-28.69V458h-12v-28.69h12Zm1.5 6.69c-2.925 0-5.798-.27-8.597-.791l2.194-11.798a34.98 34.98 0 0 0 6.403.589v12Zm7.45-.592a47.08 47.08 0 0 1-7.45.592v-12c1.887 0 3.74-.151 5.55-.441l1.9 11.849ZM778 458v-28.516h12V458h-12Zm28 28c-15.464 0-28-12.536-28-28h12c0 8.837 7.163 16 16 16v12Zm44 0h-44v-12h44v12Zm28-28c0 15.464-12.536 28-28 28v-12c8.837 0 16-7.163 16-16h12Zm0-47v47h-12v-47h12Zm0-27.797V411h-12v-27.797h12Zm-8.806-5.303a23.032 23.032 0 0 0 5.51-4.076l8.485 8.485a35.013 35.013 0 0 1-8.382 6.197l-5.613-10.606Zm5.51-4.076 44.547-44.548 8.486 8.485-44.548 44.548-8.485-8.485Zm44.547-44.548c8.982-8.982 8.982-23.545 0-32.527l8.486-8.485c13.668 13.668 13.668 35.829 0 49.497l-8.486-8.485Zm0-32.527c-8.982-8.982-23.545-8.982-32.527 0l-8.485-8.485c13.668-13.669 35.829-13.669 49.498 0l-8.486 8.485Zm-32.527 0-10.481 10.482-8.486-8.486 10.482-10.481 8.485 8.485ZM878 233v69.988h-12V233h12Zm-3.191-23.966A91.065 91.065 0 0 1 878 233h-12c0-7.212-.965-14.189-2.769-20.813l11.578-3.153Z"
                mask="url(#a)"
              />
              <path fill="#FF1E1E" d="M821.678 205.665h-88.371v13.25h88.371z" />
              <path
                fill="#000"
                fillRule="evenodd"
                d="M709.7 164.481c-17.939 14.394-28.018 37.148-28.018 57.504h61.648c.087-13.669 11.194-24.723 24.883-24.723h18.56c13.689 0 24.796 11.054 24.883 24.723H873c0-20.356-10.078-43.11-28.018-57.504C827.043 150.086 802.711 142 777.341 142c-25.37 0-49.701 8.086-67.641 22.481Z"
                clipRule="evenodd"
              />
              <path
                fill="url(#b)"
                fillOpacity=".4"
                fillRule="evenodd"
                d="M709.7 164.481c-17.939 14.394-28.018 37.148-28.018 57.504h61.648c.087-13.669 11.194-24.723 24.883-24.723h18.56c13.689 0 24.796 11.054 24.883 24.723H873c0-20.356-10.078-43.11-28.018-57.504C827.043 150.086 802.711 142 777.341 142c-25.37 0-49.701 8.086-67.641 22.481Z"
                clipRule="evenodd"
              />
              <circle
                cx="8.079"
                cy="8.079"
                r="8.079"
                fill="#000"
                transform="matrix(-1 0 0 1 730.414 240)"
              />
              <circle
                cx="8.079"
                cy="8.079"
                r="8.079"
                fill="#000"
                transform="matrix(-1 0 0 1 839 240)"
              />
              <path
                fill="#000"
                d="M755.835 262.683c0 8.21 9.868 17.451 20.845 17.451 10.977 0 20.845-9.241 20.845-17.451s-9.868-12.281-20.845-12.281c-10.977 0-20.845 4.071-20.845 12.281Z"
              />
              <path
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="6"
                d="M738 464v12m-24-12v12m127-12v12m-24-12v12"
              />
              <path
                fill="#707070"
                stroke="#000"
                strokeWidth="6"
                d="M687 370v16h183v-16zm0-54v16h183v-16z"
              />
              <path
                fill="#D9D9D9"
                stroke="#000"
                strokeWidth="6"
                d="M795 370h-28v16h28zm76-69h-16v95h16zm-172 0h-16v95h16z"
              />
              <rect
                width="74.266"
                height="52"
                x="-3"
                y="3"
                fill="#AF7128"
                stroke="#000"
                strokeWidth="6"
                rx="26"
                transform="matrix(-1 0 0 1 732 316)"
              />
              <path
                fill="#000"
                d="M722 354a3 3 0 1 1 0-6v6Zm12 0h-12v-6h12v6Zm-12-12a3 3 0 1 1 0-6v6Zm12 0h-12v-6h12v6Z"
              />
              <path
                fill="#494949"
                d="m323.749 728.949 12.392-12.694 157.087 153.35-12.392 12.694z"
              />
              <path
                fill="#494949"
                d="m468.695 876.651-11.898-13.158 162.83-147.237 11.899 13.158z"
              />
              <path
                fill="#6FB7D6"
                fillOpacity=".53"
                d="M415 372.657 643.398 213v159.657H415Z"
              />
              <path
                fill="url(#c)"
                fillOpacity=".4"
                d="M415 372.657 643.398 213v159.657H415Z"
              />
              <path fill="#000" d="M59.871 212.892H95.35v656.367H59.871z" />
              <path fill="#000" d="M106.438 523.336v35.479H59.871v-35.479z" />
              <path
                fill="#FE1616"
                d="M59.871 212.892H95.35v35.479H59.871zm0 620.888H95.35v35.479H59.871z"
              />
              <ellipse
                cx="59.871"
                cy="539.966"
                fill="url(#d)"
                rx="59.871"
                ry="38.806"
              />
              <path
                fill="#5B5B5B"
                d="M106.438 441.29h53.219v199.571h-53.219z"
              />
              <path
                fill="#D9D9D9"
                fillRule="evenodd"
                d="M1359.3 372.549H159.657v337.053H949.06l410.24-236.853v-100.2Z"
                clipRule="evenodd"
              />
              <path
                fill="url(#e)"
                fillOpacity=".4"
                fillRule="evenodd"
                d="M1359.3 372.549H159.657v337.053H949.06l410.24-236.853v-100.2Z"
                clipRule="evenodd"
              />
              <path
                fill="url(#f)"
                d="M281.617 408.028h263.877v263.877H281.617z"
              />
              <path
                fill="#FF0B0B"
                d="M192.919 709.602h443.492V798.3H192.919z"
              />
              <path
                fill="url(#g)"
                fillOpacity=".3"
                d="M192.919 709.602h443.492V798.3H192.919z"
              />
              <path fill="#FF0B0B" d="M192.919.016h443.492v88.698H192.919z" />
              <path
                fill="url(#h)"
                fillOpacity=".28"
                d="M192.919.016h443.492v88.698H192.919z"
              />
              <path
                fill="#FF0B0B"
                d="M1175.25 396.941h221.746v44.349H1175.25z"
              />
              <path
                fill="url(#i)"
                fillOpacity=".2"
                d="M1175.25 396.941h221.746v44.349H1175.25z"
              />
              <path
                fill="#F20000"
                d="M1301.65 212.892H1448l-90.92 159.657h-148.57l93.14-159.657Z"
              />
              <path
                fill="url(#j)"
                fillOpacity=".2"
                d="M1301.65 212.892H1448l-90.92 159.657h-148.57l93.14-159.657Z"
              />
              <circle cx="476.754" cy="869.259" r="68.741" fill="url(#k)" />
              <path
                fill="#494949"
                d="M223.963 88.714h33.262v620.888h-33.262zm345.923 0h33.262v620.888h-33.262z"
              />
              <defs>
                <linearGradient
                  id="b"
                  x1="682"
                  x2="860"
                  y1="205"
                  y2="182"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#fff" />
                  <stop offset=".375" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="c"
                  x1="444"
                  x2="643"
                  y1="325"
                  y2="321"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#fff" />
                  <stop offset=".443" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="d"
                  x1="0"
                  x2="119.743"
                  y1="541.075"
                  y2="541.075"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".25" stopColor="#FF2626" />
                  <stop offset=".25" />
                </linearGradient>
                <linearGradient
                  id="e"
                  x1="1232"
                  x2="160"
                  y1="521"
                  y2="521"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="g"
                  x1="626"
                  x2="208"
                  y1="754"
                  y2="754"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="h"
                  x1="636"
                  x2="193"
                  y1="44"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="i"
                  x1="1380"
                  x2="1028"
                  y1="419"
                  y2="419"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="j"
                  x1="1362"
                  x2="1156"
                  y1="273"
                  y2="279"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <radialGradient
                  id="k"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientTransform="rotate(90 -196.253 673.007) scale(68.7412)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".51" stopColor="#fff" />
                  <stop offset=".51" />
                </radialGradient>
                <pattern
                  id="f"
                  width="1"
                  height="1"
                  patternContentUnits="objectBoundingBox"
                >
                  <use xlinkHref="#l" transform="scale(.0033)" />
                </pattern>
                <image xlinkHref="" id="l" width="300" height="300" />
              </defs>
            </svg>
          </span>
        </span>

        <svg
          aria-hidden="true"
          className={styles.toggle__backdrop}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 290 228"
        >
          <g className={styles.clouds}>
            <path
              fill="#fff"
              d="M328 167.5c0 15.214-7.994 28.56-20.01 36.068.007.31.01.621.01.932 0 23.472-19.028 42.5-42.5 42.5-3.789 0-7.461-.496-10.957-1.426C249.671 263.676 233.141 277 213.5 277a42.77 42.77 0 0 1-7.702-.696C198.089 284.141 187.362 289 175.5 289a42.338 42.338 0 0 1-27.864-10.408A42.411 42.411 0 0 1 133.5 281c-4.36 0-8.566-.656-12.526-1.876C113.252 287.066 102.452 292 90.5 292a42.388 42.388 0 0 1-15.8-3.034A42.316 42.316 0 0 1 48.5 298C25.028 298 6 278.972 6 255.5S25.028 213 48.5 213a42.388 42.388 0 0 1 15.8 3.034A42.316 42.316 0 0 1 90.5 207c4.36 0 8.566.656 12.526 1.876C110.748 200.934 121.548 196 133.5 196a42.338 42.338 0 0 1 27.864 10.408A42.411 42.411 0 0 1 175.5 204c2.63 0 5.204.239 7.702.696C190.911 196.859 201.638 192 213.5 192c3.789 0 7.461.496 10.957 1.426 2.824-10.491 9.562-19.377 18.553-24.994-.007-.31-.01-.621-.01-.932 0-23.472 19.028-42.5 42.5-42.5s42.5 19.028 42.5 42.5Z"
            />
          </g>
        </svg>

        <span className={styles["toggle__indicator-wrapper"]}>
          <span className={styles.toggle__indicator}>
            <span className={styles.toggle__star}>
              <span className={styles.sun}>
                <span className={styles.moon}>
                  <span className={styles.moon__crater}></span>
                  <span className={styles.moon__crater}></span>
                  <span className={styles.moon__crater}></span>
                </span>
              </span>
            </span>
          </span>
        </span>

        <svg
          aria-hidden="true"
          className={styles.toggle__backdrop}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 290 228"
        >
          <g>
            <g className={styles.stars}>
              <g>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M61 11.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.749 3.749 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.749 3.749 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.749 3.749 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 61 11.5Z"
                  clipRule="evenodd"
                />
              </g>
              <g>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M62.5 45.219a.329.329 0 0 1 .315.238l.356 1.245a1.641 1.641 0 0 0 1.127 1.127l1.245.356a.328.328 0 0 1 0 .63l-1.245.356a1.641 1.641 0 0 0-1.127 1.127l-.356 1.245a.328.328 0 0 1-.63 0l-.356-1.245a1.641 1.641 0 0 0-1.127-1.127l-1.245-.356a.328.328 0 0 1 0-.63l1.245-.356a1.641 1.641 0 0 0 1.127-1.127l.356-1.245a.328.328 0 0 1 .315-.238Z"
                  clipRule="evenodd"
                />
              </g>
              {/* More stars here... I've truncated for brevity */}
            </g>
          </g>
        </svg>

        <span className={styles.astrobear__container}>
          <span className={styles.astrobear}>
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 316 432"
            >
              <circle cx="158" cy="143" r="140" fill="#444" />
              <circle
                cx="158"
                cy="143"
                r="140"
                fill="url(#aa)"
                fillOpacity=".2"
              />
              <circle cx="158" cy="143" r="140" stroke="#000" strokeWidth="6" />
              <path
                fill="#AF7128"
                fillRule="evenodd"
                d="M65.98 159.61C49.913 155.643 38 141.134 38 123.842 38 103.495 54.495 87 74.842 87c14.337 0 26.761 8.19 32.85 20.146C119.687 100.674 133.414 97 148 97h20c14.52 0 28.19 3.641 40.146 10.059C214.251 95.15 226.65 87 240.952 87c20.347 0 36.842 16.495 36.842 36.842 0 17.222-11.818 31.685-27.787 35.72A85.104 85.104 0 0 1 253 182v66.56l10.054-10.054c11.325-11.325 29.687-11.325 41.012 0s11.325 29.687 0 41.012l-44.548 44.548a29.004 29.004 0 0 1-6.518 4.906V407c0 12.15-9.85 22-22 22h-44c-12.15 0-22-9.85-22-22v-28.69a41.072 41.072 0 0 1-14 .174V407c0 12.15-9.85 22-22 22H85c-12.15 0-22-9.85-22-22v-77.797a28.99 28.99 0 0 1-6.946-5.137l-44.548-44.548c-11.325-11.325-11.325-29.687 0-41.012 11.326-11.325 29.687-11.325 41.013 0L63 248.988V182a85.106 85.106 0 0 1 2.98-22.39Z"
                clipRule="evenodd"
              />
              {/* More SVG paths for the astronaut bear */}
              <defs>
                <linearGradient
                  id="aa"
                  x1="158"
                  x2="158"
                  y1="0"
                  y2="286"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".219" />
                  <stop offset="1" stopColor="#fff" />
                </linearGradient>
                {/* More gradient definitions */}
              </defs>
            </svg>
          </span>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
