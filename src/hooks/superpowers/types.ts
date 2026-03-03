export type TDDStatus = 'failed' | 'passed';

export interface SuperpowersState {
  tddStatus: Record<string, TDDStatus>;
  approvals: Record<string, boolean>;
}

export interface HookContext<TArgs = unknown, TResult = unknown> {
  toolName: string;
  args: TArgs;
  result?: TResult;
  error?: unknown;
}
