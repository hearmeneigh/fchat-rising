export const smartFilterTypes = {
  ageplay: { name: 'Ageplay' },
  anthro: { name: 'Anthros' },
  female: { name: 'Females' },
  feral: { name: 'Ferals' },
  gore: { name: 'Gore/torture/death' },
  human: { name: 'Humans' },
  hyper: { name: 'Hyper' },
  incest: { name: 'Incest' },
  intersex: { name: 'Intersex' },
  male: { name: 'Males' },
  microMacro: { name: 'Micro/macro' },
  obesity: { name: 'Obesity' },
  pokemon: { name: 'Pokemons/Digimons' },
  pregnancy: { name: 'Pregnancy' },
  rape: { name: 'Rape' },
  scat: { name: 'Scat' },
  std: { name: 'STDs' },
  taur: { name: 'Taurs' },
  vore: { name: 'Vore and unbirthing' },
  unclean: { name: 'Unclean' },
  watersports: { name: 'Watersports' },
  zoophilia: { name: 'Zoophilia' }
};

export const prefFilterTypes = {
  Straight: {name: 'Straight'},
  Gay: {name: 'Gay'},
  Bisexual: {name: 'Bisexual'},
  Asexual: {name: 'Asexual'},
  Unsure: {name: 'Unsure'},
  BiMalePreference: {name: 'BiMalePreference'},
  BiFemalePreference: {name: 'BiFemalePreference'},
  Pansexual: {name: 'Pansexual'},
  BiCurious: {name: 'BiCurious'}
}

export type PrefFiltersSelection = {
  [key in keyof typeof prefFilterTypes]: boolean;
};

export type SmartFilterSelection = {
  [key in keyof typeof smartFilterTypes]: boolean;
};

export interface SmartFilterSettings {
  hideAds: boolean;
  hideSearchResults: boolean;
  hideChannelMembers: boolean;
  hidePublicChannelMessages: boolean;
  hidePrivateChannelMessages: boolean;
  hidePrivateMessages: boolean;
  penalizeMatches: boolean;
  rewardNonMatches: boolean;
  autoReply: boolean;
  showFilterIcon: boolean;

  minAge: number | null;
  maxAge: number | null;


  prefFilters: PrefFiltersSelection;
  smartFilters: SmartFilterSelection;

  exceptionNames: string[];
}
