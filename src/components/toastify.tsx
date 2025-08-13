// import React from "react";

// export const Toast = ({
//   text,
//   type,
// }: {
//   text: string;
//   type: "success" | "warning" | "failed";
// }) => {
//   return (
//     <svg
//       width="406"
//       height="50"
//       viewBox="0 0 406 50"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ marginBottom: "10px" }}
//     >
//       <path
//         d="M400 0H0V42.7778L6.5 50H406V6.66667L400 0Z"
//         fill={
//           type === "success"
//             ? "#00C30633"
//             : type === "warning"
//             ? "#FF620033"
//             : "#C3000333"
//         }
//         fillOpacity="0.9"
//       />
//       <text
//         x="50%"
//         y="50%"
//         dominantBaseline="middle"
//         textAnchor="middle"
//         fontSize="18"
//         fill={
//           type === "success"
//             ? "#009A05"
//             : type === "warning"
//             ? "#FF6200"
//             : "#FF0004"
//         }
//         fontWeight="500"
//       >
//         {text}
//       </text>
//     </svg>
//   );
// };

import React from "react";

export const Toast = ({
  text,
  type,
}: {
  text: string;
  type: "success" | "warning" | "failed";
}) => {
  return (
    <svg
      width="406"
      height="50"
      viewBox="0 0 406 50"
      fill="none"
      style={{ marginBottom: "10px" }}
    >
      <path
        d="M400 0H0V42.7778L6.5 50H406V6.66667L400 0Z"
        fill={
          type === "success"
            ? "#00C30633"
            : type === "warning"
            ? "#FF620033"
            : "#C3000333"
        }
        fillOpacity="0.9"
      />

      <foreignObject x="10" y="5" width="386" height="40">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            fontSize: "18px",
            fontWeight: 500,
            color:
              type === "success"
                ? "#009A05"
                : type === "warning"
                ? "#FF6200"
                : "#FF0004",
            padding: "0 10px",
          }}
        >
          {text}
        </div>
      </foreignObject>
    </svg>
  );
};
