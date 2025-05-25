export interface ActionIconStyle {
  icon: string;      // e.g. Bootstrap, FontAwesome, or Material icon class
  styleClass: string; // CSS class for button styling
}

export const ACTION_ICON_MAP: { [label: string]: ActionIconStyle } = {
  'Låna': { icon: 'assets/images/webpage-images/icons/borrowbook.svg', styleClass: 'action-borrow' },
  'Återlämna': { icon: 'assets/images/webpage-images/icons/returnbook.svg', styleClass: 'action-return' },
  'Reservera': { icon: 'fa-solid fa-bookmark', styleClass: 'action-reserve' },
  'Ta bort reservation': { icon: 'fa-solid fa-bookmark', styleClass: 'action-unreserve' },
  'Lägg till i läslista': { icon: 'fa-solid fa-heart-circle-plus', styleClass: 'action-add-readlist' },
  'Ta bort från läslista': { icon: 'fa-solid fa-heart-circle-minus', styleClass: 'action-remove-readlist' },
  // Add more as needed
};