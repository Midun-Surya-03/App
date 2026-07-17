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
};

const templates = [
  { name: 'Push Day', focus: 'Chest, shoulders, triceps' },
  { name: 'Pull Day', focus: 'Back, rear delts, biceps' },
  { name: 'Leg Day', focus: 'Squat, hinge, single-leg work' },
];

const roadmap = [
  { phase: 'Phase 1', title: 'Workout logging', status: 'Live now' },
  { phase: 'Phase 2', title: 'Nutrition + recovery', status: 'Retention gated' },
  { phase: 'Phase 3', title: 'Cardio + mobility', status: 'Planned' },
];

const starterSets: LoggedSet[] = [
  {
    id: '1',
    exercise: 'Barbell bench press',
    weight: 205,
    reps: 6,
    notes: 'Top set felt solid.',
  },
  {
    id: '2',
    exercise: 'Incline dumbbell press',
    weight: 60,
    reps: 10,
    notes: 'Kept control on the eccentric.',
  },
];

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState('Push Day');
  const [sessionName, setSessionName] = useState('Push Day');
  const [exercise, setExercise] = useState('Barbell bench press');
  const [weight, setWeight] = useState('205');
  const [reps, setReps] = useState('6');
  const [notes, setNotes] = useState('');
  const [loggedSets, setLoggedSets] = useState<LoggedSet[]>(starterSets);
  const [totalWorkouts, setTotalWorkouts] = useState(3);
  const [currentStreak, setCurrentStreak] = useState(4);

  const workoutVolume = useMemo(
    () => loggedSets.reduce((total, item) => total + item.weight * item.reps, 0),
    [loggedSets],
  );

  const startTemplate = (templateName: string) => {
    setActiveTemplate(templateName);
    setSessionName(templateName);
    setExercise(templateName === 'Pull Day' ? 'Lat pulldown' : templateName === 'Leg Day' ? 'Barbell back squat' : 'Barbell bench press');
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>FitLog mobile</Text>
          <Text style={styles.title}>Log a set in seconds, even between reps.</Text>
          <Text style={styles.subtitle}>
            Fast workout tracking for everyday gym-goers, designed to feel clean on a phone and
            ready for offline-first growth later.
          </Text>

          <View style={styles.heroPills}>
            <Text style={styles.pill}>Offline-first</Text>
            <Text style={styles.pill}>One-handed logging</Text>
            <Text style={styles.pill}>Phase gated</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Workouts" value={`${totalWorkouts}`} hint="Logged this week" />
          <StatCard label="Volume" value={`${workoutVolume.toLocaleString()} lbs`} hint="Active session" />
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
              <Field label="Weight" value={weight} onChangeText={setWeight} placeholder="205" keyboardType="numeric" />
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
            renderItem={({ item }) => (
              <View style={styles.setCard}>
                <View style={styles.setCardHeader}>
                  <Text style={styles.setCardTitle}>{item.exercise}</Text>
                  <Text style={styles.tag}>{item.weight} x {item.reps}</Text>
                </View>
                <Text style={styles.setCardMeta}>{item.notes || 'No notes saved.'}</Text>
              </View>
            )}
          />
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
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: '#9eb1c6',
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(124,247,201,0.12)',
    color: '#dcfff1',
    fontSize: 12,
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
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(171,207,228,0.12)',
  },
  statLabel: {
    color: '#9eb1c6',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#eef5fb',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  statHint: {
    color: '#9eb1c6',
    fontSize: 11,
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
  panelTitle: {
    color: '#eef5fb',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#7cf7c9',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
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
    paddingVertical: 10,
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
});
