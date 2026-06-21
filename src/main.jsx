import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'purrsonality-progress-v1';
const PURCHASE_STORAGE_KEY = 'purrsonality-premium-report-v1';
const ACCOUNT_STORAGE_KEY = 'cat-purrsonality-account-v1';
const APPLE_PRODUCT_ID = 'com.purrsonality.full_report';

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
  const savedPurchase = useMemo(() => localStorage.getItem(PURCHASE_STORAGE_KEY) === 'true', []);
  const [account, setAccount] = useState(savedAccount);
  const [profile, setProfile] = useState(normalizeProfile(saved?.profile));
  const [answers, setAnswers] = useState(saved?.answers ?? {});
  const [step, setStep] = useState(saved?.step ?? 0);
  const [profileNotice, setProfileNotice] = useState('');
  const [hasPremiumReport, setHasPremiumReport] = useState(savedPurchase);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, answers, step }));
  }, [profile, answers, step]);

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === questions.length;
  const catName = profile.name.trim() || 'Your cat';
  const question = questions[step - 1];
  const progress = Math.round((answeredCount / questions.length) * 100);

  const results = useMemo(() => {
    const raw = blankScores();
    const possible = blankScores();

    questions.forEach((item, index) => {
      possible[item.category] += 4;
      if (answers[index]) raw[item.category] += answers[index];
    });

    const scores = Object.fromEntries(
      categories.map((category) => [category, possible[category] ? toPercent(raw[category], possible[category]) : 0]),
    );
    const personality = buildDiscStyleResult(scores);
    return { scores, personality };
  }, [answers]);

  function updateProfile(field, value) {
    setProfileNotice('');
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function selectAnswer(value) {
    setAnswers((current) => ({ ...current, [step - 1]: value }));
  }

  function resetQuiz() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(emptyProfile);
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

  const missingProfileFields = [
    ['name', 'cat name'],
    ['age', 'age'],
    ['breed', 'breed'],
    ['sex', 'sex'],
    ['lifestyle', 'indoor/outdoor'],
    ['household', 'household type'],
  ].filter(([field]) => !String(profile[field] ?? '').trim());

  function startQuiz() {
    if (missingProfileFields.length) {
      setProfileNotice(`Please add: ${missingProfileFields.map(([, label]) => label).join(', ')}.`);
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
              {!account ? 'Account' : complete ? 'Results ready' : step === 0 ? 'Cat profile' : `Question ${step} of ${questions.length}`}
            </span>
            <h2>{!account ? 'Sign up or log in' : complete ? `${catName}'s Cat Purrsonality Map` : step === 0 ? 'Start with the essentials' : question.prompt}</h2>
          </div>
          {account ? (
            <div className="account-actions">
              <span>{account.email}</span>
              <button className="ghost-button" type="button" onClick={signOut}>
                Sign out
              </button>
              <button className="ghost-button" type="button" onClick={resetQuiz}>
                Reset
              </button>
            </div>
          ) : null}
        </div>

        {account && (
          <div className="progress-track" aria-label="Quiz progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        {!account && <AuthCard onSubmit={saveAccount} />}

        {account && step === 0 && !complete && (
          <ProfileForm profile={profile} updateProfile={updateProfile} notice={profileNotice} onStart={startQuiz} />
        )}

        {account && step > 0 && !complete && (
          <QuestionCard
            question={question}
            selected={answers[step - 1]}
            onSelect={selectAnswer}
            onBack={() => setStep((current) => Math.max(0, current - 1))}
            onNext={() => setStep((current) => Math.min(questions.length, current + 1))}
            isLast={step === questions.length}
          />
        )}

        {account && complete && !hasPremiumReport && (
          <Paywall onPurchase={unlockPremiumReport} onRestore={restorePremiumReport} />
        )}

        {account && complete && hasPremiumReport && <Results profile={profile} results={results} onRetake={resetQuiz} />}
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

function Paywall({ onPurchase, onRestore }) {
  return (
    <section className="paywall-panel">
      <div>
        <span className="eyebrow">Full report</span>
        <h3>Unlock the complete Cat Purrsonality profile.</h3>
        <p>
          The paid report includes the primary and secondary type blend, all category scores, concern-based scenario
          outlooks, strengths, challenges, and care recommendations.
        </p>
      </div>
      <div className="price-card">
        <span>Full Cat Report</span>
        <strong>$9.99</strong>
        <small>Apple In-App Purchase product: {APPLE_PRODUCT_ID}</small>
      </div>
      <div className="paywall-actions">
        <button className="primary-button" type="button" onClick={onPurchase}>
          Unlock with Apple
        </button>
        <button className="ghost-button" type="button" onClick={onRestore}>
          Restore purchase
        </button>
      </div>
    </section>
  );
}

function ProfileForm({ profile, updateProfile, notice, onStart }) {
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
      <label>
        Cat name
        <input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} placeholder="Example: Miso" />
      </label>
      <label>
        Age
        <input value={profile.age} onChange={(event) => updateProfile('age', event.target.value)} placeholder="Example: 4 years" />
      </label>
      <label>
        Breed
        <input value={profile.breed} onChange={(event) => updateProfile('breed', event.target.value)} placeholder="Example: Domestic shorthair" />
      </label>
      <label>
        Sex
        <select value={profile.sex} onChange={(event) => updateProfile('sex', event.target.value)}>
          <option value="">Choose</option>
          <option>Female</option>
          <option>Male</option>
          <option>Unknown</option>
        </select>
      </label>
      <label>
        Indoor / outdoor
        <select value={profile.lifestyle} onChange={(event) => updateProfile('lifestyle', event.target.value)}>
          <option value="">Choose</option>
          <option>Indoor only</option>
          <option>Indoor with supervised outdoor time</option>
          <option>Indoor / outdoor</option>
          <option>Outdoor mostly</option>
        </select>
      </label>
      <label>
        Household type
        <select value={profile.household} onChange={(event) => updateProfile('household', event.target.value)}>
          <option value="">Choose</option>
          <option>Single adult</option>
          <option>Adults only</option>
          <option>Family with children</option>
          <option>Multi-cat home</option>
          <option>Multi-pet home</option>
        </select>
      </label>
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
            {concernSuggestions.map((suggestion) => {
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
