import { useEvaluationStore } from "./useEvaluationStore";
import { useHistoryStore } from "./useHistoryStore";
import { useTrainingStore } from "./useTrainingStore";

type PersistApi = {
  setOptions: (options: { name: string }) => void;
  rehydrate: () => Promise<void> | void;
};

/**
 * O app guarda avaliações/progresso no localStorage do navegador. Sem escopo,
 * qualquer usuário que logue no mesmo aparelho enxerga os dados de quem usou
 * antes. Esta função re-aponta cada store persistido para uma chave exclusiva
 * do usuário logado (ex.: "epmuras-history:<user-id>").
 *
 * Ordem importante: primeiro troca a chave (setOptions), depois — se a chave
 * nova já tem dados — rehidrata; se não tem (usuário novo), zera o estado em
 * memória (o reset grava o estado limpo já na chave nova, nunca na antiga).
 */
const scopeStore = async (
  persistApi: PersistApi,
  baseName: string,
  reset: () => void,
  suffix: string
) => {
  const key = `${baseName}:${suffix}`;
  persistApi.setOptions({ name: key });
  const hasData = typeof window !== "undefined" && window.localStorage.getItem(key) !== null;
  if (hasData) {
    await persistApi.rehydrate();
  } else {
    reset();
  }
};

export const scopeStoresToUser = async (userId: string | null) => {
  const suffix = userId ?? "anon";

  await scopeStore(
    useHistoryStore.persist,
    "epmuras-history",
    () => useHistoryStore.setState({ evaluations: [] }),
    suffix
  );

  await scopeStore(
    useEvaluationStore.persist,
    "epmuras-current-evaluation",
    () => useEvaluationStore.getState().resetEvaluation(),
    suffix
  );

  await scopeStore(
    useTrainingStore.persist,
    "epmuras-training-progress",
    () => useTrainingStore.setState({ watchedLessons: [] }),
    suffix
  );
};
