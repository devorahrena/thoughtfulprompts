import React, { useState, useEffect } from "react";
import * as emailjs from "@emailjs/browser";
import "./App.css";

const prompts = [
  "What moment from this past week do you hope to remember a year from now?",
  "Did anything surprise you this week — about yourself or the world?",
  "What conversation stood out to you most this week, and why?",
  "When did you feel most at peace this week?",
  "Was there a moment this week you wish you had handled differently?",
  "What was the most meaningful thing you did for someone else this week?",
  "When did you feel truly heard or seen this week?",
  "What challenged you emotionally or mentally this past week?",
  "What’s something you avoided this week — and why?",
  "What did you learn this week that shifted your perspective, even a little?",
  "Who or what brought you unexpected joy this week?",
  "Was there a decision you struggled with this week? What did you choose?",
  "How did your routine help or hurt you this week?",
  "What memory from this week would you want to share with your future self?",
  "What was one small win from this week that you're proud of?",
  "Did you experience a moment of awe or wonder this week?",
  "What emotions were most present for you this week?",
  "How did you show up for someone else this week?",
  "When did you feel disconnected this week, and what helped you reconnect?",
  "What did this week teach you about what matters most to you?",
];

function getCurrentWeekPrompt() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - jan1) / 86400000) + jan1.getDay();
  const weekNum = Math.floor(days / 7);
  return prompts[weekNum % prompts.length];
}

export default function WeeklyQuestionApp() {
  const [prompt, _setPrompt] = useState(getCurrentWeekPrompt());
  const [draft, setDraft] = useState("");
  const [friendEmail, setFriendEmail] = useState("");

  const draftKey = `draft-${prompt}-${new Date().getFullYear()}`;
  const emailKey = "friendEmail";

  useEffect(() => {
    setDraft(localStorage.getItem(draftKey) || "");
    setFriendEmail(localStorage.getItem(emailKey) || "");
  }, [draftKey]);

  useEffect(() => {
    localStorage.setItem(draftKey, draft);
  }, [draft, draftKey]);

  useEffect(() => {
    localStorage.setItem(emailKey, friendEmail);
  }, [friendEmail]);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSend = async () => {
    if (!friendEmail) {
      return alert("Please enter your friend's email address first ✉️");
    }
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          prompt,
          message: draft,
          to_email: friendEmail,
        }
      );
      alert("Sent! 🎉");
      localStorage.removeItem(draftKey);
      setDraft("");
    } catch (err) {
      console.error(err);
      alert("Whoops – something went wrong. Check the console for details.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Weekly Question</h1>

      <div className="card">
        <p>This week's thoughtful prompt is:</p>
        <p className="prompt">{prompt}</p>

        <textarea
          placeholder="Write your response here…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />

        <input
          type="email"
          placeholder="Friend's email address"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
        />

        <button onClick={handleSend} disabled={!draft.trim()}>
          Complete & Send
        </button>
      </div>
    </div>
  );
}
