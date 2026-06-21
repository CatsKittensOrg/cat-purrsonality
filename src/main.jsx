import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'purrsonality-progress-v1';
const PURCHASE_STORAGE_KEY = 'purrsonality-premium-report-v1';
const ACCOUNT_STORAGE_KEY = 'cat-purrsonality-account-v1';
const ADMIN_CONTENT_KEY = 'cat-purrsonality-admin-content-v1';
const ADMIN_SESSION_KEY = 'cat-purrsonality-admin-session-v1';
const APPLE_PRODUCT_ID = 'com.purrsonality.full_report';
const ADMIN_EMAIL = 'kassab.team@icloud.com';
const ADMIN_PASSCODE = 'catskittens-admin';

const categories = [
  'Confidence',
  'Sociability with Humans',
  'Sociability with Animals',
  'Affection',
  'Playfulness',
  'Energy',
  'Adaptability',
  'Independence',
  'Dominance',
  'Anxiety',
];

const defaultProfileFields = [
  { id: 'name', label: 'Cat name', type: 'text', placeholder: 'Example: Miso', required: true },
  { id: 'ticaRegistration', label: 'TICA registration number', type: 'text', placeholder: 'Example: SBT 012345 678', required: false },
  { id: 'age', label: 'Age', type: 'text', placeholder: 'Example: 4 years', required: true },
  { id: 'breed', label: 'Breed', type: 'text', placeholder: 'Example: Domestic shorthair', required: true },
  { id: 'sex', label: 'Sex', type: 'select', placeholder: 'Choose', required: true, options: ['Female', 'Male', 'Unknown'] },
  {
    id: 'lifestyle',
    label: 'Indoor / outdoor',
    type: 'select',
    placeholder: 'Choose',
    required: true,
    options: ['Indoor only', 'Indoor with supervised outdoor time', 'Indoor / outdoor', 'Outdoor mostly'],
  },
  {
    id: 'household',
    label: 'Household type',
    type: 'select',
    placeholder: 'Choose',
    required: true,
    options: ['Single adult', 'Adults only', 'Family with children', 'Multi-cat home', 'Multi-pet home'],
  },
];

const questions = [
  {
    prompt: 'A guest arrives and settles on the sofa. What does your cat do first?',
    category: 'Sociability with Humans',
    answers: [
      'Hides and waits until the room is quiet again.',
      'Watches from a distance before deciding.',
      'Walks over for a sniff after a minute.',
      'Greets them like the guest came specifically to admire them.',
    ],
  },
  {
    prompt: 'You bring home a new box, bag, or cat-safe object. Your cat is most likely to:',
    category: 'Confidence',
    answers: [
      'Avoid it until it has been there for hours.',
      'Circle it carefully and retreat if it shifts.',
      'Inspect it with a few cautious taps.',
      'Climb in immediately and claim the discovery.',
    ],
  },
  {
    prompt: 'Another familiar pet walks through your cat’s favorite room.',
    category: 'Sociability with Animals',
    answers: [
      'Your cat leaves or gives a warning from afar.',
      'Your cat tolerates them but keeps clear boundaries.',
      'Your cat shares space if everyone stays polite.',
      'Your cat approaches, follows, or invites interaction.',
    ],
  },
  {
    prompt: 'At the end of a normal day, your cat wants attention by:',
    category: 'Affection',
    answers: [
      'Being nearby but mostly untouched.',
      'Accepting a short pet before moving on.',
      'Leaning in, purring, or sitting close.',
      'Demanding lap time, cuddles, or full-body devotion.',
    ],
  },
  {
    prompt: 'A wand toy appears. Your cat’s response is:',
    category: 'Playfulness',
    answers: [
      'A glance, then back to important lounging.',
      'One or two swats if it is convenient.',
      'Focused pouncing for a good few minutes.',
      'Acrobatic leaps until the toy surrenders.',
    ],
  },
  {
    prompt: 'During the busiest part of the day, your cat usually has:',
    category: 'Energy',
    answers: [
      'A deep commitment to napping.',
      'Short bursts followed by long breaks.',
      'A steady rhythm of roaming, playing, and resting.',
      'Multiple zoom sessions and opinions about every room.',
    ],
  },
  {
    prompt: 'Furniture moves or the feeding routine changes slightly.',
    category: 'Adaptability',
    answers: [
      'Your cat is unsettled for the rest of the day.',
      'Your cat needs reassurance before returning to normal.',
      'Your cat notices, investigates, and adjusts.',
      'Your cat treats change as enrichment.',
    ],
  },
  {
    prompt: 'When left with a safe solo activity, your cat:',
    category: 'Independence',
    answers: [
      'Looks for you quickly and prefers company.',
      'Checks in often between short solo moments.',
      'Enjoys independent time but returns later.',
      'Can happily manage their own little kingdom for hours.',
    ],
  },
  {
    prompt: 'Your cat wants a preferred spot that someone else is using.',
    category: 'Dominance',
    answers: [
      'Chooses another spot without fuss.',
      'Waits, watches, or gives a polite hint.',
      'Edges in and expects room to be made.',
      'Takes charge with vocalizing, blocking, or confident pressure.',
    ],
  },
  {
    prompt: 'A loud noise happens outside.',
    category: 'Anxiety',
    answers: [
      'Your cat barely reacts.',
      'Your cat startles, then recovers quickly.',
      'Your cat stays alert and cautious for a while.',
      'Your cat hides or remains stressed long after.',
    ],
  },
  {
    prompt: 'A carrier appears before a vet visit.',
    category: 'Anxiety',
    answers: [
      'Your cat investigates or ignores it.',
      'Your cat gets suspicious but manageable.',
      'Your cat avoids the area and watches closely.',
      'Your cat disappears into another dimension.',
    ],
  },
  {
    prompt: 'A sunny patch opens up near a busy family area.',
    category: 'Sociability with Humans',
    answers: [
      'Your cat chooses a quieter place instead.',
      'Your cat uses it only when people are still.',
      'Your cat lounges there while monitoring the room.',
      'Your cat sprawls there and joins the household flow.',
    ],
  },
  {
    prompt: 'You introduce a puzzle feeder or treat challenge.',
    category: 'Adaptability',
    answers: [
      'Your cat gives up unless it is very easy.',
      'Your cat tries once encouragement is added.',
      'Your cat works it out with some persistence.',
      'Your cat studies it, solves it, and asks for round two.',
    ],
  },
  {
    prompt: 'During play, your cat prefers:',
    category: 'Dominance',
    answers: [
      'Gentle turns with plenty of pauses.',
      'Balanced play where you set the pace.',
      'Being the hunter and controlling the rhythm.',
      'Winning decisively and announcing the victory.',
    ],
  },
  {
    prompt: 'When you sit down with a book or laptop, your cat:',
    category: 'Affection',
    answers: [
      'Keeps a comfortable distance.',
      'Settles in the same room.',
      'Sits beside you or nudges for attention.',
      'Occupies the exact space you were using.',
    ],
  },
  {
    prompt: 'A delivery person drops a package at the door and the hallway gets noisy.',
    category: 'Confidence',
    answers: [
      'Your cat retreats to a secure hiding spot.',
      'Your cat freezes, watches, and waits for quiet.',
      'Your cat approaches once the noise passes.',
      'Your cat marches over to inspect the whole event.',
    ],
  },
  {
    prompt: 'You open a door to a room your cat rarely visits.',
    category: 'Confidence',
    answers: [
      'Your cat stays out and observes from familiar territory.',
      'Your cat peeks in but avoids going far.',
      'Your cat explores the edges before relaxing.',
      'Your cat enters boldly and starts mapping the room.',
    ],
  },
  {
    prompt: 'A familiar person returns home after being away for several days.',
    category: 'Sociability with Humans',
    answers: [
      'Your cat notices but keeps distance.',
      'Your cat watches them for a while before approaching.',
      'Your cat comes over for a greeting once things settle.',
      'Your cat rushes in with vocal updates and affection.',
    ],
  },
  {
    prompt: 'A calm dog or cat is resting nearby with plenty of space between them.',
    category: 'Sociability with Animals',
    answers: [
      'Your cat avoids the room or stays visibly tense.',
      'Your cat tolerates it but keeps a careful buffer.',
      'Your cat relaxes nearby if the other animal is calm.',
      'Your cat chooses to settle close or initiate contact.',
    ],
  },
  {
    prompt: 'Another pet receives attention from a favorite human.',
    category: 'Sociability with Animals',
    answers: [
      'Your cat leaves or becomes uncomfortable.',
      'Your cat watches but does not join.',
      'Your cat approaches after a moment and shares the space.',
      'Your cat confidently joins the social moment.',
    ],
  },
  {
    prompt: 'You gently call your cat from across the room.',
    category: 'Affection',
    answers: [
      'Your cat looks over and stays put.',
      'Your cat responds only if there is a clear reason.',
      'Your cat comes over some of the time.',
      'Your cat usually comes over for contact or conversation.',
    ],
  },
  {
    prompt: 'Your cat finds a small toy mouse under a chair.',
    category: 'Playfulness',
    answers: [
      'Your cat ignores it after a sniff.',
      'Your cat bats it once or twice.',
      'Your cat plays with it in short bursts.',
      'Your cat turns it into a full hunting mission.',
    ],
  },
  {
    prompt: 'You try a new play style, like fetch, hide-and-seek, or treat tossing.',
    category: 'Playfulness',
    answers: [
      'Your cat is not interested.',
      'Your cat tries it only with lots of encouragement.',
      'Your cat engages once the game makes sense.',
      'Your cat quickly catches on and asks for more.',
    ],
  },
  {
    prompt: 'Right before mealtime, your cat usually acts:',
    category: 'Energy',
    answers: [
      'Calm and patient.',
      'A little more alert than usual.',
      'Busy, vocal, or pacing with anticipation.',
      'Fully activated and ready to direct operations.',
    ],
  },
  {
    prompt: 'After a long nap, your cat tends to:',
    category: 'Energy',
    answers: [
      'Stretch and return to quiet lounging.',
      'Take a slow walk around the room.',
      'Seek food, play, or a new perch.',
      'Launch into zooms, climbing, or intense investigation.',
    ],
  },
  {
    prompt: 'You change the location of a favorite bed or blanket.',
    category: 'Adaptability',
    answers: [
      'Your cat avoids it for a long while.',
      'Your cat inspects it suspiciously before using it.',
      'Your cat adjusts after a short investigation.',
      'Your cat accepts the update almost immediately.',
    ],
  },
  {
    prompt: 'You are busy and cannot respond right away when your cat asks for something.',
    category: 'Independence',
    answers: [
      'Your cat keeps asking and gets frustrated quickly.',
      'Your cat waits nearby and checks in often.',
      'Your cat finds something else to do for a while.',
      'Your cat comfortably switches to solo plans.',
    ],
  },
  {
    prompt: 'When your cat has access to a window, perch, or quiet room, they:',
    category: 'Independence',
    answers: [
      'Still prefer to stay close to you.',
      'Use it briefly, then return for company.',
      'Enjoy it for a good stretch of time.',
      'Settle in like they booked a private retreat.',
    ],
  },
  {
    prompt: 'When a routine is delayed, your cat is most likely to:',
    category: 'Dominance',
    answers: [
      'Wait quietly or adapt.',
      'Give a gentle reminder.',
      'Follow, stare, or vocalize until noticed.',
      'Take command with persistent demands.',
    ],
  },
  {
    prompt: 'A thunderstorm, fireworks, or construction noise starts nearby.',
    category: 'Anxiety',
    answers: [
      'Your cat remains mostly settled.',
      'Your cat startles but recovers quickly.',
      'Your cat becomes cautious and seeks reassurance or cover.',
      'Your cat hides, pants, trembles, or stays distressed.',
    ],
  },
];

const traitProfiles = [
  {
    key: 'clawmander',
    icon: '♛',
    name: 'The Clawmander',
    tagline: 'Confident, dominant, energetic',
    weights: {
      Confidence: 1.2,
      Dominance: 1.2,
      Energy: 1,
      Independence: 0.8,
      Playfulness: 0.5,
    },
    explanation:
      'Clawmanders move through the home with certainty. They like territory, momentum, and being taken seriously when they make a preference clear.',
    strengths: ['Bold in new spaces', 'High presence and leadership', 'Strong play and hunting drive'],
    challenges: ['May push boundaries or guard favorite resources', 'Can become intense without enough outlets'],
    recommendations: ['Add climbing routes and perch ownership', 'Use active play before meals', 'Give choices instead of forcing handling'],
  },
  {
    key: 'whiskerWatcher',
    icon: '◐',
    name: 'The Whisker Watcher',
    tagline: 'Observant, cautious, independent',
    weights: {
      Anxiety: 1.1,
      Independence: 1,
      'Low Adaptability': 0.65,
      Confidence: 0.45,
      'Low Sociability with Humans': 0.35,
    },
    explanation:
      'Whisker Watchers are careful readers of the room. They often prefer predictability, quiet trust, and the freedom to engage on their own schedule.',
    strengths: ['Thoughtful and watchful', 'Often excellent at solo routines', 'Deep trust once comfort is established'],
    challenges: ['May need longer warm-up time', 'Household changes can feel larger to them'],
    recommendations: ['Keep hiding spots and elevated retreats available', 'Use slow introductions', 'Reward brave investigation without rushing it'],
  },
  {
    key: 'purrPal',
    icon: '♡',
    name: 'The Purrfect Pal',
    tagline: 'Affectionate, social, people-oriented',
    weights: {
      Affection: 1.25,
      'Sociability with Humans': 1.25,
      'Sociability with Animals': 0.75,
      Adaptability: 0.65,
      Dominance: 0.25,
    },
    explanation:
      'Purrfect Pals are connection-forward companions. They tend to seek shared routines, attention, and friendly participation in household life.',
    strengths: ['Warm human bonding', 'Expressive communication', 'Good fit for interactive homes'],
    challenges: ['May demand attention loudly or often', 'Can get lonely or restless if social needs are missed'],
    recommendations: ['Schedule predictable attention rituals', 'Create cozy stations near people', 'Reward calm requests for affection'],
  },
  {
    key: 'catventurer',
    icon: '✦',
    name: 'The Catventurer',
    tagline: 'Curious, adaptable, playful',
    weights: {
      Playfulness: 1.2,
      Adaptability: 1.1,
      Confidence: 0.85,
      Energy: 0.8,
      'Sociability with Animals': 0.45,
    },
    explanation:
      'Catventurers are inventive and quick to explore. They thrive when the day gives them puzzles, novelty, and room to turn curiosity into play.',
    strengths: ['Creative problem-solving', 'Playful engagement', 'Strong response to enrichment'],
    challenges: ['Can become bored or mischievous', 'May need varied activities to stay satisfied'],
    recommendations: ['Rotate toys and puzzle feeders', 'Offer scent-safe novelty', 'Build short play sessions into the day'],
  },
  {
    key: 'meowdiator',
    icon: '☉',
    name: 'The Meowdiator',
    tagline: 'Animal-social, balanced, harmony-seeking',
    weights: {
      'Sociability with Animals': 1.25,
      Adaptability: 0.9,
      'Sociability with Humans': 0.7,
      'Low Dominance': 0.65,
      Confidence: 0.45,
    },
    explanation:
      'Meowdiators are social balancers. They tend to read the household, share space well, and do best when introductions and resources are fair.',
    strengths: ['Good multi-pet potential', 'Reads social signals', 'Often adapts well with proper introductions'],
    challenges: ['May withdraw if another pet is pushy', 'Needs enough resources to avoid social tension'],
    recommendations: ['Use separate food, water, litter, and rest zones', 'Reward calm parallel time', 'Supervise new pet introductions'],
  },
];

const emptyProfile = {
  name: '',
  ticaRegistration: '',
  age: '',
  breed: '',
  sex: '',
  lifestyle: '',
  household: '',
  concerns: ['', '', ''],
};

const concernExamples = [
  'Example: A new baby will be arriving soon',
  'Example: I want to add another cat',
  'Example: We are moving to a new home',
];

const concernSuggestions = [
  'A new baby will be arriving soon',
  'I want to add another cat',
  'I want to add a dog',
  'We are moving to a new home',
  'I have a hard time giving medications',
  'I want to change the litter box spot',
  'I want to change my cat’s resting spot',
  'My cat is hiding from visitors',
  'My cat is aggressive with other cats',
  'My cat is aggressive with people',
  'My cat seems anxious or fearful',
  'My cat does not like being picked up',
  'My cat bites or scratches during play',
  'My cat wakes us up at night',
  'My cat is very demanding for attention',
  'My cat does not tolerate children well',
  'My cat gets stressed during travel',
  'My cat panics at the vet',
  'My cat dislikes the carrier',
  'My cat sprays or marks territory',
  'My cat guards food, toys, or spaces',
  'My cat is bored or destructive',
  'My cat has too much energy',
  'My cat is not playful enough',
  'My cat avoids affection',
  'My cat is overly clingy',
  'My cat reacts badly to loud noises',
  'My cat fights with a housemate cat',
  'I want to match this cat with the right home',
  'I want to understand breeder temperament traits',
];

const defaultAdminSettings = {
  reportName: 'Cat Purrsonality Deposit',
  reportPrice: '$25.00',
  paymentProvider: 'Stripe or Apple',
  appleProductId: APPLE_PRODUCT_ID,
  stripeMode: 'Not connected yet',
  stripePublishableKey: '',
  stripePriceId: '',
  stripePaymentLink: '',
  successUrl: 'https://cat-purrsonality.vercel.app',
  cancelUrl: 'https://cat-purrsonality.vercel.app',
  requireLogin: true,
  requirePayment: true,
};

const scenarioResponses = {
  clawmander: {
    reaction:
      'will likely investigate quickly, then try to establish control over the new routine or territory.',
    support:
      'Give clear boundaries, extra vertical space, and active play before major transitions.',
  },
  whiskerWatcher: {
    reaction:
      'may watch carefully from a distance and need more time before trusting the change.',
    support:
      'Protect quiet retreat zones, introduce changes slowly, and reward calm curiosity.',
  },
  purrPal: {
    reaction:
      'will likely look to people for reassurance and may want to stay close during the adjustment.',
    support:
      'Keep affectionate routines predictable and include them in calm household moments.',
  },
  catventurer: {
    reaction:
      'may treat the situation as a puzzle at first, especially if it includes novelty or new spaces.',
    support:
      'Use enrichment, scent swapping, and short supervised introductions to channel curiosity.',
  },
  meowdiator: {
    reaction:
      'will likely assess the social balance first and may adjust well if every pet has enough space and resources.',
    support:
      'Use gradual introductions, duplicate key resources, and reward peaceful shared-space behavior.',
  },
};

function blankScores() {
  return Object.fromEntries(categories.map((category) => [category, 0]));
}

function toPercent(rawScore, maxScore) {
  return Math.round((rawScore / maxScore) * 100);
}

function scoreTrait(profile, scores) {
  const entries = Object.entries(profile.weights);
  const weightedTotal = entries.reduce((total, [category, weight]) => {
    const isLowSignal = category.startsWith('Low ');
    const scoreKey = isLowSignal ? category.replace('Low ', '') : category;
    const value = isLowSignal ? 100 - scores[scoreKey] : scores[scoreKey];
    return total + value * weight;
  }, 0);
  const maxTotal = entries.reduce((total, [, weight]) => total + 100 * weight, 0);
  return Math.round((weightedTotal / maxTotal) * 100);
}

function buildDiscStyleResult(scores) {
  const traits = traitProfiles
    .map((profile) => ({ ...profile, score: scoreTrait(profile, scores) }))
    .sort((a, b) => b.score - a.score);

  const primary = traits[0];
  const secondary = traits[1];

  return {
    traits,
    primary,
    secondary,
    statement: `Your cat is primarily a ${primary.name} with secondary ${secondary.name} traits.`,
    explanation: `${primary.explanation} The secondary ${secondary.name} pattern adds ${secondary.tagline.toLowerCase()} qualities, creating a more specific temperament blend.`,
    strengths: [...primary.strengths.slice(0, 2), secondary.strengths[0]],
    challenges: [...primary.challenges.slice(0, 1), secondary.challenges[0]],
    recommendations: [...primary.recommendations.slice(0, 2), secondary.recommendations[0]],
  };
}

function normalizeProfile(profile = {}) {
  return {
    ...emptyProfile,
    ...profile,
    concerns: [...(profile.concerns ?? []), '', '', ''].slice(0, 3),
  };
}

function normalizeQuestion(question = {}, index = 0) {
  return {
    prompt: question.prompt || questions[index]?.prompt || '',
    category: categories.includes(question.category) ? question.category : questions[index]?.category || categories[0],
    answers: [...(question.answers ?? questions[index]?.answers ?? []), '', '', '', ''].slice(0, 4),
  };
}

function makeFieldId(label) {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+([a-z0-9])/g, (_, letter) => letter.toUpperCase());
  return base || `customField${Date.now()}`;
}

function normalizeProfileField(field = {}, index = 0) {
  const fallback = defaultProfileFields[index] ?? {};
  const label = field.label || fallback.label || 'Custom field';
  return {
    id: field.id || fallback.id || makeFieldId(label),
    label,
    type: field.type === 'select' ? 'select' : 'text',
    placeholder: field.placeholder ?? fallback.placeholder ?? '',
    required: Boolean(field.required ?? fallback.required),
    options: Array.isArray(field.options) && field.options.length ? field.options : fallback.options ?? [],
  };
}

function normalizeAdminContent(content = {}) {
  return {
    settings: { ...defaultAdminSettings, ...(content.settings ?? {}) },
    profileFields: Array.isArray(content.profileFields) && content.profileFields.length
      ? content.profileFields.map(normalizeProfileField)
      : defaultProfileFields,
    concernSuggestions: Array.isArray(content.concernSuggestions) && content.concernSuggestions.length
      ? content.concernSuggestions
      : concernSuggestions,
    questions: Array.isArray(content.questions) && content.questions.length
      ? content.questions.map(normalizeQuestion)
      : questions,
  };
}

function loadAdminContent() {
  try {
    const saved = localStorage.getItem(ADMIN_CONTENT_KEY);
    return normalizeAdminContent(saved ? JSON.parse(saved) : null);
  } catch {
    return normalizeAdminContent();
  }
}

function buildScenarioOutlooks(concerns, personality) {
  return concerns
    .map((concern) => concern.trim())
    .filter(Boolean)
    .map((concern) => {
      const primaryResponse = scenarioResponses[personality.primary.key];
      const secondaryResponse = scenarioResponses[personality.secondary.key];

      return {
        concern,
        reaction: `As a ${personality.primary.name}, your cat ${primaryResponse.reaction} Secondary ${personality.secondary.name} traits mean they may also ${secondaryResponse.reaction}`,
        support: `${primaryResponse.support} Also: ${secondaryResponse.support}`,
      };
    });
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function loadAccount() {
  try {
    const saved = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const saved = useMemo(loadProgress, []);
  const savedAccount = useMemo(loadAccount, []);
  const savedAdminContent = useMemo(loadAdminContent, []);
  const savedPurchase = useMemo(() => localStorage.getItem(PURCHASE_STORAGE_KEY) === 'true', []);
  const [view, setView] = useState(window.location.hash === '#admin' ? 'admin' : 'app');
  const [account, setAccount] = useState(savedAccount);
  const [adminContent, setAdminContent] = useState(savedAdminContent);
  const [profile, setProfile] = useState(normalizeProfile(saved?.profile));
  const [answers, setAnswers] = useState(saved?.answers ?? {});
  const [step, setStep] = useState(saved?.step ?? 0);
  const [profileNotice, setProfileNotice] = useState('');
  const [hasPremiumReport, setHasPremiumReport] = useState(savedPurchase);
  const activeQuestions = adminContent.questions;
  const activeConcernSuggestions = adminContent.concernSuggestions;
  const activeProfileFields = adminContent.profileFields;
  const activeSettings = adminContent.settings;
  const isAdminAccount = account?.email?.trim().toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, answers, step }));
  }, [profile, answers, step]);

  useEffect(() => {
    function syncHashView() {
      setView(window.location.hash === '#admin' ? 'admin' : 'app');
    }

    window.addEventListener('hashchange', syncHashView);
    return () => window.removeEventListener('hashchange', syncHashView);
  }, []);

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === activeQuestions.length;
  const catName = profile.name.trim() || 'Your cat';
  const question = activeQuestions[step - 1];
  const progress = Math.round((answeredCount / activeQuestions.length) * 100);

  const results = useMemo(() => {
    const raw = blankScores();
    const possible = blankScores();

    activeQuestions.forEach((item, index) => {
      possible[item.category] += 4;
      if (answers[index]) raw[item.category] += answers[index];
    });

    const scores = Object.fromEntries(
      categories.map((category) => [category, possible[category] ? toPercent(raw[category], possible[category]) : 0]),
    );
    const personality = buildDiscStyleResult(scores);
    return { scores, personality };
  }, [answers, activeQuestions]);

  function updateProfile(field, value) {
    setProfileNotice('');
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function selectAnswer(value) {
    setAnswers((current) => ({ ...current, [step - 1]: value }));
  }

  function resetQuiz() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(normalizeProfile());
    setAnswers({});
    setStep(0);
    setProfileNotice('');
  }

  function saveAccount(nextAccount) {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(nextAccount));
    setAccount(nextAccount);
  }

  function signOut() {
    setAccount(null);
  }

  function openAdmin() {
    window.location.hash = 'admin';
    setView('admin');
  }

  function openApp() {
    window.location.hash = '';
    setView('app');
  }

  function saveAdminContent(nextContent) {
    const normalized = normalizeAdminContent(nextContent);
    localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(normalized));
    setAdminContent(normalized);
  }

  async function unlockPremiumReport() {
    if (window.PurrsonalityStoreKit?.purchase) {
      const purchase = await window.PurrsonalityStoreKit.purchase(APPLE_PRODUCT_ID);
      if (!purchase?.active) return;
    }

    localStorage.setItem(PURCHASE_STORAGE_KEY, 'true');
    setHasPremiumReport(true);
  }

  async function restorePremiumReport() {
    if (window.PurrsonalityStoreKit?.restore) {
      const restore = await window.PurrsonalityStoreKit.restore(APPLE_PRODUCT_ID);
      if (!restore?.active) return;
    }

    localStorage.setItem(PURCHASE_STORAGE_KEY, 'true');
    setHasPremiumReport(true);
  }

  const missingProfileFields = activeProfileFields
    .filter((field) => field.required && !String(profile[field.id] ?? '').trim())
    .map((field) => field.label);

  function startQuiz() {
    if (missingProfileFields.length) {
      setProfileNotice(`Please add: ${missingProfileFields.join(', ')}.`);
      return;
    }

    setProfileNotice('');
    setStep(1);
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="brand-lockup">
          <img src="/assets/cats-kittens-logo.jpg" alt="Cats & Kittens Organization logo" />
          <div>
            <p>Cats & Kittens</p>
            <p className="brand-subline">Organization</p>
            <small>Official Temperament Quiz</small>
          </div>
        </div>
        <div className="hero-copy">
          <h1>Cat Purrsonality</h1>
          <strong>Decode and predict your cat&apos;s behavior.</strong>
          <p>
            A DISC-inspired cat temperament quiz that maps ten behavioral signals into five feline personality types:
          </p>
          <ul className="hero-type-list">
            <li><b>The Clawmander</b> <span>(confident, dominant, energetic)</span></li>
            <li><b>The Whisker Watcher</b> <span>(observant, cautious, independent)</span></li>
            <li><b>The Purrfect Pal</b> <span>(affectionate, social, people-oriented)</span></li>
            <li><b>The Catventurer</b> <span>(curious, adaptable, playful)</span></li>
            <li><b>The Meowdiator</b> <span>(animal-social, balanced, harmony-seeking)</span></li>
          </ul>
        </div>
      </section>

      <section className="workspace">
        <div className="topbar">
          <div>
            <span className="eyebrow">
              {view === 'admin' ? 'Admin' : !account ? 'Account' : complete ? 'Results ready' : step === 0 ? 'Cat profile' : `Question ${step} of ${activeQuestions.length}`}
            </span>
            <h2>{view === 'admin' ? 'Cat Purrsonality Control Room' : !account ? 'Sign up or log in' : complete ? `${catName}'s Cat Purrsonality Map` : step === 0 ? 'Start with the essentials' : question.prompt}</h2>
          </div>
          <div className="account-actions">
            {account ? <span>{account.email}</span> : null}
            {view === 'admin' ? (
              <button className="ghost-button" type="button" onClick={openApp}>
                Back to app
              </button>
            ) : isAdminAccount ? (
              <button className="ghost-button" type="button" onClick={openAdmin}>
                Admin
              </button>
            ) : null}
            {account && view !== 'admin' ? (
              <>
                <button className="ghost-button" type="button" onClick={signOut}>
                  Sign out
                </button>
                <button className="ghost-button" type="button" onClick={resetQuiz}>
                  Reset
                </button>
              </>
            ) : null}
          </div>
        </div>

        {view === 'admin' ? (
          <AdminPortal
            account={account}
            profile={profile}
            answers={answers}
            hasPremiumReport={hasPremiumReport}
            adminContent={adminContent}
            onSaveContent={saveAdminContent}
          />
        ) : null}

        {view !== 'admin' && account && (
          <div className="progress-track" aria-label="Quiz progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        {view !== 'admin' && !account && <AuthCard onSubmit={saveAccount} />}

        {view !== 'admin' && account && step === 0 && !complete && (
          <ProfileForm
            profile={profile}
            updateProfile={updateProfile}
            notice={profileNotice}
            onStart={startQuiz}
            suggestions={activeConcernSuggestions}
            profileFields={activeProfileFields}
          />
        )}

        {view !== 'admin' && account && step > 0 && !complete && (
          <QuestionCard
            question={question}
            selected={answers[step - 1]}
            onSelect={selectAnswer}
            onBack={() => setStep((current) => Math.max(0, current - 1))}
            onNext={() => setStep((current) => Math.min(activeQuestions.length, current + 1))}
            isLast={step === activeQuestions.length}
          />
        )}

        {view !== 'admin' && account && complete && activeSettings.requirePayment && !hasPremiumReport && (
          <Paywall onPurchase={unlockPremiumReport} onRestore={restorePremiumReport} settings={activeSettings} />
        )}

        {view !== 'admin' && account && complete && (!activeSettings.requirePayment || hasPremiumReport) && <Results profile={profile} results={results} onRetake={resetQuiz} />}
      </section>
      <figure className="page-cat-strip">
        <img src="/assets/cat-family-cropped.png" alt="A lineup of Cats & Kittens organization cats" />
      </figure>
    </main>
  );
}

function AuthCard({ onSubmit }) {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [notice, setNotice] = useState('');

  function updateField(field, value) {
    setNotice('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitAuth(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim() || (mode === 'signup' && !form.name.trim())) {
      setNotice('Please fill in the required account fields.');
      return;
    }

    onSubmit({
      name: form.name.trim() || form.email.trim().split('@')[0],
      email: form.email.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form className="auth-card" onSubmit={submitAuth}>
      <div className="auth-tabs">
        <button className={mode === 'signup' ? 'active' : ''} type="button" onClick={() => setMode('signup')}>
          Sign up
        </button>
        <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
          Log in
        </button>
      </div>
      <p>
        Create an account before starting the quiz so cat profiles, paid reports, and future App Store purchases have a
        place to live.
      </p>
      {mode === 'signup' && (
        <label>
          Your name
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Example: Domi" />
        </label>
      )}
      <label>
        Email
        <input value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" type="email" />
      </label>
      <label>
        Password
        <input value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Create a password" type="password" />
      </label>
      {notice && <p className="form-notice">{notice}</p>}
      <button className="primary-button" type="submit">
        {mode === 'signup' ? 'Create account' : 'Log in'}
      </button>
    </form>
  );
}

function Paywall({ onPurchase, onRestore, settings }) {
  const [notice, setNotice] = useState('');

  function openStripeCheckout() {
    if (!settings.stripePaymentLink?.trim()) {
      setNotice('Stripe is ready for a Payment Link. Add it in Admin > Payments and features.');
      return;
    }

    window.location.href = settings.stripePaymentLink.trim();
  }

  return (
    <section className="paywall-panel">
      <div>
        <span className="eyebrow">Deposit and report</span>
        <h3>Unlock the complete Cat Purrsonality profile.</h3>
        <p>
          Pay the deposit to receive the primary and secondary type blend, all category scores, concern-based scenario
          outlooks, strengths, challenges, and care recommendations.
        </p>
      </div>
      <div className="price-card">
        <span>{settings.reportName}</span>
        <strong>{settings.reportPrice}</strong>
        <small>Choose Stripe card checkout or Apple In-App Purchase.</small>
      </div>
      <div className="paywall-actions">
        <button className="primary-button" type="button" onClick={onPurchase}>
          Pay with Apple
        </button>
        <button className="primary-button" type="button" onClick={openStripeCheckout}>
          Pay deposit with Stripe
        </button>
        <button className="ghost-button" type="button" onClick={onRestore}>
          Restore Apple purchase
        </button>
      </div>
      {notice && <p className="form-notice">{notice}</p>}
    </section>
  );
}

function ProfileForm({ profile, updateProfile, notice, onStart, suggestions, profileFields }) {
  const selectedConcerns = profile.concerns.map((concern) => concern.trim()).filter(Boolean);

  function updateConcern(index, value) {
    const concerns = [...profile.concerns];
    concerns[index] = value;
    updateProfile('concerns', concerns);
  }

  function toggleSuggestedConcern(suggestion) {
    const current = profile.concerns.map((concern) => concern.trim()).filter(Boolean);
    const exists = current.includes(suggestion);
    const next = exists ? current.filter((concern) => concern !== suggestion) : [...current, suggestion].slice(0, 3);
    updateProfile('concerns', [...next, '', '', ''].slice(0, 3));
  }

  return (
    <div className="profile-grid">
      {profileFields.map((field) => (
        <label key={field.id}>
          {field.label}{field.required ? ' *' : ''}
          {field.type === 'select' ? (
            <select value={profile[field.id] ?? ''} onChange={(event) => updateProfile(field.id, event.target.value)}>
              <option value="">{field.placeholder || 'Choose'}</option>
              {field.options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : (
            <input
              value={profile[field.id] ?? ''}
              onChange={(event) => updateProfile(field.id, event.target.value)}
              placeholder={field.placeholder}
            />
          )}
        </label>
      ))}
      <div className="concerns-fieldset wide">
        <div>
          <span className="eyebrow">Owner concerns</span>
          <h3>What situations do you want to predict?</h3>
        </div>
        <details className="concern-dropdown">
          <summary>
            <span>Choose up to 3 common concerns</span>
            <strong>{selectedConcerns.length}/3 selected</strong>
          </summary>
          <div className="concern-options">
            {suggestions.map((suggestion) => {
              const checked = selectedConcerns.includes(suggestion);
              const disabled = !checked && selectedConcerns.length >= 3;

              return (
                <label className={disabled ? 'concern-option disabled' : 'concern-option'} key={suggestion}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleSuggestedConcern(suggestion)}
                  />
                  <span>{suggestion}</span>
                </label>
              );
            })}
          </div>
        </details>
        {[0, 1, 2].map((index) => (
          <label key={index}>
            Concern {index + 1}
            <input
              value={profile.concerns[index]}
              onChange={(event) => updateConcern(index, event.target.value)}
              placeholder={concernExamples[index]}
            />
          </label>
        ))}
      </div>
      {notice && <p className="form-notice wide">{notice}</p>}
      <button className="primary-button wide" onClick={onStart} type="button">
        Begin quiz
      </button>
    </div>
  );
}

function QuestionCard({ question, selected, onSelect, onBack, onNext, isLast }) {
  return (
    <div className="question-card">
      <div className="answer-grid">
        {question.answers.map((answer, index) => {
          const value = index + 1;
          return (
            <button
              key={answer}
              className={selected === value ? 'answer selected' : 'answer'}
              type="button"
              onClick={() => onSelect(value)}
            >
              <span>{value}</span>
              {answer}
            </button>
          );
        })}
      </div>
      <div className="nav-row">
        <button className="ghost-button" type="button" onClick={onBack}>
          Back
        </button>
        <button className="primary-button" type="button" disabled={!selected} onClick={onNext}>
          {isLast ? 'See results' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function Results({ profile, results, onRetake }) {
  const { scores, personality } = results;
  const sortedScores = [...categories].sort((a, b) => scores[b] - scores[a]);
  const scenarioOutlooks = buildScenarioOutlooks(profile.concerns ?? [], personality);

  return (
    <div className="results-layout">
      <aside className="archetype-panel">
        <span className="eyebrow">{profile.breed} · {profile.age} · {profile.lifestyle}</span>
        <div className="type-lockup">
          <span>{personality.primary.icon}</span>
          <h3>{personality.primary.name}</h3>
        </div>
        <p className="result-statement">{personality.statement}</p>
        <p>{personality.explanation}</p>
        <div className="mini-profile">
          <span>{profile.sex}</span>
          <span>{profile.household}</span>
          {profile.ticaRegistration ? <span>TICA {profile.ticaRegistration}</span> : null}
        </div>
      </aside>

      <div className="trait-list">
        {personality.traits.map((trait) => (
          <div className={trait.key === personality.primary.key ? 'trait-card primary-trait' : 'trait-card'} key={trait.key}>
            <div className="trait-heading">
              <span className="trait-icon">{trait.icon}</span>
              <div>
                <strong>{trait.name}</strong>
                <small>{trait.tagline}</small>
              </div>
              <b>{trait.score}%</b>
            </div>
            <div className="score-bar">
              <span style={{ width: `${trait.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="score-list">
        <h4>Category Scores</h4>
        {sortedScores.map((category) => (
          <div className="score-row" key={category}>
            <div>
              <strong>{category}</strong>
              <span>{scores[category]}%</span>
            </div>
            <div className="score-bar">
              <span style={{ width: `${scores[category]}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Insight title="Strengths" items={personality.strengths} />
      <Insight title="Challenges" items={personality.challenges} />
      <Insight title="Recommendations" items={personality.recommendations} wide />

      {scenarioOutlooks.length > 0 && (
        <section className="scenario-panel wide">
          <h4>Scenario Outlook</h4>
          <p>Based on the owner concerns you entered before the quiz.</p>
          <div className="scenario-list">
            {scenarioOutlooks.map((scenario, index) => (
              <article className="scenario-card" key={scenario.concern}>
                <span>Scenario {index + 1}</span>
                <h5>{scenario.concern}</h5>
                <p>{scenario.reaction}</p>
                <strong>{scenario.support}</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      <button className="primary-button wide" type="button" onClick={onRetake}>
        Start a fresh profile
      </button>
    </div>
  );
}

function AdminPortal({ account, profile, answers, hasPremiumReport, adminContent, onSaveContent }) {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_EMAIL);
  const [login, setLogin] = useState({ email: ADMIN_EMAIL, passcode: '' });
  const [notice, setNotice] = useState('');
  const answeredCount = Object.keys(answers).length;

  function submitAdminLogin(event) {
    event.preventDefault();
    if (login.email.trim().toLowerCase() !== ADMIN_EMAIL || login.passcode.trim() !== ADMIN_PASSCODE) {
      setNotice('That email or passcode is not authorized for admin access.');
      return;
    }

    localStorage.setItem(ADMIN_SESSION_KEY, ADMIN_EMAIL);
    setIsAdmin(true);
    setNotice('');
  }

  function signOutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }

  if (!isAdmin) {
    return (
      <form className="auth-card admin-login" onSubmit={submitAdminLogin}>
        <span className="eyebrow">Owner access</span>
        <h3>Log in to manage the app.</h3>
        <p>This is the starter admin login. We will replace it with real secure admin accounts when we connect Supabase.</p>
        <label>
          Admin email
          <input value={login.email} onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))} />
        </label>
        <label>
          Passcode
          <input
            value={login.passcode}
            onChange={(event) => setLogin((current) => ({ ...current, passcode: event.target.value }))}
            placeholder="Enter admin passcode"
            type="password"
          />
        </label>
        {notice && <p className="form-notice">{notice}</p>}
        <button className="primary-button" type="submit">
          Open admin
        </button>
      </form>
    );
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-status">
        <div>
          <span className="eyebrow">Live controls</span>
          <h3>Manage users, content, features, and payments.</h3>
          <p>
            These controls work in this browser now. For changes to update for every visitor, the next step is connecting
            Supabase for the database and Stripe for real checkout.
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={signOutAdmin}>
          Admin sign out
        </button>
      </section>

      <div className="admin-metrics">
        <Metric label="Prototype users" value={account ? '1' : '0'} />
        <Metric label="Questions" value={adminContent.questions.length} />
        <Metric label="Concerns" value={adminContent.concernSuggestions.length} />
        <Metric label="Payment" value={adminContent.settings.requirePayment ? 'On' : 'Off'} />
      </div>

      <AdminUsersPanel account={account} profile={profile} answeredCount={answeredCount} paid={hasPremiumReport} />
      <AdminSettingsPanel adminContent={adminContent} onSaveContent={onSaveContent} />
      <AdminProfileFieldsPanel adminContent={adminContent} onSaveContent={onSaveContent} />
      <AdminConcernsPanel adminContent={adminContent} onSaveContent={onSaveContent} />
      <AdminQuestionsPanel adminContent={adminContent} onSaveContent={onSaveContent} />
      <AdminNextSteps />
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminUsersPanel({ account, profile, answeredCount, paid }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Users</span>
          <h3>Current prototype account</h3>
        </div>
      </div>
      {account ? (
        <div className="admin-table">
          <div><strong>Name</strong><span>{account.name}</span></div>
          <div><strong>Email</strong><span>{account.email}</span></div>
          <div><strong>Cat</strong><span>{profile.name || 'Not started'}</span></div>
          <div><strong>Quiz answers</strong><span>{answeredCount}</span></div>
          <div><strong>Report</strong><span>{paid ? 'Unlocked' : 'Not purchased'}</span></div>
        </div>
      ) : (
        <p className="muted-text">No one is logged in on this browser right now.</p>
      )}
    </section>
  );
}

function AdminSettingsPanel({ adminContent, onSaveContent }) {
  const [settings, setSettings] = useState(adminContent.settings);

  useEffect(() => {
    setSettings(adminContent.settings);
  }, [adminContent.settings]);

  function update(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function save() {
    onSaveContent({ ...adminContent, settings });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Payments and features</span>
          <h3>Control the paid report setup.</h3>
        </div>
        <button className="primary-button" type="button" onClick={save}>
          Save settings
        </button>
      </div>
      <div className="admin-form-grid">
        <label>
          Report name
          <input value={settings.reportName} onChange={(event) => update('reportName', event.target.value)} />
        </label>
        <label>
          Price shown
          <input value={settings.reportPrice} onChange={(event) => update('reportPrice', event.target.value)} />
        </label>
        <label>
          Apple product ID
          <input value={settings.appleProductId} onChange={(event) => update('appleProductId', event.target.value)} />
        </label>
        <label>
          Stripe publishable key
          <input value={settings.stripePublishableKey} onChange={(event) => update('stripePublishableKey', event.target.value)} placeholder="pk_live_..." />
        </label>
        <label>
          Stripe price ID
          <input value={settings.stripePriceId} onChange={(event) => update('stripePriceId', event.target.value)} placeholder="price_..." />
        </label>
        <label>
          Stripe Payment Link
          <input value={settings.stripePaymentLink} onChange={(event) => update('stripePaymentLink', event.target.value)} placeholder="https://buy.stripe.com/..." />
        </label>
        <label>
          Stripe mode
          <select value={settings.stripeMode} onChange={(event) => update('stripeMode', event.target.value)}>
            <option>Not connected yet</option>
            <option>Test mode</option>
            <option>Live mode</option>
          </select>
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={settings.requireLogin} onChange={(event) => update('requireLogin', event.target.checked)} />
          Require login before quiz
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={settings.requirePayment} onChange={(event) => update('requirePayment', event.target.checked)} />
          Require payment before full report
        </label>
      </div>
    </section>
  );
}

function AdminProfileFieldsPanel({ adminContent, onSaveContent }) {
  const [items, setItems] = useState(adminContent.profileFields);

  useEffect(() => {
    setItems(adminContent.profileFields);
  }, [adminContent.profileFields]);

  function updateField(index, field, value) {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const next = { ...item, [field]: value };
      if (field === 'label' && !defaultProfileFields.some((defaultField) => defaultField.id === item.id)) {
        next.id = makeFieldId(value);
      }
      return next;
    }));
  }

  function updateOptions(index, value) {
    const options = value.split('\n').map((option) => option.trim()).filter(Boolean);
    updateField(index, 'options', options);
  }

  function addField() {
    setItems((current) => [
      ...current,
      {
        id: `customField${Date.now()}`,
        label: 'New cat profile field',
        type: 'text',
        placeholder: 'Example: Add helpful placeholder text',
        required: false,
        options: [],
      },
    ]);
  }

  function removeField(index) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveField(index, direction) {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    onSaveContent({ ...adminContent, profileFields: items.map(normalizeProfileField) });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Start form</span>
          <h3>Add or rearrange cat profile fields.</h3>
        </div>
        <div className="admin-actions">
          <button className="ghost-button" type="button" onClick={addField}>Add field</button>
          <button className="primary-button" type="button" onClick={save}>Save form fields</button>
        </div>
      </div>
      <div className="question-editor-list">
        {items.map((item, index) => (
          <article className="question-editor" key={`${item.id}-${index}`}>
            <div className="question-editor-top">
              <strong>Field {index + 1}</strong>
              <div className="admin-actions">
                <button className="ghost-button" type="button" onClick={() => moveField(index, -1)}>Up</button>
                <button className="ghost-button" type="button" onClick={() => moveField(index, 1)}>Down</button>
                <button className="ghost-button" type="button" onClick={() => removeField(index)}>Remove</button>
              </div>
            </div>
            <label>
              Field label
              <input value={item.label} onChange={(event) => updateField(index, 'label', event.target.value)} />
            </label>
            <label>
              Placeholder
              <input value={item.placeholder} onChange={(event) => updateField(index, 'placeholder', event.target.value)} />
            </label>
            <label>
              Field type
              <select value={item.type} onChange={(event) => updateField(index, 'type', event.target.value)}>
                <option value="text">Text</option>
                <option value="select">Dropdown</option>
              </select>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={item.required} onChange={(event) => updateField(index, 'required', event.target.checked)} />
              Required before quiz
            </label>
            {item.type === 'select' && (
              <label>
                Dropdown options, one per line
                <textarea value={item.options.join('\n')} onChange={(event) => updateOptions(index, event.target.value)} />
              </label>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminConcernsPanel({ adminContent, onSaveContent }) {
  const [items, setItems] = useState(adminContent.concernSuggestions);

  useEffect(() => {
    setItems(adminContent.concernSuggestions);
  }, [adminContent.concernSuggestions]);

  function updateItem(index, value) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function addItem() {
    setItems((current) => [...current, 'New owner concern']);
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function save() {
    onSaveContent({ ...adminContent, concernSuggestions: items.map((item) => item.trim()).filter(Boolean) });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Concern list</span>
          <h3>Edit the multi-select concern menu.</h3>
        </div>
        <div className="admin-actions">
          <button className="ghost-button" type="button" onClick={addItem}>Add concern</button>
          <button className="primary-button" type="button" onClick={save}>Save concerns</button>
        </div>
      </div>
      <div className="admin-list-editor">
        {items.map((item, index) => (
          <div className="admin-edit-row" key={`${item}-${index}`}>
            <input value={item} onChange={(event) => updateItem(index, event.target.value)} />
            <button className="ghost-button" type="button" onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminQuestionsPanel({ adminContent, onSaveContent }) {
  const [items, setItems] = useState(adminContent.questions);

  useEffect(() => {
    setItems(adminContent.questions);
  }, [adminContent.questions]);

  function updateQuestion(index, field, value) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function updateAnswer(questionIndex, answerIndex, value) {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== questionIndex) return item;
      const answers = item.answers.map((answer, index) => (index === answerIndex ? value : answer));
      return { ...item, answers };
    }));
  }

  function addQuestion() {
    setItems((current) => [
      ...current,
      {
        prompt: 'New scenario question',
        category: categories[0],
        answers: ['Lowest intensity answer', 'Low-medium answer', 'Medium-high answer', 'Highest intensity answer'],
      },
    ]);
  }

  function removeQuestion(index) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function save() {
    onSaveContent({ ...adminContent, questions: items.map(normalizeQuestion) });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Quiz scenarios</span>
          <h3>Add or adjust scoring questions.</h3>
        </div>
        <div className="admin-actions">
          <button className="ghost-button" type="button" onClick={addQuestion}>Add question</button>
          <button className="primary-button" type="button" onClick={save}>Save questions</button>
        </div>
      </div>
      <div className="question-editor-list">
        {items.map((item, questionIndex) => (
          <article className="question-editor" key={`${item.prompt}-${questionIndex}`}>
            <div className="question-editor-top">
              <strong>Question {questionIndex + 1}</strong>
              <button className="ghost-button" type="button" onClick={() => removeQuestion(questionIndex)}>Remove</button>
            </div>
            <label>
              Scenario
              <textarea value={item.prompt} onChange={(event) => updateQuestion(questionIndex, 'prompt', event.target.value)} />
            </label>
            <label>
              Scoring category
              <select value={item.category} onChange={(event) => updateQuestion(questionIndex, 'category', event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            {item.answers.map((answer, answerIndex) => (
              <label key={answerIndex}>
                Answer {answerIndex + 1} score
                <input value={answer} onChange={(event) => updateAnswer(questionIndex, answerIndex, event.target.value)} />
              </label>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminNextSteps() {
  return (
    <section className="admin-panel">
      <span className="eyebrow">Next connection</span>
      <h3>What this needs before real customers pay.</h3>
      <ul>
        <li>Supabase database for real users, saved cat profiles, admin-only access, and shared content updates.</li>
        <li>Stripe checkout account keys and a secure payment endpoint so card payments are real.</li>
        <li>A private admin role so only Cats & Kittens Organization can manage app content.</li>
      </ul>
    </section>
  );
}

function Insight({ title, items, wide }) {
  return (
    <section className={wide ? 'insight-card wide' : 'insight-card'}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
