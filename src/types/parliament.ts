export type VoteType = 'agree' | 'disagree' | 'abstain' | 'no-vote' | 'absent';

export interface MP {
  id: string;
  name: string;
  party: string;
  // constituency: string;
  // isProportional: boolean;
  vote: VoteType;
  seatNumber: number;
}

export type VotingResult = 'passed' | 'failed' | 'pending' | 'withdrawn';

export interface VotingSession {
  id: string;
  billName: string;
  date: string;
  description: string;
  result: VotingResult;
}

export interface MPHistory {
  mpId: string;
  votes: Array<{
    sessionId: string;
    billName: string;
    date: string;
    vote: VoteType;
  }>;
  agreePercentage: number;
  disagreePercentage: number;
  abstainPercentage: number;
  absentPercentage: number;
  noVotePercentage: number;
}

export type LayoutType = 'semicircle' | 'grid';
