import { MP, VotingSession, MPHistory, VoteType } from '@/types/parliament';

// src/config/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://flask-api2-4412.onrender.com/';

export const API_ENDPOINTS = {
  GET_DF: `${API_BASE_URL}/api/get_df`,
  GET_PARTIES: `${API_BASE_URL}/api/get_parties`,
  GET_SESSION: `${API_BASE_URL}/api/get_session`,
  GET_HISTORY: `${API_BASE_URL}/api/get_history`,
};

export default API_BASE_URL;

export async function fetchVoteEvents(sessionId: string) {
  try {
    const response = await fetch('https://flask-api2-4412.onrender.com/api/get_df', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    const data = await response.json();

    // 🔥 data คือ array ตรง ๆ
    return data;
  } catch (error) {
    console.error('Error fetching vote events:', error);
    return [];
  }
}

export async function fetchSeatAllocation(sessionId: string) {
  try {
    const response = await fetch('https://flask-api2-4412.onrender.com/api/get_parties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })   // ✔ ส่ง sessionId ให้ backend
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching parties:', error);
    return [];
  }
}

export async function fetchSessions(): Promise<VotingSession[]> {
  try {
    const response = await fetch('https://flask-api2-4412.onrender.com/api/get_session', {
      method: 'GET',
    });
    
    const data = await response.json();
    
    // Sort by date (most recent first)
    return data.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}
const constituencies = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen', 'Nakhon Ratchasima',
  'Songkhla', 'Udon Thani', 'Chonburi', 'Nonthaburi', 'Rayong'
];

const votes: VoteType[] = ['agree', 'disagree', 'abstain'];
// Generate MPs based on seat allocation data returned from fetchSeatAllocation
export async function generateMockMPs(sessionId: string): Promise<MP[]> {
  try {
    const rows = await fetchVoteEvents(sessionId);
    // rows = array จาก df.to_json(orient='records')
    const mps: MP[] = rows.map((row: any, index: number) => ({
      id: String(row.voter_id ?? `mp-${index + 1}`),
      name: row.voter_name ?? `MP ${index + 1}`,
      party: row.voter_party ?? "Unknown",
      vote: (row.vote_category ?? "abstain") as VoteType,

      // เพิ่มข้อมูล mock เล็กน้อย
      constituency: constituencies[index % constituencies.length],
      isProportional: index % 3 === 0,
      seatNumber: index + 1,
    }));

    return mps;
  } catch (error) {
    console.error("Error generating mock MPs:", error);
    return [];
  }
}


// Generate voting data for each session (use real vote counts from fetchSeatAllocation)
export const getVotingDataForSession = async (sessionId: string): Promise<MP[]> => {
  const rows = await fetchVoteEvents(sessionId);

  if (!Array.isArray(rows)) return [];

  const grouped: Record<string, { agree: number; disagree: number; abstain: number; members: any[] }> = {};

  for (const row of rows) {
    const party = row.voter_party ?? "Unknown";

    if (!grouped[party]) {
      grouped[party] = { agree: 0, disagree: 0, abstain: 0, members: [] };
    }

    grouped[party].members.push(row);

    const vote = row.vote_category;
    if (vote === "agree") grouped[party].agree++;
    else if (vote === "disagree") grouped[party].disagree++;
    else grouped[party].abstain++;
  }

  const partyStats = Object.entries(grouped)
    .map(([party, stats]) => ({
      party,
      ...stats,
      total: stats.members.length,
    }))
    .sort((a, b) => b.agree - a.agree);

  const updatedMPs: MP[] = [];

  for (const { party, members } of partyStats) {
    const mpsForParty: MP[] = members.map((row: any, index: number) => ({
      id: String(row.voter_id ?? `${party}-${index + 1}`),
      name: row.voter_name ?? `MP ${party} ${index + 1}`,
      party,
      vote: row.vote_category ?? "abstain",
      vote_category:normalizeVoteOption(row.vote_category) as VoteType,
      // constituency: row.constituency ?? "Unknown",  // ✅ เพิ่มกลับมา
      // isProportional: row.is_proportional ?? false, // ✅ เพิ่มกลับมา
      seatNumber: updatedMPs.length + index + 1,
    }));

    updatedMPs.push(...mpsForParty);
  }

  return updatedMPs;
};


// เพิ่ม function ใหม่สำหรับดึง history
export async function fetchMPHistory(mpId: string) {
  try {
    const response = await fetch('https://flask-api2-4412.onrender.com/api/get_history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mpId })  // ส่ง mpId ไปด้วย (ถ้า backend รองรับ)
    });

    const data = await response.json();
    
    // กรองเฉพาะ MP ที่ต้องการ (กรณี backend ส่งมาทั้งหมด)
    return Array.isArray(data) 
      ? data.filter((row: any) => String(row.voter_id) === String(mpId))
      : [];
      
  } catch (error) {
    console.error('Error fetching MP history:', error);
    return [];
  }
}

// แก้ไข generateMPHistory ให้ใช้ข้อมูลจริง
export const generateMPHistory = async (
  mpId: string,
  sessionId: string
): Promise<MPHistory> => {

  try {
    // 1) ดึงข้อมูล history จริงจาก backend
    const historyData = await fetchMPHistory(mpId);
    
    if (!historyData || historyData.length === 0) {
      return {
        mpId,
        votes: [],
        agreePercentage: 0,
        disagreePercentage: 0,
        abstainPercentage: 0,
        absentPercentage: 0,
        noVotePercentage: 0
      };
    }

    // 2) แปลงข้อมูลเป็น format ที่ต้องการ
    const votes = historyData.map((row: any) => ({
      sessionId: String(row.id || ''),
      billName: row.title || 'Unknown Bill',
      date: row.start_date || '',
      vote: normalizeVoteOption(row.vote_option) as VoteType
    }));
    // 3) นับจำนวนแต่ละประเภท
    const total = votes.length || 1;
    const agreeCount = votes.filter(v => v.vote === 'เห็นด้วย').length;
    const disagreeCount = votes.filter(v => v.vote === 'ไม่เห็นด้วย').length;
    const abstainCount = votes.filter(v => v.vote === 'งดออกเสียง').length;
    const absentCount = votes.filter(v => v.vote === 'ลา/ขาด').length;
    const noVoteCount = votes.filter(v => v.vote === 'ไม่ลงคะแนน').length;
    return {
      mpId,
      votes,
      agreePercentage: Math.round((agreeCount / total) * 100),
      disagreePercentage: Math.round((disagreeCount / total) * 100),
      abstainPercentage: Math.round((abstainCount / total) * 100),
      absentPercentage: Math.round((absentCount / total) * 100),
      noVotePercentage: Math.round((noVoteCount / total) * 100),
    };

  } catch (error) {
    console.error('Error generating MP history:', error);
    return {
      mpId,
      votes: [],
      agreePercentage: 0,
      disagreePercentage: 0,
      abstainPercentage: 0,
      absentPercentage: 0,
      noVotePercentage: 0
    };
  }
};

// Helper function สำหรับแปลง vote_option จาก backend
function normalizeVoteOption(voteOption: string): VoteType {
  const normalized = (voteOption || '').toLowerCase().trim();
  
  // แปลงค่าต่าง ๆ ให้เป็น standard VoteType
  if (normalized.includes('agree') || normalized === 'เห็นด้วย') return 'เห็นด้วย';
  if (normalized.includes('disagree') || normalized === 'ไม่เห็นด้วย') return 'ไม่เห็นด้วย';
  if (normalized.includes('abstain') || normalized === 'งดออกเสียง') return 'งดออกเสียง';
  if (normalized.includes('absent') || normalized === 'ขาด') return 'ลา/ขาด';
  if (normalized.includes('no') && normalized.includes('vote')) return 'ไม่ลงคะแนน';
  
  return 'งดออกเสียง'; // default
}
