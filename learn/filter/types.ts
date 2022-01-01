// <!--                [Automated message] Sorry, the player of this character has indicated that they are not interested in characters matching your profile.-->
// <!--                Need a filter for yourself? Try out [F-Chat Rising](https://mrstallion.github.io/fchat-rising/)!-->


export const smartFilterTypes = {
  ageplay: { name: 'Ageplay' },
  anthro: { name: 'Anthros' },
  feral: { name: 'Ferals' },
  gore: { name: 'Gore/torture/death' },
  human: { name: 'Humans' },
  hyper: { name: 'Hyper' },
  incest: { name: 'Incest' },
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
  autoReply: boolean;

  minAge: number | null;
  maxAge: number | null;

  smartFilters: SmartFilterSelection;

  exceptionNames: string[];
}
