import { FC } from "react";
import styles from "./Header.module.css";

interface Props {
  text?: string;
}

const Header: FC<Props> = ({ text }) => {
  return (
    <div className={styles.header}>
      <h1>{text}</h1>
    </div>
  );
};

export default Header;
