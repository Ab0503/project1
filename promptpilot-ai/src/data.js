import {
  Code2, PenLine, Megaphone, GraduationCap, BriefcaseBusiness, Lightbulb,
} from "lucide-react";

export const categories = [
  { name: "All prompts", icon: Lightbulb },
  { name: "Writing", icon: PenLine },
  { name: "Coding", icon: Code2 },
  { name: "Marketing", icon: Megaphone },
  { name: "Learning", icon: GraduationCap },
  { name: "Business", icon: BriefcaseBusiness },
];

export const templates = [
  {
    id: "blog", title: "Blog post outline", category: "Writing", icon: PenLine,
    color: "violet", description: "Turn any topic into a clear, engaging article outline.",
    prompt: "Create a compelling blog post outline about [your topic]. Include a catchy title, introduction hook, 5 useful sections, and a conclusion."
  },
  {
    id: "debug", title: "Explain code simply", category: "Coding", icon: Code2,
    color: "blue", description: "Understand tricky code with plain-English explanations.",
    prompt: "Explain this code in beginner-friendly language, step by step. Highlight what each important line does and suggest one improvement: [paste code]"
  },
  {
    id: "campaign", title: "Campaign brainstorm", category: "Marketing", icon: Megaphone,
    color: "pink", description: "Generate fresh campaign angles for your next launch.",
    prompt: "Brainstorm 5 distinctive marketing campaign ideas for [product] targeting [audience]. For each, include the core message, channel, and a sample headline."
  },
  {
    id: "study", title: "Study plan builder", category: "Learning", icon: GraduationCap,
    color: "amber", description: "Break a big learning goal into manageable sessions.",
    prompt: "Create a practical 7-day study plan to learn [subject]. I have [minutes] minutes each day. Include daily goals, active practice, and a quick self-test."
  },
  {
    id: "pitch", title: "Pitch your idea", category: "Business", icon: BriefcaseBusiness,
    color: "green", description: "Shape an early idea into a crisp elevator pitch.",
    prompt: "Write a clear 30-second elevator pitch for [idea] aimed at [audience]. Explain the problem, solution, unique value, and a memorable closing line."
  },
  {
    id: "ideas", title: "Think outside the box", category: "Writing", icon: Lightbulb,
    color: "cyan", description: "Explore multiple creative directions before you decide.",
    prompt: "Give me 10 original ideas for [goal]. Avoid generic suggestions. For each idea, explain why it could work and one simple first step."
  },
];

export function createDemoResponse(prompt) {
  const text = prompt.trim();
  const lower = text.toLowerCase();
  if (lower.includes("code") || lower.includes("react") || lower.includes("debug")) {
    return `## Let's break it down\n\n**Goal**\nFirst, identify what you want the code to do and what result you expect.\n\n**A practical approach**\n1. Split the task into small, testable pieces.\n2. Give each component one clear responsibility.\n3. Use descriptive names and keep state close to where it is needed.\n4. Test the happy path, empty inputs, and error states.\n\n**Example next step**\nCreate the smallest working version first, then add styling and edge-case handling.\n\n> Demo response: connect a real AI provider to get answers tailored to your exact prompt.`;
  }
  if (lower.includes("write") || lower.includes("blog") || lower.includes("content")) {
    return `## A strong starting point\n\n### 1. Open with a hook\nStart with a relatable problem, surprising observation, or clear promise to the reader.\n\n### 2. Deliver useful ideas\nOrganize the main message into three to five short sections. Give each section one purpose and support it with a concrete example.\n\n### 3. Keep the tone human\nPrefer clear, specific language over jargon. Read the draft aloud and remove anything that feels repetitive.\n\n### 4. End with one next step\nClose with a concise takeaway or a call to action that fits your audience.\n\n**Tip:** Replace placeholders in your prompt with a specific audience, tone, and desired length for a more useful result.\n\n> Demo response: this is a local sample, not a response from an AI model.`;
  }
  return `## Here's a useful way to approach this\n\n**Clarify the outcome**\nDefine what a successful result looks like and who it is for.\n\n**Build a simple plan**\n1. Identify the most important goal.\n2. Break it into three achievable steps.\n3. Start with the step that gives you the clearest feedback.\n4. Review what worked and improve the next iteration.\n\n**Make it more specific**\nAdd your context, constraints, preferred tone, and an example of the output you want. Specific prompts usually lead to more useful answers.\n\n**Your prompt**\n${text}\n\n> Demo response: connect a real AI provider to generate a context-aware answer.`;
}
