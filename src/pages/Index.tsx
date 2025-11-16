import { useState, useMemo, useEffect } from "react";
import { generateMockMPs, fetchSessions, generateMPHistory, getVotingDataForSession } from "@/data/mockData";
import { MP, LayoutType, VoteType, VotingSession, MPHistory } from "@/types/parliament";
import { Check, X, Minus, UserX, Ban } from "lucide-react";  // ✅ เพิ่ม import
import ParliamentVisualization from "@/components/ParliamentVisualization";
import MPProfileSidebar from "@/components/MPProfileSidebar";
import FilterControls from "@/components/FilterControls";
import VotingSummary from "@/components/VotingSummary";
import VoteBarChart from "@/components/VoteBarChart";
import VoterSearch from "@/components/VoterSearch";
import PartyVoteBreakdown from "@/components/PartyVoteBreakdown";
import { Building2 } from "lucide-react";

const Index = () => {
  // ✅ State สำหรับ sessions (โหลดจาก API)
  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  
  // ✅ State สำหรับจัดการข้อมูลแบบ async
  const [currentMPs, setCurrentMPs] = useState<MP[]>([]);
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<VoteType[]>([]);
  const [selectedMPsForSearch, setSelectedMPsForSearch] = useState<MP[]>([]);
  const [layout, setLayout] = useState<LayoutType>("semicircle");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [highlightedMP, setHighlightedMP] = useState<MP | null>(null);
  const [voteFilterFromChart, setVoteFilterFromChart] = useState<string | null>(null);
  const [mpHistory, setMpHistory] = useState<MPHistory | null>(null);

  // ✅ โหลด sessions จาก API เมื่อ component mount
  useEffect(() => {
    (async () => {
      setIsLoadingSessions(true);
      const fetchedSessions = await fetchSessions();
      setSessions(fetchedSessions);
      
      // ตั้งค่า session แรกเป็น default
      if (fetchedSessions.length > 0) {
        setCurrentSessionId(fetchedSessions[0].id);
      }
      
      setIsLoadingSessions(false);
    })();
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // ✅ โหลด voting data ใหม่ทุกครั้งที่ session เปลี่ยน
  useEffect(() => {
    if (!currentSessionId) return;
    
    (async () => {
      const voteData = await getVotingDataForSession(currentSessionId);
      setCurrentMPs(voteData);
    })();
  }, [currentSessionId]);

  // ✅ โหลด MP history เมื่อเลือก MP
  useEffect(() => {
    if (!selectedMP || !currentSessionId) {
      setMpHistory(null);
      return;
    }

    (async () => {
      const history = await generateMPHistory(selectedMP.id, currentSessionId);
      setMpHistory(history);
    })();
  }, [selectedMP, currentSessionId]);

  const parties = Array.from(new Set(currentMPs.map((mp) => mp.party)));

  // Filter MPs for vote distribution based on selected parties
  const filteredMPsForChart = useMemo(() => {
    if (selectedParties.length === 0) return currentMPs;
    return currentMPs.filter((mp) => selectedParties.includes(mp.party));
  }, [currentMPs, selectedParties]);

  // Sync vote filter from chart with main vote filter
  const handleVoteFilterFromChart = (voteType: string | null) => {
    setVoteFilterFromChart(voteType);
    if (voteType) {
      setSelectedVotes([voteType as VoteType]);
    } else {
      setSelectedVotes([]);
    }
  };

  const handleMPClick = (mp: MP) => {
    setSelectedMP(mp);
    setSidebarOpen(true);
  };

  const currentSessionIndex = sessions.findIndex((s) => s.id === currentSessionId);

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionId(sessions[currentSessionIndex - 1].id);
    }
  };

  const handleNextSession = () => {
    if (currentSessionIndex < sessions.length - 1) {
      setCurrentSessionId(sessions[currentSessionIndex + 1].id);
    }
  };

  // ✅ แสดง loading state ระหว่างโหลด sessions
  if (isLoadingSessions) {
    return (
      <div className="min-h-screen h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // ✅ แสดงข้อความถ้าไม่มี sessions
  if (sessions.length === 0) {
    return (
      <div className="min-h-screen h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">ไม่พบข้อมูลการประชุม</h2>
          <p className="text-muted-foreground">กรุณาตรวจสอบการเชื่อมต่อกับ API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      <header className="border-b bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Parliament Voting Visualization</h1>
              <p className="text-sm text-muted-foreground">Thailand House of Representatives</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Sidebar */}
          <div className="w-[350px] border-r bg-card overflow-y-auto flex-shrink-0">
            <div className="p-4 space-y-4">
              <VotingSummary
                mps={currentMPs}
                sessions={sessions}
                currentSession={currentSession}
                onSessionChange={setCurrentSessionId}
                onPreviousSession={handlePreviousSession}
                onNextSession={handleNextSession}
                canGoPrevious={currentSessionIndex > 0}
                canGoNext={currentSessionIndex < sessions.length - 1}
              />

              <div className="space-y-4">
                <FilterControls
                  parties={parties}
                  selectedParties={selectedParties}
                  selectedVotes={selectedVotes}
                  layout={layout}
                  onPartiesChange={setSelectedParties}
                  onVotesChange={setSelectedVotes}
                  onLayoutChange={setLayout}
                />

                <VoterSearch
                  mps={currentMPs}
                  selectedMPs={selectedMPsForSearch}
                  onMPsChange={setSelectedMPsForSearch}
                />
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-auto">
              <div className="h-full flex flex-col gap-4">
                {/* 20% - Vote Distribution */}
                <div className="flex-[0.2] overflow-hidden">
                  <VoteBarChart
                    mps={filteredMPsForChart}
                    orientation="horizontal"
                    selectedVoteFilter={voteFilterFromChart}
                    onVoteClick={handleVoteFilterFromChart}
                  />
                </div>

                {/* 70% - Parliament Visualization */}
                <div className="flex-[0.7] bg-card rounded-lg border shadow-sm overflow-hidden">
                  <ParliamentVisualization
                    mps={currentMPs}
                    layout={layout}
                    onMPClick={handleMPClick}
                    filterParty={selectedParties}
                    filterVote={selectedVotes}
                    highlightedMPId={highlightedMP?.id}
                    highlightedMPIds={selectedMPsForSearch.map((mp) => mp.id)}
                  />
                </div>

                {/* 10% - Explanation */}
                <div className="flex-[0.1] overflow-auto">
                  <div className="text-center text-sm text-muted-foreground space-y-3">
                    <p className="font-medium">
                      คลิกที่จุดเพื่อดูประวัติการโหวตของ สส. • สีของจุดแสดงพรรคการเมือง • ไอคอนแสดงการโหวต
                    </p>
                    
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                      {/* เห็นด้วย */}
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium">เห็นด้วย</span>
                      </div>

                      {/* ไม่เห็นด้วย */}
                      <div className="flex items-center gap-2">
                        <X className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium">ไม่เห็นด้วย</span>
                      </div>

                      {/* งดออกเสียง */}
                      <div className="flex items-center gap-2">
                        <Minus className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium">งดออกเสียง</span>
                      </div>

                      {/* ลา/ขาด */}
                      <div className="flex items-center gap-2">
                        <UserX className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium">ลา/ขาด</span>
                      </div>

                      {/* ไม่ลงคะแนน */}
                      <div className="flex items-center gap-2">
                        <Ban className="w-5 h-5 text-gray-700" />
                        <span className="text-xs font-medium">ไม่ลงคะแนน</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[350px] border-l bg-card flex-shrink-0">
            <PartyVoteBreakdown mps={currentMPs} />
          </div>
        </div>
      </main>

      <MPProfileSidebar 
        mp={selectedMP} 
        history={mpHistory} 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
};

export default Index;