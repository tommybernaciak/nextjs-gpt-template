"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { useChat } from "ai/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Messages from "./components/Messages";
import SendButton from "./components/SendButton";
import Textarea from "react-textarea-autosize";
import { ISettings } from "./db/models/settings";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [userId] = useState<string>(uuidv4());
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [assistantMessageFinished, setAssistantMessageFinished] =
    useState(false);

  const fetchSettings = (): Promise<AxiosResponse<ISettings>> =>
    axios.get("/api/settings");

  useEffect(() => {
    fetchSettings().then((response) => {
      setSettings(response.data);
    });
  }, []);

  const { messages, input, setInput, handleSubmit, isLoading, stop } = useChat({
    onError: (error) => {
      console.error(error);
    },
    onFinish: (message) => {
      setAssistantMessageFinished(true);
    },
  });

  const sendDisabled = isLoading || input.length === 0 || !settings;
  const showSpinner =
    isLoading &&
    !assistantMessageFinished &&
    messages[messages.length - 1].role === "user";

  return (
    <>
      <main className={styles.main}>
        {settings ? <></> : <>loading settings...</>}
        <div className={styles.container}>
          <Header text={"W czym mogę pomóc?"} />
          <Messages messages={messages} showSpinner={showSpinner} />
          <div className={styles.formContainer}>
            <form
              ref={formRef}
              onSubmit={(e) => {
                setAssistantMessageFinished(false);
                handleSubmit(e, {
                  options: {
                    body: {
                      userId,
                    },
                  },
                });
              }}
              className={styles.form}
            >
              <Textarea
                ref={inputRef}
                tabIndex={0}
                rows={1}
                autoFocus
                placeholder="Wpisz swoje pytanie"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (sendDisabled) {
                      e.preventDefault();
                      return;
                    }
                    formRef.current?.requestSubmit();
                    e.preventDefault();
                  }
                }}
                spellCheck={false}
                className={styles.input}
              />
              <SendButton
                disabled={sendDisabled}
                isLoading={isLoading}
                stop={stop}
              />
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
