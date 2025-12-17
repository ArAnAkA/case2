// src/services/api.js
const STORAGE_KEY = 'cs2casebattle_cases';

const defaultCases = [
  {
    id: "1",
    name: "Operation Broken Fang Case",
    price: 2.99,
    image: "/skins/operation_broken_fang_case.jpg",
    items: [
      { name: "P90 | Blind Spot", image: "/skins/p90_blind_spot.jpg", rarity: "common", value: 0.45, chance: 20.00 },
      { name: "Nova | Green Apple", image: "/skins/nova_green_apple.jpg", rarity: "common", value: 0.32, chance: 20.00 },
      { name: "UMP-45 | Bone Pile", image: "/skins/ump_45_bone_pile.jpg", rarity: "uncommon", value: 1.25, chance: 15.00 },
      { name: "Dual Berettas | Black Limba", image: "/skins/dual_berettas_black_limba.jpg", rarity: "uncommon", value: 0.85, chance: 15.00 },
      { name: "PP-Bizon | Forest Leaves", image: "/skins/pp_bizon_forest_leaves.jpg", rarity: "rare", value: 3.50, chance: 10.00 },
      { name: "Negev | Ultralight", image: "/skins/negev_ultralight.jpg", rarity: "rare", value: 2.75, chance: 10.00 },
      { name: "XM1014 | Ziggy Anarchy", image: "/skins/xm1014_ziggy_anarchy.jpg", rarity: "mythical", value: 12.00, chance: 4.00 },
      { name: "P2000 | Urban Hazard", image: "/skins/p2000_urban_hazard.jpg", rarity: "mythical", value: 8.50, chance: 4.00 },
      { name: "Galil AR | Cold Fusion", image: "/skins/galil_ar_cold_fusion.jpg", rarity: "legendary", value: 45.00, chance: 1.50 },
      { name: "MP9 | Food Chain", image: "/skins/mp9_food_chain.jpg", rarity: "legendary", value: 35.00, chance: 0.50 }
    ]
  },
  {
    id: "2",
    name: "Operation Riptide Case",
    price: 2.79,
    image: "/skins/operation_riptide_case.jpg",
    items: [
      { name: "MP9 | Colony", image: "/skins/mp9_colony.jpg", rarity: "common", value: 0.35, chance: 20.00 },
      { name: "Nova | Forest Leaves", image: "/skins/nova_forest_leaves.jpg", rarity: "common", value: 0.28, chance: 20.00 },
      { name: "P250 | Contamination", image: "/skins/p250_contamination.jpg", rarity: "uncommon", value: 1.10, chance: 15.00 },
      { name: "PP-Bizon | Rust Coat", image: "/skins/pp_bizon_rust_coat.jpg", rarity: "uncommon", value: 0.90, chance: 15.00 },
      { name: "SG 553 | Darkwing", image: "/skins/sg_553_darkwing.jpg", rarity: "rare", value: 3.80, chance: 10.00 },
      { name: "USP-S | Torque", image: "/skins/usp_s_torque.jpg", rarity: "rare", value: 4.50, chance: 10.00 },
      { name: "FAMAS | Mecha Industries", image: "/skins/famas_mecha_industries.jpg", rarity: "mythical", value: 13.00, chance: 4.00 },
      { name: "M4A1-S | Nightmare", image: "/skins/m4a1_s_nightmare.jpg", rarity: "mythical", value: 10.50, chance: 4.00 },
      { name: "AK-47 | Slate", image: "/skins/ak_47_slate.jpg", rarity: "legendary", value: 42.00, chance: 1.50 },
      { name: "AWP | Acanthus", image: "/skins/awp_acanthus.jpg", rarity: "legendary", value: 52.00, chance: 0.50 }
    ]
  },
  {
    id: "3",
    name: "Revolution Case",
    price: 1.99,
    image: "/skins/revolution_case.jpg",
    items: [
      { name: "M4A1-S | Leet X3 O", image: "/skins/m4a1_s_leet_x3_o.jpg", rarity: "common", value: 0.55, chance: 20.00 },
      { name: "USP-S | Target Acquired", image: "/skins/usp_s_target_acquired.jpg", rarity: "common", value: 0.40, chance: 20.00 },
      { name: "AK-47 | Phantom Disruptor", image: "/skins/ak_47_phantom_disruptor.jpg", rarity: "uncommon", value: 1.80, chance: 15.00 },
      { name: "Desert Eagle | Ocean Drive", image: "/skins/desert_eagle_ocean_drive.jpg", rarity: "uncommon", value: 1.20, chance: 15.00 },
      { name: "Glock-18 | Neo-Noir", image: "/skins/glock_18_neo_noir.jpg", rarity: "rare", value: 4.25, chance: 10.00 },
      { name: "M4A4 | Coalition", image: "/skins/m4a4_coalition.jpg", rarity: "rare", value: 3.75, chance: 10.00 },
      { name: "AWP | Containment Breach", image: "/skins/awp_containment_breach.jpg", rarity: "mythical", value: 15.00, chance: 4.00 },
      { name: "Hand Wraps | Cobalt Skulls", image: "/skins/hand_wraps_cobalt_skulls.jpg", rarity: "mythical", value: 12.50, chance: 4.00 },
      { name: "Driver Gloves | Racing Green", image: "/skins/driver_gloves_racing_green.jpg", rarity: "legendary", value: 55.00, chance: 1.50 },
      { name: "Sport Gloves | Honor of the Elite", image: "/skins/sport_gloves_honor_of_the_elite.jpg", rarity: "legendary", value: 42.00, chance: 0.50 }
    ]
  },
  {
    id: "4",
    name: "Recoil Case",
    price: 2.49,
    image: "/skins/recoil_case.jpg",
    items: [
      { name: "MAC-10 | Monkeyflage", image: "/skins/mac_10_monkeyflage.jpg", rarity: "common", value: 0.38, chance: 20.00 },
      { name: "P250 | Cassette", image: "/skins/p250_cassette.jpg", rarity: "common", value: 0.42, chance: 20.00 },
      { name: "Sawed-Off | Black Sand", image: "/skins/sawed_off_black_sand.jpg", rarity: "uncommon", value: 1.15, chance: 15.00 },
      { name: "MP5-SD | Acid Wash", image: "/skins/mp5_sd_acid_wash.jpg", rarity: "uncommon", value: 0.95, chance: 15.00 },
      { name: "Tec-9 | Remote Control", image: "/skins/tec_9_remote_control.jpg", rarity: "rare", value: 3.20, chance: 10.00 },
      { name: "P90 | Trench Warfare", image: "/skins/p90_trench_warfare.jpg", rarity: "rare", value: 2.90, chance: 10.00 },
      { name: "FAMAS | Tactical Realism", image: "/skins/famas_tactical_realism.jpg", rarity: "mythical", value: 11.00, chance: 4.00 },
      { name: "M4A4 | Evil Daimyo", image: "/skins/m4a4_evil_daimyo.jpg", rarity: "mythical", value: 9.50, chance: 4.00 },
      { name: "AK-47 | Legion of Anarchy", image: "/skins/ak_47_legion_of_anarchy.jpg", rarity: "legendary", value: 38.00, chance: 1.50 },
      { name: "AWP | Tropic Thunder", image: "/skins/awp_tropic_thunder.jpg", rarity: "legendary", value: 48.00, chance: 0.50 }
    ]
  },
  {
    id: "5",
    name: "Dreams & Nightmares Case",
    price: 3.29,
    image: "/skins/dreams_and_nightmares_case.jpg",
    items: [
      { name: "Desert Eagle | Directive", image: "/skins/desert_eagle_directive.jpg", rarity: "common", value: 0.65, chance: 20.00 },
      { name: "Glock-18 | War Pig", image: "/skins/glock_18_war_pig.jpg", rarity: "common", value: 0.48, chance: 20.00 },
      { name: "Hand Wraps | Leather", image: "/skins/hand_wraps_leather.jpg", rarity: "uncommon", value: 1.45, chance: 15.00 },
      { name: "Moto Gloves | Smoke Out", image: "/skins/moto_gloves_smoke_out.jpg", rarity: "uncommon", value: 1.35, chance: 15.00 },
      { name: "Desert Eagle | Kumicho Dragon", image: "/skins/desert_eagle_kumicho_dragon.jpg", rarity: "rare", value: 5.25, chance: 10.00 },
      { name: "Glock-18 | Vogue", image: "/skins/glock_18_vogue.jpg", rarity: "rare", value: 4.75, chance: 10.00 },
      { name: "Hand Wraps | Badlands", image: "/skins/hand_wraps_badlands.jpg", rarity: "mythical", value: 18.00, chance: 4.00 },
      { name: "Driver Gloves | Queen Jaguar", image: "/skins/driver_gloves_queen_jaguar.jpg", rarity: "mythical", value: 16.50, chance: 4.00 },
      { name: "Sport Gloves | Slipstream", image: "/skins/sport_gloves_slipstream.jpg", rarity: "legendary", value: 65.00, chance: 1.50 },
      { name: "Specialist Gloves | Marble Fade", image: "/skins/specialist_gloves_marble_fade.jpg", rarity: "legendary", value: 85.00, chance: 0.50 }
    ]
  },
  {
    id: "6",
    name: "Clutch Case",
    price: 1.89,
    image: "/skins/clutch_case.jpg",
    items: [
      { name: "MP9 | Colony", image: "/skins/mp9_colony.jpg", rarity: "common", value: 0.25, chance: 20.00 },
      { name: "Nova | Forest Leaves", image: "/skins/nova_forest_leaves.jpg", rarity: "common", value: 0.18, chance: 20.00 },
      { name: "P250 | Contamination", image: "/skins/p250_contamination.jpg", rarity: "uncommon", value: 0.80, chance: 15.00 },
      { name: "PP-Bizon | Rust Coat", image: "/skins/pp_bizon_rust_coat.jpg", rarity: "uncommon", value: 0.70, chance: 15.00 },
      { name: "SG 553 | Darkwing", image: "/skins/sg_553_darkwing.jpg", rarity: "rare", value: 2.80, chance: 10.00 },
      { name: "USP-S | Torque", image: "/skins/usp_s_torque.jpg", rarity: "rare", value: 3.50, chance: 10.00 },
      { name: "FAMAS | Mecha Industries", image: "/skins/famas_mecha_industries.jpg", rarity: "mythical", value: 9.00, chance: 4.00 },
      { name: "M4A1-S | Nightmare", image: "/skins/m4a1_s_nightmare.jpg", rarity: "mythical", value: 7.50, chance: 4.00 },
      { name: "AK-47 | Slate", image: "/skins/ak_47_slate.jpg", rarity: "legendary", value: 35.00, chance: 1.50 },
      { name: "AWP | Acanthus", image: "/skins/awp_acanthus.jpg", rarity: "legendary", value: 45.00, chance: 0.50 }
    ]
  },
  {
    id: "7",
    name: "Snakebite Case",
    price: 2.19,
    image: "/skins/snakebite_case.jpg",
    items: [
      { name: "MAC-10 | Monkeyflage", image: "/skins/mac_10_monkeyflage.jpg", rarity: "common", value: 0.28, chance: 20.00 },
      { name: "P250 | Cassette", image: "/skins/p250_cassette.jpg", rarity: "common", value: 0.32, chance: 20.00 },
      { name: "Sawed-Off | Black Sand", image: "/skins/sawed_off_black_sand.jpg", rarity: "uncommon", value: 0.95, chance: 15.00 },
      { name: "MP5-SD | Acid Wash", image: "/skins/mp5_sd_acid_wash.jpg", rarity: "uncommon", value: 0.85, chance: 15.00 },
      { name: "Tec-9 | Remote Control", image: "/skins/tec_9_remote_control.jpg", rarity: "rare", value: 2.70, chance: 10.00 },
      { name: "P90 | Trench Warfare", image: "/skins/p90_trench_warfare.jpg", rarity: "rare", value: 2.40, chance: 10.00 },
      { name: "FAMAS | Tactical Realism", image: "/skins/famas_tactical_realism.jpg", rarity: "mythical", value: 8.50, chance: 4.00 },
      { name: "M4A4 | Evil Daimyo", image: "/skins/m4a4_evil_daimyo.jpg", rarity: "mythical", value: 7.00, chance: 4.00 },
      { name: "AK-47 | Legion of Anarchy", image: "/skins/ak_47_legion_of_anarchy.jpg", rarity: "legendary", value: 32.00, chance: 1.50 },
      { name: "AWP | Tropic Thunder", image: "/skins/awp_tropic_thunder.jpg", rarity: "legendary", value: 42.00, chance: 0.50 }
    ]
  }
];

const initializeCases = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('🔄 Инициализация кейсов в localStorage...');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCases));
      return defaultCases;
    }
    const parsed = JSON.parse(stored);
    console.log('📦 Загружены кейсы из localStorage:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Ошибка инициализации кейсов:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCases));
    return defaultCases;
  }
};

// Инициализируем сразу при загрузке модуля
initializeCases();

const getCasesFromStorage = () => {
  try {
    const cases = localStorage.getItem(STORAGE_KEY);
    if (!cases) {
      return initializeCases();
    }
    return JSON.parse(cases);
  } catch (error) {
    console.error('❌ Ошибка чтения кейсов из хранилища:', error);
    return initializeCases();
  }
};

const saveCasesToStorage = (cases) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    console.log('💾 Кейсы сохранены в localStorage');
    return true;
  } catch (error) {
    console.error('❌ Ошибка сохранения кейсов:', error);
    return false;
  }
};

// API функции
export const caseAPI = {
  getCases: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cases = getCasesFromStorage();
        console.log('📨 API: Отправляю кейсы:', cases);
        resolve({ data: cases });
      }, 100);
    });
  },

  getCaseById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cases = getCasesFromStorage();
        const caseItem = cases.find(c => c.id === id.toString());
        if (caseItem) {
          resolve({ data: caseItem });
        } else {
          reject(new Error('Кейс не найден'));
        }
      }, 100);
    });
  },

  createCase: async (caseData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cases = getCasesFromStorage();
        const newCase = {
          id: Date.now().toString(),
          ...caseData,
          createdAt: new Date().toISOString()
        };
        cases.push(newCase);
        saveCasesToStorage(cases);
        console.log('✅ Создан новый кейс:', newCase);
        resolve({ data: newCase });
      }, 100);
    });
  },

  updateCase: async (id, caseData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cases = getCasesFromStorage();
        const index = cases.findIndex(c => c.id === id.toString());
        if (index !== -1) {
          cases[index] = { ...cases[index], ...caseData };
          saveCasesToStorage(cases);
          resolve({ data: cases[index] });
        } else {
          reject(new Error('Кейс не найден'));
        }
      }, 100);
    });
  },

  deleteCase: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cases = getCasesFromStorage();
        const filteredCases = cases.filter(c => c.id !== id.toString());
        if (filteredCases.length !== cases.length) {
          saveCasesToStorage(filteredCases);
          resolve({ message: 'Кейс удален' });
        } else {
          reject(new Error('Кейс не найден'));
        }
      }, 100);
    });
  },

  resetToDefault: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveCasesToStorage(defaultCases);
        console.log('🔄 Кейсы сброшены к значениям по умолчанию');
        resolve({ data: defaultCases });
      }, 100);
    });
  }
};

export const uploadImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ data: { url: e.target.result } });
    };
    reader.readAsDataURL(file);
  });
};

export default caseAPI;