import { FC } from "react";
import styles from "./SendButton.module.css";

interface Props {
  isLoading: boolean;
  disabled: boolean;
  stop: () => void;
}

const SendButton: FC<Props> = ({ isLoading, disabled, stop }) => {
  return (
    <>
      {isLoading ? (
        <button type="button" className={styles.stopButton} onClick={stop}>
          <span className={`${styles.stopButtonIcon} material-symbols-rounded`}>
            stop
          </span>
        </button>
      ) : (
        <button className={styles.sendButton} disabled={disabled}>
          <span className={`${styles.sendButtonIcon} material-symbols-rounded`}>
            arrow_right_alt
          </span>
        </button>
      )}
    </>
  );
};

export default SendButton;
