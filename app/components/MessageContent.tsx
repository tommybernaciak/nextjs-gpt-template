import { Message } from "ai";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MessageContent.module.css";

interface Props {
  message: Message;
}

const MessageContent: FC<Props> = ({ message }) => {
  return (
    <ReactMarkdown
      className={styles.content + styles.prose}
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
      }}
    >
      {message.content}
    </ReactMarkdown>
  );
};

export default MessageContent;
