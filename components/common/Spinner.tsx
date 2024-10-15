import React from "react";
import styles from "./Spinner.module.css";

type Props = {
  size: number;
};

export default function Spinner({ size }: Props) {
  return (
    <div
      className={styles.spinner}
      style={{ width: `${size}px`, height: `${size}px` }}
    ></div>
  );
}
