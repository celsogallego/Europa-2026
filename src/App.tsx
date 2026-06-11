import { useState, useEffect, FormEvent } from "react";
import { 
  ArrowRight, 
  ArrowUpRight,
  Code, 
  ExternalLink, 
  Globe, 
  Layers, 
  Layout, 
  Mail, 
  Menu, 
  Sparkles, 
  Upload, 
  X,
  Calendar,
  Users,
  Plane,
  Train,
  Hotel,
  DollarSign,
  MapPin,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  RefreshCw,
  Plus,
  AlertCircle,
  Eye,
  Check,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface BudgetCategory {
  id: string;
  category: string;
  specification: string;
  valueEUR: number;
  isCustom?: boolean;
}

// Initial Budget Items directly from Document
const INITIAL_BUDGET: BudgetCategory[] = [
  {
    id: "cat-1",
    category: "Passagens Aéreas Internacionais",
    specification: "Voo Direto de Ida e Volta (GRU ➔ FCO ➔ GRU) com franquia de bagagem",
    valueEUR: 2300.00
  },
  {
    id: "cat-2",
    category: "Alojamento (Hotéis Escolhidos)",
    specification: "15 Noites calculadas de acordo com as propriedades selecionadas",
    valueEUR: 1892.00
  },
  {
    id: "cat-3",
    category: "Comboios de Alta Velocidade + Passes",
    specification: "Todos os bilhetes Frecciarossa/EuroCity + Swiss Travel Pass (4 Dias) + TGV Lyria",
    valueEUR: 1350.00
  },
  {
    id: "cat-4",
    category: "Transporte Urbano e Marítimo",
    specification: "Ferries na Costa Amalfitana, bilhetes de metro nas capitais e transfers pontuais",
    valueEUR: 300.00
  },
  {
    id: "cat-5",
    category: "Alimentação (Média / Alta)",
    specification: "Almoços práticos diários e jantares completos em ótimos restaurantes (€130/dia)",
    valueEUR: 2080.00
  },
  {
    id: "cat-6",
    category: "Ingressos e Passeios Culturais",
    specification: "Coliseu/Vaticano, Duomo de Milão, Jungfraujoch, Louvre, Versalhes e Torre Eiffel",
    valueEUR: 600.00
  },
  {
    id: "cat-7",
    category: "Seguros e Conectividade",
    specification: "Seguro Viagem Obrigatório Schengen (alta cobertura) + 2 eSIMs de dados",
    valueEUR: 180.00
  }
];

// Fallback high-res pictures in case they are not loaded locally
const TRAVEL_PHOTOS: Record<string, string[]> = {
  "trecho-1": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800", // Colosseum
    "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=800", // Pantheon
    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800", // Trastevere
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"  // Spa Hotel pool
  ],
  "trecho-2": [
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800", // Positano
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800", // Amalfi Coast
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800", // Terrace
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"  // Sorrento resort
  ],
  "trecho-3": [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800", // Alps
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800", // Lake Brienz
    "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800", // Grindelwald
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800"  // Alpine Room
  ],
  "trecho-4": [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800", // Eiffel
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800", // Louvre Cafe
    "https://images.unsplash.com/photo-1550130806-03f47e30777a?q=80&w=800", // Versailles
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"  // Executive suite
  ],
  "trecho-5": [
    "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=800", // Duomo Milano
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800", // Galleria
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800", // Navigli channels
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800"  // Trendy Milano bar
  ],
  "trecho-7": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800", // Colosseum
    "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=800", // Pantheon
    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800", // Trastevere
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"  // Spa Hotel pool
  ]
};

// Map of Local Filenames corresponding to what's in Word
const LOCAL_IMAGE_PATHS: Record<string, string[]> = {
  "trecho-1": [
    "/images/image001.jpg",
    "/images/image002.jpg",
    "/images/image003.jpg",
    "/images/image004.jpg"
  ],
  "trecho-2": [
    "/images/image005.jpg",
    "/images/image006.jpg",
    "/images/image007.jpg",
    "/images/image008.jpg"
  ],
  "trecho-3": [
    "/images/image009.jpg",
    "/images/image010.jpg",
    "/images/image011.jpg",
    "/images/image012.jpg"
  ],
  "trecho-4": [
    "/images/image013.jpg",
    "/images/image014.jpg",
    "/images/image015.jpg",
    "/images/image016.jpg"
  ],
  "trecho-5": [
    "/images/image017.jpg",
    "/images/image018.jpg",
    "/images/image019.jpg",
    "/images/image020.jpg"
  ],
  "trecho-7": [
    "/images/image001.jpg",
    "/images/image002.jpg",
    "/images/image003.jpg",
    "/images/image004.jpg"
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"viagem" | "roteiro" | "custos">("viagem");
  const [activeTrecho, setActiveTrecho] = useState<string>("trecho-1");
  const [showHowToUpload, setShowHowToUpload] = useState<boolean>(false);
  const [useLocalImages, setUseLocalImages] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // Editable state with localStorage persistence
  const [budget, setBudget] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem("eu_itinerary_costs");
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  const [exchangeRate, setExchangeRate] = useState<number>(6.20);

  // New cost item form
  const [newItem, setNewItem] = useState({ category: "", specification: "", valueEUR: "" });
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);

  // Persist edits
  useEffect(() => {
    localStorage.setItem("eu_itinerary_costs", JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("eu_itinerary_rate", exchangeRate.toString());
  }, [exchangeRate]);

  // Scroll to active segment title when active segment changes (both mobile and desktop)
  useEffect(() => {
    const element = document.getElementById("active-trecho-header");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTrecho]);

  // Calculations
  const totalEUR = budget.reduce((acc, curr) => acc + curr.valueEUR, 0);
  const totalBRL = totalEUR * exchangeRate;

  // Edit budget item inline
  const handleBudgetChange = (id: string, value: string) => {
    const normalized = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    const numeric = parseFloat(normalized) || 0;
    setBudget(prev => prev.map(item => item.id === id ? { ...item, valueEUR: numeric } : item));
  };

  // Add custom fee
  const handleAddCostItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.category || !newItem.valueEUR) return;
    const item: BudgetCategory = {
      id: `custom-${Date.now()}`,
      category: newItem.category,
      specification: newItem.specification || "Despesa personalizada inserida localmente",
      valueEUR: parseFloat(newItem.valueEUR) || 0,
      isCustom: true
    };
    setBudget(prev => [...prev, item]);
    setNewItem({ category: "", specification: "", valueEUR: "" });
    setIsAddingItem(false);
  };

  // Remove custom fee
  const handleRemoveCostItem = (id: string) => {
    setBudget(prev => prev.filter(item => item.id !== id));
  };

  // Reset Budget
  const handleResetBudget = () => {
    setBudget(INITIAL_BUDGET);
    setExchangeRate(6.20);
  };



  // Travel stages data
  const stages = [
    {
      id: "trecho-1",
      title: "Roma",
      days: "Dias 1 a 3",
      subtitle: "Aterrar e Absorver a Cidade Eterna",
      desc: "Desembarque no Aeroporto de Fiumicino (FCO) num voo direto vindo de Guarulhos. Transfer até ao hotel para check-in e descanso. Nos dias subsequentes, desfrutem do circuito histórico clássico: Coliseu, Fórum Romano, Pantheon, Fontana di Trevi, Piazza Navona e um dia integral dedicado aos tesouros do Vaticano (Museus e Basílica de São Pedro). Jantares focados na boémia romântica de Trastevere.",
      hotel: "Mercure Roma West (4★)",
      hotelDesc: "Propriedade moderna e sofisticada. Dispõe de excelentes quartos e uma elogiada área de bem-estar com spa e piscina coberta, ideal para repor as energias pós-voo.",
      hotelLink: "https://www.google.com/travel/search?q=Mercure+Roma+West&qs=MhRDZ3NJbk1INTVZS3JnS2UtQVJBQg&ts=CAESABoWEhQSEgoHCOoPEAoYDBIHCOoPEAoYDyoHCgU6A0JSTA",
      hasGallery: true
    },
    {
      id: "trecho-2",
      title: "Costa Amalfitana",
      days: "Dias 4 a 6",
      subtitle: "O Romance Mediterrânico",
      desc: "Embarque na estação Roma Termini no comboio de alta velocidade Frecciarossa direto para Salerno (apenas 1h30). De Salerno, transfer ou ferry cénico para a base em Sorrento. Dias dedicados a explorar as falésias e ruelas de Positano e Amalfi, contemplar os jardins suspensos de Ravello e realizar o icónico passeio marítimo à Ilha de Capri.",
      hotel: "Hotel Florida Sorrento (3★)",
      hotelDesc: "Hotel de gerência familiar altamente charmoso, rodeado por plantações de laranjeiras e limoeiros. Oferece piscina exterior, atendimento caloroso e atmosfera perfeitamente costeira.",
      hotelLink: "https://www.google.com/travel/search?q=Hotel+Florida+Sorrento&qs=MhRDZ3NJekxDYWtOX29tTFBOQVJBQg&ts=CAESABoWEhQSEgoHCOoPEAoYDxIHCOoPEAoYEioHCgU6A0JSTA",
      hasGallery: true
    },
    {
      id: "trecho-3",
      title: "Suíça",
      days: "Dias 7 a 9",
      subtitle: "A Majestade dos Alpes Berneses",
      desc: "Deslocamento ferroviário cénico cruzando a fronteira em direção aos Alpes. A composição do EuroCity rasga as montanhas até Interlaken (aprox. 7h30 com restaurante a bordo). Utilização do Swiss Travel Pass para subir ao lendário Jungfraujoch (3.454 metros de altitude), caminhar na passarela suspensa de Grindelwald First e fotografar as cachoeiras de Lauterbrunnen.",
      hotel: "Hotel Brienzersee (3★)",
      hotelDesc: "Localizado estrategicamente nas margens do Lago de Brienz. Garante ao casal uma vista extraordinária e direta das águas azul-turquesa e picos alpinos logo ao abrir a janela.",
      hotelLink: "https://www.google.com/travel/search?q=Hotel+Brienzersee&qs=MhRDZ3NJbnRyXzBvUEI2STNxQVJBQg&ts=CAESABoWEhQSEgoHCOoPEAoYEhIHCOoPEAoYFSoHCgU6A0JSTA",
      hasGallery: true
    },
    {
      id: "trecho-4",
      title: "Paris",
      days: "Dias 10 a 13",
      subtitle: "Arte, Cultura e Elegância Urbana",
      desc: "Viagem a bordo do comboio de alta velocidade TGV Lyria ligando os Alpes diretamente a Paris (Gare de Lyon) in 4h30. Quatro dias dedicados à Cidade Luz: subida à Torre Eiffel ao anoitecer, visitas agendadas ao Museu do Louvre e d'Orsay, caminhadas românticas por Montmartre (Sacré-Cœur), cruzeiro noturno no Sena e um dia de bate-volta de RER até ao Palácio de Versalhes.",
      hotel: "Hotel Mercure Paris La Defense (4★)",
      hotelDesc: "Hotel moderno com quartos substancialmente mais amplos e confortáveis do que a média dos hotéis centrais de Paris. Apresenta uma estrutura impecável e um sofisticado wine bar.",
      hotelLink: "https://www.google.com/travel/search?q=Hotel+Mercure+Paris+La+Defense&qs=MhRDZ3NJbHBDSnRfZjFwOW5aQVJBQg&ts=CAESABoWEhQSEgoHCOoPEAoYFRIHCOoPEAoYGSoHCgU6A0JSTA",
      hasGallery: true
    },
    {
      id: "trecho-5",
      title: "Paris ➔ Milão",
      days: "Dia 14",
      subtitle: "O Stopover de Charme e Gastronomia",
      desc: "Embarque no comboio rápido que faz o trajeto de regresso a Itália (7h). Aproveitem a viagem para relaxar, ler e apreciar a mudança de paisagem. Chegada ao final da tarde a Milão, mesmo a tempo de um fantástico jantar romântico à beira dos canais históricos na animada zona de Navigli.",
      hotel: "Combo, Milano (3★)",
      hotelDesc: "Um espaço de hotelaria e design inovador localizado em Navigli. Oferece quartos privados excelentes, muito confortáveis e um pátio interno com bar super charmoso.",
      hotelLink: "https://www.google.com/travel/search?q=Combo,+Milano&qs=MhRDZ29JbEpPeTQtNkUtWUpYRUFF&ts=CAESABoWEhQSEgoHCOoPEAoYGRIHCOoPEAoYGioHCgU6A0JSTA",
      hasGallery: true
    },
    {
      id: "trecho-6",
      title: "Milão ➔ Roma",
      days: "Dia 15",
      subtitle: "Fecho Estratégico com Risco Zero",
      desc: "Manhã livre para visitar a imponente Catedral de Milão (Duomo), subindo aos terraços de mármore, e passear pela luxuosa Galleria Vittorio Emanuele II. Após o almoço, embarque final no Frecciarossa direto para Roma Termini (3h). Última noite em Roma reservada como margem de segurança definitiva antes do voo internacional.",
      hotel: "Hospedagem de Retorno em Roma",
      hotelDesc: "Pernoite estratégica próxima a Roma Termini para check-out matinal tranquilo sem stress de atrasos.",
      hotelLink: "#",
      hasGallery: false
    },
    {
      id: "trecho-7",
      title: "Roma ➔ Brasil",
      days: "Dia 16",
      subtitle: "Retorno Internacional",
      desc: "Deslocamento ao Aeroporto de Fiumicino (FCO) e embarque no voo direto de regresso a Guarulhos (GRU) na tranquilidade de um percurso planejado.",
      hotel: "Voo Direto FCO ➔ GRU",
      hotelDesc: "Término de uma das viagens mais inesquecíveis da Europa.",
      hotelLink: "#",
      hasGallery: true
    }
  ];

  return (
    <div id="viagem-app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden pb-12">
      
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-[120px]" />
        <div className="absolute top-[15%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-transparent blur-[100px]" />
      </div>

      {/* Modern Fixed Header (Sleek Dark Theme) */}
      <header id="custom-fixed-header" className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900/80 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg border border-amber-300/20">
              CV
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg tracking-tight text-white leading-none">Roteiro Europa 2026</h1>
              <p className="text-[10px] uppercase font-mono tracking-widest text-amber-500/80 mt-1">Roteiro de Viagem Oficial</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
            <button
              onClick={() => setActiveTab("viagem")}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer ${
                activeTab === "viagem" 
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-md" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Resumo Geral
            </button>
            <button
              onClick={() => setActiveTab("roteiro")}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer ${
                activeTab === "roteiro" 
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-md" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Diário (Trechos)
            </button>
            <button
              onClick={() => setActiveTab("custos")}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer ${
                activeTab === "custos" 
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-md" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Simulador de Custos
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">

        {/* Global stats alert box */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">Roteiro de Viagem • Celso Gallego & Namorada</p>
              <p className="text-sm font-semibold text-white">Outubro a Novembro de 2026 • 16 Dias / 15 Noites</p>
            </div>
          </div>
          <div className="flex items-center gap-6 divide-x divide-slate-800">
            <div className="px-3">
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wide">Orçamento Total</p>
              <p className="text-sm font-bold text-amber-400">€ {totalEUR.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="pl-6 pr-3">
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wide">Est. em Reais (1€ = R$ {exchangeRate.toFixed(2)})</p>
              <p className="text-sm font-bold text-emerald-400">R$ {totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Tab 1: Resumo Geral */}
        {activeTab === "viagem" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Vantagens de Rota */}
              <div className="md:col-span-2 border border-slate-900 bg-slate-900/20 backdrop-blur-sm p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-semibold uppercase">Engenharia Logística</span>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-display font-medium text-white mb-4">
                    Por que esta rota é extraordinariamente inteligente?
                  </h3>
                  
                  <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                    <p>
                      Este planeamento foi desenvolvido sob medida para aliar a excelente eficiência económica de passagens aéreas de ida e volta focadas num único <strong className="text-amber-400 font-medium">hub (Roma)</strong> ao charme inigualável de uma jornada puramente ferroviária.
                    </p>
                    <p>
                      A prevenção do uso do automóvel neste circuito protege o casal do stresse de trânsito urbano, escassez severa de estacionamentos e multas em Zonas de Tráfego Limitado (ZTL).
                    </p>
                    <p>
                      O itinerário desenha um fluxo contínuo em formato <strong className="text-amber-400 font-medium">circular</strong>. Para mitigar o desgaste físico de um regresso longo vindo de Paris, posicionámos Milão como uma paragem estratégica de uma noite. Esta abordagem transforma o tempo de trânsito numa nova experiência gastronómica e garante risco zero em relação ao voo de volta ao Brasil.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-mono">Sem Carros • Sem Estresse • 100% Trilhos</div>
                  <button 
                    onClick={() => setActiveTab("roteiro")}
                    className="text-xs font-semibold text-amber-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Ver Linha de Tempo <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Perfil da Viagem */}
              <div className="border border-slate-900 bg-slate-900/20 backdrop-blur-sm p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4">Perfil do Casal</h3>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Viajantes</p>
                        <p className="text-sm font-medium text-white">Celso Gallego & Namorada</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Voos Internacionais Directos</p>
                        <p className="text-sm font-medium text-white">GRU ➔ FCO ➔ GRU (Roma)</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Transporte Continental</p>
                        <p className="text-sm font-medium text-white">100% Comboio de Alta Velocidade</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                        <Hotel className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Perfil de Alojamento</p>
                        <p className="text-sm font-medium text-white">Padrão Conforto Executivo (3 e 4★)</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900/60">
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-500/90 font-mono">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Estilo Alimentação Média/Alta</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfólio de Hotéis (Full width grid) */}
            <div className="border border-slate-900 p-6 rounded-3xl bg-slate-900/10">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-white mb-1">Portfólio de Hotéis</h3>
                <p className="text-xs text-slate-500 font-mono">Hotéis Escolhidos Oficiais</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">ROMA</span>
                    <p className="text-xs font-semibold text-white mt-1">Mercure Roma West (4★)</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Spa requintado & piscina interna inclusa</p>
                </div>
                <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">SORRENTO / AMALFI</span>
                    <p className="text-xs font-semibold text-white mt-1">Hotel Florida (3★)</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Laranjeiras aromáticas & piscina exterior</p>
                </div>
                <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">ALPES SUÍÇOS</span>
                    <p className="text-xs font-semibold text-white mt-1">Hotel Brienzersee (3★)</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Vista direta para o lago turquesa</p>
                </div>
                <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">PARIS</span>
                    <p className="text-xs font-semibold text-white mt-1">Mercure Paris La Defense (4★)</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Amplos quartos & excelente Wine Bar</p>
                </div>
                <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-xl hover:border-slate-800 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">MILÃO</span>
                    <p className="text-xs font-semibold text-white mt-1">Combo Milano (3★)</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Quartos novos com bar pátio super charmoso</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Diário (Roteiro) */}
        {activeTab === "roteiro" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Horizontal Sub-Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-900 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">Roteiro Diário</span>
                <span className="text-[10px] text-slate-500">| Escolha o Trecho abaixo para detalhes</span>
              </div>
            </div>

            {/* Trechos Selector Bar */}
            <div className="flex flex-col md:flex-row gap-2 pb-2 md:pb-0 overflow-y-visible md:overflow-x-auto scrollbar-none">
              {stages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setActiveTrecho(stage.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-tight whitespace-nowrap transition-all shrink-0 cursor-pointer text-left md:text-center ${
                    activeTrecho === stage.id 
                      ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-md font-semibold" 
                      : "bg-slate-900/30 text-slate-400 border border-slate-900/60 hover:text-white"
                  }`}
                >
                  {stage.title} <span className="text-[10px] font-mono text-slate-500 ml-1">({stage.days})</span>
                </button>
              ))}
            </div>

            {/* Active Trecho details layout */}
            {stages.map(stage => {
              if (stage.id !== activeTrecho) return null;
              
              // Use local image paths from uploaded files
              const images = LOCAL_IMAGE_PATHS[stage.id] || [];

              return (
                <div key={stage.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Itinerary Story Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <div id="active-trecho-header" className="space-y-2 scroll-mt-24">
                      <span className="text-xs uppercase font-mono tracking-widest text-amber-500">{stage.days}</span>
                      <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">{stage.title}</h2>
                      <p className="text-sm text-slate-400 italic">"{stage.subtitle}"</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4">
                      <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400">Atividades e Logística</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{stage.desc}</p>
                    </div>

                    {/* Hotel Details card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/20 border border-slate-900 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-400">Alojamento Recomendado</span>
                          <h4 className="text-base font-semibold text-white mt-1 flex items-center gap-1.5">
                            <Hotel className="w-4 h-4 text-amber-400" />
                            {stage.hotel}
                          </h4>
                        </div>
                        {stage.hotelLink !== "#" && (
                          <a 
                            href={stage.hotelLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-[10px] text-amber-400 transition-all font-semibold flex items-center gap-1 shrink-0"
                          >
                            Site Oficial <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed">{stage.hotelDesc}</p>
                    </div>

                  </div>

                  {/* Photo Gallery Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-medium">Galeria Ilustrada</h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        Fotos do Roteiro
                      </span>
                    </div>

                    {images.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {images.map((img, i) => (
                          <div 
                            key={i} 
                            className="group relative rounded-xl border border-slate-900 overflow-hidden bg-slate-950 aspect-[4/3] shadow-md hover:border-slate-800 transition-colors"
                          >
                            <img 
                              src={img} 
                              alt={`${stage.title} view ${i + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-[9px] font-mono text-slate-300 font-medium">Foto {i + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs font-medium">Nenhuma foto encontrada para este trecho final.</p>
                        <p className="text-[10px] text-slate-600">Este trecho compreende noites de trânsito ou retorno internacional direto.</p>
                      </div>
                    )}

                  </div>

                  {/* Navigation assistance buttons (After images - Unified for both mobile & desktop) */}
                  <div className="col-span-1 lg:col-span-12 flex items-center justify-between pt-6 border-t border-slate-900/60 mt-4 w-full">
                    <button
                      onClick={() => {
                        const idx = stages.findIndex(s => s.id === stage.id);
                        if (idx > 0) setActiveTrecho(stages[idx - 1].id);
                      }}
                      disabled={stages.findIndex(s => s.id === stage.id) === 0}
                      className="px-4 py-2 hover:bg-slate-900 border border-slate-900 rounded-xl text-xs font-semibold tracking-tight disabled:opacity-20 flex items-center gap-1.5 transition-all text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    
                    <button
                      onClick={() => {
                        const idx = stages.findIndex(s => s.id === stage.id);
                        if (idx < stages.length - 1) setActiveTrecho(stages[idx + 1].id);
                      }}
                      disabled={stages.findIndex(s => s.id === stage.id) === stages.length - 1}
                      className="px-4 py-2 hover:bg-slate-900 border border-slate-900 rounded-xl text-xs font-semibold tracking-tight disabled:opacity-20 flex items-center gap-1.5 transition-all text-slate-400 hover:text-white cursor-pointer"
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </motion.div>
        )}

        {/* Tab 3: Simulador de Custos */}
        {activeTab === "custos" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Interactive Controller box for exchange rate */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Simulador Cambial e Ajustes
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ajuste a cotação do Euro hoje para simular o preço estimado do orçamento completo para o casal em Reais Brasileiros (BRL).
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto">
                  <div className="space-y-1.5 flex-1 lg:flex-none">
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Taxa Cambial (1€ = BRL)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="2.00" 
                        max="20.00" 
                        step="0.05"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                        className="accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <input
                        type="number"
                        min="2"
                        max="20"
                        step="0.01"
                        value={exchangeRate.toFixed(2)}
                        onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                        className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-amber-400 text-center font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleResetBudget}
                    className="p-2 sm:px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Resetar Originais</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editable Spreadsheet styled table */}
            <div className="border border-slate-900 rounded-3xl bg-slate-900/10 overflow-hidden">
              <div className="p-4 bg-slate-900/30 border-b border-slate-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400">Consolidação Orçamental do Casal</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Clique diretamente no campo Valor (EUR) para editar qualquer tarifa e simular cenários</p>
                </div>
                <button
                  onClick={() => setIsAddingItem(!isAddingItem)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Despesa
                </button>
              </div>

              {/* Add budget item drawer */}
              <AnimatePresence>
                {isAddingItem && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddCostItem}
                    className="p-6 bg-slate-900/60 border-b border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Categoria</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Passeio e Jantares em Capri"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Especificações / Descrição</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Entrada na Gruta Azul + almoço especial"
                        value={newItem.specification}
                        onChange={(e) => setNewItem({ ...newItem, specification: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Custo Total (EUR)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="Ex: 250"
                          value={newItem.valueEUR}
                          onChange={(e) => setNewItem({ ...newItem, valueEUR: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        Salvar
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Table rendering - Desktop Table vs Mobile Cards */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-900">
                      <th className="p-4 pl-6">Categoria</th>
                      <th className="p-4">Especificação do Serviço</th>
                      <th className="p-4 text-right">Valor (EUR)</th>
                      <th className="p-4 text-right pr-6">Valor (BRL)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-xs">
                    {budget.map(item => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-900/40 transition-colors ${item.isCustom ? "bg-amber-500/5" : ""}`}
                      >
                        <td className="p-4 pl-6 font-semibold text-slate-200">
                          <div className="flex items-center gap-2">
                            {item.isCustom && <span className="p-0.5 px-1.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-semibold uppercase font-mono scale-90">Custom</span>}
                            <span>{item.category}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">
                          <div className="flex items-center justify-between gap-4">
                            <span>{item.specification}</span>
                            {item.isCustom && (
                              <button
                                onClick={() => handleRemoveCostItem(item.id)}
                                className="text-[10px] text-red-400 hover:text-red-350 hover:underline font-mono cursor-pointer shrink-0"
                              >
                                Excluir
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center justify-end bg-slate-950/60 border border-slate-900/80 rounded px-2 py-1 font-mono">
                            <input 
                              type="text"
                              value={editingId === item.id ? editingValue : item.valueEUR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              onFocus={() => {
                                setEditingId(item.id);
                                setEditingValue(item.valueEUR === 0 ? "" : item.valueEUR.toString());
                              }}
                              onBlur={() => {
                                handleBudgetChange(item.id, editingValue);
                                setEditingId(null);
                              }}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="w-20 bg-transparent text-right text-slate-100 font-semibold focus:outline-none focus:text-amber-400"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right pr-6 font-mono font-medium text-emerald-400">
                          {(item.valueEUR * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}

                    {/* Grand Total Row */}
                    <tr className="bg-amber-500/10 border-t-2 border-slate-900 border-b-2 font-semibold">
                      <td className="p-4 pl-6 font-bold text-white text-sm" colSpan={2}>
                        TOTAL CONSOLIDADO (Casal)
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-amber-400 text-sm">
                        {totalEUR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right pr-6 font-mono font-bold text-emerald-400 text-sm">
                        {totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View (No Horizontal Scroll) */}
              <div className="block md:hidden p-4 space-y-4">
                {budget.map(item => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-2xl border border-slate-900/80 bg-slate-950/25 space-y-3 ${item.isCustom ? "border-amber-500/30 bg-amber-500/5" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isCustom && <span className="p-0.5 px-1.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-semibold uppercase font-mono">Custom</span>}
                          <span className="font-semibold text-slate-200 text-xs leading-tight">{item.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{item.specification}</p>
                      </div>
                      
                      {item.isCustom && (
                        <button
                          onClick={() => handleRemoveCostItem(item.id)}
                          className="text-[10px] text-red-400 hover:text-red-355 bg-red-500/10 px-2 py-1 rounded font-mono cursor-pointer shrink-0"
                        >
                          Excluir
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col justify-center">
                        <span className="text-[9px] uppercase font-mono text-slate-500 mb-0.5">Euro (EUR)</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] text-slate-400">€</span>
                          <input 
                            type="text"
                            value={editingId === item.id ? editingValue : item.valueEUR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            onFocus={() => {
                              setEditingId(item.id);
                              setEditingValue(item.valueEUR === 0 ? "" : item.valueEUR.toString());
                            }}
                            onBlur={() => {
                              handleBudgetChange(item.id, editingValue);
                              setEditingId(null);
                            }}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-transparent text-slate-100 font-semibold text-xs font-mono w-full focus:outline-none focus:text-amber-400"
                          />
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col justify-center">
                        <span className="text-[9px] uppercase font-mono text-slate-500 mb-0.5">Real (BRL)</span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">
                          R$ {(item.valueEUR * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Grand Total Card on Mobile */}
                <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl p-4 space-y-3.5">
                  <div className="text-xs uppercase font-bold text-center text-white tracking-wide">
                    TOTAL CONSOLIDADO (Casal)
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-900">
                      <span className="text-[9px] text-slate-500 block uppercase mb-0.5">Total Euro</span>
                      <span className="text-xs font-bold text-amber-400">
                        € {totalEUR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-900">
                      <span className="text-[9px] text-slate-500 block uppercase mb-0.5">Total Real</span>
                      <span className="text-xs font-bold text-emerald-400">
                        R$ {totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-900">
                <span>*A conversão estável referencial no documento inicial foi de 1€ = R$ 6,20.</span>
                <span className="font-mono text-slate-600">Simulador Europa v2026.1</span>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Footer info card */}
      <footer className="border-t border-slate-900 mt-16 pt-8 pb-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              CV
            </div>
            <span className="text-xs text-slate-400 font-medium">Nosso Roteiro de Viagem Europa 2026 ©</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-500">
            <a href="#custom-fixed-header" className="hover:text-amber-500 transition-colors font-mono">Índice</a>
            <span className="font-mono text-slate-650">Outubro-Novembro 2026</span>
          </div>
        </div>
      </footer>

      {/* Modern Dialog/Modal for Upload instructions */}
      <AnimatePresence>
        {showHowToUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowToUpload(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-transparent" />
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-500 animate-pulse" />
                    Como integrar suas próprias fotos locais?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Como você já possui a pasta de fotos na sua máquina, veja como colocá-las no site:
                  </p>
                </div>
                <button 
                  onClick={() => setShowHowToUpload(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                
                {/* Step 1 */}
                <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500">Passo 1: Envie as imagens pelo chat</span>
                  <p className="text-slate-400">
                    Você pode <strong>anexar a sua pasta ou arquivos de imagens no chat</strong> ao lado. Eu vou recebê-los e criar os caminhos correspondentes para renderizá-los diretamente no site de forma polida!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500">Passo 2: Arraste os arquivos no Painel Esquerdo</span>
                  <p className="text-slate-400">
                    No explorador de arquivos esquerdo do AI Studio, você pode criar uma pasta correspondente chamada <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">/Roteiro Europa.fld/</code> ou colocar as imagens na pasta <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">/public/</code>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500">Passo 3: Ative o Modo "Pasta Local" no Site</span>
                  <p className="text-slate-400">
                    Na aba <strong className="text-white">Diário (Trechos)</strong>, clique no botão superior <strong className="text-amber-500">Pasta Local (.fld)</strong>. O site passará a buscar as imagens diretamente dos arquivos que você carregou.
                  </p>
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowHowToUpload(false)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Entendi, excelente!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
