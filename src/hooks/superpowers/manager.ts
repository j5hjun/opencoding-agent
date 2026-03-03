import { SuperpowersState, TDDStatus } from './types';

export class SuperpowersManager {
  private states: Map<string, SuperpowersState> = new Map();

  private constructor() {}

  private getOrCreateState(sessionID: string): SuperpowersState {
    let state = this.states.get(sessionID);
    if (!state) {
      state = {
        tddStatus: {},
        approvals: {},
      };
      this.states.set(sessionID, state);
    }
    return state;
  }

  approve(sessionID: string, topic: string): void {
    const state = this.getOrCreateState(sessionID);
    state.approvals[topic] = true;
  }

  isApproved(sessionID: string, topic: string): boolean {
    const state = this.states.get(sessionID);
    return state?.approvals[topic] ?? false;
  }

  markAsFailed(sessionID: string, testPath: string): void {
    const state = this.getOrCreateState(sessionID);
    state.tddStatus[testPath] = 'failed';
  }

  markAsPassed(sessionID: string, testPath: string): void {
    const state = this.getOrCreateState(sessionID);
    state.tddStatus[testPath] = 'passed';
  }

  isFailed(sessionID: string, testPath: string): boolean {
    const state = this.states.get(sessionID);
    return state?.tddStatus[testPath] === 'failed';
  }

  getTDDStatus(sessionID: string, testPath: string): TDDStatus | undefined {
    const state = this.states.get(sessionID);
    return state?.tddStatus[testPath];
  }

  clear(sessionID: string): void {
    this.states.delete(sessionID);
  }

  static readonly instance = new SuperpowersManager();
}

export const superpowersManager = SuperpowersManager.instance;
