export type TDDStatus = 'failed' | 'passed';

export interface GuardrailInput {
  tool: string;
  sessionID: string;
  callID: string;
  args?: any;
}

export interface GuardrailOutput {
  title: string;
  output: string;
  metadata: any;
}
