// All visible wording for the journey lives here so Sarah can edit it easily.
// Voice: British English, "I" to "you", no hyphens or dashes, never the word "quiet".

export const ESSAY_URL = "https://www.seekingikigai.online/p/how-to-find-work-worth-doing";
export const SITE_URL = "https://www.seekingikigai.online";
export const WORKBOOK_URL = "#workbook-coming-soon"; // placeholder for the companion workbook

// The AI prompt offered in step 14, Synthesise and Choose.
export const SARAH_PPS_PROMPT = `I'm working out my hatarakigai, work worth doing, using the framework: what I love, what I'm good at, what I can be paid for and what the world needs. Above are some of our reflections: my joys, labels and values; my strengths; the problems I care about; what I could be paid for; and my real constraints. (If you've only done some please note which elements are still missing.)

Please don't tell me what my purpose is, instead:

1. Read across all of it and reflect back the strongest patterns and threads you see, the connections between my loves, strengths, problems and values that I might be too close to notice.

2. Suggest 6 concrete pathways that combine these into meaningful work; a mix of career moves, ways to reshape my current role and entrepreneurial or side project ideas.

3. For each, give an honest read on how close to ikigai it might feel for me, and what would need to be true, skills, money, time, to make it realistic within my constraints.

4. Point out anything that seems to light me up more than I've realised, and any tension worth sitting with.

Keep me in the driving seat: offer patterns and possibilities, not a verdict. I'll decide what resonates and choose one small experiment to try first.`;

export type Mode = "Reflect" | "Check" | "Test";
export type Circle = "Love" | "Skill" | "Value" | "Problem";

export type Field =
  | { type: "list"; key: string; label?: string; min: number; placeholder: string }
  | { type: "text"; key: string; label: string; placeholder?: string; rows?: number }
  | { type: "tags"; key: string; label?: string; placeholder: string }
  | { type: "timer"; minutes: number; label: string }
  | { type: "links"; links: { label: string; url: string; note?: string }[] }
  | { type: "copy"; label: string; text: string }
  | { type: "people"; key: string; count: number }
  | { type: "values"; key: string; max: number; labelsFrom: string }
  | { type: "problems"; key: string; count: number }
  | { type: "sdg"; key: string; problemsFrom: string }
  | { type: "choice"; key: string; label: string; options: string[] }
  | { type: "board"; key: string; edges: { key: string; label: string; placeholder: string }[] }
  | { type: "gather" }
  | { type: "pathways"; key: string; count: number };

export type Step = {
  id: string;
  n: number;
  title: string;
  phase: string;
  group?: string;
  mode: Mode;
  circle?: Circle;
  why: string;
  prompt: string;
  kind?: string; // a gentle extra note
  fields: Field[];
};

export const threshold = {
  title: "Before we begin",
  intro: [
    "Iki means life. Gai means worth, or value. Together, ikigai is that felt sense that your life is worth living... not a diagram, not a destination, more like a warmth you notice when you are moving toward something that matters.",
    "Hatarakigai is the working cousin of ikigai. Work worth doing, in the broadest sense: paid or unpaid, caring, making, mending, teaching. I wrote this companion to walk beside my essay, so you can do the exercises one by one and keep your answers somewhere safe.",
    "Keep a paper journal close by if you like. Everything here can be done on paper instead, and you can simply mark it so.",
  ],
  warmup: {
    title: "An optional warm up: five pillars",
    credit: "These five pillars come from Ken Mogi, from his book The Little Book of Ikigai.",
    pillars: [
      "Starting small",
      "Releasing yourself",
      "Harmony and sustainability",
      "The joy of little things",
      "Being in the here and now",
    ],
    builder:
      "Now, if you fancy it... choose a five letter word that means something to you, and write your own pillar for each letter. Here is mine, BLOOM:",
    example: [
      { letter: "B", text: "Begin Small" },
      { letter: "L", text: "Let GO" },
      { letter: "O", text: "Open to harmony" },
      { letter: "O", text: "Observe tiny joys" },
      { letter: "M", text: "Mindful presence" },
    ],
    exampleAfter: "Now it is your turn...",
  },
};

export const steps: Step[] = [
  {
    id: "1", n: 1, title: "Joy Audit", phase: "The Foundation", group: "What you love", mode: "Reflect", circle: "Love",
    why: "Joy leaves clues. Most of us rush past the small moments that light us up, and those moments are often the truest signal we have. I want you to slow down and notice them.",
    prompt: "Write down at least five small moments of joy or gratitude from the past week. Tiny counts. Especially tiny.",
    fields: [{ type: "list", key: "joys", min: 5, placeholder: "A moment of joy or gratitude..." }],
  },
  {
    id: "2", n: 2, title: "Labels and Loves", phase: "The Foundation", group: "What you love", mode: "Reflect", circle: "Love",
    why: "We are made of many ingredients: roles, passions, quirks, the things people call us and the things we call ourselves. Seeing them all at once can be surprising.",
    prompt: "Set the timer for ten minutes and brain dump every label that describes you. Do not edit. Mother, gardener, worrier, tea snob... all of it.",
    fields: [
      { type: "timer", minutes: 10, label: "Ten minutes, no editing" },
      { type: "tags", key: "labels", placeholder: "Type a label and press Enter" },
    ],
  },
  {
    id: "3", n: 3, title: "Values Deep Dive", phase: "The Foundation", group: "What you love", mode: "Reflect", circle: "Love",
    why: "Values are the compass underneath everything. When work honours them, it feels right even when it is hard. When it does not, something niggles.",
    prompt: "Choose up to ten values that feel true for you right now. Then link each one to any of your labels it connects with.",
    fields: [
      { type: "links", links: [{ label: "Explore the Schwartz values wheel", url: "https://en.wikipedia.org/wiki/Theory_of_basic_human_values" }] },
      { type: "values", key: "values", max: 10, labelsFrom: "2.labels" },
    ],
  },
  {
    id: "4", n: 4, title: "Effortless Wins", phase: "Designing the Work", group: "Skill", mode: "Reflect", circle: "Skill",
    why: "Our gifts often hide in plain sight because they feel so easy to us. If it comes naturally, we assume everyone can do it... they usually cannot.",
    prompt: "What comes easily to you but visibly challenges other people?",
    fields: [{ type: "list", key: "wins", min: 3, placeholder: "Something that comes easily to me..." }],
  },
  {
    id: "5", n: 5, title: "Skills Test", phase: "Designing the Work", group: "Skill", mode: "Check", circle: "Skill",
    why: "A little outside language can help you name what you already sense. Treat the results as a mirror, not a verdict.",
    prompt: "Take one or both of these tests, then record your top results here.",
    fields: [
      { type: "links", links: [
        { label: "CliftonStrengths", url: "https://www.gallup.com/cliftonstrengths/", note: "paid" },
        { label: "VIA Character Strengths", url: "https://www.viacharacter.org/", note: "free" },
      ] },
      { type: "list", key: "results", min: 5, placeholder: "One of my top strengths..." },
    ],
  },
  {
    id: "6", n: 6, title: "Ask Three People", phase: "Designing the Work", group: "Skill", mode: "Check", circle: "Skill",
    why: "Other people see us in ways we cannot see ourselves. Asking feels vulnerable, I know... but the replies are often the most moving part of this whole journey.",
    prompt: "Choose three people who know you well. Send them a message, then record what they say.",
    fields: [
      { type: "copy", label: "A message you can copy", text: "Hello! I'm doing a little exercise about the work I find meaningful. Would you tell me what you think my natural strengths are? What do you come to me for? No need to be polished, a few honest lines would mean a lot. Thank you." },
      { type: "people", key: "people", count: 3 },
    ],
  },
  {
    id: "7", n: 7, title: "Paid and Thanked", phase: "Designing the Work", group: "Value", mode: "Reflect", circle: "Value",
    why: "Value already flows towards you in ways you may not have noticed. Money is one signal, gratitude is another, and both matter.",
    prompt: "Make two lists. Times you were paid or offered payment, or value in kind. And times you were thanked for something you would happily do for free.",
    fields: [
      { type: "list", key: "paid", label: "Paid, or offered value", min: 3, placeholder: "A time I was paid or offered something..." },
      { type: "list", key: "thanked", label: "Thanked for something I would do for free", min: 3, placeholder: "A time I was thanked..." },
    ],
  },
  {
    id: "8", n: 8, title: "Market Scan", phase: "Designing the Work", group: "Value", mode: "Check", circle: "Value",
    why: "Before inventing something new, look at where money already moves around the things you love and do well. It is reassuring, and full of ideas.",
    prompt: "Make notes on where money already flows around your love and skill combinations: job titles, freelancers, small companies, courses.",
    fields: [{ type: "list", key: "market", min: 4, placeholder: "A job title, a freelancer, a course..." }],
  },
  {
    id: "9", n: 9, title: "Smallest Paid Test", phase: "Designing the Work", group: "Value", mode: "Test", circle: "Value",
    why: "I will be honest... this is the most uncomfortable step. Asking for money for something you care about can feel exposing. Be gentle with yourself. The point is not success, the point is learning.",
    prompt: "Design one tiny offer. A £5 offer, a signup list, a paid discovery call, one freelance afternoon. Then record whether one person committed.",
    kind: "Whatever happens, you have done something brave. That is the whole point.",
    fields: [
      { type: "text", key: "offer", label: "My tiny offer", placeholder: "What I will offer, to whom, and for how much..." },
      { type: "choice", key: "result", label: "Did one person commit?", options: ["Yes, someone committed", "Not yet", "I haven't tried it yet"] },
      { type: "text", key: "learned", label: "What I learned", placeholder: "How it felt, what surprised me..." },
    ],
  },
  {
    id: "10", n: 10, title: "Twelve Favourite Problems", phase: "Designing the Work", group: "Problem", mode: "Reflect", circle: "Problem",
    why: "Richard Feynman kept a dozen favourite problems in mind and tested every new idea against them. Problems you cannot stop caring about point towards work worth doing.",
    prompt: "Set the timer for fifteen minutes. Write twelve problems you care about, and tag each as personal, local or global.",
    fields: [
      { type: "timer", minutes: 15, label: "Fifteen minutes" },
      { type: "problems", key: "problems", count: 12 },
    ],
  },
  {
    id: "11", n: 11, title: "SDG Exercise", phase: "Designing the Work", group: "Problem", mode: "Check", circle: "Problem",
    why: "The UN Sustainable Development Goals are a shared map of the world's big problems. Seeing where your problems land can show a pattern you had not spotted.",
    prompt: "Tap the goals each of your problems connects with. Then see which goals light up most.",
    fields: [{ type: "sdg", key: "sdg", problemsFrom: "10.problems" }],
  },
  {
    id: "12", n: 12, title: "Talk to One", phase: "Designing the Work", group: "Problem", mode: "Test", circle: "Problem",
    why: "A problem in the abstract stays comfortable. A real person with a real problem changes everything. One conversation is enough to begin.",
    prompt: "Name one specific person you would like to help. Plan the conversation, have it, and record what you learned.",
    fields: [
      { type: "text", key: "who", label: "Who I would like to help", placeholder: "A name, or a description of one real person..." },
      { type: "text", key: "plan", label: "My conversation plan", placeholder: "What I will ask, and how I will listen..." },
      { type: "text", key: "learned", label: "What I learned", placeholder: "After the conversation..." },
    ],
  },
  {
    id: "13", n: 13, title: "Face Your Constraints", phase: "Bringing It Together", mode: "Reflect",
    why: "Constraints are not the enemy. They are the edges of the board, and every good game happens inside edges. Naming them honestly frees up your creativity.",
    prompt: "Write honest notes on each edge of your board.",
    fields: [{ type: "board", key: "edges", edges: [
      { key: "time", label: "Time", placeholder: "How much time I really have..." },
      { key: "money", label: "Money", placeholder: "What I need to earn, what I can risk..." },
      { key: "location", label: "Location", placeholder: "Where I am, where I could be..." },
      { key: "skills", label: "Skill gaps", placeholder: "What I would need to learn..." },
      { key: "family", label: "Family realities", placeholder: "The people I care for and with..." },
    ] }],
  },
  {
    id: "14", n: 14, title: "Synthesise and Choose", phase: "Bringing It Together", mode: "Test",
    why: "This is where reflection turns into movement. Gather your pages, look for patterns, then choose one path and one small experiment. Not forever... just for this week.",
    prompt: "Gather everything you have written. If you like, copy it with my prompt into Claude or ChatGPT to help you spot patterns. Then record up to six pathways, choose one, and commit to a small experiment.",
    kind: "AI can help you see patterns. It cannot tell you your purpose. Only you can feel that.",
    fields: [{ type: "gather" }, { type: "pathways", key: "pathways", count: 6 }],
  },
];

export const SDGS = [
  "No Poverty", "Zero Hunger", "Good Health and Wellbeing", "Quality Education", "Gender Equality",
  "Clean Water and Sanitation", "Affordable and Clean Energy", "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure", "Reduced Inequalities", "Sustainable Cities and Communities",
  "Responsible Consumption and Production", "Climate Action", "Life Below Water", "Life on Land",
  "Peace, Justice and Strong Institutions", "Partnerships for the Goals",
];

export const SUGGESTED_VALUES = [
  "Kindness", "Freedom", "Creativity", "Security", "Adventure", "Learning", "Tradition", "Justice",
  "Beauty", "Achievement", "Belonging", "Curiosity", "Honesty", "Nature", "Family", "Independence",
  "Craft", "Service", "Play", "Calm", "Courage", "Faith", "Health", "Influence",
];

export const copy = {
  tagline: "A hatarakigai companion to my essay, How To Find Work Worth Doing",
  pathIntro: "Fourteen stepping stones. The path suggests an order, but you can wander. Stones turn from pencil to watercolour as you go.",
  modes: {
    Reflect: "Look inward",
    Check: "Check outside yourself",
    Test: "Test it small",
  },
  compass: {
    title: "The Compass Log",
    intro: "This is the heart of it all. Every experiment, however small, teaches you something. Over time you will feel your own pull... toward meaning, or away from it. That feeling is purpose literacy, and it only grows when you act.",
    dialLabel: "Toward or away from meaning?",
    dial: ["Far away", "A little away", "Unsure", "A little toward", "Strongly toward"],
  },
  oneWord: {
    title: "One Sentence",
    question: "In one sentence, what makes work feel worth doing, for you?",
    share: "Share your sentence in the essay comments",
    delete: "Delete sentence",
    confirmDelete: "Delete this sentence? This cannot be undone.",
  },
  idea: {
    button: "Give me an AI idea",
    note: "I pick up to four of your answers at random and ask an AI to spin them into one small idea. Just a spark to play with... never a verdict on your purpose.",
    needMore: "Write a few answers in at least two of the circles first, and I will have something to mix.",
    using: "Mixed from",
    reroll: "Another idea",
    dismiss: "Close",
    brewing: "Brewing an idea...",
  },
  table: {
    title: "The Design Table",
    intro: "This Venn diagram is a tool for designing work, not a map of your purpose. Your ikigai is something you feel. Here, your own words gather into four ellipses, so every one of the fifteen overlaps can be shown. Tap any space to see those circles side by side.",
  },
};
