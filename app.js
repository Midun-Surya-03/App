const STORAGE_KEY = 'fitlog-state-v1';

const exerciseLibrary = [
  { name: 'Barbell bench press', category: 'Chest', equipment: 'Barbell', movement: 'Push' },
  { name: 'Incline dumbbell press', category: 'Chest', equipment: 'Dumbbells', movement: 'Push' },
  { name: 'Push-up', category: 'Chest', equipment: 'Bodyweight', movement: 'Push' },
  { name: 'Barbell back squat', category: 'Legs', equipment: 'Barbell', movement: 'Squat' },
  { name: 'Romanian deadlift', category: 'Posterior chain', equipment: 'Barbell', movement: 'Hinge' },
  { name: 'Lat pulldown', category: 'Back', equipment: 'Cable', movement: 'Pull' },
  { name: 'Seated cable row', category: 'Back', equipment: 'Cable', movement: 'Pull' },
  { name: 'Pull-up', category: 'Back', equipment: 'Bodyweight', movement: 'Pull' },
  { name: 'Dumbbell shoulder press', category: 'Shoulders', equipment: 'Dumbbells', movement: 'Push' },
  { name: 'Lateral raise', category: 'Shoulders', equipment: 'Dumbbells', movement: 'Accessory' },
  { name: 'Biceps curl', category: 'Arms', equipment: 'Dumbbells', movement: 'Accessory' },
  { name: 'Triceps rope pushdown', category: 'Arms', equipment: 'Cable', movement: 'Accessory' },
  { name: 'Leg press', category: 'Legs', equipment: 'Machine', movement: 'Squat' },
  { name: 'Walking lunge', category: 'Legs', equipment: 'Dumbbells', movement: 'Lunge' },
  { name: 'Plank', category: 'Core', equipment: 'Bodyweight', movement: 'Core' },
  { name: 'Hanging knee raise', category: 'Core', equipment: 'Bodyweight', movement: 'Core' },
  { name: 'Cable fly', category: 'Chest', equipment: 'Cable', movement: 'Accessory' },
  { name: 'Hip thrust', category: 'Glutes', equipment: 'Barbell', movement: 'Bridge' },
  { name: 'Chest-supported row', category: 'Back', equipment: 'Machine', movement: 'Pull' },
  { name: 'Goblet squat', category: 'Legs', equipment: 'Dumbbell', movement: 'Squat' },
];

const templates = [
  {
    name: 'Push Day',
    goal: 'Upper body push',
    exercises: ['Barbell bench press', 'Incline dumbbell press', 'Dumbbell shoulder press', 'Triceps rope pushdown'],
  },
  {
    name: 'Pull Day',
    goal: 'Upper body pull',
    exercises: ['Lat pulldown', 'Seated cable row', 'Pull-up', 'Biceps curl'],
  },
  {
    name: 'Leg Day',
    goal: 'Lower body strength',
    exercises: ['Barbell back squat', 'Romanian deadlift', 'Leg press', 'Walking lunge'],
  },
];

const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Workout tracking',
    status: 'Live',
    focus: 'Logging, PRs, templates, progress, offline-first web shell.',
    live: true,
  },
  {
    phase: 'Phase 2',
    title: 'Nutrition + recovery',
    status: 'Gated by retention',
    focus: 'Macros, barcode scan, sleep, wearables, adaptive programming.',
  },
  {
    phase: 'Phase 3',
    title: 'Cardio + broader discipline',
    status: 'Future expansion',
    focus: 'GPS tracking, mobility, meditation, unified dashboard.',
  },
  {
    phase: 'Phase 4',
    title: 'Social + growth loops',
    status: 'Future expansion',
    focus: 'Friends, challenges, achievements, referrals, streak nudges.',
  },
];

const seedWorkouts = [
  {
    id: 'seed-1',
    title: 'Push Day',
    startedAt: '2026-07-15T18:30:00',
    completedAt: '2026-07-15T19:08:00',
    notes: 'Bench moved well after warmup.',
    exercises: [
      { name: 'Barbell bench press', sets: [{ weight: 185, reps: 8, rpe: 8 }, { weight: 185, reps: 7, rpe: 8.5 }] },
      { name: 'Incline dumbbell press', sets: [{ weight: 60, reps: 10, rpe: 8 }] },
      { name: 'Dumbbell shoulder press', sets: [{ weight: 45, reps: 8, rpe: 8 }] },
    ],
  },
  {
    id: 'seed-2',
    title: 'Pull Day',
    startedAt: '2026-07-13T18:20:00',
    completedAt: '2026-07-13T19:00:00',
    notes: 'Pulled with straps, good lat feel.',
    exercises: [
      { name: 'Lat pulldown', sets: [{ weight: 140, reps: 10, rpe: 7.5 }] },
      { name: 'Seated cable row', sets: [{ weight: 135, reps: 10, rpe: 8 }] },
      { name: 'Biceps curl', sets: [{ weight: 35, reps: 12, rpe: 8 }] },
    ],
  },
  {
    id: 'seed-3',
    title: 'Leg Day',
    startedAt: '2026-07-10T07:05:00',
    completedAt: '2026-07-10T07:52:00',
    notes: 'Front squat is coming back up.',
    exercises: [
      { name: 'Barbell back squat', sets: [{ weight: 235, reps: 5, rpe: 8.5 }] },
      { name: 'Romanian deadlift', sets: [{ weight: 215, reps: 8, rpe: 8 }] },
      { name: 'Walking lunge', sets: [{ weight: 40, reps: 12, rpe: 7.5 }] },
    ],
  },
];

const elements = {
  statWeeklyWorkouts: document.getElementById('statWeeklyWorkouts'),
  statVolume: document.getElementById('statVolume'),
  statStreak: document.getElementById('statStreak'),
  statDuration: document.getElementById('statDuration'),
  sessionTitle: document.getElementById('sessionTitle'),
  sessionStarted: document.getElementById('sessionStarted'),
  sessionDuration: document.getElementById('sessionDuration'),
  sessionSetCount: document.getElementById('sessionSetCount'),
  activeWorkoutList: document.getElementById('activeWorkoutList'),
  templateChips: document.getElementById('templateChips'),
  recentPrs: document.getElementById('recentPrs'),
  recentWorkouts: document.getElementById('recentWorkouts'),
  sessionSnapshot: document.getElementById('sessionSnapshot'),
  volumeChart: document.getElementById('volumeChart'),
  consistencyChart: document.getElementById('consistencyChart'),
  roadmapCards: document.getElementById('roadmapCards'),
  exerciseLibrary: document.getElementById('exerciseLibrary'),
  exerciseOptions: document.getElementById('exerciseOptions'),
  exerciseSearch: document.getElementById('exerciseSearch'),
  libraryCount: document.getElementById('libraryCount'),
  libraryFilteredCount: document.getElementById('libraryFilteredCount'),
  exerciseInput: document.getElementById('exerciseInput'),
  weightInput: document.getElementById('weightInput'),
  repsInput: document.getElementById('repsInput'),
  rpeInput: document.getElementById('rpeInput'),
  notesInput: document.getElementById('notesInput'),
};

const state = loadState();
ensureSeedData(state);

const buttonTabs = Array.from(document.querySelectorAll('[data-view-button]'));
const views = Array.from(document.querySelectorAll('.view'));
const startEmptyWorkoutButton = document.getElementById('startEmptyWorkout');
const repeatLastWorkoutButton = document.getElementById('repeatLastWorkout');
const finishWorkoutButton = document.getElementById('finishWorkout');
const logSetForm = document.getElementById('logSetForm');

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { workouts: [], currentWorkout: null };
    }

    const parsed = JSON.parse(raw);
    return {
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      currentWorkout: parsed.currentWorkout ?? null,
    };
  } catch (error) {
    return { workouts: [], currentWorkout: null };
  }
}

function ensureSeedData(currentState) {
  if (!currentState.workouts.length) {
    currentState.workouts = [...seedWorkouts];
    persist();
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateTime(iso) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

function formatDuration(minutes) {
  return `${Math.max(0, Math.round(minutes))} min`;
}

function getActiveWorkout() {
  return state.currentWorkout;
}

function startWorkout(templateName = 'Custom Workout') {
  const template = templates.find((entry) => entry.name === templateName);
  state.currentWorkout = {
    id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
    title: template?.name ?? templateName,
    startedAt: new Date().toISOString(),
    exercises: template
      ? template.exercises.map((name) => ({ name, sets: [] }))
      : [],
    notes: '',
  };
  persist();
  render();
}

function finishWorkout() {
  const session = getActiveWorkout();
  if (!session) {
    return;
  }

  const completedAt = new Date().toISOString();
  const finishedWorkout = {
    id: session.id,
    title: session.title,
    startedAt: session.startedAt,
    completedAt,
    notes: session.notes ?? '',
    exercises: session.exercises,
  };

  state.workouts = [finishedWorkout, ...state.workouts].slice(0, 40);
  state.currentWorkout = null;
  persist();
  render();
}

function upsertSet(session, exerciseName, setEntry) {
  const normalizedName = exerciseName.trim();
  const existing = session.exercises.find((exercise) => exercise.name.toLowerCase() === normalizedName.toLowerCase());
  if (existing) {
    existing.sets.push(setEntry);
    return;
  }

  session.exercises.push({ name: normalizedName, sets: [setEntry] });
}

function getExerciseHistory(exerciseName) {
  const history = [];
  for (const workout of state.workouts) {
    workout.exercises.forEach((exercise) => {
      if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
        history.push({ workout, exercise });
      }
    });
  }
  return history;
}

function getVolumeForWorkout(workout) {
  return workout.exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, setEntry) => setTotal + setEntry.weight * setEntry.reps, 0);
    return workoutTotal + exerciseVolume;
  }, 0);
}

function getWorkoutDuration(workout) {
  const startedAt = new Date(workout.startedAt).getTime();
  const completedAt = new Date(workout.completedAt).getTime();
  return Math.max(0, Math.round((completedAt - startedAt) / 60000));
}

function getStreak() {
  const workoutDates = [...new Set(state.workouts.map((workout) => formatLocalDate(workout.completedAt)))].sort().reverse();
  if (!workoutDates.length) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = formatLocalDate(cursor);
    if (workoutDates.includes(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      if (workoutDates.includes(formatLocalDate(yesterday))) {
        streak = 1;
      }
    }

    break;
  }

  return streak;
}

function formatLocalDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getWeeklyWorkoutCount() {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return state.workouts.filter((workout) => new Date(workout.completedAt).getTime() >= cutoff).length;
}

function getAverageDuration() {
  if (!state.workouts.length) {
    return 0;
  }

  const totalMinutes = state.workouts.reduce((sum, workout) => sum + getWorkoutDuration(workout), 0);
  return totalMinutes / state.workouts.length;
}

function getRecentPrs() {
  const prs = [];
  const seen = new Set();

  for (const workout of state.workouts) {
    for (const exercise of workout.exercises) {
      for (const setEntry of exercise.sets) {
        const key = `${exercise.name}:${setEntry.weight}:${setEntry.reps}`;
        if (seen.has(key)) {
          continue;
        }

        const historicalSets = getExerciseHistory(exercise.name)
          .flatMap((entry) => entry.exercise.sets)
          .filter((entry) => entry.weight * entry.reps <= setEntry.weight * setEntry.reps);

        const heaviest = Math.max(...historicalSets.map((entry) => entry.weight * entry.reps), 0);
        if (setEntry.weight * setEntry.reps >= heaviest) {
          prs.push({
            exercise: exercise.name,
            detail: `${setEntry.weight} x ${setEntry.reps} at ${formatDate(workout.completedAt)}`,
          });
          seen.add(key);
        }
      }
    }
  }

  return prs.slice(0, 3);
}

function currentWorkoutSetCount(session) {
  if (!session) {
    return 0;
  }

  return session.exercises.reduce((count, exercise) => count + exercise.sets.length, 0);
}

function getRecentWorkoutItems() {
  return state.workouts.slice(0, 4);
}

function computeTimeline() {
  return [...state.workouts]
    .slice(0, 8)
    .reverse()
    .map((workout) => ({
      label: formatDate(workout.completedAt),
      value: getVolumeForWorkout(workout),
    }));
}

function computeConsistencyBuckets() {
  const buckets = [];
  for (let offset = 27; offset >= 0; offset -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - offset);
    const key = formatLocalDate(day);
    const count = state.workouts.filter((workout) => formatLocalDate(workout.completedAt) === key).length;
    buckets.push({ label: day.getDate().toString(), value: count });
  }
  return buckets;
}

function renderStats() {
  elements.statWeeklyWorkouts.textContent = String(getWeeklyWorkoutCount());
  elements.statVolume.textContent = `${Math.round(state.workouts.reduce((sum, workout) => sum + getVolumeForWorkout(workout), 0)).toLocaleString()} lbs`;
  elements.statStreak.textContent = `${getStreak()} days`;
  elements.statDuration.textContent = formatDuration(getAverageDuration());
}

function renderSession() {
  const session = getActiveWorkout();
  if (!session) {
    elements.sessionTitle.textContent = 'No active workout';
    elements.sessionStarted.textContent = 'Ready when you are';
    elements.sessionDuration.textContent = '0 min';
    elements.sessionSetCount.textContent = '0 sets';
    elements.activeWorkoutList.innerHTML = '<div class="alert">Start an empty workout or repeat a template to begin logging.</div>';
    elements.sessionSnapshot.innerHTML = '<div class="snapshot-stack__item"><strong>Idle</strong><span>Pick a template or start a custom workout to unlock the logger.</span></div>';
    return;
  }

  const elapsedMs = Date.now() - new Date(session.startedAt).getTime();
  const elapsedMinutes = Math.max(0, Math.round(elapsedMs / 60000));

  elements.sessionTitle.textContent = session.title;
  elements.sessionStarted.textContent = formatDateTime(session.startedAt);
  elements.sessionDuration.textContent = formatDuration(elapsedMinutes);
  elements.sessionSetCount.textContent = `${currentWorkoutSetCount(session)} sets`;

  if (!session.exercises.length) {
    elements.activeWorkoutList.innerHTML = '<div class="alert">No exercises logged yet. Add the first one using the form above.</div>';
  } else {
    elements.activeWorkoutList.innerHTML = session.exercises.map((exercise) => {
      const latestSet = exercise.sets[exercise.sets.length - 1];
      const setSummary = exercise.sets.length
        ? exercise.sets.map((setEntry, index) => `Set ${index + 1}: ${setEntry.weight} x ${setEntry.reps}${setEntry.rpe ? ` @ RPE ${setEntry.rpe}` : ''}`).join(' · ')
        : 'No sets yet';

      return `
        <article class="workout-card">
          <div class="workout-card__top">
            <div>
              <strong>${exercise.name}</strong>
              <div class="workout-card__meta">
                <span class="meta-pill">${exercise.sets.length} sets</span>
                ${latestSet ? `<span class="meta-pill">Latest ${latestSet.weight} x ${latestSet.reps}</span>` : ''}
              </div>
            </div>
          </div>
          <p>${setSummary}</p>
        </article>
      `;
    }).join('');
  }

  const firstExercise = session.exercises[0];
  elements.sessionSnapshot.innerHTML = `
    <div class="snapshot-stack__item">
      <strong>${session.title}</strong>
      <span>Started ${formatDateTime(session.startedAt)}</span>
    </div>
    <div class="snapshot-stack__item">
      <strong>${currentWorkoutSetCount(session)} logged sets</strong>
      <span>${firstExercise ? `${firstExercise.name} is leading the session.` : 'No exercise selected yet.'}</span>
    </div>
    <div class="snapshot-stack__item">
      <strong>Offline-ready</strong>
      <span>Every set is stored locally first and kept ready for sync architecture later.</span>
    </div>
  `;
}

function renderTemplates() {
  elements.templateChips.innerHTML = templates
    .map(
      (template) => `
        <button class="chip" type="button" data-template-start="${template.name}">
          ${template.name}
        </button>
      `,
    )
    .join('');
}

function renderRecentPrs() {
  const prs = getRecentPrs();
  if (!prs.length) {
    elements.recentPrs.innerHTML = '<div class="pr-item"><strong>No PRs yet</strong><span>Log a workout to start surfacing milestones.</span></div>';
    return;
  }

  elements.recentPrs.innerHTML = prs
    .map(
      (item) => `
        <div class="pr-item">
          <div class="pr-item__top">
            <strong>${item.exercise}</strong>
            <span class="tag">PR</span>
          </div>
          <span>${item.detail}</span>
        </div>
      `,
    )
    .join('');
}

function renderRecentWorkouts() {
  const items = getRecentWorkoutItems();
  if (!items.length) {
    elements.recentWorkouts.innerHTML = '<div class="feed__item">No completed workouts yet.</div>';
    return;
  }

  elements.recentWorkouts.innerHTML = items
    .map((workout) => {
      const totalVolume = getVolumeForWorkout(workout);
      const duration = getWorkoutDuration(workout);
      return `
        <article class="feed__item">
          <div class="feed__top">
            <div>
              <strong class="feed__title">${workout.title}</strong>
              <span class="feed__meta">${formatDate(workout.completedAt)}</span>
            </div>
            <span class="tag">${formatDuration(duration)}</span>
          </div>
          <div class="feed__meta-row">
            <span class="meta-pill">${workout.exercises.length} exercises</span>
            <span class="meta-pill">${Math.round(totalVolume).toLocaleString()} lbs volume</span>
          </div>
          <p>${workout.notes || 'No notes saved.'}</p>
        </article>
      `;
    })
    .join('');
}

function renderCharts() {
  const timeline = computeTimeline();
  const volumeSvg = buildLineChart(timeline, {
    labelFormatter: (item) => `${item.label} · ${Math.round(item.value).toLocaleString()} lbs`,
  });
  elements.volumeChart.innerHTML = volumeSvg;

  const consistency = computeConsistencyBuckets();
  const barsSvg = buildBarChart(consistency);
  elements.consistencyChart.innerHTML = barsSvg;
}

function buildLineChart(points, options = {}) {
  const width = 760;
  const height = 280;
  const padding = 34;
  const values = points.map((point) => point.value || 0);
  const maxValue = Math.max(...values, 1);
  const safePoints = points.length ? points : [{ label: 'No data', value: 0 }];
  const coordinates = safePoints.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(safePoints.length - 1, 1);
    const y = height - padding - ((point.value || 0) / maxValue) * (height - padding * 2);
    return { ...point, x, y };
  });
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(' ');

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = padding + ratio * (height - padding * 2);
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(171,207,228,0.12)" stroke-dasharray="4 6" />`;
  });

  const labels = coordinates
    .map(
      (point) => `
        <g>
          <circle cx="${point.x}" cy="${point.y}" r="6" fill="var(--accent)" />
          <circle cx="${point.x}" cy="${point.y}" r="11" fill="rgba(124,247,201,0.18)" />
          <title>${options.labelFormatter ? options.labelFormatter(point) : `${point.label} · ${point.value}`}</title>
        </g>
      `,
    )
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Workout volume trend chart">
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#7cf7c9" />
          <stop offset="100%" stop-color="#ffcb77" />
        </linearGradient>
      </defs>
      ${ticks.join('')}
      <polyline
        fill="none"
        stroke="url(#lineGradient)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${line}"
      />
      ${labels}
      ${coordinates
        .map(
          (point) => `
            <text x="${point.x}" y="${height - 10}" fill="rgba(158,177,198,0.84)" text-anchor="middle" font-size="11">${point.label}</text>
          `,
        )
        .join('')}
      <text x="${padding}" y="22" fill="#eef5fb" font-size="14" font-weight="700">Volume trend</text>
    </svg>
  `;
}

function buildBarChart(points) {
  const width = 760;
  const height = 260;
  const padding = 34;
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const barGap = 6;
  const barWidth = (width - padding * 2 - barGap * (points.length - 1)) / points.length;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Consistency chart">
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#7cf7c9" />
          <stop offset="100%" stop-color="#25d39d" />
        </linearGradient>
      </defs>
      <text x="${padding}" y="22" fill="#eef5fb" font-size="14" font-weight="700">Workout days per day</text>
      ${points
        .map((point, index) => {
          const barHeight = ((point.value || 0) / maxValue) * (height - padding * 2);
          const x = padding + index * (barWidth + barGap);
          const y = height - padding - barHeight;
          return `
            <g>
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="10" fill="url(#barGradient)" />
              <text x="${x + barWidth / 2}" y="${height - 10}" fill="rgba(158,177,198,0.84)" text-anchor="middle" font-size="10">${point.label}</text>
            </g>
          `;
        })
        .join('')}
    </svg>
  `;
}

function renderRoadmap() {
  elements.roadmapCards.innerHTML = roadmap
    .map(
      (item) => `
        <article class="roadmap-card ${item.live ? 'is-live' : ''}">
          <div class="roadmap-card__meta">
            <span class="tag">${item.phase}</span>
            <span class="meta-pill">${item.status}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.focus}</p>
        </article>
      `,
    )
    .join('');
}

function renderLibrary(filter = '') {
  const normalized = filter.trim().toLowerCase();
  const filtered = exerciseLibrary.filter((exercise) => {
    if (!normalized) {
      return true;
    }

    return [exercise.name, exercise.category, exercise.equipment, exercise.movement].some((field) =>
      field.toLowerCase().includes(normalized),
    );
  });

  elements.libraryCount.textContent = String(exerciseLibrary.length);
  elements.libraryFilteredCount.textContent = String(filtered.length);
  elements.exerciseOptions.innerHTML = exerciseLibrary
    .map((exercise) => `<option value="${exercise.name}"></option>`)
    .join('');

  elements.exerciseLibrary.innerHTML = filtered
    .map((exercise) => {
      const history = getExerciseHistory(exercise.name);
      const lastEntry = history[0];
      const lastSet = lastEntry?.exercise.sets[lastEntry.exercise.sets.length - 1];

      return `
        <article class="library-card">
          <div class="library-card__top">
            <div>
              <strong>${exercise.name}</strong>
              <p>${exercise.category} · ${exercise.equipment}</p>
            </div>
            <span class="tag">${exercise.movement}</span>
          </div>
          <div class="library-card__meta">
            <span class="meta-pill">${history.length ? `${history.length} sessions logged` : 'No history yet'}</span>
            ${lastSet ? `<span class="meta-pill">Last ${lastSet.weight} x ${lastSet.reps}</span>` : ''}
          </div>
        </article>
      `;
    })
    .join('');
}

function render() {
  renderStats();
  renderSession();
  renderTemplates();
  renderRecentPrs();
  renderRecentWorkouts();
  renderCharts();
  renderRoadmap();
  renderLibrary(elements.exerciseSearch.value);
}

function addSetFromForm(event) {
  event.preventDefault();
  if (!state.currentWorkout) {
    startWorkout();
  }

  const session = getActiveWorkout();
  const exerciseName = elements.exerciseInput.value.trim();
  const setEntry = {
    weight: Number(elements.weightInput.value),
    reps: Number(elements.repsInput.value),
    rpe: elements.rpeInput.value ? Number(elements.rpeInput.value) : null,
    notes: elements.notesInput.value.trim(),
  };

  upsertSet(session, exerciseName, setEntry);
  session.notes = session.notes || setEntry.notes;

  persist();
  render();
  logSetForm.reset();
  elements.exerciseInput.value = exerciseName;
  elements.exerciseInput.focus();
}

function wireEvents() {
  buttonTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const viewName = button.dataset.viewButton;
      buttonTabs.forEach((entry) => {
        const active = entry === button;
        entry.classList.toggle('is-active', active);
        entry.setAttribute('aria-selected', String(active));
      });

      views.forEach((view) => {
        const active = view.dataset.view === viewName;
        view.classList.toggle('is-active', active);
        view.hidden = !active;
      });
    });
  });

  startEmptyWorkoutButton.addEventListener('click', () => startWorkout('Custom Workout'));
  repeatLastWorkoutButton.addEventListener('click', () => {
    const lastWorkout = state.workouts[0];
    if (!lastWorkout) {
      startWorkout('Push Day');
      return;
    }

    state.currentWorkout = {
      id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
      title: `${lastWorkout.title} Remix`,
      startedAt: new Date().toISOString(),
      exercises: lastWorkout.exercises.map((exercise) => ({ name: exercise.name, sets: [] })),
      notes: '',
    };
    persist();
    render();
  });

  finishWorkoutButton.addEventListener('click', finishWorkout);
  logSetForm.addEventListener('submit', addSetFromForm);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const templateButton = target.closest('[data-template-start]');
    if (templateButton) {
      startWorkout(templateButton.dataset.templateStart);
    }
  });

  elements.exerciseSearch.addEventListener('input', (event) => {
    renderLibrary(event.target.value);
  });
}

wireEvents();
render();
setInterval(() => {
  if (state.currentWorkout) {
    renderSession();
  }
}, 30000);
