import { Message } from "ai";
import { FC, Fragment, useRef } from "react";
import Spinner from "./Spinner";
import styles from "./Messages.module.css";
import MessageContent from "./MessageContent";

interface Props {
  messages: Message[];
  showSpinner: boolean;
}

const Messages: FC<Props> = ({ messages, showSpinner }) => {
  const chatContainerRef = useRef<null | HTMLDivElement>(null);

  // INFO: Hook for autoscroll to the bottom of the chat
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  return (
    <div ref={chatContainerRef} className={styles.container}>
      {messages.map((message, i) => (
        <Fragment key={i}>
          {message.role === "assistant" && (
            <div className={styles.assistantContainer}>
              <div className={styles.assistantContent}>
                <MessageContent message={message} />
              </div>
            </div>
          )}
          {message.role === "user" && (
            <div className={styles.userContainer}>
              <div className={styles.userContent}>
                <MessageContent message={message} />
              </div>
            </div>
          )}
        </Fragment>
      ))}
      {showSpinner && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Messages;
