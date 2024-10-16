export const FilterAttacksByWar = (attacks, war) => {
  return attacks.filter(attack => attack.war === war);
};

export const GetAttacksOnTeam = (attacks, teamNo) => {
  return attacks.filter(attack => attack.attacking_team === teamNo || attack.defending_team === teamNo);
};

export const GetAttacksByTeam = (attacks, teamNo) => {
  return attacks.filter(attack => attack.attacking_team === teamNo);
};

