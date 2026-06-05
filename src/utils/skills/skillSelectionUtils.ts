export function toggleSkillSelection(
  selectedIds: Set<string>,
  id: string
) {
  const next = new Set(selectedIds);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
}

export function toggleAllSkillSelection(
  selectedIds: Set<string>,
  visibleIds: string[]
) {
  const next = new Set(selectedIds);

  const allSelected = visibleIds.every(
    (id) => next.has(id)
  );

  if (allSelected) {
    visibleIds.forEach((id) => next.delete(id));
  } else {
    visibleIds.forEach((id) => next.add(id));
  }
  return next;
}

export function removeSelectedSkill(
  selectedIds: Set<string>,
  skillId: string
) {
  const next = new Set(selectedIds);
  next.delete(skillId);
  return next;
}