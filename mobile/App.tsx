import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type LoggedSet = {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  notes: string;
  unit: string; // 'lbs' or 'kg'
};

type AppSettings = {
  goal: string;
  level: string;
  unit: string;
  bodyweight: number;
  guestMode: boolean;
};

const templates = [
  { name: 'Push Day', focus: 'Chest, shoulders, triceps' },
  { name: 'Pull Day', focus: 'Back, rear delts, biceps' },
  { name: 'Leg Day', focus: 'Squat, hinge, single-leg work' },
];

const roadmap = [
  { phase: 'Phase 1', title: 'Workout tracking', status: 'Live now' },
  { phase: 'Phase 2', title: 'Nutrition + recovery', status: 'Retention gated' },
  { phase: 'Phase 3', title: 'Cardio + mobility', status: 'Planned' },
];

const exerciseCategories: Record<string, string> = {
  'barbell bench press': 'Chest',
  'incline dumbbell press': 'Chest',
  'push-up': 'Chest',
  'barbell back squat': 'Legs',
  'romanian deadlift': 'Posterior chain',
  'lat pulldown': 'Back',
  'seated cable row': 'Back',
  'pull-up': 'Back',
  'dumbbell shoulder press': 'Shoulders',
  'lateral raise': 'Shoulders',
  'biceps curl': 'Arms',
  'triceps rope pushdown': 'Arms',
  'leg press': 'Legs',
  'walking lunge': 'Legs',
  'plank': 'Core',
  'hanging knee raise': 'Core',
  'cable fly': 'Chest',
  'hip thrust': 'Glutes',
  'chest-supported row': 'Back',
  'goblet squat': 'Legs',
};

const starterSets: LoggedSet[] = [
  {
    id: '1',
    exercise: 'Barbell bench press',
    weight: 205,
    reps: 6,
    notes: 'Top set felt solid.',
    unit: 'lbs',
  },
  {
    id: '2',
    exercise: 'Incline dumbbell press',
    weight: 60,
    reps: 10,
    notes: 'Kept control on the eccentric.',
    unit: 'lbs',
  },
];

const convertWeight = (val: number, fromUnit: string, toUnit: string): number => {
  if (!val) return 0;
  if (fromUnit === toUnit) return val;
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round(val * 0.45359237 * 2) / 2;
  }
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round((val * 2.20462262) / 2.5) * 2.5;
  }
  return val;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'skills' | 'settings'>('today');
  const [activeTemplate, setActiveTemplate] = useState('Push Day');
  const [sessionName, setSessionName] = useState('Push Day');
  const [exercise, setExercise] = useState('Barbell bench press');
  const [weight, setWeight] = useState('205');
  const [reps, setReps] = useState('6');
  const [notes, setNotes] = useState('');
  const [loggedSets, setLoggedSets] = useState<LoggedSet[]>(starterSets);
  const [totalWorkouts, setTotalWorkouts] = useState(3);
  const [currentStreak, setCurrentStreak] = useState(4);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    goal: 'General Consistency',
    level: 'Beginner',
    unit: 'lbs',
    bodyweight: 150,
    guestMode: false,
  });

  // Local input settings states (for the form)
  const [formGoal, setFormGoal] = useState(settings.goal);
  const [formLevel, setFormLevel] = useState(settings.level);
  const [formUnit, setFormUnit] = useState(settings.unit);
  const [formBodyweight, setFormBodyweight] = useState(String(settings.bodyweight));
  const [formGuestMode, setFormGuestMode] = useState(settings.guestMode);

  // Convert stats
  const workoutVolume = useMemo(() => {
    return loggedSets.reduce((total, item) => {
      const itemUnit = item.unit || 'lbs';
      const weightInCurrentUnit = convertWeight(item.weight, itemUnit, settings.unit);
      return total + weightInCurrentUnit * item.reps;
    }, 0);
  }, [loggedSets, settings.unit]);

  // Skills calculations
  const skillsData = useMemo(() => {
    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Glutes', 'Posterior chain'];
    const weeklySetsCount: Record<string, number> = {};
    const lifetimeSetsCount: Record<string, number> = {};
    const prs: Record<string, { weight: number; reps: number; exercise: string; unit: string; est1RM: number } | null> = {};

    muscleGroups.forEach(g => {
      weeklySetsCount[g] = 0;
      lifetimeSetsCount[g] = 0;
      prs[g] = null;
    });

    loggedSets.forEach(set => {
      const category = exerciseCategories[set.exercise.toLowerCase()] || 'Accessory';
      if (category in weeklySetsCount) {
        weeklySetsCount[category] += 1;
        lifetimeSetsCount[category] += 1; // Since mobile is single session, treats loggedSets as both weekly and lifetime

        const setUnit = set.unit || 'lbs';
        const weightInLbs = convertWeight(set.weight, setUnit, 'lbs');
        const est1RM = weightInLbs * (1 + set.reps / 30);
        
        const currentPr = prs[category];
        if (!currentPr || est1RM > currentPr.est1RM) {
          prs[category] = { weight: set.weight, reps: set.reps, exercise: set.exercise, unit: setUnit, est1RM };
        }
      }
    });

    return { muscleGroups, weeklySetsCount, lifetimeSetsCount, prs };
  }, [loggedSets]);

  const startTemplate = (templateName: string) => {
    setActiveTemplate(templateName);
    setSessionName(templateName);
    setExercise(
      templateName === 'Pull Day'
        ? 'Lat pulldown'
        : templateName === 'Leg Day'
        ? 'Barbell back squat'
        : 'Barbell bench press'
    );
    setNotes('');
  };

  const logSet = () => {
    const parsedWeight = Number(weight) || 0;
    const parsedReps = Number(reps) || 0;
    if (!exercise.trim() || parsedWeight <= 0 || parsedReps <= 0) {
      return;
    }

    setLoggedSets((current) => [
      {
        id: `${Date.now()}`,
        exercise: exercise.trim(),
        weight: parsedWeight,
        reps: parsedReps,
        notes: notes.trim(),
        unit: settings.unit,
      },
      ...current,
    ]);
    setWeight('');
    setReps('');
    setNotes('');
  };

  const finishWorkout = () => {
    setTotalWorkouts((current) => current + 1);
    setCurrentStreak((current) => current + 1);
    alert('Workout completed successfully!');
  };

  const saveSettings = () => {
    const newWeight = Number(formBodyweight) || 150;
    let finalBodyweight = newWeight;
    if (formUnit !== settings.unit) {
      finalBodyweight = convertWeight(settings.bodyweight, settings.unit, formUnit);
      setFormBodyweight(String(finalBodyweight));
    }

    setSettings({
      goal: formGoal,
      level: formLevel,
      unit: formUnit,
      bodyweight: finalBodyweight,
      guestMode: formGuestMode,
    });
    alert('Settings saved!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {activeTab === 'today' && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>LiftOff Mobile</Text>
            <Text style={styles.title}>Log a set in seconds, even between reps.</Text>
            <Text style={styles.subtitle}>
              Fast workout tracking with dynamic muscle group metrics, designed to optimize your training balance.
            </Text>

            <View style={styles.heroPills}>
              <Text style={styles.pill}>Offline-first</Text>
              <Text style={styles.pill}>One-handed logging</Text>
              <Text style={styles.pill}>Habit focused</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard label="Workouts" value={`${totalWorkouts}`} hint="Logged this week" />
            <StatCard label="Volume" value={`${Math.round(workoutVolume).toLocaleString()} ${settings.unit}`} hint="Active session" />
            <StatCard label="Streak" value={`${currentStreak} days`} hint="Keep the habit" />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Current workout</Text>
            <Text style={styles.panelTitle}>{sessionName}</Text>

            <View style={styles.rowWrap}>
              {templates.map((template) => (
                <Pressable
                  key={template.name}
                  style={[
                    styles.templateChip,
                    activeTemplate === template.name && styles.templateChipActive,
                  ]}
                  onPress={() => startTemplate(template.name)}
                >
                  <Text style={styles.templateChipTitle}>{template.name}</Text>
                  <Text style={styles.templateChipSubtitle}>{template.focus}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.form}>
              <Field label="Exercise" value={exercise} onChangeText={setExercise} placeholder="Incline dumbbell press" />
              <View style={styles.twoUp}>
                <Field
                  label={`Weight (${settings.unit})`}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder={settings.unit === 'kg' ? '40' : '205'}
                  keyboardType="numeric"
                />
                <Field label="Reps" value={reps} onChangeText={setReps} placeholder="6" keyboardType="numeric" />
              </View>
              <Field
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                placeholder="How did the set feel?"
                multiline
              />

              <Pressable style={styles.primaryButton} onPress={logSet}>
                <Text style={styles.primaryButtonText}>Log Set</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHeaderRow}>
              <Text style={styles.panelLabel}>Logged sets</Text>
              <Pressable style={styles.secondaryButton} onPress={finishWorkout}>
                <Text style={styles.secondaryButtonText}>Finish Workout</Text>
              </Pressable>
            </View>

            <FlatList
              data={loggedSets}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const displayWeight = convertWeight(item.weight, item.unit, settings.unit);
                return (
                  <View style={styles.setCard}>
                    <View style={styles.setCardHeader}>
                      <Text style={styles.setCardTitle}>{item.exercise}</Text>
                      <Text style={styles.tag}>{displayWeight} {settings.unit} x {item.reps}</Text>
                    </View>
                    <Text style={styles.setCardMeta}>{item.notes || 'No notes saved.'}</Text>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      )}

      {activeTab === 'skills' && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Weekly Muscle Balance</Text>
            <Text style={styles.panelSubtitle}>Target: 10 sets per group per week</Text>
            
            {skillsData.muscleGroups.map(g => {
              const count = skillsData.weeklySetsCount[g] || 0;
              const percent = Math.min(1, count / 10);
              return (
                <View key={g} style={styles.progressContainer}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabelText}>{g === 'Posterior chain' ? 'Posterior Chain' : g}</Text>
                    <Text style={styles.progressValueText}>{count} / 10 sets</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percent * 100}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>LiftOff Strength Levels</Text>
            
            {skillsData.muscleGroups.map(g => {
              const sets = skillsData.lifetimeSetsCount[g] || 0;
              let level = 'Novice';
              let badgeColor = '#9eb1c6';
              if (sets >= 21) {
                level = 'Proficient';
                badgeColor = '#7cf7c9';
              } else if (sets >= 5) {
                level = 'Competent';
                badgeColor = '#ffcb77';
              }
              const pr = skillsData.prs[g];
              const prText = pr
                ? `${pr.exercise}: ${convertWeight(pr.weight, pr.unit, settings.unit)} ${settings.unit} x ${pr.reps}`
                : 'No lifts logged';

              return (
                <View key={g} style={styles.levelRow}>
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelName}>{g === 'Posterior chain' ? 'Posterior Chain' : g}</Text>
                    <Text style={[styles.levelBadge, { color: badgeColor, borderColor: badgeColor }]}>{level}</Text>
                  </View>
                  <Text style={styles.levelDetailText}>Lifetime sets: {sets}</Text>
                  <Text style={styles.levelPrText}>Best: {prText}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {activeTab === 'settings' && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Profile Settings</Text>
            <Text style={styles.panelTitle}>LiftOff Settings</Text>

            <View style={styles.form}>
              <Text style={styles.fieldLabel}>Goal Selection</Text>
              <View style={styles.rowWrap}>
                {['Build Muscle', 'Get Stronger', 'General Consistency'].map((g) => (
                  <Pressable
                    key={g}
                    style={[styles.optionBtn, formGoal === g && styles.optionBtnActive]}
                    onPress={() => setFormGoal(g)}
                  >
                    <Text style={[styles.optionText, formGoal === g && styles.optionTextActive]}>{g}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Experience Level</Text>
              <View style={styles.rowWrap}>
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <Pressable
                    key={lvl}
                    style={[styles.optionBtn, formLevel === lvl && styles.optionBtnActive]}
                    onPress={() => setFormLevel(lvl)}
                  >
                    <Text style={[styles.optionText, formLevel === lvl && styles.optionTextActive]}>{lvl}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Preferred Weight Unit</Text>
              <View style={styles.rowWrap}>
                {['lbs', 'kg'].map((u) => (
                  <Pressable
                    key={u}
                    style={[styles.optionBtn, formUnit === u && styles.optionBtnActive]}
                    onPress={() => setFormUnit(u)}
                  >
                    <Text style={[styles.optionText, formUnit === u && styles.optionTextActive]}>{u}</Text>
                  </Pressable>
                ))}
              </View>

              <Field
                label={`Current Bodyweight (${formUnit})`}
                value={formBodyweight}
                onChangeText={setFormBodyweight}
                placeholder="150"
                keyboardType="numeric"
              />

              <View style={styles.toggleRow}>
                <Text style={styles.fieldLabel}>Guest Mode</Text>
                <Pressable
                  style={[styles.toggleSwitch, formGuestMode && styles.toggleSwitchActive]}
                  onPress={() => setFormGuestMode(!formGuestMode)}
                >
                  <Text style={styles.toggleSwitchText}>{formGuestMode ? 'ON' : 'OFF'}</Text>
                </Pressable>
              </View>

              <Pressable style={styles.primaryButton} onPress={saveSettings}>
                <Text style={styles.primaryButtonText}>Save Settings</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Roadmap</Text>
            {roadmap.map((item) => (
              <View key={item.phase} style={styles.roadmapItem}>
                <View>
                  <Text style={styles.roadmapPhase}>{item.phase}</Text>
                  <Text style={styles.roadmapTitle}>{item.title}</Text>
                </View>
                <Text style={styles.roadmapStatus}>{item.status}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeTab === 'today' && styles.tabButtonActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'skills' && styles.tabButtonActive]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={[styles.tabText, activeTab === 'skills' && styles.tabTextActive]}>Skills</Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
};

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(205,216,228,0.46)"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111a',
  },
  container: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
    backgroundColor: '#08111a',
  },
  hero: {
    backgroundColor: '#0f1a28',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,247,201,0.18)',
  },
  eyebrow: {
    color: '#7cf7c9',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: '#eef5fb',
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: '#9eb1c6',
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(124,247,201,0.12)',
    color: '#dcfff1',
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0d1723',
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
  },
  statLabel: {
    color: '#9eb1c6',
    fontSize: 11,
    marginBottom: 6,
  },
  statValue: {
    color: '#eef5fb',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  statHint: {
    color: '#9eb1c6',
    fontSize: 10,
  },
  panel: {
    backgroundColor: '#0d1723',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
    gap: 12,
  },
  panelLabel: {
    color: '#7cf7c9',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 11,
    fontWeight: '800',
  },
  panelSubtitle: {
    color: '#9eb1c6',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  panelTitle: {
    color: '#eef5fb',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateChip: {
    width: '100%',
    backgroundColor: '#08111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
    padding: 14,
    gap: 4,
  },
  templateChipActive: {
    borderColor: 'rgba(124,247,201,0.4)',
    backgroundColor: 'rgba(124,247,201,0.08)',
  },
  templateChipTitle: {
    color: '#eef5fb',
    fontSize: 16,
    fontWeight: '800',
  },
  templateChipSubtitle: {
    color: '#9eb1c6',
    fontSize: 12,
  },
  form: {
    gap: 12,
  },
  twoUp: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  fieldLabel: {
    color: '#dde8f1',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#08111a',
    color: '#eef5fb',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#7cf7c9',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#04120d',
    fontWeight: '900',
    fontSize: 15,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#162435',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(124,247,201,0.16)',
  },
  secondaryButtonText: {
    color: '#eef5fb',
    fontWeight: '800',
    fontSize: 13,
  },
  separator: {
    height: 10,
  },
  setCard: {
    backgroundColor: '#08111a',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
  },
  setCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  setCardTitle: {
    flex: 1,
    color: '#eef5fb',
    fontSize: 15,
    fontWeight: '800',
  },
  tag: {
    color: '#04120d',
    backgroundColor: '#7cf7c9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '900',
    overflow: 'hidden',
  },
  setCardMeta: {
    marginTop: 8,
    color: '#9eb1c6',
    fontSize: 12,
    lineHeight: 18,
  },
  roadmapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(171,207,228,0.08)',
  },
  roadmapPhase: {
    color: '#7cf7c9',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  roadmapTitle: {
    color: '#eef5fb',
    fontWeight: '800',
    fontSize: 15,
  },
  roadmapStatus: {
    color: '#9eb1c6',
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0d1723',
    borderTopWidth: 1,
    borderTopColor: 'rgba(171,207,228,0.12)',
    paddingVertical: 10,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(124,247,201,0.08)',
  },
  tabText: {
    color: '#9eb1c6',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#7cf7c9',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabelText: {
    color: '#eef5fb',
    fontWeight: '700',
    fontSize: 14,
  },
  progressValueText: {
    color: '#9eb1c6',
    fontSize: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(171,207,228,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7cf7c9',
    borderRadius: 4,
  },
  levelRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(171,207,228,0.08)',
    paddingVertical: 12,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelName: {
    color: '#eef5fb',
    fontWeight: '800',
    fontSize: 15,
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: '800',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  levelDetailText: {
    color: '#9eb1c6',
    fontSize: 12,
    marginBottom: 2,
  },
  levelPrText: {
    color: '#7cf7c9',
    fontSize: 12,
    fontWeight: '600',
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#08111a',
  },
  optionBtnActive: {
    borderColor: 'rgba(124,247,201,0.4)',
    backgroundColor: 'rgba(124,247,201,0.08)',
  },
  optionText: {
    color: '#9eb1c6',
    fontSize: 12,
    fontWeight: '700',
  },
  optionTextActive: {
    color: '#7cf7c9',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleSwitch: {
    borderWidth: 1,
    borderColor: '#ff6b7a',
    backgroundColor: 'rgba(255,107,122,0.06)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleSwitchActive: {
    borderColor: '#7cf7c9',
    backgroundColor: 'rgba(124,247,201,0.08)',
  },
  toggleSwitchText: {
    color: '#eef5fb',
    fontWeight: '800',
    fontSize: 11,
  },
});
