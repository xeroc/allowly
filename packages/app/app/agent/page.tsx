"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AppForm from "@/components/AppForm";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AgentPage() {
  const [copied, setCopied] = useState(false);
  const [skillCode, setSkillCode] = useState("");

  useEffect(() => {
    fetch("/agent/skill.md")
      .then((res) => res.text())
      .then(setSkillCode)
      .catch((err) => console.error("Failed to load skill.md:", err));
  }, []);

  const handleCopy = async () => {
    if (!skillCode) return;
    await navigator.clipboard.writeText(skillCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!skillCode) return;
    const blob = new Blob([skillCode], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "allowly-agent-skill.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const PreBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="!mt-0 !mb-0 !bg-transparent !p-0">{children}</pre>
  );

  const CodeBlock = ({
    node,
    inline,
    className,
    children,
    ...props
  }: {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag={PreBlock}
        customStyle={{
          borderRadius: "0.5rem",
          margin: 0,
        }}
        {...(props as any)}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...(props as any)}>
        {children}
      </code>
    );
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <Hero mode="agent" />
      <HowItWorks mode="agent" />
      <AppForm mode="agent" />
      <Features />

      {/* Skill Download Section */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            Download Agent Skill
          </h2>

          <p className="text-gray-300 mb-6">
            Copy this self-contained OpenClow skill file to give your AI agent
            the ability to check allowance and manage budgets autonomously.
          </p>

          <div className="bg-black/30 rounded-lg border border-white/10 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">
                SKILL.md - Self-contained
              </span>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Download File
              </button>
            </div>

            <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto overflow-x-auto text-sm prose prose-invert prose-sm max-w-none">
              <ReactMarkdown components={{ code: CodeBlock }}>
                {skillCode}
              </ReactMarkdown>
            </div>

            <button
              onClick={handleCopy}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {copied ? "✅ Copied to clipboard!" : "Copy skill to clipboard"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                ✅ Self-Contained
              </h3>
              <p className="text-sm text-gray-300">
                No external dependencies or imports. Everything you need is in
                this one file.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                🤖 Agent-Ready
              </h3>
              <p className="text-sm text-gray-300">
                OpenClow-compatible skill designed for AI agents to check
                allowances autonomously.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                📊 Budget Tracking
              </h3>
              <p className="text-sm text-gray-300">
                Functions to check remaining budget, max per claim, and period
                end date.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                🔄 On-Demand Claims
              </h3>
              <p className="text-sm text-gray-300">
                Agents claim funds when needed, respecting human-set budget
                limits.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-2">
              <strong>Installation:</strong> Save file as{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">
                SKILL.md
              </code>{" "}
              in your OpenClow skills directory.
            </p>
            <p className="text-sm text-gray-400">
              <strong>Documentation:</strong> Full usage guide included in the
              skill file.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
