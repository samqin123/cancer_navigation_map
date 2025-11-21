
import React, { useState, useEffect } from 'react';
import type { JourneyNode, TrackDefinition } from './types';
import { INITIAL_NODES, TRACKS, REGIONAL_NODES, HOSPITAL_NODES } from './constants';

// --- Icons Components (Extracted for performance) ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const QRIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

// --- UI Sub-components ---

const NodeCard = ({ node, onClick, colorClass, bgClass }: { node: JourneyNode; onClick: (n: JourneyNode) => void; colorClass: string; bgClass: string }) => (
  <button 
    onClick={() => onClick(node)}
    className={`group relative flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-lg active:scale-95 w-full md:min-w-[200px] md:w-52 min-h-[110px] ${bgClass} border-opacity-50 hover:border-opacity-100 bg-white`}
    style={{ borderColor: 'currentColor' }}
  >
    <div className={`mb-2 p-1.5 rounded-lg ${colorClass} bg-opacity-10`}>
      <QRIcon />
    </div>
    <h3 className="font-bold text-[15px] text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
      {node.title}
    </h3>
    {node.subtitle && (
      <p className="text-xs text-slate-500 leading-relaxed">
        {node.subtitle}
      </p>
    )}
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
      <UsersIcon />
    </div>
  </button>
);

const TrackSection = ({ track, onNodeClick }: { track: TrackDefinition; onNodeClick: (n: JourneyNode) => void }) => (
  <div className="mb-10 relative">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-1.5 h-6 rounded-full ${track.theme.bg}`}></div>
      <div>
        <h2 className={`text-lg font-bold ${track.theme.text}`}>{track.title}</h2>
        <p className="text-xs text-slate-400 hidden md:block">{track.description}</p>
      </div>
    </div>
    
    {/* Track Line Background (Desktop) */}
    <div className="hidden md:block absolute left-4 right-4 top-[92px] h-0.5 bg-slate-100 -z-10"></div>

    <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 hide-scrollbar md:items-center pr-4">
      {track.nodes.map((node, idx) => (
        <React.Fragment key={node.id}>
          <NodeCard 
            node={node} 
            onClick={onNodeClick} 
            colorClass={track.theme.text}
            bgClass={track.theme.lightBg}
          />
          {idx < track.nodes.length - 1 && (
            <div className="hidden md:block transform translate-x-0">
              <ArrowRight />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Modal = ({ node, onClose }: { node: JourneyNode | null; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  // Index to cycle through multiple admin QRs
  const [adminIndex, setAdminIndex] = useState(0);

  // Reset to first admin when node changes
  useEffect(() => {
    setAdminIndex(0);
    setCopied(false);
  }, [node]);

  if (!node) return null;

  const themeColor = node.category === 'clinical' ? 'bg-blue-600' : 
                     node.category === 'psychological' ? 'bg-rose-500' : 
                     node.category === 'nutrition' ? 'bg-emerald-500' : 
                     node.category === 'molecular' ? 'bg-purple-600' : 
                     node.category === 'complication' ? 'bg-orange-500' : 'bg-slate-600';

  // LOGIC:
  // 1. If node.qrImageUrl exists, show Group QR. Do not show admin QRs.
  // 2. If NO Group QR, show Admin QRs (node.adminQrCodes). Allow cycling if > 1.
  
  const hasGroupQr = Boolean(node.qrImageUrl && node.qrImageUrl.trim() !== '');
  const adminQrList = node.adminQrCodes && node.adminQrCodes.length > 0 ? node.adminQrCodes : [];
  const adminIdList = node.adminWechatIds || [];
  
  // Determine display data based on mode and index
  let qrSrc = '';
  let displayId = node.wechatId;
  let displayLabel = '';

  if (hasGroupQr) {
    qrSrc = node.qrImageUrl!;
    displayLabel = '群名称 / ID';
    displayId = node.wechatId;
  } else if (adminQrList.length > 0) {
    qrSrc = adminQrList[adminIndex];
    // Try to get specific admin ID, fallback to node default if missing
    displayId = adminIdList[adminIndex] || node.wechatId;
    
    if (adminQrList.length > 1) {
      displayLabel = `管理员 (${adminIndex + 1}/${adminQrList.length}) 微信号`;
    } else {
      displayLabel = '管理员微信号';
    }
  } else {
    // Fallback generic QR
    qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WeChat:${node.wechatId}&color=1e293b`;
    displayLabel = '管理员微信号';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextAdmin = () => {
    if (adminQrList.length > 1) {
      setAdminIndex((prev) => (prev + 1) % adminQrList.length);
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-scale-in flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors z-10 backdrop-blur-sm"
        >
          <CloseIcon />
        </button>
        
        <div className={`shrink-0 h-28 ${themeColor} flex items-center justify-center relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
           <h2 className="text-white font-bold text-xl relative z-10 drop-shadow-md">
             {hasGroupQr ? '加入社群' : '联系管理员'}
           </h2>
        </div>
        
        <div className="p-6 text-center -mt-12 relative z-20 overflow-y-auto">
          {/* QR Code Area */}
          <div className="relative inline-block group/qr">
            <div className="bg-white p-3 rounded-2xl shadow-lg inline-block mb-4 relative z-10">
              <div className="w-48 h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 relative">
                  <img 
                    key={qrSrc} // Force re-render on change
                    src={qrSrc} 
                    alt="QR Code" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Error&color=ef4444`;
                    }}
                  />
              </div>
            </div>
            
            {/* Badge indicating current mode */}
            <div className={`absolute -bottom-0 -right-2 z-20 text-[10px] font-bold px-2 py-1 rounded-full shadow-md border-2 border-white ${hasGroupQr ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
              {hasGroupQr ? '群二维码' : (adminQrList.length > 1 ? `管理员 ${adminIndex + 1}` : '管理员')}
            </div>
          </div>
          
          {/* Admin Cycle Button - Only shown if NOT group mode AND multiple admins exist */}
          {!hasGroupQr && adminQrList.length > 1 && (
            <div className="flex justify-center mb-4">
               <button 
                 onClick={handleNextAdmin}
                 className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
               >
                 <RefreshIcon />
                 切换管理员 ({adminIndex + 1}/{adminQrList.length})
               </button>
            </div>
          )}
          
          <h3 className="text-lg font-bold text-slate-800 mb-1">{node.title}</h3>
          <p className="text-sm text-slate-500 mb-6 px-4 leading-tight">{node.description || node.subtitle}</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mx-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">
              {displayLabel}
            </p>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 pl-3 shadow-sm">
              <span className="font-mono text-slate-700 font-medium select-all text-sm truncate mr-2">{displayId}</span>
              <button 
                onClick={handleCopy}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-md transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              >
                {copied ? <span>已复制</span> : <><CopyIcon /> <span>复制</span></>}
              </button>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-slate-400">
            {hasGroupQr 
              ? '请使用微信扫描上方二维码，直接加入互助群' 
              : '当前群组需审核，请添加管理员微信，备注“入群”'}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-blue-100 text-slate-900">
      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200 pt-10 pb-8 px-4 md:px-8 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-4 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            肿瘤患者全病程支持平台
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            癌症患者社群 <span className="text-blue-600">导航地图</span>
          </h1>
          <p className="text-slate-600 max-w-2xl text-sm md:text-base leading-relaxed">
            临床 · 心理 · 营养 三线并行，全程陪伴。
            <br className="hidden md:block"/>
            按诊疗阶段/需求一键直达，扫码入群。
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Initial Entry Points */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-slate-700">初始入口</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_NODES.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all text-left group hover:border-blue-200"
              >
                <div className={`p-3 rounded-xl mr-4 transition-colors ${node.category === 'clinical' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : node.category === 'psychological' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}`}>
                  <UsersIcon />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{node.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{node.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Main Tracks */}
        <section>
           <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-slate-700">全病程支持路径</h3>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            {TRACKS.map(track => (
              <TrackSection key={track.id} track={track} onNodeClick={setSelectedNode} />
            ))}
          </div>
        </section>

        {/* Other Resources Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Groups */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">3</span>
              <h3 className="text-sm font-bold text-slate-700">地域病友分支</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 shadow-sm">
              {REGIONAL_NODES.map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="p-3 text-center rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-100 transition-all group"
                >
                  <span className="text-sm font-bold block mb-1 group-hover:scale-105 transition-transform">{node.title}</span>
                  <span className="text-[10px] text-slate-400 block group-hover:text-blue-400">{node.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Tier Hospital Groups */}
          <div>
             <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold">4</span>
              <h3 className="text-sm font-bold text-slate-700">三甲医院专属群</h3>
            </div>
            <div className="space-y-3">
              {HOSPITAL_NODES.map(node => (
                 <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="w-full flex items-center justify-between p-4 bg-slate-800 text-white rounded-xl shadow-md hover:bg-slate-700 hover:shadow-lg transition-all group border border-slate-700"
                >
                  <div className="flex items-center gap-4">
                     <div className="p-2.5 bg-slate-700 rounded-lg text-blue-300 group-hover:text-white transition-colors"><UsersIcon /></div>
                     <div className="text-left">
                       <h4 className="font-bold text-sm">{node.title}</h4>
                       <p className="text-xs text-slate-400 group-hover:text-slate-300">{node.subtitle}</p>
                     </div>
                  </div>
                  <div className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <ArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer Legend */}
        <footer className="pt-12 border-t border-slate-200 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 临床治疗</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> 基因突变</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 并发症</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 营养管理</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 心理支持</span>
          </div>
          <p className="mt-6 text-slate-400 text-[10px] max-w-md mx-auto leading-relaxed">
            免责声明：本导航仅供信息参考。请在加入群组前仔细核实群主身份。<br/>
            涉及医疗建议请务必遵循主治医生指导。
          </p>
        </footer>

      </main>

      {/* Modal Overlay */}
      {selectedNode && (
        <Modal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}
