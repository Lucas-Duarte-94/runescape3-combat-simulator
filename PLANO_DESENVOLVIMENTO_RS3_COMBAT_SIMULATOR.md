# RS3 Melee Rotation Simulator

Plano de desenvolvimento para um simulador de combate do RuneScape 3 focado inicialmente em rotações de Melee.

---

## 1. Objetivo

Criar um simulador capaz de:

- montar uma rotação de habilidades;
- validar cooldowns;
- validar adrenalina;
- respeitar o global cooldown;
- calcular dano esperado;
- exibir dano total;
- exibir DPS;
- exibir eventos em uma linha do tempo;
- evoluir futuramente para um modo de treinamento em tempo real.

O primeiro MVP usará o valor de `ability damage` informado manualmente pelo jogador.

Isso evita, inicialmente, a necessidade de calcular:

- nível de Strength;
- tier da arma;
- bônus de equipamento;
- prayers;
- potions;
- perks;
- relics;
- familiares;
- precisão;
- defesa do alvo.

---

## 2. Escopo do MVP

### Incluído

- apenas habilidades de Melee;
- 10 a 15 habilidades;
- ataque direto;
- habilidades multi-hit;
- uma habilidade canalizada;
- um bleed;
- Berserk;
- cooldown individual;
- global cooldown;
- adrenalina;
- cálculo de dano médio;
- linha do tempo;
- dano total;
- DPS;
- editor simples de rotação;
- persistência local da rotação.

### Fora do MVP

- equipamentos;
- perks;
- familiares;
- bosses;
- accuracy;
- damage potential;
- poison;
- weapon switches;
- Essence of Finality;
- special attacks;
- Monte Carlo;
- multiplayer;
- conta de usuário;
- compartilhamento público de rotações.

---

## 3. Stack

- Next.js
- React
- TypeScript
- Zustand
- Vitest
- dnd-kit
- Tailwind CSS
- JSON para dados das habilidades

Opcional posteriormente:

- Supabase;
- PostgreSQL;
- Playwright;
- ECharts ou Recharts.

---

## 4. Arquitetura

```text
┌──────────────────────┐
│ RuneScape Wiki       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Ability Data         │
│ melee-abilities.json │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Combat Engine        │
│ ticks                │
│ cooldowns            │
│ adrenalina           │
│ buffs                │
│ dano                 │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Zustand Store        │
│ rotação              │
│ configuração         │
│ resultado            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Interface React      │
│ ability list         │
│ rotation builder     │
│ timeline             │
│ results              │
└──────────────────────┘
```

---

## 5. Estrutura de pastas

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ability-list/
│   │   ├── AbilityCard.tsx
│   │   └── AbilityList.tsx
│   │
│   ├── rotation-builder/
│   │   ├── RotationBuilder.tsx
│   │   ├── RotationItem.tsx
│   │   └── RotationControls.tsx
│   │
│   ├── simulation/
│   │   ├── SimulationControls.tsx
│   │   ├── SimulationResults.tsx
│   │   └── Timeline.tsx
│   │
│   └── configuration/
│       └── PlayerConfiguration.tsx
│
├── data/
│   └── melee-abilities.json
│
├── engine/
│   ├── calculate-damage.ts
│   ├── simulate-rotation.ts
│   ├── process-effects.ts
│   ├── validators.ts
│   └── types.ts
│
├── stores/
│   └── simulator-store.ts
│
├── hooks/
│   └── use-simulation.ts
│
├── lib/
│   ├── constants.ts
│   └── formatters.ts
│
└── tests/
    ├── damage.test.ts
    ├── cooldown.test.ts
    ├── adrenaline.test.ts
    └── simulation.test.ts
```

---

## 6. Tipos principais

```ts
export interface AbilityHit {
  tickOffset: number;
  minMultiplier: number;
  maxMultiplier: number;
  canCrit?: boolean;
}

export interface AbilityEffect {
  type:
    | "direct_damage"
    | "multi_hit"
    | "bleed"
    | "buff"
    | "channelled";

  hits?: AbilityHit[];
  durationTicks?: number;
  damageMultiplier?: number;
}

export interface Ability {
  id: string;
  name: string;
  style: "melee";

  cooldownTicks: number;
  globalCooldownTicks: number;

  adrenalineCost: number;
  adrenalineGain: number;

  weaponRequirement?: "any" | "dual_wield" | "two_handed";

  effects: AbilityEffect[];

  source?: {
    pageTitle: string;
    revisionId?: number;
    url?: string;
  };
}

export interface RotationStep {
  id: string;
  abilityId: string;
}

export interface SimulationEvent {
  tick: number;

  type:
    | "ability_activated"
    | "damage"
    | "buff_applied"
    | "buff_expired"
    | "error";

  abilityId?: string;
  damage?: number;
  message?: string;
}

export interface SimulationResult {
  totalTicks: number;
  totalSeconds: number;
  totalDamage: number;
  damagePerSecond: number;
  events: SimulationEvent[];
}
```

---

## 7. Modelo inicial de habilidade

```json
{
  "id": "example-ability",
  "name": "Example Ability",
  "style": "melee",
  "cooldownTicks": 10,
  "globalCooldownTicks": 3,
  "adrenalineCost": 0,
  "adrenalineGain": 8,
  "weaponRequirement": "any",
  "effects": [
    {
      "type": "direct_damage",
      "hits": [
        {
          "tickOffset": 1,
          "minMultiplier": 0.8,
          "maxMultiplier": 1.2,
          "canCrit": true
        }
      ]
    }
  ],
  "source": {
    "pageTitle": "Example Ability",
    "revisionId": 0
  }
}
```

---

## 8. Constantes iniciais

```ts
export const TICK_DURATION_SECONDS = 0.6;
export const DEFAULT_GLOBAL_COOLDOWN_TICKS = 3;
export const MAX_ADRENALINE = 100;
export const MIN_ADRENALINE = 0;
```

---

## 9. Fórmula inicial de dano

No MVP:

```ts
const averageMultiplier =
  (hit.minMultiplier + hit.maxMultiplier) / 2;

const expectedDamage =
  abilityDamage * averageMultiplier;
```

Exemplo:

```text
Ability damage: 2.500
Multiplicador: 80% a 120%
Multiplicador médio: 100%
Dano esperado: 2.500
```

---

## 10. Fluxo da simulação

```text
1. Receber configuração do jogador
2. Receber rotação
3. Iniciar tick em 0
4. Iniciar adrenalina
5. Validar habilidade
6. Validar cooldown
7. Validar adrenalina
8. Ativar habilidade
9. Registrar cooldown
10. Agendar hits
11. Aplicar efeitos
12. Avançar global cooldown
13. Repetir até o fim da rotação
14. Ordenar eventos
15. Calcular dano total
16. Calcular DPS
```

---

## 11. Regras do motor

### Cooldown

```ts
readyAtTick = activationTick + cooldownTicks;
```

A habilidade só pode ser usada quando:

```ts
currentTick >= readyAtTick;
```

### Global cooldown

Após uma ativação:

```ts
currentTick += ability.globalCooldownTicks;
```

### Adrenalina

Ao ativar:

```ts
adrenaline -= ability.adrenalineCost;
adrenaline += ability.adrenalineGain;
adrenaline = Math.min(100, Math.max(0, adrenaline));
```

### Hits futuros

Cada hit cria um evento:

```ts
eventTick = activationTick + hit.tickOffset;
```

### DPS

```ts
totalSeconds = totalTicks * 0.6;
dps = totalDamage / totalSeconds;
```

---

## 12. Zustand

O Zustand deve armazenar apenas o estado da interface.

```ts
interface SimulatorStore {
  abilityDamage: number;
  startingAdrenaline: number;

  rotation: RotationStep[];
  result: SimulationResult | null;
  selectedAbilityId: string | null;

  setAbilityDamage: (value: number) => void;
  setStartingAdrenaline: (value: number) => void;

  addAbility: (abilityId: string) => void;
  removeAbility: (stepId: string) => void;
  moveAbility: (from: number, to: number) => void;
  clearRotation: () => void;

  setResult: (result: SimulationResult | null) => void;
}
```

O motor não deve depender do Zustand.

Correto:

```ts
const result = simulateRotation({
  rotation,
  abilities,
  abilityDamage,
  startingAdrenaline
});

setResult(result);
```

Evitar:

```ts
function simulateRotation() {
  const state = useSimulatorStore.getState();
}
```

---

## 13. Ordem de desenvolvimento

### Etapa 1 — Inicialização

```bash
npx create-next-app@latest rs3-combat-simulator
cd rs3-combat-simulator

npm install zustand
npm install @dnd-kit/core @dnd-kit/sortable
npm install -D vitest
```

### Etapa 2 — Tipos

Criar `src/engine/types.ts` e implementar:

- `Ability`;
- `AbilityEffect`;
- `AbilityHit`;
- `RotationStep`;
- `SimulationEvent`;
- `SimulationResult`.

### Etapa 3 — Dados

Criar `src/data/melee-abilities.json` e adicionar inicialmente cinco habilidades validadas.

### Etapa 4 — Motor

Criar `src/engine/simulate-rotation.ts` e implementar:

- cooldown;
- GCD;
- adrenalina;
- dano médio;
- hits futuros;
- erros de validação.

### Etapa 5 — Testes

Criar testes para:

- habilidade inexistente;
- cooldown;
- adrenalina insuficiente;
- ganho de adrenalina;
- dano direto;
- multi-hit;
- cálculo de DPS.

### Etapa 6 — Store

Criar `src/stores/simulator-store.ts` e adicionar:

- configuração;
- rotação;
- resultado;
- ações de adicionar;
- remover;
- mover;
- limpar;
- executar simulação.

### Etapa 7 — Interface

Criar:

- `PlayerConfiguration`;
- `AbilityList`;
- `RotationBuilder`;
- `SimulationControls`;
- `SimulationResults`;
- `Timeline`.

### Etapa 8 — Drag-and-drop

Adicionar ordenação da rotação usando `dnd-kit`.

### Etapa 9 — Persistência

Persistir no navegador:

- rotação;
- ability damage;
- adrenalina inicial.

Usar middleware `persist` do Zustand.

### Etapa 10 — Efeitos avançados

Adicionar nesta ordem:

1. multi-hit;
2. buff temporal;
3. Berserk;
4. bleed;
5. habilidade canalizada.

---

## 14. Testes essenciais

```ts
describe("simulateRotation", () => {
  it("calcula dano direto", () => {});
  it("calcula múltiplos hits", () => {});
  it("impede habilidade durante cooldown", () => {});
  it("impede habilidade sem adrenalina", () => {});
  it("aplica ganho de adrenalina", () => {});
  it("respeita o global cooldown", () => {});
  it("ordena eventos por tick", () => {});
  it("calcula DPS corretamente", () => {});
});
```

---

## 15. Critérios de conclusão do MVP

- [x] o usuário pode informar ability damage;
- [x] o usuário pode informar adrenalina inicial;
- [x] as habilidades são carregadas de JSON;
- [x] o usuário pode adicionar habilidades à rotação;
- [x] o usuário pode reorganizar a rotação;
- [x] o usuário pode remover habilidades;
- [x] o motor valida cooldown;
- [x] o motor valida adrenalina;
- [x] o motor respeita o GCD;
- [x] o motor calcula dano médio;
- [x] o motor processa multi-hit;
- [x] o sistema mostra erros;
- [x] o sistema mostra dano total;
- [x] o sistema mostra DPS;
- [x] o sistema mostra duração;
- [x] o sistema mostra uma timeline;
- [x] a rotação persiste no navegador;
- [x] os testes principais passam.

---

## 16. Evolução após o MVP

### Versão 0.2

- Berserk;
- bleeds;
- canalizadas;
- buffs;
- critical strikes;
- hit cap.

### Versão 0.3

- equipamento;
- nível;
- prayer;
- potion;
- perks;
- relics.

### Versão 0.4

- accuracy;
- damage potential;
- defesa do alvo;
- perfis de bosses.

### Versão 0.5

- treinamento em tempo real;
- keybinds;
- feedback de atraso;
- ghost rotation;
- pontuação.

### Versão 1.0

- Magic;
- Ranged;
- Necromancy;
- compartilhamento de rotações;
- comparação de builds;
- otimizador de rotações.

---

## 17. Primeira meta prática

A primeira entrega deve funcionar com:

- cinco habilidades;
- uma rotação manual;
- ability damage informado;
- adrenalina;
- cooldown;
- GCD;
- dano total;
- DPS;
- timeline.

```text
Selecionar habilidades
        ↓
Montar rotação
        ↓
Informar ability damage
        ↓
Simular
        ↓
Ver dano, DPS e timeline
```

Essa versão já valida a arquitetura central do projeto.
